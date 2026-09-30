import { ActivityIndicator, Pressable, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import { colors, MIN_TOUCH, radius, spacing } from "@/theme";
import { AppText } from "./AppText";

interface Props extends Omit<PressableProps, "children" | "style"> {
  style?: StyleProp<ViewStyle>;
  label: string;
  variant?: "primary" | "secondary" | "quiet";
  loading?: boolean;
}

export function Button({ label, variant = "primary", loading, disabled, style, ...rest }: Props) {
  const isPrimary = variant === "primary";
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!inactive, busy: !!loading }}
      disabled={inactive}
      {...rest}
      style={({ pressed }) => [
        {
          minHeight: MIN_TOUCH,
          paddingHorizontal: spacing.xl,
          borderRadius: radius.pill,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: isPrimary ? colors.primary : variant === "secondary" ? colors.primarySoft : "transparent",
          opacity: inactive ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.primaryText : colors.primary} />
      ) : (
        <AppText variant="bodyStrong" tone={isPrimary ? "onPrimary" : "primary"}>
          {label}
        </AppText>
      )}
    </Pressable>
  );
}
