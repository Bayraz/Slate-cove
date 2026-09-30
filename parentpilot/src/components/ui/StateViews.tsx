import { ActivityIndicator, View } from "react-native";
import { colors, spacing } from "@/theme";
import { AppText } from "./AppText";
import { Button } from "./Button";

export function LoadingView({ label = "Just a moment…" }: { label?: string }) {
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      style={{ padding: spacing.xxl, alignItems: "center", gap: spacing.md }}
    >
      <ActivityIndicator color={colors.primary} />
      <AppText tone="secondary">{label}</AppText>
    </View>
  );
}

export function ErrorView({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View accessibilityRole="alert" style={{ padding: spacing.xl, gap: spacing.md, alignItems: "flex-start" }}>
      <AppText variant="title">That didn't work</AppText>
      <AppText tone="secondary">{message}</AppText>
      {onRetry ? <Button label="Try again" variant="secondary" onPress={onRetry} /> : null}
    </View>
  );
}

export function EmptyView({ title, message }: { title: string; message?: string }) {
  return (
    <View style={{ padding: spacing.xl, gap: spacing.sm }}>
      <AppText variant="title">{title}</AppText>
      {message ? <AppText tone="secondary">{message}</AppText> : null}
    </View>
  );
}
