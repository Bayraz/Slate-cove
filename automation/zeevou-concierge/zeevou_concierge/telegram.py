"""Telegram bot: send drafts for approval, collect the verdict, raise alerts."""

from __future__ import annotations

import asyncio
import html
import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import aiohttp

log = logging.getLogger(__name__)

API_ROOT = "https://api.telegram.org"
MAX_MESSAGE_CHARS = 3900  # Telegram's limit is 4096; leave room for markup.


class TelegramError(RuntimeError):
    """The Telegram API rejected a call."""


@dataclass
class Update:
    update_id: int
    chat_id: str | None
    text: str | None = None
    callback_data: str | None = None
    callback_query_id: str | None = None
    message_id: int | None = None

    @property
    def is_callback(self) -> bool:
        return self.callback_data is not None


def parse_update(payload: dict[str, Any]) -> Update:
    """Flatten Telegram's update shape into what the runner needs."""
    update_id = int(payload["update_id"])
    callback = payload.get("callback_query")
    if callback:
        message = callback.get("message") or {}
        return Update(
            update_id=update_id,
            chat_id=str((message.get("chat") or {}).get("id", "")) or None,
            text=None,
            callback_data=callback.get("data"),
            callback_query_id=callback.get("id"),
            message_id=message.get("message_id"),
        )
    message = payload.get("message") or payload.get("edited_message") or {}
    return Update(
        update_id=update_id,
        chat_id=str((message.get("chat") or {}).get("id", "")) or None,
        text=message.get("text"),
        message_id=message.get("message_id"),
    )


def truncate(text: str, limit: int = MAX_MESSAGE_CHARS) -> str:
    if len(text) <= limit:
        return text
    return text[: limit - 20].rstrip() + "\n… (truncated)"


def approval_keyboard(short_id: str) -> dict[str, Any]:
    return {
        "inline_keyboard": [
            [
                {"text": "✅ Approve & send", "callback_data": f"approve:{short_id}"},
                {"text": "✍️ Edit", "callback_data": f"edit:{short_id}"},
            ],
            [{"text": "🚫 Skip", "callback_data": f"skip:{short_id}"}],
        ]
    }


def format_draft_message(
    *,
    guest_name: str,
    property_name: str,
    received_label: str,
    guest_message: str,
    draft: str,
    escalate: bool,
) -> str:
    """The approval card, in Telegram HTML."""
    head = "⚠️ <b>Needs your judgement</b>" if escalate else "💬 <b>New guest message</b>"
    meta_bits = [bit for bit in (guest_name, property_name, received_label) if bit]
    meta = html.escape(" · ".join(meta_bits)) if meta_bits else "unknown conversation"
    return truncate(
        f"{head}\n<i>{meta}</i>\n\n"
        f"<b>Guest wrote:</b>\n<blockquote>{html.escape(guest_message)}</blockquote>\n\n"
        f"<b>Draft reply:</b>\n<blockquote>{html.escape(draft)}</blockquote>\n\n"
        + (
            "Claude flagged this one — read it carefully before approving."
            if escalate
            else "Approve to send it into the guest's Zeevou conversation."
        )
    )


class TelegramClient:
    def __init__(self, token: str, chat_id: str | None = None) -> None:
        if not token:
            raise TelegramError("TELEGRAM_BOT_TOKEN is not set.")
        self._token = token
        self.chat_id = chat_id
        self._session: aiohttp.ClientSession | None = None

    async def __aenter__(self) -> "TelegramClient":
        await self.start()
        return self

    async def __aexit__(self, *_exc: Any) -> None:
        await self.close()

    async def start(self) -> None:
        if self._session is None or self._session.closed:
            self._session = aiohttp.ClientSession(
                timeout=aiohttp.ClientTimeout(total=60)
            )

    async def close(self) -> None:
        if self._session is not None and not self._session.closed:
            await self._session.close()
        self._session = None

    async def _call(self, method: str, **params: Any) -> Any:
        await self.start()
        assert self._session is not None
        url = f"{API_ROOT}/bot{self._token}/{method}"
        payload = {k: v for k, v in params.items() if v is not None}
        async with self._session.post(url, json=payload) as response:
            data = await response.json()
        if not data.get("ok"):
            raise TelegramError(
                f"{method} failed: {data.get('description', 'unknown error')}"
            )
        return data.get("result")

    # -- outbound ----------------------------------------------------------
    async def send_message(
        self,
        text: str,
        *,
        chat_id: str | None = None,
        reply_markup: dict[str, Any] | None = None,
        parse_mode: str | None = "HTML",
    ) -> int:
        target = chat_id or self.chat_id
        if not target:
            raise TelegramError("No chat id: set TELEGRAM_CHAT_ID.")
        result = await self._call(
            "sendMessage",
            chat_id=target,
            text=truncate(text),
            parse_mode=parse_mode,
            reply_markup=reply_markup,
            disable_web_page_preview=True,
        )
        return int(result["message_id"])

    async def send_photo(
        self, path: str | Path, caption: str = "", *, chat_id: str | None = None
    ) -> None:
        target = chat_id or self.chat_id
        if not target:
            raise TelegramError("No chat id: set TELEGRAM_CHAT_ID.")
        await self.start()
        assert self._session is not None
        form = aiohttp.FormData()
        form.add_field("chat_id", str(target))
        if caption:
            form.add_field("caption", truncate(caption, 1000))
        with open(path, "rb") as handle:
            form.add_field("photo", handle, filename=Path(path).name)
            url = f"{API_ROOT}/bot{self._token}/sendPhoto"
            async with self._session.post(url, data=form) as response:
                data = await response.json()
        if not data.get("ok"):
            raise TelegramError(f"sendPhoto failed: {data.get('description')}")

    async def edit_message_reply_markup(
        self, message_id: int, *, chat_id: str | None = None
    ) -> None:
        """Remove the buttons once a decision has been made."""
        try:
            await self._call(
                "editMessageReplyMarkup",
                chat_id=chat_id or self.chat_id,
                message_id=message_id,
                reply_markup={"inline_keyboard": []},
            )
        except TelegramError as exc:  # not worth failing a send over
            log.debug("could not clear keyboard: %s", exc)

    async def answer_callback(self, callback_query_id: str, text: str = "") -> None:
        try:
            await self._call(
                "answerCallbackQuery", callback_query_id=callback_query_id, text=text
            )
        except TelegramError as exc:
            log.debug("could not answer callback: %s", exc)

    # -- inbound -----------------------------------------------------------
    async def get_updates(self, offset: int | None, timeout: int = 25) -> list[Update]:
        """Long-poll for updates. Returns [] on a network hiccup."""
        try:
            result = await self._call(
                "getUpdates",
                offset=offset,
                timeout=timeout,
                allowed_updates=["message", "callback_query"],
            )
        except (aiohttp.ClientError, asyncio.TimeoutError) as exc:
            log.warning("getUpdates network error: %s", exc)
            return []
        return [parse_update(item) for item in (result or [])]

    async def get_me(self) -> dict[str, Any]:
        return await self._call("getMe")
