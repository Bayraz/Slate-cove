"""Command line entry point: `python -m zeevou_concierge <command>`."""

from __future__ import annotations

import argparse
import asyncio
import json
import logging
import sys

from .config import ConfigError, load_settings

COMMANDS = ("run", "check-once", "probe", "test-telegram", "status")


def _configure_logging(verbose: bool) -> None:
    logging.basicConfig(
        level=logging.DEBUG if verbose else logging.INFO,
        format="%(asctime)s %(levelname)-7s %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    logging.getLogger("anthropic").setLevel(logging.WARNING)
    logging.getLogger("aiohttp").setLevel(logging.WARNING)


async def _run(settings) -> int:
    from .runner import Concierge

    concierge = Concierge(settings)
    try:
        await concierge.run()
    except KeyboardInterrupt:  # pragma: no cover - interactive
        await concierge.shutdown()
    return 0


async def _check_once(settings) -> int:
    from .runner import Concierge

    concierge = Concierge(settings)
    try:
        await concierge.telegram.start()
        drafted = await concierge.check_inbox()
        sent = await concierge.dispatch_approved()
        print(f"drafted {drafted} reply(ies); sent {sent} approved reply(ies)")
        return 0
    finally:
        await concierge.shutdown()


async def _probe(settings) -> int:
    """Log in and report which selectors still match — run this when alerted."""
    from .zeevou import ZeevouClient

    async with ZeevouClient(settings) as client:
        report = await client.probe()
    print(json.dumps(report, indent=2))
    missing = [name for name, info in report["selectors"].items() if not info["matched"]]
    if missing:
        print("\nNo match for:", ", ".join(missing), file=sys.stderr)
        print(
            "Fix these in zeevou_concierge/selectors.py, or set ZEEVOU_SEL_<NAME> "
            "in .env. The screenshot above shows the page as the tool sees it.",
            file=sys.stderr,
        )
        return 1
    print("\nAll selectors matched.")
    return 0


async def _test_telegram(settings) -> int:
    from .telegram import TelegramClient

    async with TelegramClient(settings.telegram_bot_token, settings.telegram_chat_id) as bot:
        me = await bot.get_me()
        print(f"Bot: @{me.get('username')}")
        if not bot.chat_id:
            print(
                "TELEGRAM_CHAT_ID is not set. Message the bot once, then run "
                "`run` — it will tell you the chat id it sees."
            )
            return 1
        await bot.send_message("🔔 Test message from the Zeevou concierge.")
        print(f"Sent a test message to chat {bot.chat_id}.")
    return 0


async def _status(settings) -> int:
    from .state import Store

    with Store(settings.state_path) as store:
        print(json.dumps(store.counts_by_status(), indent=2))
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(
        prog="python -m zeevou_concierge",
        description="Draft and send Zeevou guest replies, with Telegram approval.",
    )
    parser.add_argument("command", choices=COMMANDS, nargs="?", default="run")
    parser.add_argument("-v", "--verbose", action="store_true")
    parser.add_argument("--env-file", default=".env")
    args = parser.parse_args(argv)

    _configure_logging(args.verbose)
    try:
        settings = load_settings(args.env_file)
    except ConfigError as exc:
        print(f"Configuration error: {exc}", file=sys.stderr)
        return 2

    handlers = {
        "run": _run,
        "check-once": _check_once,
        "probe": _probe,
        "test-telegram": _test_telegram,
        "status": _status,
    }
    try:
        return asyncio.run(handlers[args.command](settings))
    except KeyboardInterrupt:  # pragma: no cover - interactive
        print("\nStopped.")
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
