import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { colors, MIN_TOUCH, radius, spacing } from "@/theme";

interface Props {
  onSend: (text: string) => Promise<boolean>;
  disabled?: boolean;
  error?: string;
  /** Pre-fills the box (e.g. from a suggestion on Today) without sending. */
  initialText?: string;
}

export function Composer({ onSend, disabled, error, initialText }: Props) {
  const [text, setText] = useState(initialText ?? "");
  useEffect(() => {
    if (initialText) setText(initialText);
  }, [initialText]);

  const submit = async () => {
    const sent = await onSend(text);
    if (sent) setText("");
  };

  return (
    <View style={{ padding: spacing.md, gap: spacing.xs, backgroundColor: colors.background }}>
      {error ? (
        <AppText variant="secondary" tone="danger" accessibilityRole="alert">
          {error}
        </AppText>
      ) : null}
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-end",
          gap: spacing.sm,
          backgroundColor: colors.surface,
          borderRadius: radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          paddingLeft: spacing.lg,
          paddingRight: spacing.xs,
          paddingVertical: spacing.xs,
        }}
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="What can I take care of?"
          placeholderTextColor={colors.textSecondary}
          accessibilityLabel="Message ParentPilot"
          multiline
          maxLength={1200}
          style={{ flex: 1, minHeight: MIN_TOUCH - 4, maxHeight: 140, fontSize: 17, color: colors.text, paddingVertical: 10 }}
        />
        <Pressable
          onPress={submit}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityLabel="Send message"
          accessibilityState={{ disabled: !!disabled }}
          style={{
            width: MIN_TOUCH,
            height: MIN_TOUCH,
            borderRadius: MIN_TOUCH / 2,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
            opacity: disabled ? 0.5 : 1,
          }}
        >
          <Ionicons name="arrow-up" size={22} color={colors.primaryText} />
        </Pressable>
      </View>
    </View>
  );
}
