"""Every CSS/text selector the tool depends on, in one place.

Zeevou's markup is not a published API, so this is the file that breaks when
they redesign the Unified Inbox — and the only file that needs editing when
they do. Each entry is a list of candidates tried in order, so a redesign that
keeps one of the shapes still works.

Any entry can be overridden from the environment without touching code:

    ZEEVOU_SEL_CONVERSATION_ROW='div[data-testid="thread"]'

Multiple candidates are separated by ` || `.
"""

from __future__ import annotations

import os

OVERRIDE_PREFIX = "ZEEVOU_SEL_"
OVERRIDE_SEPARATOR = "||"

DEFAULTS: dict[str, list[str]] = {
    # --- login form -------------------------------------------------------
    "login_email": [
        'input[name="email"]',
        'input[type="email"]',
        "#username",
        'input[name="_username"]',
    ],
    "login_password": [
        'input[name="password"]',
        'input[type="password"]',
        'input[name="_password"]',
    ],
    "login_submit": [
        'button[type="submit"]',
        'input[type="submit"]',
        "button:has-text('Log in')",
        "button:has-text('Sign in')",
    ],
    # Presence of this means we are *not* logged in.
    "login_marker": [
        'form[action*="login"]',
        'input[type="password"]',
    ],
    # --- inbox ------------------------------------------------------------
    # Presence of this means the inbox finished loading.
    "inbox_marker": [
        '[data-testid="unified-inbox"]',
        ".unified-inbox",
        "#unified-inbox",
        "main:has-text('Inbox')",
    ],
    "conversation_row": [
        '[data-testid="conversation-item"]',
        ".conversation-list-item",
        ".inbox-thread",
        "ul.conversations > li",
    ],
    "conversation_unread_row": [
        '[data-testid="conversation-item"].unread',
        ".conversation-list-item.unread",
        ".inbox-thread.unread",
        "li.conversation.unread",
    ],
    "conversation_guest_name": [
        '[class*="Conversation-guestName"]',
        '[class*="Conversation-name"]',
        '[class*="Conversation-title"]',
        '[data-testid="guest-name"]',
        ".guest-name",
        ".conversation-title",
        "h3",
    ],
    "conversation_property_name": [
        '[data-testid="property-name"]',
        ".property-name",
        ".conversation-subtitle",
    ],
    # --- open conversation ------------------------------------------------
    "thread_marker": [
        '[data-testid="message-thread"]',
        ".message-thread",
        ".chat-messages",
    ],
    "thread_message": [
        '[data-testid="message"]',
        ".message-item",
        ".chat-message",
    ],
    # A message matching this is from the guest, not from us.
    "thread_message_inbound": [
        '[data-testid="message"][data-direction="inbound"]',
        ".message-item.inbound",
        ".message-item.received",
        ".chat-message--guest",
    ],
    "thread_message_body": [
        '[data-testid="message-body"]',
        ".message-body",
        ".message-text",
        ".chat-message__text",
    ],
    "thread_message_time": [
        "time",
        '[data-testid="message-time"]',
        ".message-time",
        ".timestamp",
    ],
    # --- composer ---------------------------------------------------------
    "composer_input": [
        '[data-testid="message-composer"] textarea',
        "textarea[name='message']",
        "textarea[placeholder*='message' i]",
        "div[contenteditable='true']",
    ],
    "composer_send": [
        '[data-testid="send-message"]',
        "button:has-text('Send')",
        "button[type='submit']",
    ],
}


def _override_key(name: str) -> str:
    return OVERRIDE_PREFIX + name.upper()


def candidates(name: str) -> list[str]:
    """Selector candidates for `name`, newest override first."""
    if name not in DEFAULTS:
        raise KeyError(f"unknown selector {name!r}")
    raw = os.environ.get(_override_key(name), "").strip()
    if raw:
        return [part.strip() for part in raw.split(OVERRIDE_SEPARATOR) if part.strip()]
    return list(DEFAULTS[name])


def describe(name: str) -> str:
    """Human-readable form for alerts, including the override to set."""
    return (
        f"{name} (tried: {', '.join(candidates(name))}; "
        f"override with {_override_key(name)})"
    )


def all_names() -> list[str]:
    return sorted(DEFAULTS)
