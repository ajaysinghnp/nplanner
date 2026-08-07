import { z } from "zod";

import { organizationalCodeRegex } from "@/conf/formats";
import { RecordStatus } from "@/generated/prisma/client";

const optionalText = (min: number, max: number, fieldName: string) =>
  z
    .string()
    .optional()
    .transform((value) => value?.trim() ?? "")
    .refine(
      (value) => value === "" || value.length >= min,
      `${fieldName} must be at least ${min} characters.`
    )
    .refine((value) => value.length <= max, `${fieldName} must not exceed ${max} characters.`);

const requiredText = (min: number, max: number, fieldName: string) =>
  z
    .string()
    .trim()
    .min(min, `${fieldName} must be at least ${min} characters.`)
    .max(max, `${fieldName} must not exceed ${max} characters.`);

const optionalId = (fieldName: string) =>
  z
    .string()
    .optional()
    .transform((value) => value?.trim() ?? "")
    .refine((value) => value === "" || value.length > 0, `${fieldName} is invalid.`);

const recordStatusSchema = z
  .string()
  .refine(
    (value): value is RecordStatus =>
      value === RecordStatus.ACTIVE ||
      value === RecordStatus.INACTIVE ||
      value === RecordStatus.ARCHIVED,
    "Please select a valid status."
  )
  .transform((value) => value as RecordStatus);

export const createOrganizationalUnitSchema = z.object({
  organizationId: z.string().trim().min(1, "Organization ID is required."),

  parentId: optionalId("Parent organizational unit"),

  unitTypeId: optionalId("Organizational unit type"),

  code: z
    .string()
    .trim()
    .min(2, "Organizational unit code must be at least 2 characters.")
    .max(50, "Organizational unit code must not exceed 50 characters.")
    .regex(organizationalCodeRegex.pattern, organizationalCodeRegex.message),

  nameEn: requiredText(2, 200, "English organizational unit name"),

  nameNe: optionalText(2, 200, "Nepali organizational unit name"),

  shortNameEn: optionalText(2, 50, "English short name"),

  shortNameNe: optionalText(2, 50, "Nepali short name"),

  sortOrder: z.coerce
    .number()
    .int("Sort order must be a whole number.")
    .min(0, "Sort order cannot be negative.")
    .max(999999, "Sort order is too large.")
    .default(0),

  status: recordStatusSchema.default(RecordStatus.ACTIVE),
});

export const updateOrganizationalUnitSchema = z.object({
  id: z.string().trim().min(1, "Organizational unit ID is required."),

  parentId: optionalId("Parent organizational unit"),

  unitTypeId: optionalId("Organizational unit type"),

  nameEn: requiredText(2, 200, "English organizational unit name"),

  nameNe: optionalText(2, 200, "Nepali organizational unit name"),

  shortNameEn: optionalText(2, 50, "English short name"),

  shortNameNe: optionalText(2, 50, "Nepali short name"),

  sortOrder: z.coerce
    .number()
    .int("Sort order must be a whole number.")
    .min(0, "Sort order cannot be negative.")
    .max(999999, "Sort order is too large."),

  status: recordStatusSchema,
});

export type CreateOrganizationalUnitInput = z.input<typeof createOrganizationalUnitSchema>;

export type CreateOrganizationalUnitData = z.output<typeof createOrganizationalUnitSchema>;

export type UpdateOrganizationalUnitInput = z.input<typeof updateOrganizationalUnitSchema>;

export type UpdateOrganizationalUnitData = z.output<typeof updateOrganizationalUnitSchema>;
