import { z } from "zod";

export const createOrganizationSchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, "Organization code must be at least 2 characters.")
    .max(50, "Organization code must not exceed 50 characters.")
    .regex(
      /^[A-Z0-9]+(?:-[A-Z0-9]+)*$/,
      "Organization code must contain uppercase letters, numbers, and hyphens only."
    ),

  nameEn: z
    .string()
    .trim()
    .min(2, "English organization name must be at least 2 characters.")
    .max(200, "English organization name must not exceed 200 characters."),

  nameNe: z
    .string()
    .trim()
    .min(2, "Nepali organization name must be at least 2 characters.")
    .max(200, "Nepali organization name must not exceed 200 characters.")
    .optional(),

  shortNameEn: z
    .string()
    .trim()
    .min(2, "English short name must be at least 2 characters.")
    .max(50, "English short name must not exceed 50 characters.")
    .optional(),

  shortNameNe: z
    .string()
    .trim()
    .min(2, "Nepali short name must be at least 2 characters.")
    .max(50, "Nepali short name must not exceed 50 characters.")
    .optional(),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
