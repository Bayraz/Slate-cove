import type { ReactNode } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, spacing } from "@/theme";

interface Props {
  children: ReactNode;
  /** Non-scrolling layout for screens that manage their own list (e.g. chat). */
  scroll?: boolean;
}

export function Screen({ children, scroll = true }: Props) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.xxl, gap: spacing.xl }}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{children}</View>
      )}
    </SafeAreaView>
  );
}
