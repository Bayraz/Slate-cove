"""Prompt-side logic that runs without touching the network."""

from __future__ import annotations

import json

from zeevou_concierge.drafting import ESCALATE_MARKER, build_system_prompt, parse_reply
from zeevou_concierge.properties import PropertyBook


def test_parse_reply_plain():
    text, escalate = parse_reply("  Check-in is from 3pm.  ")
    assert text == "Check-in is from 3pm."
    assert escalate is False


def test_parse_reply_detects_escalation_marker():
    text, escalate = parse_reply(f"{ESCALATE_MARKER}\nI'll look into the refund.")
    assert escalate is True
    assert text == "I'll look into the refund."


def test_parse_reply_strips_wrapping_quotes_and_extra_blank_lines():
    text, _ = parse_reply('"Hello.\n\n\n\nSee you soon."')
    assert text == "Hello.\n\nSee you soon."


def write_book(tmp_path):
    path = tmp_path / "properties.json"
    path.write_text(
        json.dumps(
            {
                "shared_notes": "Office hours are weekdays 9am-10pm.",
                "properties": [
                    {
                        "name": "Cove Loft, Shoreditch",
                        "aliases": ["SH-01"],
                        "check_in": "From 3pm",
                        "pets": "Not allowed",
                        "local_tips": ["Market nearby", "Tube 5 min"],
                    }
                ],
            }
        ),
        encoding="utf-8",
    )
    return PropertyBook.load(path)


def test_property_matching_is_forgiving(tmp_path):
    book = write_book(tmp_path)
    assert book.match("Cove Loft, Shoreditch") is not None
    assert book.match("cove loft shoreditch") is not None
    assert book.match("SH-01") is not None
    assert book.match("Cove Loft") is not None
    assert book.match("Somewhere Else") is None


def test_context_includes_facts_and_shared_notes(tmp_path):
    book = write_book(tmp_path)
    context = book.context_for("SH-01")
    assert "Check in: From 3pm" in context
    assert "Local tips: Market nearby; Tube 5 min" in context
    assert "Office hours are weekdays 9am-10pm." in context


def test_unknown_property_tells_claude_not_to_invent(tmp_path):
    book = write_book(tmp_path)
    context = book.context_for("Unlisted Cottage")
    assert "Do not invent" in context


def test_missing_property_file_is_not_fatal(tmp_path):
    book = PropertyBook.load(tmp_path / "nope.json")
    assert book.context_for("") == "No property context available."


def test_brand_defaults_are_neutral_when_not_configured(tmp_path):
    book = PropertyBook.load(tmp_path / "missing.json")
    prompt = build_system_prompt(book.brand)
    assert "the property management company" in prompt
    assert "Sign off as" not in prompt


def test_brand_from_file_shapes_the_prompt(tmp_path):
    path = tmp_path / "properties.json"
    path.write_text(
        json.dumps(
            {
                "brand": {
                    "name": "Airhost",
                    "description": "a short-let management company",
                    "sign_off": "the Airhost team",
                    "tone": "Friendly but efficient.",
                },
                "properties": [],
            }
        ),
        encoding="utf-8",
    )
    book = PropertyBook.load(path)
    prompt = build_system_prompt(book.brand)

    assert "on behalf of Airhost, a short-let management company" in prompt
    assert "Sign off as the Airhost team" in prompt
    assert "Friendly but efficient." in prompt
    # The company the tool was first written for must not leak into another brand.
    assert "Slate & Cove" not in prompt


def test_blank_greeting_gets_closed_up():
    """A draft must never go out addressed to nobody."""
    text, _ = parse_reply("Hi , sorry about that.\n\nThe lift is building-managed.")
    assert text.startswith("Hi there, sorry about that.")


def test_real_name_is_left_alone():
    text, _ = parse_reply("Hi Ipsita, sorry about that.")
    assert text.startswith("Hi Ipsita,")


def test_greeting_repair_only_touches_the_opening():
    text, _ = parse_reply("Hi Sam, say hello , to the team.")
    assert text == "Hi Sam, say hello , to the team."
