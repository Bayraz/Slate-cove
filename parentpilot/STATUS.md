# ParentPilot: Status

_As of 2026-09-30 · branch `claude/parentpilot-foundation-bgd87p` · commit `42b43a4`_

**Where we are:** Stage 1 (foundation) is complete. The app runs end to end on demo data. There is no real backend and no real AI yet. Next up: Supabase wiring.

---

## What's done

### App shell
- Expo SDK 57 + React Native + TypeScript (strict) + Expo Router, in `parentpilot/` (the repo root is an unrelated Next.js website, left untouched apart from one `tsconfig` exclude).
- Five tabs: **Today**, **Ask**, **Memory**, **Reminders**, **Community**.
- Warm, calm theme with design tokens; 48pt touch targets; screen-reader labels; contrast-checked colours.

### Screens
| Screen | State |
| --- | --- |
| **Today** | Built. Greeting, child name/age (twins handled), today's appointment, due reminders, one saved question, "What can I take care of?" prompt. Loading / error / empty states. |
| **Ask** | Built. Chat UI, suggested prompts, input validation, "Preview" banner, tool-activity lines, safety styling for urgent replies. |
| Memory / Reminders / Community | Placeholders with visible `TODO:` markers. |
| Sign in | Built (sign in, create account, reset password). Only shown when Supabase is configured. |

### AI architecture
- Flow: safety screen → provider interprets → approved tool runs → typed result → provider explains → honesty guard.
- **Tool registry:** typed, zod-validated, unknown tools rejected, write tools blocked without confirmation. The AI never touches the database; tools only get family-scoped repositories.
- **3 read-only tools:** `get_child_information`, `search_memory`, `list_reminders` (the other 13 are named, not built).
- **Safety:** emergency and parent-crisis messages get fixed guidance and never reach a model; health questions are redirected to NHS/professionals; system prompt for future models; guard that blocks replies claiming an action that never happened.
- **Preview assistant:** a keyword router, *not* real AI, clearly labelled. Only uses read-only tools.

### Data and domain
- Family → Caregivers (roles/permissions) → Children; structured Memory (kinds, tags, source), Reminders (recurrence, truthful notification field), Appointments, Community models.
- Repository interfaces with demo data isolated in `src/data/mock` (Sarah, Emma, one appointment, 3 reminders, 4 memories).
- Reminder service with a `NotificationScheduler` abstraction (no scheduler exists, so nothing is ever reported as sent).

### Backend foundation
- Supabase auth service (sign up/in/out, reset request) + demo mode when no credentials.
- `supabase/migrations/0001_foundation.sql`: all tables with row-level security.

### Docs
`README.md`, `TODO.md`, `.env.example`, this file.

---

## What was verified

| Check | Result |
| --- | --- |
| TypeScript strict | Clean |
| Unit tests (safety, tools, orchestrator, Today logic, dates) | 38 passing |
| Expo bundling: iOS, Android, web | All succeed |
| Web build driven in Chromium: Today, all tabs, Ask (lookup, unsupported request, emergency) | Works, no console errors |
| SQL migration on local Postgres, two-family RLS test | Applies; family B cannot read or write family A's data |

Bugs found and fixed during verification: a non-immutable generated column in the SQL, a crisis-wording gap in the safety screen, truncated tab labels, a Pressable typing error.

## Not verified yet
- Running on a real phone, iOS simulator or Android emulator.
- Sign-in against a real Supabase project.
- Anything involving a real AI model (none is connected).

---

## What's not built
- Real data persistence (everything is demo data, read-only)
- Family onboarding and invites
- Real AI provider (server-side, holds the key)
- Write tools (save memory, create reminder) with confirmation
- Push notifications
- Memory / Reminders / Community screens
- Calendar, baby log, trusted-information search, product search
- Clinical review of safety wording
- CI, e2e tests, dark mode, analytics

---

## Next step

**Wire up the real backend.** Create the Supabase project, apply the migration, implement the Supabase repositories, add family onboarding.

**Needed from you:** Supabase project URL + anon key, and a decision on email confirmation for new accounts. Also helpful: try the app in Expo Go and share feedback.

Full ordered roadmap: [TODO.md](TODO.md).
