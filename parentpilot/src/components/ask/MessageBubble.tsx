import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import type { ChatMessage } from "@/ai/types";
import { AppText } from "@/components/ui/AppText";
import { colors, radius, spacing } from "@/theme";

export function MessageBubble({ message }: { message: ChatMessage }) {
  const mine = message.role === "user";
  const safety = message.tone === "safety";
  const bg = mine ? colors.primary : safety ? colors.safetyBackground : colors.surface;
  return (
    <View style={{ alignSelf: mine ? "flex-end" : "flex-start", maxWidth: "88%", gap: spacing.xs }}>
      <View
        accessible
        accessibilityLabel={`${mine ? "You" : "ParentPilot"}: ${message.text}`}
        style={{
          backgroundColor: bg,
          borderRadius: radius.lg,
          padding: spacing.lg,
          borderWidth: mine ? 0 : 1,
          borderColor: safety ? colors.safetyBorder : colors.border,
        }}
      >
        {safety ? (
          <View style={{ flexDirection: "row", gap: spacing.sm, alignItems: "center", marginBottom: spacing.sm }}>
            <Ionicons name="alert-circle" size={20} color={colors.danger} />
            <AppText variant="label" tone="danger">
              IMPORTANT
            </AppText>
          </View>
        ) : null}
        <AppText tone={mine ? "onPrimary" : message.tone === "error" ? "danger" : "default"}>{message.text}</AppText>
      </View>
      {message.toolActivity?.map((a, i) => (
        <AppText key={`${a.tool}-${i}`} variant="label" tone="secondary" style={{ marginLeft: spacing.sm }}>
          {a.ok ? "✓" : "✕"} {a.summary}
        </AppText>
      ))}
    </View>
  );
}
