"use server";

import { revalidatePath } from "next/cache";

import { updateOrganizationSchema } from "@/lib/organizations/organization.schemas";
import { updateOrganization } from "@/lib/organizations/organization.service";

import type { UpdateOrganizationActionState } from "./action-state";

export async function updateOrganizationAction(
  _previousState: UpdateOrganizationActionState,
  formData: FormData
): Promise<UpdateOrganizationActionState> {
  const validationResult = updateOrganizationSchema.safeParse({
    id: formData.get("id"),
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
    const organization = await updateOrganization(validationResult.data);

    revalidatePath("/organizations");
    revalidatePath(`/organizations/${organization.code}`);

    return {
      message: "Organization updated successfully.",
      success: true,
    };
  } catch (error: unknown) {
    console.error("Failed to update organization:", error);

    return {
      message:
        error instanceof Error
          ? error.message
          : "Unable to update the organization. Please try again.",
      success: false,
    };
  }
}
