"""End-to-end flow with Zeevou, Claude and Telegram faked out.

Covers the two promises that matter most: nothing is sent to a guest without an
approval, and nothing is ever processed twice.
"""

from __future__ import annotations

import asyncio
from dataclasses import dataclass, field

import pytest

from zeevou_concierge import state
from zeevou_concierge.config import load_settings
from zeevou_concierge.drafting import Draft, DraftingError
from zeevou_concierge.runner import Concierge
from zeevou_concierge.zeevou import Conversation, GuestMessage, LayoutError


@dataclass
class FakeZeevou:
    conversations: list[Conversation] = field(default_factory=list)
    messages: dict[str, list[GuestMessage]] = field(default_factory=dict)
    sent: list[tuple[str, str]] = field(default_factory=list)
    raise_layout_error: bool = False
    lock: asyncio.Lock = field(default_factory=asyncio.Lock)

    async def ensure_logged_in(self):
        if self.raise_layout_error:
            raise LayoutError("inbox_marker", "https://app.zeevou.test/unified-inbox")

    async def list_conversations(self, unread_only=True):
        return list(self.conversations)

    async def read_guest_messages(self, conversation, limit=5):
        return list(self.messages.get(conversation.conversation_id, []))

    async def send_reply(self, conversation, text):
        self.sent.append((conversation.conversation_id, text))

    async def close(self):
        pass


@dataclass
class FakeTelegram:
    chat_id: str | None = "42"
    messages: list[str] = field(default_factory=list)
    keyboards: list[dict] = field(default_factory=list)
    photos: list[str] = field(default_factory=list)

    async def start(self):
        pass

    async def close(self):
        pass

    async def send_message(self, text, *, chat_id=None, reply_markup=None, parse_mode="HTML"):
        self.messages.append(text)
        if reply_markup:
            self.keyboards.append(reply_markup)
        return len(self.messages)

    async def send_photo(self, path, caption="", *, chat_id=None):
        self.photos.append(str(path))

    async def answer_callback(self, callback_query_id, text=""):
        pass

    async def edit_message_reply_markup(self, message_id, *, chat_id=None):
        pass

    async def get_updates(self, offset, timeout=25):
        return []


class FakeDrafter:
    def __init__(self, text="Check-in is from 3pm.", fail=False):
        self.text = text
        self.fail = fail
        self.calls = 0

    async def draft(self, **kwargs):
        self.calls += 1
        if self.fail:
            raise DraftingError("model unavailable")
        return Draft(text=self.text, escalate=False, model="fake")


@pytest.fixture()
def concierge(tmp_path, monkeypatch):
    for key, value in {
        "ZEEVOU_EMAIL": "ops@example.test",
        "ZEEVOU_PASSWORD": "secret",
        "ANTHROPIC_API_KEY": "sk-test",
        "TELEGRAM_BOT_TOKEN": "123:abc",
        "TELEGRAM_CHAT_ID": "42",
        "DATA_DIR": str(tmp_path / "data"),
        "PROPERTIES_FILE": str(tmp_path / "properties.json"),
    }.items():
        monkeypatch.setenv(key, value)
    settings = load_settings(env_file=None)
    concierge = Concierge(settings)
    concierge.zeevou = FakeZeevou()
    concierge.telegram = FakeTelegram()
    concierge.alerts.telegram = concierge.telegram
    concierge.drafter = FakeDrafter()
    yield concierge
    concierge.store.close()


def add_message(concierge, body, *, conversation_id="conv-1", label="10:03"):
    conversation = Conversation(
        conversation_id=conversation_id,
        url=f"https://app.zeevou.test/c/{conversation_id}",
        guest_name="Sam",
        property_name="Cove Loft",
    )
    if conversation not in concierge.zeevou.conversations:
        concierge.zeevou.conversations.append(conversation)
    concierge.zeevou.messages.setdefault(conversation_id, []).append(
        GuestMessage(conversation=conversation, body=body, received_label=label)
    )


def approve_all(concierge):
    for message in concierge.store.by_status(state.AWAITING_APPROVAL):
        concierge.store.update(
            message.fingerprint, status=state.APPROVED, reply_sent=message.draft
        )


def test_first_run_baselines_existing_messages_instead_of_replying(concierge):
    add_message(concierge, "An old message already in the inbox")
    drafted = asyncio.run(concierge.check_inbox())

    assert drafted == 0
    assert concierge.drafter.calls == 0
    assert concierge.store.counts_by_status() == {state.SKIPPED: 1}
    assert any("First run" in text for text in concierge.telegram.messages)


