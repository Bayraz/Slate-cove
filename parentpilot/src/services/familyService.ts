import type { FamilyContext, Repositories } from "@/data";
import { DataError } from "@/data";
import type { Child } from "@/domain/models";
import { addChildInput, onboardingInput } from "@/domain/validation";

export type ServiceResult<T> = { ok: true; data: T } | { ok: false; message: string };

const firstIssue = (issues: { message: string }[]) => issues[0]?.message ?? "Please check your details.";

export const toFailure = (error: unknown): { ok: false; message: string } => ({
  ok: false,
  message: error instanceof DataError ? error.message : "Something went wrong. Please try again.",
});

/** Validates, then creates family + caregiver + first child in one step (see FamilyRepository.onboard). */
export async function completeOnboarding(repos: Repositories, raw: unknown): Promise<ServiceResult<FamilyContext>> {
  const parsed = onboardingInput.safeParse(raw);
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error.issues) };
  try {
    return { ok: true, data: await repos.family.onboard(parsed.data) };
  } catch (error) {
    return toFailure(error);
  }
}

export async function addChild(repos: Repositories, familyId: string, raw: unknown): Promise<ServiceResult<Child>> {
  const parsed = addChildInput.safeParse(raw);
  if (!parsed.success) return { ok: false, message: firstIssue(parsed.error.issues) };
  try {
    return { ok: true, data: await repos.family.addChild(familyId, parsed.data) };
  } catch (error) {
    return toFailure(error);
  }
}
