import type { Appointment, Caregiver, Child, Family, Memory, Reminder } from "@/domain/models";
import type { AddChildInput, CreateMemoryInput, CreateReminderInput, OnboardingInput, UpdateReminderInput } from "@/domain/validation";

/**
 * Data access contracts. UI, services and AI tools depend ONLY on these
 * interfaces. `data/mock` implements them with demo data; a Supabase
 * implementation can be dropped in without changing anything above this line.
 *
 * Every method is scoped by familyId: there is no "get everything" access.
 */
export interface FamilyContext {
  family: Family;
  caregiver: Caregiver;
}

/** Thrown by repositories. `message` is safe to show a parent; `code` is for branching. */
export type DataErrorCode = "not_found" | "forbidden" | "network" | "invalid" | "unknown";
export class DataError extends Error {
  constructor(
    public readonly code: DataErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "DataError";
  }
}

export interface FamilyRepository {
  /** The family + caregiver record for a signed-in user, or null if they have not onboarded yet. */
  getContextForUser(userId: string): Promise<FamilyContext | null>;
  listChildren(familyId: string): Promise<Child[]>;
  /**
   * Creates the family, the owner caregiver and the first child in ONE step, so a
   * failure can never leave a half-built family. Idempotent: if the signed-in
   * user already has a family, that family is returned and nothing is created.
   */
  onboard(input: OnboardingInput): Promise<FamilyContext>;
  addChild(familyId: string, input: AddChildInput): Promise<Child>;
}

export interface AppointmentRepository {
  listUpcoming(familyId: string, from: Date, limit?: number): Promise<Appointment[]>;
}

export interface MemoryRepository {
  list(familyId: string): Promise<Memory[]>;
  search(familyId: string, query: string, limit?: number): Promise<Memory[]>;
  create(familyId: string, input: CreateMemoryInput): Promise<Memory>;
}

export interface ReminderRepository {
  list(familyId: string, options?: { includeCompleted?: boolean }): Promise<Reminder[]>;
  create(familyId: string, input: CreateReminderInput): Promise<Reminder>;
  /** Throws DataError("not_found") if the reminder is not in this family. */
  update(familyId: string, reminderId: string, patch: UpdateReminderInput): Promise<Reminder>;
  complete(familyId: string, reminderId: string, at?: Date): Promise<Reminder>;
  delete(familyId: string, reminderId: string): Promise<void>;
}

export interface Repositories {
  family: FamilyRepository;
  appointments: AppointmentRepository;
  memories: MemoryRepository;
  reminders: ReminderRepository;
}