def test_new_message_is_drafted_once_and_awaits_approval(concierge):
    asyncio.run(concierge.check_inbox())  # baseline
    add_message(concierge, "What time is check-in?", label="11:00")

    assert asyncio.run(concierge.check_inbox()) == 1
    # The same message still sitting in the inbox on the next poll is ignored.
    assert asyncio.run(concierge.check_inbox()) == 0
    assert concierge.drafter.calls == 1

    pending = concierge.store.by_status(state.AWAITING_APPROVAL)
    assert len(pending) == 1
    assert pending[0].draft == "Check-in is from 3pm."
    # Nothing has reached the guest.
    assert concierge.zeevou.sent == []
    assert concierge.telegram.keyboards, "approval buttons should have been offered"


def test_nothing_is_sent_until_approved_then_sent_exactly_once(concierge):
    asyncio.run(concierge.check_inbox())
    add_message(concierge, "Is parking included?", label="12:00")
    asyncio.run(concierge.check_inbox())

    assert asyncio.run(concierge.dispatch_approved()) == 0  # not approved yet
    assert concierge.zeevou.sent == []

    approve_all(concierge)
    assert asyncio.run(concierge.dispatch_approved()) == 1
    assert concierge.zeevou.sent == [("conv-1", "Check-in is from 3pm.")]

    # A second dispatch pass must not re-send.
    assert asyncio.run(concierge.dispatch_approved()) == 0
    assert len(concierge.zeevou.sent) == 1
    assert concierge.store.counts_by_status()[state.SENT] == 1


def test_edited_reply_is_sent_instead_of_the_draft(concierge):
    asyncio.run(concierge.check_inbox())
    add_message(concierge, "Can we bring the dog?", label="13:00")
    asyncio.run(concierge.check_inbox())

    message = concierge.store.by_status(state.AWAITING_APPROVAL)[0]
    concierge.store.update(
        message.fingerprint, status=state.APPROVED, reply_sent="Sorry, no pets."
    )
    asyncio.run(concierge.dispatch_approved())
    assert concierge.zeevou.sent == [("conv-1", "Sorry, no pets.")]


def test_dry_run_never_touches_zeevou(concierge):
    object.__setattr__(concierge.settings, "dry_run", True)
    asyncio.run(concierge.check_inbox())
    add_message(concierge, "Late checkout possible?", label="14:00")
    asyncio.run(concierge.check_inbox())
    approve_all(concierge)

    assert asyncio.run(concierge.dispatch_approved()) == 1
    assert concierge.zeevou.sent == []
    assert any("DRY RUN" in text for text in concierge.telegram.messages)


def test_send_failure_retries_then_alerts_and_stops(concierge):
    asyncio.run(concierge.check_inbox())
    add_message(concierge, "Where is the key safe?", label="15:00")
    asyncio.run(concierge.check_inbox())
    approve_all(concierge)

    async def failing_send(conversation, text):
        raise OSError("composer never appeared")

    concierge.zeevou.send_reply = failing_send
    for _ in range(3):
        asyncio.run(concierge.dispatch_approved())

    message = concierge.store.by_status(state.FAILED)
    assert len(message) == 1
    assert "composer" in (message[0].error or "")
    assert any("Could not send an approved reply" in text for text in concierge.telegram.messages)


def test_layout_change_raises_an_alert_with_a_fix_hint(concierge):
    concierge.zeevou.raise_layout_error = True

    async def one_pass():
        try:
            await concierge.check_inbox()
        except LayoutError as exc:
            await concierge.alerts.failure(
                "inbox", "Zeevou's page layout looks different", exc,
                hint=f"Selector that stopped matching: {exc.selector_name}.",
            )

    asyncio.run(one_pass())
    alert = "\n".join(concierge.telegram.messages)
    assert "layout looks different" in alert
    assert "inbox_marker" in alert


def test_drafting_failure_alerts_and_leaves_the_message_for_a_human(concierge):
    asyncio.run(concierge.check_inbox())
    add_message(concierge, "My boiler is leaking", label="16:00")
    concierge.drafter = FakeDrafter(fail=True)

    assert asyncio.run(concierge.check_inbox()) == 0
    assert concierge.store.counts_by_status()[state.FAILED] == 1
    assert any("could not draft" in text.lower() for text in concierge.telegram.messages)
    assert concierge.zeevou.sent == []


def test_repeated_failures_are_throttled_to_one_alert(concierge):
    async def alert_twice():
        for _ in range(2):
            await concierge.alerts.failure("inbox", "Inbox check failed", RuntimeError("boom"))

    asyncio.run(alert_twice())
    assert sum("Inbox check failed" in text for text in concierge.telegram.messages) == 1
