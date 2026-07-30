import type { Id } from "@/types/common";

export const PERMISSIONS = [
  "SYSTEM_MANAGE",
  "ORGANIZATION_MANAGE",
  "ORGANIZATION_VIEW",
  "UNIT_MANAGE",
  "UNIT_VIEW",
  "USER_MANAGE",
  "ROLE_MANAGE",
  "EVENT_CREATE",
  "EVENT_UPDATE",
  "EVENT_DELETE",
  "EVENT_VIEW",
  "EVENT_APPROVE",
  "CALENDAR_VIEW",
  "CALENDAR_DATASET_MANAGE",
] as const;

export type Permission = (typeof PERMISSIONS)[number];

export type Role = {
  id: Id;
  code: string;
  name: string;
  description: string | null;
  isSystemRole: boolean;
  isActive: boolean;
};

export type RolePermission = {
  roleId: Id;
  permission: Permission;
};
