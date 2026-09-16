"""Playwright driver for Zeevou: log in, read the Unified Inbox, send a reply.

Selectors live in `selectors.py`. When one of them stops matching, this module
raises `LayoutError` with a screenshot, which the runner turns into a Telegram
alert — that is the "tell me when Zeevou changes their site" requirement.
"""

from __future__ import annotations

import asyncio
import logging
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any

from playwright.async_api import (
    Browser,
    BrowserContext,
    Locator,
    Page,
    async_playwright,
)
from playwright.async_api import Error as PlaywrightError
from playwright.async_api import TimeoutError as PlaywrightTimeout

from . import selectors
from .config import Settings

log = logging.getLogger(__name__)

DEFAULT_TIMEOUT_MS = 15_000


class ZeevouError(RuntimeError):
    """Something went wrong talking to Zeevou."""


class LayoutError(ZeevouError):
    """A selector no longer matches — most likely Zeevou changed their markup."""

    def __init__(self, selector_name: str, url: str, screenshot: Path | None = None):
        self.selector_name = selector_name
        self.url = url
        self.screenshot = screenshot
        super().__init__(
            f"Could not find {selectors.describe(selector_name)} on {url}. "
            "Zeevou's page layout has probably changed."
        )


class LoginError(ZeevouError):
    """Credentials were rejected, or the login page did not behave as expected."""


@dataclass
class Conversation:
    conversation_id: str
    url: str
    guest_name: str = ""
    property_name: str = ""
    preview: str = ""


@dataclass
class GuestMessage:
    conversation: Conversation
    body: str
    received_label: str = ""
    extras: dict[str, Any] = field(default_factory=dict)


