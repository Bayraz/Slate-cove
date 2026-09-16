"""The loop: poll the inbox, draft, ask for approval, send what is approved."""

from __future__ import annotations

import asyncio
import html
import logging
import random
import time

from . import state
from .alerts import Alerter
from .config import Settings
from .drafting import Drafter, DraftingError
from .properties import PropertyBook
from .state import Store, fingerprint
from .telegram import (
    TelegramClient,
    TelegramError,
    Update,
    approval_keyboard,
    format_draft_message,
)
from .zeevou import Conversation, LayoutError, LoginError, ZeevouClient, ZeevouError

log = logging.getLogger(__name__)

DISPATCH_INTERVAL_SECONDS = 20
MAX_SEND_ATTEMPTS = 3
BASELINE_KEY = "baseline_done"
OFFSET_KEY = "telegram_offset"
EDIT_TARGET_KEY = "awaiting_edit_for"
CHAT_ID_KEY = "learned_chat_id"

HELP_TEXT = (
    "<b>Zeevou concierge</b>\n"
    "I check the Unified Inbox every few minutes, draft a reply to anything new, "
    "and send it here for approval. Nothing reaches a guest until you press "
    "Approve.\n\n"
    "/status — what is queued, drafted and sent\n"
    "/check — check the inbox now, without waiting for the timer\n"
    "/help — this message"
)


