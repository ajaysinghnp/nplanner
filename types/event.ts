import type { CalendarType, GregorianDate, NepaliDate } from "@/types/calendar";
import type { DateTimeString, Id } from "@/types/common";

export const EVENT_STATUSES = ["DRAFT", "ACTIVE", "COMPLETED", "CANCELLED"] as const;

export type EventStatus = (typeof EVENT_STATUSES)[number];

export const APPROVAL_STATUSES = [
  "NOT_REQUIRED",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "REVISION_REQUESTED",
] as const;

export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];

export const EVENT_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

export type EventPriority = (typeof EVENT_PRIORITIES)[number];

export const EVENT_SCOPES = [
  "ORGANIZATION",
  "DEPARTMENT",
  "SECTION",
  "UNIT",
  "TEAM",
  "USER",
] as const;

export type EventScope = (typeof EVENT_SCOPES)[number];

export type EventDate = {
  primaryCalendarType: CalendarType;
  gregorianDate: GregorianDate | null;
  nepaliDate: NepaliDate | null;
};

export type Event = {
  id: Id;
  organizationId: Id;
  ownerUnitId: Id | null;
  createdByUserId: Id;

  title: string;
  description: string | null;

  startDate: EventDate;
  endDate: EventDate | null;

  startTime: string | null;
  endTime: string | null;

  scope: EventScope;
  status: EventStatus;
  approvalStatus: ApprovalStatus;

  priority: EventPriority;
  progressPercentage: number;

  isRecurring: boolean;
  recurrenceCalendarType: CalendarType | null;

  requiresApproval: boolean;
  supportingDocumentReference: string | null;

  createdAt: DateTimeString;
  updatedAt: DateTimeString;
};
