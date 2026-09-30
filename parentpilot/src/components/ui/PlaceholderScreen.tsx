import { View } from "react-native";
import { colors, radius, spacing } from "@/theme";
import { AppText } from "./AppText";
import { Screen } from "./Screen";

interface Props {
  title: string;
  description: string;
  /** Visible TODO markers for what this area will become. */
  todo: string[];
}

/** Honest placeholder for areas that are planned but not built yet. */
export function PlaceholderScreen({ title, description, todo }: Props) {
  return (
    <Screen>
      <AppText variant="display" accessibilityRole="header">
        {title}
      </AppText>
      <AppText tone="secondary">{description}</AppText>
      <View style={{ backgroundColor: colors.surfaceMuted, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.sm }}>
        <AppText variant="label" tone="secondary">
          COMING LATER
        </AppText>
        {todo.map((item) => (
          <AppText key={item} tone="secondary">
            TODO: {item}
          </AppText>
        ))}
      </View>
    </Screen>
  );
}
