import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { colors, spacing } from "@/theme";

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  kind: string; // "Appointment", "Reminder", "Saved question"
  title: string;
  detail?: string;
}

export function TodayRow({ icon, kind, title, detail }: Props) {
  const spoken = `${kind}: ${title}${detail ? `, ${detail}` : ""}`;
  return (
    <View accessible accessibilityLabel={spoken} style={{ flexDirection: "row", gap: spacing.md, alignItems: "flex-start" }}>
      <View
        style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" }}
      >
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText variant="label" tone="secondary">
          {kind.toUpperCase()}
        </AppText>
        <AppText variant="bodyStrong">{title}</AppText>
        {detail ? <AppText tone="secondary">{detail}</AppText> : null}
      </View>
    </View>
  );
}
