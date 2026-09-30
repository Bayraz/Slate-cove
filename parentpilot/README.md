# ParentPilot

> "You've got enough to think about. We'll handle the little things."

ParentPilot is a mobile-first AI assistant that reduces the mental and practical
load on new parents: remembering things, organising things, preparing for
appointments, managing reminders, and (eventually) completing small tasks through
tightly controlled tools. It is deliberately **not** a baby tracker or content library.

This folder is the **foundation** (stage 1). It lives in `parentpilot/` inside the
repository; the Next.js website at the repository root is a separate project.

## Stack

| Concern | Choice |
| --- | --- |
| App | React Native + Expo (SDK 57), TypeScript (strict), Expo Router |
| UI | Plain React Native components + a small token-based theme (`src/theme`) |
| Backend | Supabase: Auth and Postgres with row-level security (connected, see below). Edge Functions for AI come later |
| Validation | zod (also produces the JSON Schemas handed to AI providers) |
| Tests | jest-expo |

Targets iOS, Android and web (web is used for development/verification; the
business logic is UI-free so a real web client can share it later).

## Install & run

Requires Node 20+ (developed on 22).

```bash
cd parentpilot
npm install
cp .env.example .env     # optional: with no values the app runs in demo mode
npm start                # Expo dev server (press i / a / w, or scan the QR code)
```

- **Phone (easiest):** install *Expo Go*, run `npm start`, scan the QR code (same Wi-Fi). If your network blocks it: `npx expo start --tunnel`.
- **iOS simulator:** `npm run ios` (macOS + Xcode). **Android emulator:** `npm run android`. **Browser:** `npm run web`.
- Changed `.env`? Restart with `npx expo start --clear` (values are baked in at bundle time).

Checks:

```bash
npm run typecheck   # tsc --noEmit
npm test            # unit tests
npm run test:db     # applies every migration to a throwaway Postgres and runs the family-isolation (RLS) tests
npm run check       # all three
```

`test:db` needs PostgreSQL server binaries (`initdb`, `pg_ctl`, `psql`); it never touches your Supabase project.

## Two modes: live and demo

The app decides once, from configuration, and uses it for **both** auth and data, so sample data never mixes with a real user's.

| Mode | When | What happens |
| --- | --- | --- |
| **live** | `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are both set and valid | Real sign-in, real data in Supabase, onboarding for new users |
| **demo** | Either is missing/invalid, or `EXPO_PUBLIC_DATA_SOURCE=mock` | No login, in-memory sample data (writes are lost on reload). Today shows a "Demo mode" banner saying why |

Missing or bad config never crashes the app; it falls back to demo mode and says so.
`EXPO_PUBLIC_DEMO_SCENARIO=empty` (demo only) starts with no family so you can try onboarding without a backend.

## Setting up Supabase

1. Create a project at supabase.com.
2. **Apply the migrations, in order:** open *SQL Editor* and run `supabase/migrations/0001_foundation.sql`, then `0002_onboarding_and_hardening.sql`. (Or with the Supabase CLI: `supabase db push`.)
3. **Email confirmation:** *Authentication > Providers > Email > Confirm email*. Either setting works; the app handles both. If ON, new users are told to check their email and come back to sign in.
4. Copy *Project settings > API > Project URL* and the **anon / public** key into `.env` as `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`. **Never** use the `service_role` key anywhere in this app.
5. `npx expo start --clear`.

## Environment variables

See `.env.example`. Anything prefixed `EXPO_PUBLIC_` is **compiled into the app and public**, so only the Supabase URL and anon key belong there (safe because Postgres row-level security enforces access). Secrets (service-role key, AI provider keys, push credentials) never go in the app.

| Variable | Purpose |
| --- | --- |
| `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Enable live mode |
| `EXPO_PUBLIC_DATA_SOURCE` | `mock` forces demo mode (development) |
| `EXPO_PUBLIC_DEMO_SCENARIO` | `empty` = demo with no family yet |
| `EXPO_PUBLIC_AI_ENDPOINT` | Future server-side AI function (not built) |
| `EXPO_PUBLIC_EMERGENCY_NUMBER` | Number in safety guidance (default `999`) |

## Project structure

```
app/                  Expo Router routes only: thin screens, no business logic
  (tabs)/             Today · Ask · Memory · Reminders · Community
  (auth)/sign-in.tsx  Sign in / create account / reset password (Supabase mode only)
src/
  ai/                 AI logic, no UI imports
    orchestrator.ts   One assistant turn: safety -> provider -> tool -> result -> explain
    safety.ts         Emergency/crisis/health screening, system prompt, action-claim guard
    providers/        AiProvider implementations (currently the labelled preview provider)
    tools/            Typed, isolated tools + registry (the ONLY way the AI can act)
  auth/               AuthService interface, Supabase + demo implementations, provider
  components/         Reusable UI (ui/, today/, ask/)
  config/env.ts       The single place env vars are read
  data/               Repository interfaces; mock/ (demo, in-memory) and supabase/ (real, RLS-backed)
  domain/             Models (Family -> Caregivers, Children), validation, memory search
  hooks/              React glue: family context, async state, conversation state
  services/           Business logic: Today summary, onboarding, memory, reminders, Ask wiring
  theme/              Colours, spacing, type scale
  utils/              Dates, logger, ids
supabase/migrations/  Postgres schema, RLS policies, atomic onboarding function
supabase/tests/       SQL family-isolation tests (run by scripts/test-rls.sh)
```

