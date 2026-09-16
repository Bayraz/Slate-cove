"""Settings, loaded from the environment (never from code)."""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path


class ConfigError(RuntimeError):
    """A required setting is missing or malformed."""


def _env(name: str, default: str | None = None, *, required: bool = False) -> str:
    value = os.environ.get(name, default if default is not None else "")
    value = value.strip()
    if required and not value:
        raise ConfigError(
            f"{name} is not set. Copy .env.example to .env and fill it in."
        )
    return value


def _env_int(name: str, default: int) -> int:
    raw = os.environ.get(name, "").strip()
    if not raw:
        return default
    try:
        return int(raw)
    except ValueError as exc:
        raise ConfigError(f"{name} must be a whole number, got {raw!r}") from exc


def _env_bool(name: str, default: bool) -> bool:
    raw = os.environ.get(name, "").strip().lower()
    if not raw:
        return default
    if raw in {"1", "true", "yes", "on"}:
        return True
    if raw in {"0", "false", "no", "off"}:
        return False
    raise ConfigError(f"{name} must be true or false, got {raw!r}")


@dataclass(frozen=True)
class Settings:
    zeevou_email: str
    zeevou_password: str
    zeevou_base_url: str
    zeevou_inbox_path: str

    anthropic_api_key: str
    anthropic_model: str
    anthropic_effort: str

    telegram_bot_token: str
    telegram_chat_id: str

    poll_min_seconds: int
    poll_max_seconds: int
    headless: bool
    dry_run: bool
    max_drafts_per_cycle: int
    watchdog_minutes: int

    data_dir: Path
    properties_file: Path

    # Derived paths.
    state_path: Path = field(init=False)
    storage_state_path: Path = field(init=False)
    screenshot_dir: Path = field(init=False)

    def __post_init__(self) -> None:
        object.__setattr__(self, "state_path", self.data_dir / "state.sqlite3")
        object.__setattr__(
            self, "storage_state_path", self.data_dir / "zeevou-session.json"
        )
        object.__setattr__(self, "screenshot_dir", self.data_dir / "screenshots")

    @property
    def inbox_url(self) -> str:
        return self.zeevou_base_url.rstrip("/") + "/" + self.zeevou_inbox_path.lstrip("/")

    def ensure_dirs(self) -> None:
        self.data_dir.mkdir(parents=True, exist_ok=True)
        self.screenshot_dir.mkdir(parents=True, exist_ok=True)


def load_settings(env_file: str | os.PathLike[str] | None = ".env") -> Settings:
    """Read settings from `.env` (if present) and the process environment."""
    if env_file is not None:
        try:
            from dotenv import load_dotenv
        except ImportError:  # pragma: no cover - dependency is declared
            load_dotenv = None
        if load_dotenv is not None and Path(env_file).exists():
            load_dotenv(env_file, override=False)

    poll_min = _env_int("POLL_MIN_SECONDS", 300)
    poll_max = _env_int("POLL_MAX_SECONDS", 600)
    if poll_min < 60:
        raise ConfigError("POLL_MIN_SECONDS must be at least 60 to stay polite to Zeevou.")
    if poll_max < poll_min:
        raise ConfigError("POLL_MAX_SECONDS must be >= POLL_MIN_SECONDS.")

    effort = _env("ANTHROPIC_EFFORT", "medium").lower() or "medium"
    if effort not in {"low", "medium", "high", "xhigh", "max"}:
        raise ConfigError(
            "ANTHROPIC_EFFORT must be one of low, medium, high, xhigh, max."
        )

    return Settings(
        zeevou_email=_env("ZEEVOU_EMAIL", required=True),
        zeevou_password=_env("ZEEVOU_PASSWORD", required=True),
        zeevou_base_url=_env("ZEEVOU_BASE_URL", "https://app.zeevou.com"),
        zeevou_inbox_path=_env("ZEEVOU_INBOX_PATH", "/unified-inbox"),
        anthropic_api_key=_env("ANTHROPIC_API_KEY", required=True),
        anthropic_model=_env("ANTHROPIC_MODEL", "claude-opus-5"),
        anthropic_effort=effort,
        telegram_bot_token=_env("TELEGRAM_BOT_TOKEN", required=True),
        telegram_chat_id=_env("TELEGRAM_CHAT_ID"),
        poll_min_seconds=poll_min,
        poll_max_seconds=poll_max,
        headless=_env_bool("HEADLESS", True),
        dry_run=_env_bool("DRY_RUN", False),
        max_drafts_per_cycle=_env_int("MAX_DRAFTS_PER_CYCLE", 10),
        watchdog_minutes=_env_int("WATCHDOG_MINUTES", 45),
        data_dir=Path(_env("DATA_DIR", "./data")).expanduser(),
        properties_file=Path(_env("PROPERTIES_FILE", "./config/properties.json")).expanduser(),
    )
