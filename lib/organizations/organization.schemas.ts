import { z } from "zod";

const optionalText = (min: number, max: number, fieldName: string) =>
  z
    .string()
    .trim()
    .max(max, `${fieldName} must not exceed ${max} characters.`)
    .refine(
      (value) => value === "" || value.length >= min,
      `${fieldName} must be at least ${min} characters.`
    );

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

  nameNe: optionalText(2, 200, "Nepali organization name"),

  shortNameEn: optionalText(2, 50, "English short name"),

  shortNameNe: optionalText(2, 50, "Nepali short name"),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
