# ParentPilot: next stages

Ordered. Each stage should ship on its own and be testable with real parents.

1. **Backend wiring**: create the Supabase project, apply `supabase/migrations`, implement
   `createSupabaseRepositories` behind `src/data/repositories.ts`, flip `EXPO_PUBLIC_DATA_SOURCE`.
2. **Onboarding**: create family (`create_family` RPC), add first child, invite a second caregiver;
   finish auth (email-confirmation state, "set new password" screen, profile management, delete account).
3. **Memory (first real write path)**: `save_memory` tool with an explicit confirm step in the Ask UI;
   Memory screen (browse by kind, edit, delete); upgrade search to Postgres full-text.
4. **Reminders + notifications**: reminder CRUD tools, Reminders screen, `expo-notifications` implementation of
   `NotificationScheduler`; only set `notificationScheduledAt` when scheduling really succeeds.
5. **Real AI provider**: server-side function holding the model key, using `SAFETY_POLICY_PROMPT` and `registry.specs()`;
   rate limiting; conversation persistence; evaluation set for tool selection and honesty.
6. **Safety review**: clinical review of `safety.ts` wording, localisation (region-specific numbers), broader evaluated classifier,
   `search_trusted_information` restricted to official sources (e.g. NHS) with citations.
7. **Calendar**: `get/create/update/delete_calendar_event` via the device calendar or a provider integration, with confirmation.
8. **Baby log**: `log_baby_event` / `get_baby_history` (feeds, sleep), only what parents actually need.
9. **Appointment prep**: "what should I ask the health visitor?" using memories and saved questions.
10. **Community**: topic-based posts/comments, save, report, block; moderation tooling before launch.
11. **Later**: `search_products`, dark mode, analytics (privacy-first), e2e tests (Maestro/Detox), CI (typecheck + test), web client.
