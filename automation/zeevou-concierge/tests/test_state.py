"""The de-duplication guarantee: a message is never processed twice."""

from __future__ import annotations

from zeevou_concierge import state
from zeevou_concierge.state import Store, fingerprint, short_id_for


def make_store(tmp_path) -> Store:
    return Store(tmp_path / "state.sqlite3")


def test_fingerprint_is_stable_across_whitespace_reflow():
    a = fingerprint("conv-1", "Hi there,\n  what time is check in?", "10:03", "Sam")
    b = fingerprint("conv-1", "Hi there, what time is check   in?", "10:03", "Sam")
    assert a == b


def test_fingerprint_separates_conversations_and_bodies():
    base = fingerprint("conv-1", "Same text", "10:03", "Sam")
    assert base != fingerprint("conv-2", "Same text", "10:03", "Sam")
    assert base != fingerprint("conv-1", "Other text", "10:03", "Sam")
    assert base != fingerprint("conv-1", "Same text", "11:03", "Sam")


def test_record_if_new_is_idempotent(tmp_path):
    store = make_store(tmp_path)
    fp = fingerprint("conv-1", "What is the wifi password?", "10:03")
    kwargs = dict(
        fingerprint=fp,
        conversation_id="conv-1",
        conversation_url="https://example.test/c/1",
        body="What is the wifi password?",
    )
    assert store.record_if_new(**kwargs) is True
    assert store.record_if_new(**kwargs) is False
    assert store.is_known(fp)
    assert len(store.by_status(state.NEW)) == 1


def test_status_transitions_and_lookup_by_short_id(tmp_path):
    store = make_store(tmp_path)
    fp = fingerprint("conv-9", "Can I check in early?")
    store.record_if_new(
        fingerprint=fp, conversation_id="conv-9", conversation_url="u", body="early?"
    )
    store.update(fp, status=state.DRAFTED, draft="Yes, from 1pm.")
    found = store.get_by_short_id(short_id_for(fp))
    assert found is not None and found.draft == "Yes, from 1pm."
    store.update(fp, status=state.SENT)
    assert store.counts_by_status() == {state.SENT: 1}


def test_update_rejects_unknown_columns(tmp_path):
    store = make_store(tmp_path)
    fp = fingerprint("c", "b")
    store.record_if_new(fingerprint=fp, conversation_id="c", conversation_url="u", body="b")
    try:
        store.update(fp, nonsense="x")
    except ValueError as exc:
        assert "nonsense" in str(exc)
    else:  # pragma: no cover
        raise AssertionError("expected ValueError")


def test_attempts_increment(tmp_path):
    store = make_store(tmp_path)
    fp = fingerprint("c", "b")
    store.record_if_new(fingerprint=fp, conversation_id="c", conversation_url="u", body="b")
    assert store.bump_attempts(fp) == 1
    assert store.bump_attempts(fp) == 2


def test_alert_throttling_lets_the_first_through_then_mutes(tmp_path):
    store = make_store(tmp_path)
    assert store.should_alert("layout", cooldown_seconds=60) is True
    assert store.should_alert("layout", cooldown_seconds=60) is False
    assert store.should_alert("other", cooldown_seconds=60) is True
    store.clear_alert("layout")
    assert store.should_alert("layout", cooldown_seconds=60) is True


def test_kv_roundtrip(tmp_path):
    store = make_store(tmp_path)
    assert store.get_value("offset", 0) == 0
    store.set_value("offset", 41)
    store.set_value("offset", 42)
    assert store.get_value("offset") == 42
