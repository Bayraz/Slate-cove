import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { getAuthService } from "@/auth";
import { credentialsSchema, emailSchema, firstError } from "@/auth/validation";
import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { TextField } from "@/components/ui/TextField";
import { spacing } from "@/theme";

type Mode = "signIn" | "signUp" | "reset" | "checkEmail";

/** Only reachable in live mode; demo mode skips it. */
export default function SignInScreen() {
  const { notice } = useAuth();
  const [mode, setMode] = useState<Mode>("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; error: boolean } | undefined>();

  const switchMode = (next: Mode) => {
    setMessage(undefined);
    setMode(next);
  };

  const submit = async () => {
    if (busy) return;
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
      return setMessage({ text: "If that email has an account, we've sent a link to reset your password.", error: false });
    }

    const parsed = credentialsSchema.safeParse({ email, password });
    if (!parsed.success) return setMessage({ text: firstError(parsed.error), error: true });
    setBusy(true);
    const res =
      mode === "signIn"
        ? await auth.signIn(parsed.data.email, parsed.data.password)
        : await auth.signUp(parsed.data.email, parsed.data.password);
    setBusy(false);

    if (!res.ok) {
      setMessage({ text: res.message, error: true });
      // An existing account should go to sign-in, keeping what they typed.
      return;
    }
    // Signed up but the project requires email confirmation: the account is NOT usable yet.
    if (mode === "signUp" && res.needsEmailConfirmation) return switchMode("checkEmail");
    // Otherwise the auth listener updates the session and the router moves on.
  };

  if (mode === "checkEmail") {
    return (
      <Screen>
        <View style={{ gap: spacing.lg }}>
          <AppText variant="display" accessibilityRole="header">
            Check your email
          </AppText>
          <AppText>
            We've sent a message to {email.trim()}. Open it and confirm your address, then come back here to sign in.
          </AppText>
          <AppText tone="secondary">Your account isn't ready until you've confirmed. It can take a minute to arrive, and it may be in spam.</AppText>
          <Button label="Back to sign in" onPress={() => switchMode("signIn")} />
        </View>
      </Screen>
    );
  }

  const title = mode === "signIn" ? "Welcome back" : mode === "signUp" ? "Create your account" : "Reset your password";

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ gap: spacing.lg }}>
        <AppText variant="display" accessibilityRole="header">
          {title}
        </AppText>
        <AppText tone="secondary">You've got enough to think about. We'll handle the little things.</AppText>
        {notice === "session_ended" && mode === "signIn" ? (
          <AppText accessibilityRole="alert" tone="secondary">
            Your session ended, so please sign in again.
          </AppText>
        ) : null}
        <TextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        {mode !== "reset" ? (
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="At least 8 characters"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete={mode === "signIn" ? "current-password" : "new-password"}
            textContentType={mode === "signIn" ? "password" : "newPassword"}
            returnKeyType="go"
            onSubmitEditing={submit}
          />
        ) : null}
        {message ? (
          <AppText accessibilityRole={message.error ? "alert" : undefined} tone={message.error ? "danger" : "secondary"}>
            {message.text}
          </AppText>
        ) : null}
        <Button
          label={mode === "signIn" ? "Sign in" : mode === "signUp" ? "Create account" : "Send reset link"}
          onPress={submit}
          loading={busy}
        />
        <View style={{ gap: spacing.xs }}>
          {mode !== "signIn" ? <Button label="I already have an account" variant="quiet" onPress={() => switchMode("signIn")} /> : null}
          {mode !== "signUp" ? <Button label="Create an account" variant="quiet" onPress={() => switchMode("signUp")} /> : null}
          {mode === "signIn" ? <Button label="Forgot password?" variant="quiet" onPress={() => switchMode("reset")} /> : null}
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
