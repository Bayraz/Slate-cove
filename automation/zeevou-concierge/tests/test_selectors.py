"""Selector overrides — the escape hatch when Zeevou's markup changes."""

from __future__ import annotations

from zeevou_concierge import selectors


def test_defaults_are_returned_when_no_override(monkeypatch):
    monkeypatch.delenv("ZEEVOU_SEL_COMPOSER_SEND", raising=False)
    assert selectors.candidates("composer_send") == selectors.DEFAULTS["composer_send"]


def test_env_override_replaces_defaults(monkeypatch):
    monkeypatch.setenv("ZEEVOU_SEL_COMPOSER_SEND", "#send || button.new-send")
    assert selectors.candidates("composer_send") == ["#send", "button.new-send"]


def test_describe_names_the_override_variable():
    assert "ZEEVOU_SEL_CONVERSATION_ROW" in selectors.describe("conversation_row")


def test_unknown_selector_is_an_error():
    try:
        selectors.candidates("not_a_selector")
    except KeyError:
        return
    raise AssertionError("expected KeyError")
