"use server";

import { revalidatePath } from "next/cache";

import { createOrganizationSchema } from "@/lib/organizations/organization.schemas";
import { createOrganization } from "@/lib/organizations/organization.service";

import type { CreateOrganizationActionState } from "./action-state";

export async function createOrganizationAction(
  _previousState: CreateOrganizationActionState,
  formData: FormData
): Promise<CreateOrganizationActionState> {
  const validationResult = createOrganizationSchema.safeParse({
    code: formData.get("code"),
    nameEn: formData.get("nameEn"),
    nameNe: formData.get("nameNe"),
    shortNameEn: formData.get("shortNameEn"),
    shortNameNe: formData.get("shortNameNe"),
  });

  if (!validationResult.success) {
    return {
      fieldErrors: validationResult.error.flatten().fieldErrors,
      message: "Please correct the highlighted fields.",
      success: false,
    };
  }

  try {
    await createOrganization(validationResult.data);
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("already exists")) {
      return {
        fieldErrors: {
          code: [error.message],
        },
        success: false,
      };
    }

    console.error("Failed to create organization:", error);

    return {
      message: "Unable to create the organization. Please try again.",
      success: false,
    };
  }

  revalidatePath("/organizations");

  return {
    message: "Organization created successfully.",
    success: true,
  };
}