Dependency direction: `app` -> `hooks` -> `services`/`ai` -> `data` interfaces -> `domain`.
UI never talks to the database; the AI never sees a database.

## How the AI tool architecture works

```
parent message
  -> safety screen          (emergency / crisis => fixed guidance; the model is never called)
  -> AiProvider.next()      interprets the request, returns either a message or a tool_call
  -> ToolRegistry.execute() looks up an APPROVED tool, validates input (zod),
                            enforces confirmation for write tools, runs it
  -> ToolResult             typed { ok, data, summary } or { ok:false, error }
  -> AiProvider.next()      explains the real result
  -> honesty guard          text that claims an unperformed action is replaced
  -> reply (+ the list of tools that actually ran, shown in the UI)
```

Key rules:

- **No database access for the AI.** Tools receive a `ToolContext` containing family-scoped
  *repositories*, never a DB client. Every repository method takes a `familyId`.
- **Model output is untrusted.** Unknown tools are rejected; inputs are validated before `run()`.
- **Read vs write.** `sideEffect: "write"` tools are refused by the registry unless
  `confirmed: true` is passed, which only the UI may do after the parent approves.
- **Nothing is claimed unless it happened.** "✓ Looked at your reminders" is derived from
  tool results, not model text. Reminders only count as notified if `notificationScheduledAt`
  was set by a real scheduler.
- **The preview provider is not AI.** It is a small keyword router used to exercise the
  pipeline. The Ask screen says so, and it only chooses read-only tools.

`PLANNED_TOOL_NAMES` in `src/ai/tools/types.ts` lists all sixteen intended tools. Implemented today:
`get_child_information`, `search_memory`, `list_reminders` (all read-only, over demo data).

### How to add a new AI tool

1. Create `src/ai/tools/<toolName>.ts` using `defineTool({ name, description, input, sideEffect, run, describeResult })`.
   `name` must be one of `PLANNED_TOOL_NAMES` (add it there first if it's new). Define `input` with zod.
2. Reach data only through `ctx.repos.*`. If you need a new capability, add a method to the
   repository interface in `src/data/repositories.ts` and implement it in the mock (and later Supabase) repositories.
3. Mark anything that changes state `sideEffect: "write"`, and make `describeResult` past-tense and true.
4. Register it in `src/ai/tools/index.ts`.
5. Add tests in `src/__tests__/` (valid input, invalid input, family scoping, and confirmation for write tools).

### Connecting a real model (next AI step)

Implement `AiProvider` behind a server-side function (e.g. a Supabase Edge Function) that holds the model
key, sends `SAFETY_POLICY_PROMPT` as the system prompt plus `registry.specs()` as tools, and returns
`ProviderStep`s. Point `EXPO_PUBLIC_AI_ENDPOINT` at it and return it from `src/ai/providers/index.ts`.

## Safety

`src/ai/safety.ts` holds the policy. The assistant must not diagnose, invent medical advice or doses,
present uncertain information as fact, pose as a clinician, or claim an action happened when it did not.
Emergency messages get fixed guidance to call emergency services; parent-crisis messages get
supportive signposting; other health questions are redirected to NHS / a professional.
The keyword screen is a floor, **not** a clinical safety system: wording needs clinical review
and the classifier needs evaluation before real families use it (see TODO.md).

## What is implemented

**Phase 1 (foundation):** five-tab app; Today and Ask; safety layer; typed AI tool registry with three read-only tools; honest preview assistant; family data model; demo data.

**Phase 2 (real backend and family accounts):**

- Real Supabase auth: create account, sign in, sign out, password-reset *request*, session restore on launch, expired-session handling, calm messages for invalid credentials / existing account / unconfirmed email / network failure / rate limiting.
- Configurable email confirmation ("check your email" state; never treats an unconfirmed account as usable).
- Three-step onboarding (welcome, your name, child's name and date of birth) that creates the family, owner caregiver and child **atomically** in Postgres (`onboard_family`); idempotent, so a retry or double tap never makes a second family.
- Supabase repositories for families, caregivers, children, appointments, memories and reminders, all family-scoped.
- Today driven by real data with honest empty states; children are named on each item when a family has more than one.
- Service layer for saving/retrieving memories and full reminder CRUD (create, list, update, complete, delete). Stored only: no notifications exist.
- Migration `0002`: composite foreign keys so a row can never reference another family's child, and the atomic onboarding function.
- Automated family-isolation tests (two families, a viewer, a signed-out user) against real Postgres.

## What remains

See [TODO.md](TODO.md). Not built: in-app "choose a new password" screen (the reset email can be requested, but completing the reset inside the app needs deep-link handling), UI to add a second child (the data layer supports it), Memory/Reminders/Community screens, real AI provider, push notifications.

## Verification status

See [STATUS.md](STATUS.md) for the current, honest status, including what has and has not been tested against a real Supabase project.
