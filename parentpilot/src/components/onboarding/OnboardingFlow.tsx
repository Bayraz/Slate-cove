import { useRef, useState } from "react";
import { KeyboardAvoidingView, Platform, TextInput, View } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { TextField } from "@/components/ui/TextField";
import type { Repositories } from "@/data";
import { completeOnboarding } from "@/services/familyService";
import { spacing } from "@/theme";
import { parseDateOfBirth } from "@/utils/dateOfBirth";

type Step = "welcome" | "you" | "child";

interface Props {
  repos: Repositories;
  /** Called once the family exists; the parent then loads it. */
  onDone: () => void;
}

/** Three short steps: welcome, your name, your child. Nothing else is asked. */
export function OnboardingFlow({ repos, onDone }: Props) {
  const { signOut, isDemo } = useAuth();
  const [step, setStep] = useState<Step>("welcome");
  const [displayName, setDisplayName] = useState("");
  const [childName, setChildName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const monthRef = useRef<TextInput>(null);
  const yearRef = useRef<TextInput>(null);

  const nextFromName = () => {
    if (!displayName.trim()) return setError("Please tell us what to call you.");
    setError(undefined);
    setStep("child");
  };

  const finish = async () => {
    if (busy) return;
    const dob = parseDateOfBirth(day, month, year);
    if (!childName.trim()) return setError("Please enter your child's name.");
    if (!dob.ok) return setError(dob.message);
    setError(undefined);
    setBusy(true);
    const result = await completeOnboarding(repos, { displayName, childName, childDateOfBirth: dob.iso });
    setBusy(false);
    if (!result.ok) return setError(result.message);
    onDone();
  };

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ gap: spacing.xl }}>
        {step === "welcome" ? (
          <>
            <AppText variant="display" accessibilityRole="header">
              Welcome to ParentPilot.
            </AppText>
            <AppText variant="title" tone="secondary">
              You've got enough to think about. We'll handle the little things.
            </AppText>
            <AppText tone="secondary">Two quick questions and you're in. We only ask for what we need.</AppText>
            <Button label="Get started" onPress={() => setStep("you")} />
            {!isDemo ? <Button label="Sign out" variant="quiet" onPress={signOut} /> : null}
          </>
        ) : null}

        {step === "you" ? (
          <>
            <AppText variant="display" accessibilityRole="header">
              What should we call you?
            </AppText>
            <TextField
              label="Your first name"
              value={displayName}
              onChangeText={setDisplayName}
              autoFocus
              autoComplete="given-name"
              textContentType="givenName"
              returnKeyType="next"
              onSubmitEditing={nextFromName}
              maxLength={60}
              error={error}
            />
            <Button label="Next" onPress={nextFromName} />
            <Button label="Back" variant="quiet" onPress={() => { setError(undefined); setStep("welcome"); }} />
          </>
        ) : null}

        {step === "child" ? (
          <>
            <AppText variant="display" accessibilityRole="header">
              Tell us about your child.
            </AppText>
            <TextField
              label="Their first name"
              value={childName}
              onChangeText={setChildName}
              autoFocus
              returnKeyType="next"
              maxLength={60}
            />
            <View accessible={false} style={{ gap: spacing.xs }}>
              <AppText variant="label" tone="secondary">
                DATE OF BIRTH
              </AppText>
              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                <TextField
                  label="Day"
                  value={day}
                  onChangeText={(t) => { setDay(t); if (t.length === 2) monthRef.current?.focus(); }}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="DD"
                />
                <TextField
                  ref={monthRef}
                  label="Month"
                  value={month}
                  onChangeText={(t) => { setMonth(t); if (t.length === 2) yearRef.current?.focus(); }}
                  keyboardType="number-pad"
                  maxLength={2}
                  placeholder="MM"
                />
                <TextField
                  ref={yearRef}
                  label="Year"
                  value={year}
                  onChangeText={setYear}
                  keyboardType="number-pad"
                  maxLength={4}
                  placeholder="YYYY"
                  returnKeyType="done"
                  onSubmitEditing={finish}
                />
              </View>
            </View>
            {error ? (
              <AppText accessibilityRole="alert" tone="danger">
                {error}
              </AppText>
            ) : null}
            <AppText variant="secondary" tone="secondary">
              You can add more children, and anything else, later.
            </AppText>
            <Button label="Finish" onPress={finish} loading={busy} />
            <Button label="Back" variant="quiet" disabled={busy} onPress={() => { setError(undefined); setStep("you"); }} />
          </>
        ) : null}
      </KeyboardAvoidingView>
    </Screen>
  );
}
