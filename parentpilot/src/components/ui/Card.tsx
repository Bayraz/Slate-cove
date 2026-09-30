import { View, type ViewProps } from "react-native";
import { colors, radius, spacing } from "@/theme";

export function Card({ style, ...rest }: ViewProps) {
  return (
    <View
      {...rest}
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          padding: spacing.lg,
        },
        style,
      ]}
    />
  );
}
