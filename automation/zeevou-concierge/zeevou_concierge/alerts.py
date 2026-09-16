"""Failure alerting.

The point of this module: if Zeevou changes their markup, or the login stops
working, or Claude starts erroring, the loop must not fail quietly. Every
failure path funnels through `Alerter.failure`, which sends a Telegram message
(with a screenshot when there is one) and throttles repeats so a broken
selector does not fire an alert every five minutes.
"""

from __future__ import annotations

import html
import logging
import time
import traceback

from .state import Store
from .telegram import TelegramClient, TelegramError

log = logging.getLogger(__name__)

DEFAULT_COOLDOWN_SECONDS = 1800.0


class Alerter:
    def __init__(
        self,
        telegram: TelegramClient,
        store: Store,
        *,
        cooldown_seconds: float = DEFAULT_COOLDOWN_SECONDS,
    ) -> None:
        self.telegram = telegram
        self.store = store
        self.cooldown_seconds = cooldown_seconds

    async def failure(
        self,
        key: str,
        headline: str,
        exc: BaseException | None = None,
        *,
        screenshot: str | None = None,
        hint: str = "",
    ) -> None:
        """Report a failure, at most once per cooldown window per `key`."""
        log.error("%s: %s", headline, exc, exc_info=exc is not None)
        if not self.store.should_alert(key, self.cooldown_seconds):
            log.info("alert %s suppressed (still inside cooldown)", key)
            return

        detail = ""
        if exc is not None:
            detail = f"{type(exc).__name__}: {exc}".strip()
            log.debug("%s", "".join(traceback.format_exception(exc)))

        body = f"🚨 <b>{html.escape(headline)}</b>"
        if detail:
            body += f"\n\n<pre>{html.escape(detail[:1200])}</pre>"
        if hint:
            body += f"\n\n{html.escape(hint)}"
        body += (
            "\n\nThe loop keeps running and will retry. Further alerts of this "
            f"kind are muted for {int(self.cooldown_seconds // 60)} minutes."
        )

        try:
            await self.telegram.send_message(body)
            if screenshot:
                await self.telegram.send_photo(screenshot, caption=headline)
        except (TelegramError, OSError) as send_exc:
            # If Telegram itself is the thing that is broken, the log is all
            # that is left — make sure it is loud.
            log.critical("COULD NOT DELIVER ALERT %r: %s", headline, send_exc)

    async def recovered(self, key: str, message: str) -> None:
        """Clear a failure key and say so, but only if it was actually firing."""
        if self.store.get_value(f"alert_active:{key}", False):
            self.store.set_value(f"alert_active:{key}", False)
            try:
                await self.telegram.send_message(f"✅ {html.escape(message)}")
            except TelegramError as exc:
                log.warning("could not send recovery notice: %s", exc)
        self.store.clear_alert(key)

    def mark_active(self, key: str) -> None:
        self.store.set_value(f"alert_active:{key}", True)

    # -- watchdog ----------------------------------------------------------
    def note_success(self, name: str) -> None:
        self.store.set_value(f"last_success:{name}", time.time())

    def last_success(self, name: str) -> float | None:
        value = self.store.get_value(f"last_success:{name}")
        return float(value) if value else None

    async def check_watchdog(self, name: str, max_age_seconds: float) -> None:
        """Alert if `name` has not reported success inside its window."""
        last = self.last_success(name)
        if last is None:
            self.note_success(name)  # first run — start the clock
            return
        age = time.time() - last
        if age > max_age_seconds:
            minutes = int(age // 60)
            self.mark_active(f"watchdog:{name}")
            await self.failure(
                f"watchdog:{name}",
                f"No successful {name} for {minutes} minutes",
                hint=(
                    "The loop is running but not getting through. Check the logs, "
                    "then try `python -m zeevou_concierge probe`."
                ),
            )
