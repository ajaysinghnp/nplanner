import { z } from "zod";

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

const recordStatusSchema = z.enum([
  RecordStatus.ACTIVE,
  RecordStatus.INACTIVE,
  RecordStatus.ARCHIVED,
]);

export const createOrganizationalUnitTypeSchema = z.object({
  organizationId: z.string().trim().min(1, "Organization ID is required."),

  code: z
    .string()
    .trim()
    .min(2, "Unit type code must be at least 2 characters.")
    .max(50, "Unit type code must not exceed 50 characters.")
    .regex(
      /^[A-Z0-9]+(?:-[A-Z0-9]+)*$/,
      "Unit type code must contain uppercase letters, numbers, and hyphens only."
    ),

  nameEn: requiredText(2, 200, "English unit type name"),

  nameNe: optionalText(2, 200, "Nepali unit type name"),

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

export const updateOrganizationalUnitTypeSchema = z.object({
  id: z.string().trim().min(1, "Organizational unit type ID is required."),

  nameEn: requiredText(2, 200, "English unit type name"),

  nameNe: optionalText(2, 200, "Nepali unit type name"),

  shortNameEn: optionalText(2, 50, "English short name"),

  shortNameNe: optionalText(2, 50, "Nepali short name"),

  sortOrder: z.coerce
    .number()
    .int("Sort order must be a whole number.")
    .min(0, "Sort order cannot be negative.")
    .max(999999, "Sort order is too large."),

  status: recordStatusSchema,
});

export type CreateOrganizationalUnitTypeInput = {
  organizationId: string;
  code: string;
  nameEn: string;
  nameNe?: string;
  shortNameEn?: string;
  shortNameNe?: string;
  sortOrder?: string | number;
  status?: string;
};

export type CreateOrganizationalUnitTypeData = z.output<typeof createOrganizationalUnitTypeSchema>;

export type UpdateOrganizationalUnitTypeInput = {
  id: string;
  nameEn: string;
  nameNe?: string;
  shortNameEn?: string;
  shortNameNe?: string;
  sortOrder: string | number;
  status: string;
};

export type UpdateOrganizationalUnitTypeData = z.output<typeof updateOrganizationalUnitTypeSchema>;