class Concierge:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        settings.ensure_dirs()
        self.store = Store(settings.state_path)
        self.telegram = TelegramClient(settings.telegram_bot_token, settings.telegram_chat_id)
        if not self.telegram.chat_id:
            learned = self.store.get_value(CHAT_ID_KEY)
            if learned:
                self.telegram.chat_id = str(learned)
        self.alerts = Alerter(self.telegram, self.store)
        self.zeevou = ZeevouClient(settings)
        self.drafter = Drafter(settings, PropertyBook.load(settings.properties_file))
        self._check_now = asyncio.Event()
        self._stopping = asyncio.Event()

    # -- lifecycle ---------------------------------------------------------
    async def run(self) -> None:
        await self.telegram.start()
        await self._announce_start()
        tasks = [
            asyncio.create_task(self._inbox_loop(), name="inbox"),
            asyncio.create_task(self._telegram_loop(), name="telegram"),
            asyncio.create_task(self._dispatch_loop(), name="dispatch"),
        ]
        try:
            await asyncio.gather(*tasks)
        except asyncio.CancelledError:
            pass
        finally:
            self._stopping.set()
            for task in tasks:
                task.cancel()
            await asyncio.gather(*tasks, return_exceptions=True)
            await self.shutdown()

    async def shutdown(self) -> None:
        await self.zeevou.close()
        await self.telegram.close()
        self.store.close()

    async def _announce_start(self) -> None:
        mode = " (DRY RUN — nothing will be sent to Zeevou)" if self.settings.dry_run else ""
        try:
            await self.telegram.send_message(
                f"👋 Concierge started{mode}. Checking the Zeevou inbox every "
                f"{self.settings.poll_min_seconds // 60}–"
                f"{self.settings.poll_max_seconds // 60} minutes."
            )
        except TelegramError as exc:
            log.warning("could not announce startup: %s", exc)

    # -- inbox -------------------------------------------------------------
    async def _inbox_loop(self) -> None:
        while not self._stopping.is_set():
            try:
                await self.check_inbox()
                self.alerts.note_success("inbox check")
                await self.alerts.recovered("inbox", "Zeevou inbox check is working again.")
            except asyncio.CancelledError:
                raise
            except LayoutError as exc:
                self.alerts.mark_active("inbox")
                await self.alerts.failure(
                    "inbox",
                    "Zeevou's page layout looks different",
                    exc,
                    screenshot=str(exc.screenshot) if exc.screenshot else None,
                    hint=(
                        f"Selector that stopped matching: {exc.selector_name}. Run "
                        "`python -m zeevou_concierge probe` to see what does match, "
                        "then fix it in selectors.py or set the matching "
                        "ZEEVOU_SEL_* variable in .env. Nothing is being replied to "
                        "until this is sorted."
                    ),
                )
            except LoginError as exc:
                self.alerts.mark_active("inbox")
                await self.alerts.failure(
                    "login", "Cannot log in to Zeevou", exc,
                    hint="Check the credentials in .env, and whether Zeevou is asking for 2FA.",
                )
            except Exception as exc:  # noqa: BLE001 - the loop must not die
                self.alerts.mark_active("inbox")
                await self.alerts.failure("inbox", "Inbox check failed", exc)

            await self.alerts.check_watchdog(
                "inbox check", self.settings.watchdog_minutes * 60
            )
            await self._sleep_until_next_check()

    async def _sleep_until_next_check(self) -> None:
        delay = random.randint(
            self.settings.poll_min_seconds, self.settings.poll_max_seconds
        )
        log.info("next inbox check in %s seconds", delay)
        self._check_now.clear()
        try:
            await asyncio.wait_for(self._check_now.wait(), timeout=delay)
            log.info("inbox check triggered manually")
        except asyncio.TimeoutError:
            pass

    async def check_inbox(self) -> int:
        """One full cycle: collect new guest messages, then draft for each."""
        found = await self._collect_new_messages()
        drafted = await self._draft_pending()
        log.info("inbox check complete: %s new, %s drafted", found, drafted)
        return drafted

    async def _collect_new_messages(self) -> int:
        async with self.zeevou.lock:
            await self.zeevou.ensure_logged_in()
            conversations = await self.zeevou.list_conversations(unread_only=True)
            log.info("%s conversations to inspect", len(conversations))
            seen = 0
            for conversation in conversations:
                messages = await self.zeevou.read_guest_messages(conversation)
                for message in messages:
                    fp = fingerprint(
                        conversation.conversation_id,
                        message.body,
                        message.received_label,
                        conversation.guest_name,
                    )
                    inserted = self.store.record_if_new(
                        fingerprint=fp,
                        conversation_id=conversation.conversation_id,
                        conversation_url=conversation.url,
                        guest_name=conversation.guest_name,
                        property_name=conversation.property_name,
                        received_label=message.received_label,
                        body=message.body,
                    )
                    if inserted:
                        seen += 1
        if seen and not self.store.get_value(BASELINE_KEY, False):
            await self._establish_baseline(seen)
            return 0
        self.store.set_value(BASELINE_KEY, True)
        return seen

    async def _establish_baseline(self, count: int) -> None:
        """First run: record what is already there instead of replying to it."""
        for message in self.store.by_status(state.NEW, limit=10_000):
            self.store.update(message.fingerprint, status=state.SKIPPED,
                              error="pre-existing at first run")
        self.store.set_value(BASELINE_KEY, True)
        await self.telegram.send_message(
            f"📒 First run: noted {count} message(s) already in the inbox and left "
            "them alone. From now on I will only draft replies to messages that "
            "arrive after this point."
        )

    async def _draft_pending(self) -> int:
        pending = self.store.by_status(state.NEW, limit=self.settings.max_drafts_per_cycle)
        drafted = 0
        for message in pending:
            try:
                draft = await self.drafter.draft(
                    guest_message=message.body,
                    guest_name=message.guest_name,
                    property_label=message.property_name,
                )
            except DraftingError as exc:
                self.store.update(message.fingerprint, status=state.FAILED, error=str(exc))
                await self.alerts.failure(
                    "drafting", "Claude could not draft a reply", exc,
                    hint=(
                        f"Guest message from {message.guest_name or 'a guest'} is "
                        "waiting for a human reply in Zeevou."
                    ),
                )
                continue

            self.store.update(
                message.fingerprint, status=state.DRAFTED, draft=draft.text, error=None
            )
            try:
                telegram_message_id = await self.telegram.send_message(
                    format_draft_message(
                        guest_name=message.guest_name,
                        property_name=message.property_name,
                        received_label=message.received_label,
                        guest_message=message.body,
                        draft=draft.text,
                        escalate=draft.escalate,
                    ),
                    reply_markup=approval_keyboard(message.short_id),
                )
            except TelegramError as exc:
                await self.alerts.failure(
                    "telegram-send", "Could not send a draft for approval", exc
                )
                continue
            self.store.set_value(f"telegram_message:{message.short_id}", telegram_message_id)
            self.store.update(message.fingerprint, status=state.AWAITING_APPROVAL)
            drafted += 1
        return drafted

    # -- approvals ---------------------------------------------------------
    async def _telegram_loop(self) -> None:
        while not self._stopping.is_set():
            try:
                offset = self.store.get_value(OFFSET_KEY)
                updates = await self.telegram.get_updates(offset)
                for update in updates:
                    self.store.set_value(OFFSET_KEY, update.update_id + 1)
                    await self._handle_update(update)
            except asyncio.CancelledError:
                raise
            except Exception as exc:  # noqa: BLE001 - the loop must not die
                await self.alerts.failure("telegram", "Telegram polling failed", exc)
                await asyncio.sleep(10)

    async def _handle_update(self, update: Update) -> None:
        if update.chat_id and not self.telegram.chat_id:
            self.telegram.chat_id = update.chat_id
            self.store.set_value(CHAT_ID_KEY, update.chat_id)
            await self.telegram.send_message(
                f"Noted this chat ({update.chat_id}). Put "
                f"<code>TELEGRAM_CHAT_ID={update.chat_id}</code> in your .env so I "
                "know where to reach you on the next restart."
            )
        if self.telegram.chat_id and update.chat_id and update.chat_id != self.telegram.chat_id:
            log.warning("ignoring update from unexpected chat %s", update.chat_id)
            return

        if update.is_callback:
            await self._handle_callback(update)
        elif update.text:
            await self._handle_text(update)

    async def _handle_callback(self, update: Update) -> None:
        action, _, short_id = (update.callback_data or "").partition(":")
        message = self.store.get_by_short_id(short_id)
        if message is None:
            await self.telegram.answer_callback(
                update.callback_query_id or "", "That message is no longer tracked."
            )
            return

        if action == "approve":
            self.store.update(message.fingerprint, status=state.APPROVED,
                              reply_sent=message.draft)
            await self.telegram.answer_callback(update.callback_query_id or "", "Sending…")
            await self.telegram.send_message("⏳ Approved — sending it to Zeevou now.")
        elif action == "skip":
            self.store.update(message.fingerprint, status=state.SKIPPED)
            await self.telegram.answer_callback(update.callback_query_id or "", "Skipped.")
            await self.telegram.send_message(
                "🚫 Skipped. Nothing was sent — reply in Zeevou yourself if it needs one."
            )
        elif action == "edit":
            self.store.set_value(EDIT_TARGET_KEY, message.short_id)
            self.store.update(message.fingerprint, status=state.AWAITING_EDIT)
            await self.telegram.answer_callback(update.callback_query_id or "", "Send me your version.")
            await self.telegram.send_message(
                "✍️ Send the reply you want me to post, as your next message. "
                "Send /cancel to leave it alone."
            )
        else:
            await self.telegram.answer_callback(update.callback_query_id or "", "Unknown action.")
            return

        if update.message_id:
            await self.telegram.edit_message_reply_markup(update.message_id)

    async def _handle_text(self, update: Update) -> None:
        text = (update.text or "").strip()
        pending_edit = self.store.get_value(EDIT_TARGET_KEY)

        if text.startswith("/"):
            command = text.split()[0].lower().lstrip("/").split("@")[0]
            if command == "cancel" and pending_edit:
                self.store.set_value(EDIT_TARGET_KEY, None)
                message = self.store.get_by_short_id(str(pending_edit))
                if message is not None:
                    self.store.update(message.fingerprint, status=state.SKIPPED)
                await self.telegram.send_message("Left that one alone.")
            elif command == "status":
                await self.telegram.send_message(self._status_text())
            elif command == "check":
                self._check_now.set()
                await self.telegram.send_message("Checking the inbox now…")
            else:
                await self.telegram.send_message(HELP_TEXT)
            return

        if pending_edit:
            message = self.store.get_by_short_id(str(pending_edit))
            self.store.set_value(EDIT_TARGET_KEY, None)
            if message is None:
                await self.telegram.send_message("That message is no longer tracked.")
                return
            self.store.update(message.fingerprint, status=state.APPROVED, reply_sent=text)
            await self.telegram.send_message("⏳ Got it — sending your version to Zeevou.")
            return

        await self.telegram.send_message(HELP_TEXT)

    def _status_text(self) -> str:
        counts = self.store.counts_by_status()
        last = self.alerts.last_success("inbox check")
        when = (
            f"{int((time.time() - last) // 60)} min ago" if last else "not yet"
        )
        lines = [f"<b>Status</b> — last successful inbox check: {when}"]
        for label, key in [
            ("Awaiting your approval", state.AWAITING_APPROVAL),
            ("Awaiting your edit", state.AWAITING_EDIT),
            ("Approved, sending", state.APPROVED),
            ("Sent", state.SENT),
            ("Skipped", state.SKIPPED),
            ("Failed", state.FAILED),
        ]:
            lines.append(f"{label}: {counts.get(key, 0)}")
        if self.settings.dry_run:
            lines.append("\n<i>DRY_RUN is on — approvals are not sent to Zeevou.</i>")
        return "\n".join(lines)

    # -- sending -----------------------------------------------------------
    async def _dispatch_loop(self) -> None:
        while not self._stopping.is_set():
            try:
                await self.dispatch_approved()
            except asyncio.CancelledError:
                raise
            except Exception as exc:  # noqa: BLE001 - the loop must not die
                await self.alerts.failure("dispatch", "Sending approved replies failed", exc)
            await asyncio.sleep(DISPATCH_INTERVAL_SECONDS)

    async def dispatch_approved(self) -> int:
        approved = self.store.by_status(state.APPROVED, limit=10)
        sent = 0
        for message in approved:
            reply = (message.reply_sent or message.draft or "").strip()
            if not reply:
                self.store.update(message.fingerprint, status=state.FAILED,
                                  error="approved with an empty reply")
                continue

            if self.settings.dry_run:
                self.store.update(message.fingerprint, status=state.SENT)
                await self.telegram.send_message(
                    "🧪 DRY RUN — would have sent this reply into Zeevou, but did not."
                )
                sent += 1
                continue

            conversation = Conversation(
                conversation_id=message.conversation_id,
                url=message.conversation_url,
                guest_name=message.guest_name,
                property_name=message.property_name,
            )
            try:
                async with self.zeevou.lock:
                    await self.zeevou.send_reply(conversation, reply)
            except (ZeevouError, OSError) as exc:
                attempts = self.store.bump_attempts(message.fingerprint)
                if attempts >= MAX_SEND_ATTEMPTS:
                    self.store.update(message.fingerprint, status=state.FAILED, error=str(exc))
                    screenshot = getattr(exc, "screenshot", None)
                    await self.alerts.failure(
                        "send-reply",
                        "Could not send an approved reply into Zeevou",
                        exc,
                        screenshot=str(screenshot) if screenshot else None,
                        hint=(
                            f"Gave up after {attempts} attempts. The guest "
                            f"({message.guest_name or 'unknown'}) has not been "
                            "replied to — do it by hand in Zeevou."
                        ),
                    )
                else:
                    log.warning("send attempt %s failed, will retry: %s", attempts, exc)
                continue

            self.store.update(message.fingerprint, status=state.SENT, error=None)
            sent += 1
            await self.telegram.send_message(
                f"✅ Sent to {html.escape(message.guest_name or 'the guest')} in Zeevou."
            )
        return sent
