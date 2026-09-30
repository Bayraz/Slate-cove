import { Pressable, View } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { colors, MIN_TOUCH, radius, spacing } from "@/theme";

interface Props {
  prompts: string[];
  onPick: (prompt: string) => void;
}

export function SuggestedPrompts({ prompts, onPick }: Props) {
  return (
    <View style={{ gap: spacing.sm }}>
      {prompts.map((prompt) => (
        <Pressable
          key={prompt}
          onPress={() => onPick(prompt)}
          accessibilityRole="button"
          accessibilityLabel={prompt}
          style={({ pressed }) => ({
            minHeight: MIN_TOUCH,
            justifyContent: "center",
            paddingHorizontal: spacing.lg,
            borderRadius: radius.pill,
            backgroundColor: pressed ? colors.accentSoft : colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            alignSelf: "flex-start",
          })}
        >
          <AppText>{prompt}</AppText>
        </Pressable>
      ))}
    </View>
  );
}
