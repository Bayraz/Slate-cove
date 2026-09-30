import { Text, type TextProps } from "react-native";
import { colors, typography, type TextVariant } from "@/theme";

interface Props extends TextProps {
  variant?: TextVariant;
  tone?: "default" | "secondary" | "primary" | "danger" | "onPrimary";
}

const toneColor = {
  default: colors.text,
  secondary: colors.textSecondary,
  primary: colors.primary,
  danger: colors.danger,
  onPrimary: colors.primaryText,
} as const;

export function AppText({ variant = "body", tone = "default", style, ...rest }: Props) {
  return <Text {...rest} style={[typography[variant], { color: toneColor[tone] }, style]} />;
}
