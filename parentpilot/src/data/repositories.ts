import type { Appointment, Caregiver, Child, Family, Memory, Reminder } from "@/domain/models";

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

export interface FamilyRepository {
  /** The family + caregiver record for a signed-in user. */
  getContextForUser(userId: string): Promise<FamilyContext | null>;
  listChildren(familyId: string): Promise<Child[]>;
}

export interface AppointmentRepository {
  listUpcoming(familyId: string, from: Date, limit?: number): Promise<Appointment[]>;
}

export interface MemoryRepository {
  list(familyId: string): Promise<Memory[]>;
  search(familyId: string, query: string, limit?: number): Promise<Memory[]>;
}

export interface ReminderRepository {
  list(familyId: string, options?: { includeCompleted?: boolean }): Promise<Reminder[]>;
}

export interface Repositories {
  family: FamilyRepository;
  appointments: AppointmentRepository;
  memories: MemoryRepository;
  reminders: ReminderRepository;
}
