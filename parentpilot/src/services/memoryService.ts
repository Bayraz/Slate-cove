import type { Repositories } from "@/data";
import type { Memory } from "@/domain/models";
import { createMemoryInput } from "@/domain/validation";
import { toFailure, type ServiceResult } from "./familyService";

/** Saving and reading family memories. The UI and AI tools go through here, never raw queries. */
export async function saveMemory(repos: Repositories, familyId: string, raw: unknown): Promise<ServiceResult<Memory>> {
  const parsed = createMemoryInput.safeParse(raw);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Please check that." };
  try {
    return { ok: true, data: await repos.memories.create(familyId, parsed.data) };
  } catch (error) {
    return toFailure(error);
  }
}

export const listMemories = (repos: Repositories, familyId: string) => repos.memories.list(familyId);
export const searchFamilyMemories = (repos: Repositories, familyId: string, query: string, limit?: number) =>
  repos.memories.search(familyId, query, limit);
