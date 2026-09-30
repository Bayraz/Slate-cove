import { useState } from "react";
import { KeyboardAvoidingView, Platform, TextInput, View } from "react-native";
import { getAuthService } from "@/auth";
import { credentialsSchema, emailSchema, firstError } from "@/auth/validation";
import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { colors, MIN_TOUCH, radius, spacing } from "@/theme";

type Mode = "signIn" | "signUp" | "reset";

const inputStyle = {
  minHeight: MIN_TOUCH,
  borderRadius: radius.md,
  borderWidth: 1,
  borderColor: colors.border,
  backgroundColor: colors.surface,
  paddingHorizontal: spacing.lg,
  fontSize: 17,
  color: colors.text,
} as const;

/** Only reachable when Supabase is configured; demo mode skips it. */
export default function SignInScreen() {
  const [mode, setMode] = useState<Mode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | undefined>();

  const submit = async () => {
    const auth = getAuthService();
    setMessage(undefined);
    if (mode === "reset") {
      const parsed = emailSchema.safeParse(email);
      if (!parsed.success) return setMessage({ text: firstError(parsed.error), error: true });
      setBusy(true);
      const res = await auth.requestPasswordReset(parsed.data);
      setBusy(false);
      if (!res.ok) return setMessage({ text: res.message, error: true });
      // Same wording whether or not the account exists, so emails can't be probed.
      return setMessage({ text: "If that email has an account, we've sent a reset link.", error: false });
    }
    const parsed = credentialsSchema.safeParse({ email, password });
    if (!parsed.success) return setMessage({ text: firstError(parsed.error), error: true });
    setBusy(true);
    const res = mode === "signIn" ? await auth.signIn(parsed.data.email, parsed.data.password) : await auth.signUp(parsed.data.email, parsed.data.password);
    setBusy(false);
    if (!res.ok) return setMessage({ text: res.message, error: true });
    // TODO(stage: auth): if email confirmation is enabled, show "check your email" after sign-up.
    // On success the auth listener updates the session and the router redirects.
  };

  const title = mode === "signIn" ? "Welcome back" : mode === "signUp" ? "Create your account" : "Reset your password";

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ gap: spacing.lg }}>
        <AppText variant="display" accessibilityRole="header">
          {title}
        </AppText>
        <AppText tone="secondary">You've got enough to think about. We'll handle the little things.</AppText>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={colors.textSecondary}
          accessibilityLabel="Email"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
          style={inputStyle}
        />
        {mode !== "reset" ? (
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password (8+ characters)"
            placeholderTextColor={colors.textSecondary}
            accessibilityLabel="Password"
            secureTextEntry
            autoComplete={mode === "signIn" ? "current-password" : "new-password"}
            textContentType={mode === "signIn" ? "password" : "newPassword"}
            style={inputStyle}
          />
        ) : null}
        {message ? (
          <AppText accessibilityRole={message.error ? "alert" : undefined} tone={message.error ? "danger" : "secondary"}>
            {message.text}
          </AppText>
        ) : null}
        <Button label={mode === "signIn" ? "Sign in" : mode === "signUp" ? "Create account" : "Send reset link"} onPress={submit} loading={busy} />
        <View style={{ gap: spacing.xs }}>
          {mode !== "signIn" ? <Button label="I already have an account" variant="quiet" onPress={() => setMode("signIn")} /> : null}
          {mode !== "signUp" ? <Button label="Create an account" variant="quiet" onPress={() => setMode("signUp")} /> : null}
          {mode === "signIn" ? <Button label="Forgot password?" variant="quiet" onPress={() => setMode("reset")} /> : null}
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
