"""Approval-card construction and update parsing."""

from __future__ import annotations

from zeevou_concierge.telegram import (
    MAX_MESSAGE_CHARS,
    approval_keyboard,
    format_draft_message,
    parse_update,
    truncate,
)


def test_parse_callback_update():
    update = parse_update(
        {
            "update_id": 7,
            "callback_query": {
                "id": "cb1",
                "data": "approve:abc123",
                "message": {"message_id": 55, "chat": {"id": -100}},
            },
        }
    )
    assert update.is_callback
    assert update.callback_data == "approve:abc123"
    assert update.chat_id == "-100"
    assert update.message_id == 55


def test_parse_text_update():
    update = parse_update(
        {"update_id": 8, "message": {"message_id": 3, "chat": {"id": 42}, "text": "/status"}}
    )
    assert not update.is_callback
    assert update.text == "/status"
    assert update.chat_id == "42"


def test_keyboard_callback_data_fits_telegram_limit():
    keyboard = approval_keyboard("0123456789abcdef")
    actions = [
        button["callback_data"]
        for row in keyboard["inline_keyboard"]
        for button in row
    ]
    assert actions == ["approve:0123456789abcdef", "edit:0123456789abcdef", "skip:0123456789abcdef"]
    assert all(len(action.encode("utf-8")) <= 64 for action in actions)


def test_format_draft_message_escapes_html_and_flags_escalation():
    card = format_draft_message(
        guest_name="Sam <script>",
        property_name="Cove Loft",
        received_label="10:03",
        guest_message="Can I get a refund & early check-in?",
        draft="I'll check with the team.",
        escalate=True,
    )
    assert "&lt;script&gt;" in card
    assert "&amp;" in card
    assert "Needs your judgement" in card


def test_truncate_keeps_within_limit():
    long_text = "x" * (MAX_MESSAGE_CHARS + 500)
    assert len(truncate(long_text)) <= MAX_MESSAGE_CHARS
    assert truncate("short") == "short"