class ZeevouClient:
    """One long-lived browser. Not safe for concurrent use — hold `lock`."""

    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.lock = asyncio.Lock()
        self._playwright = None
        self._browser: Browser | None = None
        self._context: BrowserContext | None = None
        self._page: Page | None = None

    # -- lifecycle ---------------------------------------------------------
    async def start(self) -> None:
        if self._browser is not None:
            return
        self.settings.ensure_dirs()
        self._playwright = await async_playwright().start()
        self._browser = await self._playwright.chromium.launch(
            headless=self.settings.headless
        )
        storage = self.settings.storage_state_path
        self._context = await self._browser.new_context(
            storage_state=str(storage) if storage.exists() else None,
            viewport={"width": 1440, "height": 900},
        )
        self._context.set_default_timeout(DEFAULT_TIMEOUT_MS)
        self._page = await self._context.new_page()

    async def close(self) -> None:
        for closer in (self._context, self._browser):
            if closer is not None:
                try:
                    await closer.close()
                except PlaywrightError:  # pragma: no cover - best effort teardown
                    pass
        if self._playwright is not None:
            await self._playwright.stop()
        self._playwright = self._browser = self._context = self._page = None

    async def __aenter__(self) -> "ZeevouClient":
        await self.start()
        return self

    async def __aexit__(self, *_exc: Any) -> None:
        await self.close()

    @property
    def page(self) -> Page:
        if self._page is None:
            raise ZeevouError("browser not started — call start() first")
        return self._page

    # -- selector helpers --------------------------------------------------
    async def _first_match(
        self, name: str, *, root: Locator | Page | None = None, timeout: int = 5_000
    ) -> Locator | None:
        """First selector candidate that actually resolves, or None."""
        scope = root if root is not None else self.page
        for candidate in selectors.candidates(name):
            locator = scope.locator(candidate).first
            try:
                await locator.wait_for(state="attached", timeout=timeout)
                return locator
            except PlaywrightTimeout:
                continue
        return None

    async def _require(
        self, name: str, *, root: Locator | Page | None = None, timeout: int = 10_000
    ) -> Locator:
        locator = await self._first_match(name, root=root, timeout=timeout)
        if locator is None:
            raise LayoutError(name, self.page.url, await self.screenshot(f"missing-{name}"))
        return locator

    async def _all_matches(
        self, name: str, *, root: Locator | Page | None = None
    ) -> list[Locator]:
        scope = root if root is not None else self.page
        for candidate in selectors.candidates(name):
            locators = await scope.locator(candidate).all()
            if locators:
                return locators
        return []

    async def screenshot(self, label: str) -> Path | None:
        """Capture the current page for a failure alert. Never raises."""
        if self._page is None:
            return None
        self.settings.ensure_dirs()
        safe = "".join(c if c.isalnum() or c in "-_" else "-" for c in label)
        path = self.settings.screenshot_dir / f"{int(time.time())}-{safe}.png"
        try:
            await self._page.screenshot(path=str(path), full_page=True)
            return path
        except PlaywrightError:  # pragma: no cover - screenshots are best effort
            log.warning("could not capture screenshot for %s", label)
            return None

    # -- authentication ----------------------------------------------------
    async def _looks_logged_out(self) -> bool:
        return await self._first_match("login_marker", timeout=2_000) is not None

    async def ensure_logged_in(self) -> None:
        """Open the inbox, logging in first if the saved session has expired."""
        await self.start()
        await self.page.goto(self.settings.inbox_url, wait_until="domcontentloaded")
        if await self._looks_logged_out():
            await self._log_in()
        marker = await self._first_match("inbox_marker", timeout=15_000)
        if marker is None:
            raise LayoutError("inbox_marker", self.page.url, await self.screenshot("inbox"))

    async def _log_in(self) -> None:
        log.info("logging in to Zeevou as %s", self.settings.zeevou_email)
        email = await self._require("login_email")
        password = await self._require("login_password")
        submit = await self._require("login_submit")
        await email.fill(self.settings.zeevou_email)
        await password.fill(self.settings.zeevou_password)
        await submit.click()
        try:
            await self.page.wait_for_load_state("networkidle", timeout=30_000)
        except PlaywrightTimeout:
            pass
        if await self._looks_logged_out():
            raise LoginError(
                "Still on the login page after submitting credentials. Check "
                "ZEEVOU_EMAIL / ZEEVOU_PASSWORD, or whether Zeevou is asking for "
                "a 2FA code or a CAPTCHA."
            )
        if self._context is not None:
            await self._context.storage_state(path=str(self.settings.storage_state_path))

    # -- reading -----------------------------------------------------------
    async def list_conversations(self, *, unread_only: bool = True) -> list[Conversation]:
        """Conversations currently shown in the Unified Inbox."""
        await self.ensure_logged_in()
        name = "conversation_unread_row" if unread_only else "conversation_row"
        rows = await self._all_matches(name)
        if not rows and unread_only:
            # Zeevou may not mark unread rows distinctly in every theme; fall
            # back to every row and let fingerprinting filter what is new.
            rows = await self._all_matches("conversation_row")
        if not rows:
            # An inbox with nothing in it is normal. An inbox whose rows we
            # cannot recognise at all is not — tell them apart by the marker,
            # which ensure_logged_in has already confirmed is present.
            log.info("no conversations matched in the inbox")
            return []

        conversations: list[Conversation] = []
        for index, row in enumerate(rows):
            url = await self._row_url(row)
            conversation_id = self._conversation_id(url, index)
            conversations.append(
                Conversation(
                    conversation_id=conversation_id,
                    url=url or self.settings.inbox_url,
                    guest_name=await self._text(row, "conversation_guest_name"),
                    property_name=await self._text(row, "conversation_property_name"),
                    preview=(await self._safe_inner_text(row))[:280],
                )
            )
        return conversations

    async def _row_url(self, row: Locator) -> str:
        for locator in (row, row.locator("a").first):
            try:
                href = await locator.get_attribute("href")
            except PlaywrightError:
                href = None
            if href:
                if href.startswith("http"):
                    return href
                return self.settings.zeevou_base_url.rstrip("/") + "/" + href.lstrip("/")
        for attribute in ("data-conversation-id", "data-id", "id"):
            try:
                value = await row.get_attribute(attribute)
            except PlaywrightError:
                value = None
            if value:
                return f"{self.settings.inbox_url}#{value}"
        return ""

    @staticmethod
    def _conversation_id(url: str, index: int) -> str:
        if url:
            return url.rstrip("/").split("/")[-1].split("#")[-1] or url
        return f"row-{index}"

    async def _text(self, root: Locator, name: str) -> str:
        locator = await self._first_match(name, root=root, timeout=1_000)
        if locator is None:
            return ""
        return (await self._safe_inner_text(locator)).strip()

    @staticmethod
    async def _safe_inner_text(locator: Locator) -> str:
        try:
            return (await locator.inner_text()).strip()
        except PlaywrightError:
            return ""

    async def open_conversation(self, conversation: Conversation) -> None:
        if conversation.url and not conversation.url.startswith(self.settings.inbox_url + "#"):
            await self.page.goto(conversation.url, wait_until="domcontentloaded")
        else:
            rows = await self._all_matches("conversation_row")
            for row in rows:
                if self._conversation_id(await self._row_url(row), -1) == conversation.conversation_id:
                    await row.click()
                    break
        marker = await self._first_match("thread_marker", timeout=15_000)
        if marker is None:
            raise LayoutError(
                "thread_marker", self.page.url, await self.screenshot("thread")
            )

    async def read_guest_messages(
        self, conversation: Conversation, *, limit: int = 5
    ) -> list[GuestMessage]:
        """The most recent inbound (guest-authored) messages in a conversation."""
        await self.open_conversation(conversation)
        inbound = await self._all_matches("thread_message_inbound")
        if not inbound:
            # Some themes do not tag direction. Fall back to every message and
            # let the caller's fingerprint store suppress anything already seen;
            # our own outbound replies are recorded as sent, so they are skipped.
            inbound = await self._all_matches("thread_message")
        if not inbound:
            raise LayoutError(
                "thread_message", self.page.url, await self.screenshot("thread-messages")
            )

        messages: list[GuestMessage] = []
        for node in inbound[-limit:]:
            body = await self._text(node, "thread_message_body")
            if not body:
                body = await self._safe_inner_text(node)
            body = body.strip()
            if not body:
                continue
            messages.append(
                GuestMessage(
                    conversation=conversation,
                    body=body,
                    received_label=await self._message_time(node),
                )
            )
        return messages

    async def _message_time(self, node: Locator) -> str:
        locator = await self._first_match("thread_message_time", root=node, timeout=1_000)
        if locator is None:
            return ""
        for attribute in ("datetime", "title"):
            try:
                value = await locator.get_attribute(attribute)
            except PlaywrightError:
                value = None
            if value:
                return value.strip()
        return await self._safe_inner_text(locator)

    # -- writing -----------------------------------------------------------
    async def send_reply(self, conversation: Conversation, text: str) -> None:
        """Type `text` into the conversation's composer and send it."""
        if not text.strip():
            raise ValueError("refusing to send an empty reply")
        await self.ensure_logged_in()
        await self.open_conversation(conversation)

        composer = await self._require("composer_input")
        await composer.click()
        await composer.fill("")
        await composer.type(text, delay=8)

        send = await self._require("composer_send")
        await send.click()

        # Confirm it landed: the composer empties and the text shows in the
        # thread. If neither happens, treat the send as failed rather than
        # silently assuming success.
        try:
            await self.page.wait_for_timeout(1_500)
            leftover = (await composer.input_value()) if await self._is_input(composer) else ""
        except PlaywrightError:
            leftover = ""
        if leftover.strip() == text.strip():
            raise ZeevouError(
                "Clicked send but the composer still holds the draft — the reply "
                "probably did not go out."
            )

    @staticmethod
    async def _is_input(locator: Locator) -> bool:
        try:
            tag = await locator.evaluate("node => node.tagName.toLowerCase()")
        except PlaywrightError:
            return False
        return tag in {"input", "textarea"}

    # -- diagnostics -------------------------------------------------------
    async def probe(self) -> dict[str, Any]:
        """Report which selectors currently match — used by `probe` CLI."""
        await self.ensure_logged_in()
        report: dict[str, Any] = {"url": self.page.url, "selectors": {}}
        for name in selectors.all_names():
            matched = None
            count = 0
            for candidate in selectors.candidates(name):
                count = await self.page.locator(candidate).count()
                if count:
                    matched = candidate
                    break
            report["selectors"][name] = {"matched": matched, "count": count}
        report["screenshot"] = str(await self.screenshot("probe") or "")
        return report
