import { createContext, useContext, type ReactNode } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { ErrorView, LoadingView } from "@/components/ui/StateViews";
import { getRepositories, type Repositories } from "@/data";
import type { FamilyContext } from "@/data/repositories";
import type { Child } from "@/domain/models";
import { useAsync } from "./useAsync";

interface FamilyState extends FamilyContext {
  children: Child[];
  repos: Repositories;
}

const Ctx = createContext<FamilyState | null>(null);

/**
 * Loads the signed-in user's family, caregiver and children once, then shares them with all screens.
 * A signed-in user with no family yet sees onboarding instead of the app.
 */
export function FamilyProvider({ children: ui }: { children: ReactNode }) {
  const { user } = useAuth();
  const repos = getRepositories();
  const state = useAsync(async () => {
    if (!user) return null;
    const context = await repos.family.getContextForUser(user.id);
    if (!context) return null;
    return { ...context, children: await repos.family.listChildren(context.family.id), repos };
  }, [user?.id]);

  if (state.status === "loading") return <LoadingView />;
  if (state.status === "error") {
    return <ErrorView message="We couldn't load your family. Check your connection and try again." onRetry={state.reload} />;
  }
  if (!state.data) return <OnboardingFlow repos={repos} onDone={state.reload} />;
  return <Ctx.Provider value={state.data}>{ui}</Ctx.Provider>;
}

export function useFamily(): FamilyState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useFamily must be used inside <FamilyProvider>");
  return ctx;
}
