# ParentPilot: next stages

Ordered. Each stage should ship on its own and be testable with real parents.

**Done:** 1. Foundation. 2. Real backend and family accounts (auth, onboarding, persistence, isolation tests).

1. **Verify on a real Supabase project + phone** (first task in any session that has credentials): apply both migrations, run the manual phone checklist in STATUS.md, fix whatever the real backend reveals.
2. **Account completion**: in-app "choose a new password" screen (deep link from the reset email), profile editing, delete account, "add another child" UI, invite a second caregiver.
3. **Memory (first real write path)**: Memory screen (browse by kind, edit, delete); `save_memory` tool with an explicit confirm step in the Ask UI; Postgres full-text search.
4. **Reminders + notifications**: Reminders screen; reminder tools; `expo-notifications` implementation of `NotificationScheduler`; set `notificationScheduledAt` only when scheduling really succeeds.
5. **Real AI provider**: server-side function holding the model key, using `SAFETY_POLICY_PROMPT` and `registry.specs()`; rate limiting; conversation persistence; evaluation set for tool selection and honesty.
6. **Safety review**: clinical review of `safety.ts` wording, localisation, broader evaluated classifier, `search_trusted_information` restricted to official sources with citations.
7. **Calendar**, 8. **Baby log**, 9. **Appointment prep**, 10. **Community** (topic-based, moderated), 11. later: `search_products`, dark mode, privacy-first analytics, e2e tests on device (Maestro/Detox), CI running `npm run check`, web client.
