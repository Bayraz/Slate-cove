import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { FlatList, KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Composer } from "@/components/ask/Composer";
import { MessageBubble } from "@/components/ask/MessageBubble";
import { SuggestedPrompts } from "@/components/ask/SuggestedPrompts";
import { AppText } from "@/components/ui/AppText";
import { useAskConversation } from "@/hooks/useAskConversation";
import { useFamily } from "@/hooks/FamilyProvider";
import { suggestedPrompts } from "@/services/askService";
import { colors, radius, spacing } from "@/theme";

export default function AskScreen() {
  const { prompt } = useLocalSearchParams<{ prompt?: string }>();
  const { children } = useFamily();
  const { messages, sending, send, inputError, isPreview } = useAskConversation();
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length) listRef.current?.scrollToEnd({ animated: true });
  }, [messages.length, sending]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={["top"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={{ paddingHorizontal: spacing.xl, paddingTop: spacing.lg, gap: spacing.sm }}>
          <AppText variant="display" accessibilityRole="header">
            Ask
          </AppText>
          {isPreview ? (
            <View
              accessible
              style={{ backgroundColor: colors.surfaceMuted, borderRadius: radius.md, padding: spacing.md }}
            >
              <AppText variant="secondary" tone="secondary">
                Preview: the AI isn't connected yet. I can look things up, but I can't save or change anything.
              </AppText>
            </View>
          ) : null}
        </View>

        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          renderItem={({ item }) => <MessageBubble message={item} />}
          contentContainerStyle={{ padding: spacing.xl, gap: spacing.lg, flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <View style={{ gap: spacing.lg }}>
              <AppText variant="title">What can I take care of?</AppText>
              <SuggestedPrompts prompts={suggestedPrompts(children[0]?.name)} onPick={(p) => send(p)} />
            </View>
          }
          ListFooterComponent={
            sending ? (
              <AppText accessibilityLiveRegion="polite" tone="secondary">
                Thinking…
              </AppText>
            ) : null
          }
        />
        <Composer onSend={send} disabled={sending} error={inputError} initialText={prompt} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
