import type { Id } from "@/types/common";

export const ORGANIZATIONAL_UNIT_TYPES = ["DEPARTMENT", "SECTION", "UNIT", "TEAM"] as const;

export type OrganizationalUnitType = (typeof ORGANIZATIONAL_UNIT_TYPES)[number];

export type Organization = {
  id: Id;
  code: string;
  name: string;
  isActive: boolean;
};

export type OrganizationalUnit = {
  id: Id;
  organizationId: Id;
  parentUnitId: Id | null;
  type: OrganizationalUnitType;
  code: string;
  name: string;
  isActive: boolean;
};
