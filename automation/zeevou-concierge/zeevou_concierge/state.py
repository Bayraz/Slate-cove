"""Durable state: what has been seen, drafted, approved and sent.

Everything the loop must not repeat lives in one SQLite file. The message
fingerprint is the primary key, so a message that reappears in the inbox on the
next poll is recognised and skipped rather than drafted and sent twice.
"""

from __future__ import annotations

import hashlib
import json
import sqlite3
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

# Lifecycle of one guest message.
NEW = "new"
DRAFTED = "drafted"
AWAITING_APPROVAL = "awaiting_approval"
AWAITING_EDIT = "awaiting_edit"
APPROVED = "approved"
SENT = "sent"
SKIPPED = "skipped"
FAILED = "failed"

SCHEMA = """
CREATE TABLE IF NOT EXISTS messages (
    fingerprint      TEXT PRIMARY KEY,
    short_id         TEXT UNIQUE NOT NULL,
    conversation_id  TEXT NOT NULL,
    conversation_url TEXT NOT NULL,
    guest_name       TEXT NOT NULL DEFAULT '',
    property_name    TEXT NOT NULL DEFAULT '',
    received_label   TEXT NOT NULL DEFAULT '',
    body             TEXT NOT NULL,
    status           TEXT NOT NULL,
    draft            TEXT,
    reply_sent       TEXT,
    error            TEXT,
    attempts         INTEGER NOT NULL DEFAULT 0,
    created_at       REAL NOT NULL,
    updated_at       REAL NOT NULL
);
CREATE INDEX IF NOT EXISTS messages_status_idx ON messages (status);

CREATE TABLE IF NOT EXISTS alerts (
    key          TEXT PRIMARY KEY,
    last_sent_at REAL NOT NULL,
    count        INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS kv (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
"""


def fingerprint(
    conversation_id: str, body: str, received_label: str = "", sender: str = ""
) -> str:
    """Stable identity for one inbound message.

    Zeevou does not expose a dependable per-message id in the DOM, so identity
    is derived from the conversation plus the message content and its timestamp
    label. Whitespace is normalised so a re-render that reflows the text does
    not look like a new message.
    """
    parts = [
        conversation_id.strip(),
        sender.strip().lower(),
        received_label.strip().lower(),
        " ".join(body.split()),
    ]
    digest = hashlib.sha256("\x1f".join(parts).encode("utf-8"))
    return digest.hexdigest()


def short_id_for(fp: str) -> str:
    """Telegram callback_data is capped at 64 bytes, so carry a short handle."""
    return fp[:16]


@dataclass
class StoredMessage:
    fingerprint: str
    short_id: str
    conversation_id: str
    conversation_url: str
    guest_name: str
    property_name: str
    received_label: str
    body: str
    status: str
    draft: str | None
    reply_sent: str | None
    error: str | None
    attempts: int
    created_at: float
    updated_at: float

    @classmethod
    def from_row(cls, row: sqlite3.Row) -> "StoredMessage":
        return cls(**{key: row[key] for key in row.keys()})


