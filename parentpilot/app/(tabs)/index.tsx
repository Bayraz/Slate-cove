import { useRouter } from "expo-router";
import { View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { SuggestedPrompts } from "@/components/ask/SuggestedPrompts";
import { TodayRow } from "@/components/today/TodayRow";
import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Screen } from "@/components/ui/Screen";
import { ErrorView, LoadingView } from "@/components/ui/StateViews";
import { configStatus, demoReasonText } from "@/config/env";
import { useFamily } from "@/hooks/FamilyProvider";
import { useToday } from "@/hooks/useToday";
import { suggestedPrompts } from "@/services/askService";
import { childrenSentence } from "@/services/todayService";
import { colors, radius, spacing } from "@/theme";
import { formatTime, greetingFor } from "@/utils/dates";

export default function TodayScreen() {
  const router = useRouter();
  const { caregiver, children } = useFamily();
  const { isDemo, signOut } = useAuth();
  const today = useToday();

  const openAsk = (prompt?: string) => router.push({ pathname: "/ask", params: prompt ? { prompt } : {} });

  return (
    <Screen>
      {isDemo ? (
        <View accessible style={{ backgroundColor: colors.surfaceMuted, borderRadius: radius.md, padding: spacing.md }}>
          <AppText variant="secondary" tone="secondary">
            {demoReasonText(configStatus)}
          </AppText>
        </View>
      ) : null}

      <View style={{ gap: spacing.xs }}>
        <AppText variant="display" accessibilityRole="header">
          {greetingFor()}, {caregiver.displayName}.
        </AppText>
        {today.status === "success" && today.data.children.length > 0 ? (
          <AppText variant="title" tone="secondary">
            {childrenSentence(today.data.children)}
          </AppText>
        ) : null}
      </View>

      {today.status === "loading" ? <LoadingView label="Getting your day ready…" /> : null}
      {today.status === "error" ? (
        <ErrorView message="We couldn't load today. Please try again." onRetry={today.reload} />
      ) : null}

      {today.status === "success" ? (
        <Card style={{ gap: spacing.lg }}>
          <AppText variant="title" accessibilityRole="header">
            Today
          </AppText>
          {today.data.appointments.length > 0 ? (
            today.data.appointments.map((a) => (
              <TodayRow
                key={a.id}
                icon="calendar-outline"
                kind="Appointment"
                childName={a.childName}
                title={a.title}
                detail={`${formatTime(a.startsAt)}${a.location ? ` · ${a.location}` : ""}`}
              />
            ))
          ) : (
            <AppText tone="secondary">No appointments today.</AppText>
          )}
          {today.data.reminders.length > 0 ? (
            today.data.reminders.map((r) => (
              <TodayRow key={r.id} icon="notifications-outline" kind="Reminder" childName={r.childName} title={r.title} detail={formatTime(r.dueAt)} />
            ))
          ) : (
            <AppText tone="secondary">No reminders due today.</AppText>
          )}
          {today.data.savedNote ? (
            <TodayRow icon="bookmark-outline" kind="Saved question" childName={today.data.savedNote.childName} title={today.data.savedNote.content} />
          ) : null}
        </Card>
      ) : null}

      <View style={{ backgroundColor: colors.accentSoft, borderRadius: 20, padding: spacing.xl, gap: spacing.lg }}>
        <AppText variant="title" accessibilityRole="header">
          What can I take care of?
        </AppText>
        <SuggestedPrompts prompts={suggestedPrompts(children[0]?.name).slice(0, 2)} onPick={openAsk} />
        <Button label="Ask ParentPilot" onPress={() => openAsk()} />
      </View>

      {!isDemo ? <Button label="Sign out" variant="quiet" onPress={signOut} /> : null}
    </Screen>
  );
}
