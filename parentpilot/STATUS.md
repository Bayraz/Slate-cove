# ParentPilot: Status

_Phase 2 (real backend and family accounts): code complete and verified locally. **Not yet verified against a real Supabase project or a physical phone.**_

## What works, and how it was checked

| Area | Checked how | Result |
| --- | --- | --- |
| TypeScript (strict) | `npm run typecheck` | Clean |
| Unit tests (11 suites) | `npm test` | 116 passing |
| **Family isolation (RLS)** | `npm run test:db`: every migration applied to a real throwaway Postgres; two families, a read-only viewer, a user with no family, and a signed-out user | 52 assertions pass. A deliberately weakened policy makes it fail, so it can fail |
| Expo bundles (iOS, Android, web) | `expo export`, in demo config and in live config | All succeed |
| Onboarding UI in a browser | Welcome, name, child, validation errors, bad date, then Today ("Emma is 11 weeks old", honest empty states) | Works, no console errors |
| Live-mode auth path | Real `supabase-js` pointed at an unreachable URL | Starts signed out, validates, shows a calm "couldn't reach ParentPilot", never crashes |
| Demo mode regression | Original Today / Ask / safety flows | Unchanged and working |
| No secrets in the app | Test scans app code and `.env.example` for service-role keys / secret `EXPO_PUBLIC_` names | Passes. It fails if I plant one |

## NOT verified (needs your Supabase project and phone)

- Migrations applied to an actual Supabase project (they apply cleanly to plain Postgres 16 with a stub of Supabase's `auth` schema).
- Sign-up / sign-in / sign-out / session restore against real Supabase Auth (covered by mocked-client tests and the offline run only).
- The Supabase repositories against real PostgREST (covered by a recording fake client: queries are family-scoped, errors mapped; but no real round trip).
- Anything on a physical phone or simulator.
- The password-reset email and what happens after tapping its link (the in-app "new password" screen is not built).

## Completion criteria

| Criterion | State |
| --- | --- |
| Create account, sign in, create family, add child, see child on Today, sign out, sign in, data still there | Implemented end to end. **Real-backend run pending** (phone test below) |
| Family A cannot access Family B's data | Verified in Postgres (52 assertions) |
| TypeScript clean, tests passing, Expo builds | Verified |

## Manual phone test (after setting up Supabase; see README "Setting up Supabase")

1. `cd parentpilot && npm install`, then create `.env` with your URL and anon key.
2. `npx expo start --clear`, scan the QR code with Expo Go (same Wi-Fi, or add `--tunnel`).
3. **No "Demo mode" banner** should appear after sign-in. If you see it, the `.env` values were not picked up.
4. Tap *Create an account*, enter an email and an 8+ character password.
   - If email confirmation is **on**: you should see "Check your email". Confirm, return, sign in.
   - If **off**: you go straight to onboarding.
5. Onboarding: *Get started*, your first name, *Next*, child's name and date of birth (DD / MM / YYYY), *Finish*.
6. **Today** shows "Good morning/afternoon/evening, <you>.", "<child> is N weeks old.", and "No appointments today." / "No reminders due today."
7. In Supabase *Table editor*, confirm rows in `families`, `caregivers` (role owner) and `children`.
8. Tap *Sign out* (bottom of Today). You should land on the sign-in screen.
9. Sign in again. You should go **straight to Today** (no onboarding) with the same name and child.
10. Fully close the app and reopen it: you should still be signed in on Today.
11. Try a wrong password: calm message, no crash. Turn on airplane mode and try to sign in: "We couldn't reach ParentPilot."
12. Optional isolation check: sign up a second account. It must get its own onboarding and never see the first family's child.

If any step fails, send me the step number and what you saw.

## Not built yet

In-app new-password screen; UI to add a second child (data layer and tests support it); Memory / Reminders / Community screens; real AI provider; push notifications; calendar; baby log.

## Next step

Run the phone test above and fix whatever the real backend reveals. Then: account completion (new-password screen, add-another-child UI, invites). See [TODO.md](TODO.md).
