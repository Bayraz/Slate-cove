/**
 * Domain models. Everything hangs off a Family, never a single baby:
 *
 *   Family -> Caregivers (with roles/permissions)
 *          -> Children (twins etc. are simply more than one)
 *
 * Dates are ISO-8601 strings so the same shapes work over JSON, Postgres and
 * any future web client. These types are storage-agnostic on purpose.
 */

export type Id = string;
export type IsoDateTime = string;

// ---- Family ---------------------------------------------------------------

export interface Family {
  id: Id;
  name: string;
  createdAt: IsoDateTime;
}

export type CaregiverRole = "owner" | "parent" | "carer" | "viewer";

export interface CaregiverPermissions {
  /** Can edit child details, memories and reminders. */
  canEdit: boolean;
  /** Can invite/remove caregivers and change roles. */
  canManageFamily: boolean;
}

export interface Caregiver {
  id: Id;
  familyId: Id;
  /** Auth user id once the caregiver has an account. */
  userId?: Id;
  /** How they are addressed in the app. No legal names required. */
  displayName: string;
  role: CaregiverRole;
  permissions: CaregiverPermissions;
}

export interface FeedingInfo {
  method?: "breast" | "bottle" | "mixed" | "solids";
  notes?: string;
}

export interface SleepInfo {
  notes?: string;
}

/** Deliberately small: no unnecessary sensitive data (no NHS number, weight etc. yet). */
export interface Child {
  id: Id;
  familyId: Id;
  name: string;
  dateOfBirth: IsoDateTime;
  /** Important things anyone caring for this child should know. */
  importantNotes: string[];
  feeding?: FeedingInfo;
  sleep?: SleepInfo;
}

export interface Appointment {
  id: Id;
  familyId: Id;
  childId?: Id;
  title: string;
  startsAt: IsoDateTime;
  location?: string;
  notes?: string;
}

// ---- Memory ---------------------------------------------------------------

/**
 * Structured memory. Each item is one atomic fact with a kind, optional
 * subject (a child) and tags, so the AI can search precisely instead of
 * reading one giant text blob.
 */
export type MemoryKind =
  | "preference" // "I prefer morning appointments"
  | "contact" // "My health visitor is Jane"
  | "child_note" // "Emma doesn't like the blue bottle"
  | "medical_guidance" // "The doctor wants us to monitor her feeding" (as told by a professional)
  | "question" // saved question to ask someone
  | "general";

export interface Memory {
  id: Id;
  familyId: Id;
  childId?: Id;
  kind: MemoryKind;
  content: string;
  tags: string[];
  /** Where it came from, so the AI never presents it as its own knowledge. */
  source: "parent" | "assistant_confirmed";
  createdAt: IsoDateTime;
}

// ---- Reminders ------------------------------------------------------------

export type RecurrenceFrequency = "daily" | "weekly" | "monthly";

export interface Recurrence {
  frequency: RecurrenceFrequency;
  /** Every N units, 1 = every day/week/month. */
  interval: number;
  until?: IsoDateTime;
}

export interface Reminder {
  id: Id;
  familyId: Id;
  childId?: Id;
  title: string;
  description?: string;
  dueAt: IsoDateTime;
  recurrence?: Recurrence;
  completedAt?: IsoDateTime;
  /**
   * Set ONLY by the notification system after it has really scheduled or
   * delivered a notification. The UI/AI must never claim a notification
   * happened unless this is populated.
   */
  notificationScheduledAt?: IsoDateTime;
}

// ---- Community (data model only; no UI yet) --------------------------------

export interface CommunityProfile {
  id: Id;
  userId: Id;
  /** Public display name. No real name, email or location is ever exposed. */
  displayName: string;
}

export interface CommunityPost {
  id: Id;
  authorProfileId: Id;
  topic: string;
  title: string;
  body: string;
  createdAt: IsoDateTime;
  status: "visible" | "hidden_by_moderation";
}

export interface CommunityComment {
  id: Id;
  postId: Id;
  authorProfileId: Id;
  body: string;
  createdAt: IsoDateTime;
}

export interface CommunityReport {
  id: Id;
  reporterProfileId: Id;
  postId?: Id;
  commentId?: Id;
  reason: string;
  createdAt: IsoDateTime;
}

export interface CommunityBlock {
  blockerProfileId: Id;
  blockedProfileId: Id;
}

export interface CommunitySavedPost {
  profileId: Id;
  postId: Id;
}