class Store:
    def __init__(self, path: str | Path) -> None:
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._db = sqlite3.connect(self.path, isolation_level=None)
        self._db.row_factory = sqlite3.Row
        self._db.execute("PRAGMA journal_mode=WAL")
        self._db.execute("PRAGMA busy_timeout=5000")
        self._db.executescript(SCHEMA)

    def close(self) -> None:
        self._db.close()

    def __enter__(self) -> "Store":
        return self

    def __exit__(self, *_exc: Any) -> None:
        self.close()

    # -- messages ----------------------------------------------------------
    def record_if_new(
        self,
        *,
        fingerprint: str,
        conversation_id: str,
        conversation_url: str,
        guest_name: str = "",
        property_name: str = "",
        received_label: str = "",
        body: str = "",
    ) -> bool:
        """Insert a freshly seen message. Returns False if already known."""
        now = time.time()
        cur = self._db.execute(
            """
            INSERT OR IGNORE INTO messages (
                fingerprint, short_id, conversation_id, conversation_url,
                guest_name, property_name, received_label, body, status,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                fingerprint,
                short_id_for(fingerprint),
                conversation_id,
                conversation_url,
                guest_name,
                property_name,
                received_label,
                body,
                NEW,
                now,
                now,
            ),
        )
        return cur.rowcount == 1

    def is_known(self, fingerprint: str) -> bool:
        row = self._db.execute(
            "SELECT 1 FROM messages WHERE fingerprint = ?", (fingerprint,)
        ).fetchone()
        return row is not None

    def get(self, fingerprint: str) -> StoredMessage | None:
        row = self._db.execute(
            "SELECT * FROM messages WHERE fingerprint = ?", (fingerprint,)
        ).fetchone()
        return StoredMessage.from_row(row) if row else None

    def get_by_short_id(self, short_id: str) -> StoredMessage | None:
        row = self._db.execute(
            "SELECT * FROM messages WHERE short_id = ?", (short_id,)
        ).fetchone()
        return StoredMessage.from_row(row) if row else None

    def by_status(self, *statuses: str, limit: int = 50) -> list[StoredMessage]:
        placeholders = ",".join("?" for _ in statuses)
        rows = self._db.execute(
            f"SELECT * FROM messages WHERE status IN ({placeholders}) "
            "ORDER BY created_at ASC LIMIT ?",
            (*statuses, limit),
        ).fetchall()
        return [StoredMessage.from_row(row) for row in rows]

    def update(self, fingerprint: str, **fields: Any) -> None:
        allowed = {
            "status",
            "draft",
            "reply_sent",
            "error",
            "attempts",
            "guest_name",
            "property_name",
        }
        unknown = set(fields) - allowed
        if unknown:
            raise ValueError(f"cannot update unknown columns: {sorted(unknown)}")
        if not fields:
            return
        assignments = ", ".join(f"{key} = ?" for key in fields)
        self._db.execute(
            f"UPDATE messages SET {assignments}, updated_at = ? WHERE fingerprint = ?",
            (*fields.values(), time.time(), fingerprint),
        )

    def bump_attempts(self, fingerprint: str) -> int:
        self._db.execute(
            "UPDATE messages SET attempts = attempts + 1, updated_at = ? "
            "WHERE fingerprint = ?",
            (time.time(), fingerprint),
        )
        row = self._db.execute(
            "SELECT attempts FROM messages WHERE fingerprint = ?", (fingerprint,)
        ).fetchone()
        return int(row["attempts"]) if row else 0

    def counts_by_status(self) -> dict[str, int]:
        rows = self._db.execute(
            "SELECT status, COUNT(*) AS n FROM messages GROUP BY status"
        ).fetchall()
        return {row["status"]: row["n"] for row in rows}

    # -- alert throttling --------------------------------------------------
    def should_alert(self, key: str, cooldown_seconds: float = 1800.0) -> bool:
        """True at most once per cooldown window for a given failure key.

        Keeps a broken selector from sending an alert on every single poll while
        still making sure the first one gets through immediately.
        """
        now = time.time()
        row = self._db.execute(
            "SELECT last_sent_at FROM alerts WHERE key = ?", (key,)
        ).fetchone()
        if row is not None and now - row["last_sent_at"] < cooldown_seconds:
            self._db.execute(
                "UPDATE alerts SET count = count + 1 WHERE key = ?", (key,)
            )
            return False
        self._db.execute(
            "INSERT INTO alerts (key, last_sent_at, count) VALUES (?, ?, 1) "
            "ON CONFLICT(key) DO UPDATE SET last_sent_at = excluded.last_sent_at, "
            "count = alerts.count + 1",
            (key, now),
        )
        return True

    def clear_alert(self, key: str) -> None:
        self._db.execute("DELETE FROM alerts WHERE key = ?", (key,))

    # -- small key/value scratchpad ---------------------------------------
    def get_value(self, key: str, default: Any = None) -> Any:
        row = self._db.execute("SELECT value FROM kv WHERE key = ?", (key,)).fetchone()
        return json.loads(row["value"]) if row else default

    def set_value(self, key: str, value: Any) -> None:
        self._db.execute(
            "INSERT INTO kv (key, value) VALUES (?, ?) "
            "ON CONFLICT(key) DO UPDATE SET value = excluded.value",
            (key, json.dumps(value)),
        )

    def known_fingerprints(self, candidates: Iterable[str]) -> set[str]:
        candidates = list(candidates)
        if not candidates:
            return set()
        placeholders = ",".join("?" for _ in candidates)
        rows = self._db.execute(
            f"SELECT fingerprint FROM messages WHERE fingerprint IN ({placeholders})",
            candidates,
        ).fetchall()
        return {row["fingerprint"] for row in rows}
