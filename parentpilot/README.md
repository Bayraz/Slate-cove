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
| Backend (planned) | Supabase: Auth, Postgres with row-level security, Edge Functions for AI |
| Validation | zod (also produces the JSON Schemas handed to AI providers) |
| Tests | jest-expo |

Targets iOS, Android and web (web is used for development/verification; the
business logic is UI-free so a real web client can share it later).

## Install & run

Requires Node 20+ (developed on 22).

```bash
cd parentpilot
npm install
cp .env.example .env     # optional: the app runs on demo data without any values
npm start                # Expo dev server (press i / a / w, or scan the QR code)
```

- **Phone (easiest):** install *Expo Go* from the App Store / Play Store, run `npm start`,
  and scan the QR code (same Wi-Fi). If your network blocks this, use `npx expo start --tunnel`.
- **iOS simulator:** `npm run ios` (macOS + Xcode).
- **Android emulator:** `npm run android` (Android Studio emulator).
- **Browser:** `npm run web`.

Checks:

```bash
npm run typecheck   # tsc --noEmit
npm test            # unit tests: safety, tools, orchestrator, Today logic, dates
```

## Environment variables

See `.env.example`. Anything prefixed `EXPO_PUBLIC_` is **compiled into the app and
public**, so only the Supabase URL and anon key belong there (the anon key is safe
because access is enforced by row-level security). **Secrets (AI provider keys,
Supabase service-role key, push credentials) never go in the app**; they live
server-side (e.g. Supabase Edge Function secrets).

| Variable | Purpose |
| --- | --- |
| `EXPO_PUBLIC_DATA_SOURCE` | `mock` (default) or `supabase` (repositories not built yet; falls back to mock with a warning) |
| `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Enables real sign-in. Blank = **demo mode** (no login, demo family) |
| `EXPO_PUBLIC_AI_ENDPOINT` | Future server-side AI function. Blank = preview assistant |
| `EXPO_PUBLIC_EMERGENCY_NUMBER` | Number shown in safety guidance (default `999`) |

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
  data/               Repository interfaces; mock/ (demo data) and supabase/ (client)
  domain/             Models (Family -> Caregivers, Children), validation, memory search
  hooks/              React glue: family context, async state, conversation state
  services/           Business logic (Today summary, Ask wiring, reminder/notification abstraction)
  theme/              Colours, spacing, type scale
  utils/              Dates, logger, ids
supabase/migrations/  Postgres schema + RLS policies
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

- Expo Router app with the five tabs; **Today** and **Ask** built, **Memory / Reminders / Community** are marked placeholders.
- **Today:** greeting, child name/age (twins handled), today's appointment, due reminders, a saved question, and an "ask" prompt; loading / error / empty states.
- **Ask:** conversational UI, suggested prompts, input validation, honest preview banner, real tool-activity lines, safety styling.
- Family model: Family -> Caregivers (roles/permissions) -> Children; structured Memory, Reminder (with recurrence and notification truthfulness), Appointment, and Community models.
- AI architecture: safety screen, provider interface, typed tool registry, three read-only tools, honesty guard.
- Auth foundation: sign up / sign in / sign out / password-reset request against Supabase; demo mode with no credentials.
- Postgres schema with row-level security (`supabase/migrations/0001_foundation.sql`).
- Demo data (one parent, one child, one appointment, reminders, memories) isolated in `src/data/mock`.

## What remains

See [TODO.md](TODO.md). Notably: Supabase repositories, family onboarding, the real AI provider,
write tools with confirmation, push notifications, the Memory/Reminders/Community screens, and clinical safety review.

## Verification status

Checked in development: `tsc` (strict), 38 unit tests, Expo bundling for iOS, Android and web, and the web build
driven in a browser (Today, all tabs, Ask flows). The SQL migration was applied to a local Postgres and RLS
isolation between two families was tested. **Not yet verified:** running on a physical device / simulator,
and sign-in against a real Supabase project.
