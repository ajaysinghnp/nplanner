import { z } from "zod";

const optionalText = (min: number, max: number, fieldName: string) =>
  z.preprocess(
    (value) => {
      if (value === undefined || value === null) {
        return "";
      }

      if (typeof value === "string") {
        return value.trim();
      }

      return value;
    },
    z
      .string()
      .refine(
        (value) => value === "" || value.length >= min,
        `${fieldName} must be at least ${min} characters.`
      )
      .refine(
        (value) => value === "" || value.length <= max,
        `${fieldName} must not exceed ${max} characters.`
      )
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

export const updateOrganizationSchema = z.object({
  id: z.string().cuid("Invalid organization identifier."),

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

export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
