"use server";

import { revalidatePath } from "next/cache";

import {
  createOrganizationSchema,
  updateOrganizationSchema,
} from "@/lib/organizations/organization.schemas";
import {
  createOrganization,
  deleteOrganization,
  updateOrganization,
} from "@/lib/organizations/organization.service";

import type {
  CreateOrganizationActionState,
  DeleteOrganizationActionState,
  UpdateOrganizationActionState,
} from "./action-state";

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

export async function deleteOrganizationAction(
  organizationId: string,
  confirmationCode: string
): Promise<DeleteOrganizationActionState> {
  const normalizedOrganizationId = organizationId.trim();
  const normalizedConfirmationCode = confirmationCode.trim();

  if (normalizedOrganizationId === "") {
    return {
      success: false,
      message: "Organization ID is required.",
    };
  }

  if (normalizedConfirmationCode === "") {
    return {
      success: false,
      message: "Enter the organization code to confirm deletion.",
    };
  }

  try {
    await deleteOrganization(normalizedOrganizationId, normalizedConfirmationCode);

    revalidatePath("/organizations");

    return {
      success: true,
      message: "Organization deleted successfully.",
    };
  } catch (error) {
    console.error("Failed to delete organization:", error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete the organization.",
    };
  }
}
