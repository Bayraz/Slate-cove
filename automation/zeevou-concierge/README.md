# Zeevou guest-message concierge

Checks the Zeevou Unified Inbox every five to ten minutes, drafts a reply to
each new guest message with Claude, sends the draft to you on Telegram, and —
only once you approve it — logs back into Zeevou and posts the reply into that
guest's conversation.

Nothing reaches a guest without you pressing a button.

```
inbox poll ──► new guest message ──► Claude drafts a reply
                                          │
                                          ▼
                              Telegram: Approve / Edit / Skip
                                          │  (approved)
                                          ▼
                              Playwright types it into Zeevou
```

## What is in here

| File | Role |
| --- | --- |
| `zeevou_concierge/runner.py` | The loop: poll, draft, ask, send. Three asyncio tasks. |
| `zeevou_concierge/zeevou.py` | Playwright driver — login, read the inbox, post a reply. |
| `zeevou_concierge/selectors.py` | **Every selector, in one file.** This is what breaks when Zeevou redesigns. |
| `zeevou_concierge/drafting.py` | The Claude call and the reply-writing prompt. |
| `zeevou_concierge/telegram.py` | The approval bot. |
| `zeevou_concierge/state.py` | SQLite: what has been seen, drafted, approved, sent. |
| `zeevou_concierge/alerts.py` | Failure alerts, with throttling and a watchdog. |
| `config/properties.example.json` | Per-property facts Claude is allowed to quote. |

## Setup

```bash
cd automation/zeevou-concierge
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
playwright install chromium

cp .env.example .env                              # then fill it in
cp config/properties.example.json config/properties.json
```

`.env` holds the Zeevou login, the Anthropic key and the Telegram token. It is
gitignored, and no credential is read from anywhere else in the code.

### Telegram bot

1. Message [@BotFather](https://t.me/BotFather), `/newbot`, copy the token into
   `TELEGRAM_BOT_TOKEN`.
2. Send your new bot any message so it is allowed to write to you.
3. Run `python -m zeevou_concierge test-telegram`. If `TELEGRAM_CHAT_ID` is
   still blank, start the tool once and it will tell you the chat id it sees —
   paste that into `.env`.

### Property context

`config/properties.json` is what stops Claude inventing a check-in time. Each
entry is free-form: any key you add is passed to the model as a fact it may
quote. `aliases` covers the case where Zeevou labels the property differently
from your own naming. `escalate_if` lists the subjects Claude should flag for
your judgement rather than answer.

## Running it

```bash
python -m zeevou_concierge run          # the loop — this is the normal command
python -m zeevou_concierge check-once   # one cycle, then exit
python -m zeevou_concierge probe        # which selectors still match (see below)
python -m zeevou_concierge status       # counts by state
python -m zeevou_concierge test-telegram
```

Set `DRY_RUN=true` for the first few days: you will get drafts and approval
buttons as normal, but an approval stops short of posting to Zeevou.

### Keeping it alive

```ini
# /etc/systemd/system/zeevou-concierge.service
[Unit]
Description=Zeevou guest-message concierge
After=network-online.target

[Service]
WorkingDirectory=/opt/zeevou-concierge
ExecStart=/opt/zeevou-concierge/.venv/bin/python -m zeevou_concierge run
Restart=always
RestartSec=30
User=zeevou

[Install]
WantedBy=multi-user.target
```

The tool does its own timing, so run it as one long-lived service rather than
from cron.

## The approval flow

Each new guest message arrives on Telegram as a card: who wrote it, which
property, what they said, and the draft. Three buttons:

- **Approve & send** — posts the draft into that guest's Zeevou conversation.
- **Edit** — your next Telegram message is sent instead of the draft.
- **Skip** — nothing is sent; handle it yourself in Zeevou.

Claude flags anything about money, complaints, damage, safety or legal matters,
and anything it would have to guess at, as **⚠️ Needs your judgement**. It still
writes a draft in those cases, so you have something to edit.

## Nothing is handled twice

Every inbound message gets a fingerprint — a hash of the conversation id, the
sender, the timestamp label and the normalised body — which is the primary key
in `data/state.sqlite3`. A message that is still sitting in the inbox on the
next poll is recognised and skipped. The same key guards sending: a reply moves
`approved → sent` in one transaction, and only `approved` rows are dispatched.

On the very first run the tool takes a **baseline**: everything already in the
inbox is recorded as seen and left alone, so switching it on does not fire off
drafts for a backlog of old conversations. It tells you how many it skipped.

## When Zeevou changes their site

This is browser automation against a UI that is not a published API, so assume
it will break eventually. The selectors in `selectors.py` are a best guess at
Zeevou's current markup — **verify them against your own account before
trusting the tool**, with `HEADLESS=false` so you can watch it work.

When a selector stops matching, the tool does not fail quietly:

1. It raises `LayoutError` naming the exact selector that stopped matching.
2. You get a Telegram alert with that name, a hint, and a full-page screenshot
   of what the tool was looking at.
3. Repeat alerts for the same failure are muted for 30 minutes, so a broken
   selector does not spam you every five minutes.
4. A watchdog alerts separately if no inbox check has succeeded in
   `WATCHDOG_MINUTES` (default 45), which catches failures that do not raise —
   for example a page that loads but never finishes.
5. The loop keeps running and keeps retrying. Nothing is silently dropped:
   messages it could not handle stay visible in `status`.

To fix one, run:

```bash
python -m zeevou_concierge probe
```

It logs in, reports which selector matched for each name and which did not, and
saves a screenshot. Then either edit `selectors.py` or — for a quick fix with no
code change — set the override in `.env`:

```bash
ZEEVOU_SEL_COMPOSER_SEND='button[data-new-thing] || button:has-text("Send")'
```

Candidates are tried in order, so you can leave the old one in place as a
fallback.

Other alerts you may see: **Cannot log in to Zeevou** (credentials, or Zeevou
now asking for 2FA or a CAPTCHA — which this tool cannot answer for you),
**Claude could not draft a reply**, **Could not send an approved reply** (after
three attempts), and **Telegram polling failed**.

## Tests

```bash
python -m pytest tests -q
```

The suite fakes Zeevou, Claude and Telegram, and covers the two guarantees that
matter: no reply is sent without an approval, and no message is drafted or sent
twice. It does not touch the network.

## Cost and rate limits

One Claude call per new guest message, at `ANTHROPIC_EFFORT` (default
`medium`). `MAX_DRAFTS_PER_CYCLE` caps how many are drafted in one pass so an
unexpected flood cannot run up a bill in a single cycle; the rest are picked up
on the next one. The poll interval is randomised between `POLL_MIN_SECONDS` and
`POLL_MAX_SECONDS` rather than fixed, which keeps the traffic pattern to Zeevou
less machine-like.

## Limits worth knowing

- Zeevou 2FA or a CAPTCHA on login will stop it; you will get an alert saying so.
- The browser session is cached in `data/zeevou-session.json` so it is not
  logging in from scratch every five minutes. Delete that file to force a fresh
  login.
- It replies in the conversation it read the message from. It does not create
  conversations, change bookings, or touch anything else in Zeevou.
- Check Zeevou's terms on automated access before running this against a
  production account.
