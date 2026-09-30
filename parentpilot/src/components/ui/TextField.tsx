import { forwardRef } from "react";
import { TextInput, View, type TextInputProps } from "react-native";
import { colors, MIN_TOUCH, radius, spacing } from "@/theme";
import { AppText } from "./AppText";

interface Props extends TextInputProps {
  label: string;
  error?: string;
}

/** Labelled input. The visible label doubles as the screen-reader label. */
export const TextField = forwardRef<TextInput, Props>(function TextField({ label, error, style, ...rest }, ref) {
  return (
    <View style={{ gap: spacing.xs, flex: style ? undefined : 1 }}>
      <AppText variant="label" tone="secondary">
        {label.toUpperCase()}
      </AppText>
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        placeholderTextColor={colors.textSecondary}
        {...rest}
        style={[
          {
            minHeight: MIN_TOUCH,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: error ? colors.danger : colors.border,
            backgroundColor: colors.surface,
            paddingHorizontal: spacing.lg,
            fontSize: 17,
            color: colors.text,
          },
          style,
        ]}
      />
      {error ? (
        <AppText variant="secondary" tone="danger" accessibilityRole="alert">
          {error}
        </AppText>
      ) : null}
    </View>
  );
});
