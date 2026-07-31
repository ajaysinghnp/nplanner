"use server";

import { revalidatePath } from "next/cache";

import {
  createOrganizationalUnitType,
  deleteOrganizationalUnitType,
  updateOrganizationalUnitType,
} from "@/lib/organizations/units/organizational-unit-type.service";
import {
  createOrganizationalUnit,
  deleteOrganizationalUnit,
  updateOrganizationalUnit,
} from "@/lib/organizations/units/organizational-unit.service";

import type {
  CreateOrganizationalUnitActionState,
  CreateOrganizationalUnitTypeActionState,
  DeleteOrganizationalUnitActionState,
  DeleteOrganizationalUnitTypeActionState,
  UpdateOrganizationalUnitActionState,
  UpdateOrganizationalUnitTypeActionState,
} from "./action-state";

function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

function getFieldErrors(error: unknown): Record<string, string[] | undefined> | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "flatten" in error &&
    typeof error.flatten === "function"
  ) {
    const flattenedError = error.flatten();

    if (
      typeof flattenedError === "object" &&
      flattenedError !== null &&
      "fieldErrors" in flattenedError
    ) {
      return flattenedError.fieldErrors as Record<string, string[] | undefined>;
    }
  }

  return undefined;
}

export async function createOrganizationalUnitTypeAction(
  _previousState: CreateOrganizationalUnitTypeActionState,
  formData: FormData
): Promise<CreateOrganizationalUnitTypeActionState> {
  const organizationId = getStringValue(formData, "organizationId");
  const organizationCode = getStringValue(formData, "organizationCode");

  try {
    await createOrganizationalUnitType({
      organizationId,
      code: getStringValue(formData, "code"),
      nameEn: getStringValue(formData, "nameEn"),
      nameNe: getStringValue(formData, "nameNe"),
      shortNameEn: getStringValue(formData, "shortNameEn"),
      shortNameNe: getStringValue(formData, "shortNameNe"),
      sortOrder: getStringValue(formData, "sortOrder"),
      status: getStringValue(formData, "status"),
    });

    revalidatePath(`/organizations/${organizationCode}`);
    revalidatePath(`/organizations/${organizationCode}/units`);

    return {
      success: true,
      message: "Organizational unit type created successfully.",
    };
  } catch (error) {
    const fieldErrors = getFieldErrors(error);

    if (fieldErrors) {
      return {
        success: false,
        fieldErrors: {
          code: fieldErrors.code,
          nameEn: fieldErrors.nameEn,
          nameNe: fieldErrors.nameNe,
          shortNameEn: fieldErrors.shortNameEn,
          shortNameNe: fieldErrors.shortNameNe,
          sortOrder: fieldErrors.sortOrder,
          status: fieldErrors.status,
        },
        message: "Please correct the highlighted fields.",
      };
    }

    console.error("Failed to create organizational unit type:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to create organizational unit type.",
    };
  }
}

export async function updateOrganizationalUnitTypeAction(
  _previousState: UpdateOrganizationalUnitTypeActionState,
  formData: FormData
): Promise<UpdateOrganizationalUnitTypeActionState> {
  const organizationCode = getStringValue(formData, "organizationCode");

  try {
    await updateOrganizationalUnitType({
      id: getStringValue(formData, "id"),
      nameEn: getStringValue(formData, "nameEn"),
      nameNe: getStringValue(formData, "nameNe"),
      shortNameEn: getStringValue(formData, "shortNameEn"),
      shortNameNe: getStringValue(formData, "shortNameNe"),
      sortOrder: getStringValue(formData, "sortOrder"),
      status: getStringValue(formData, "status"),
    });

    revalidatePath(`/organizations/${organizationCode}`);
    revalidatePath(`/organizations/${organizationCode}/units`);

    return {
      success: true,
      message: "Organizational unit type updated successfully.",
    };
  } catch (error) {
    const fieldErrors = getFieldErrors(error);

    if (fieldErrors) {
      return {
        success: false,
        fieldErrors: {
          nameEn: fieldErrors.nameEn,
          nameNe: fieldErrors.nameNe,
          shortNameEn: fieldErrors.shortNameEn,
          shortNameNe: fieldErrors.shortNameNe,
          sortOrder: fieldErrors.sortOrder,
          status: fieldErrors.status,
        },
        message: "Please correct the highlighted fields.",
      };
    }

    console.error("Failed to update organizational unit type:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to update organizational unit type.",
    };
  }
}

export async function deleteOrganizationalUnitTypeAction(
  _previousState: DeleteOrganizationalUnitTypeActionState,
  formData: FormData
): Promise<DeleteOrganizationalUnitTypeActionState> {
  const id = getStringValue(formData, "id");
  const confirmationCode = getStringValue(formData, "confirmationCode");
  const organizationCode = getStringValue(formData, "organizationCode");

  if (id === "") {
    return {
      success: false,
      message: "Organizational unit type ID is required.",
    };
  }

  try {
    await deleteOrganizationalUnitType(id, confirmationCode);

    revalidatePath(`/organizations/${organizationCode}`);
    revalidatePath(`/organizations/${organizationCode}/units`);

    return {
      success: true,
      message: "Organizational unit type deleted successfully.",
    };
  } catch (error) {
    console.error("Failed to delete organizational unit type:", error);

    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete organizational unit type.",
    };
  }
}

// Action functions for organizational unit operations will be implemented in a similar manner, following the same structure and error handling as above.
export async function createOrganizationalUnitAction(
  _previousState: CreateOrganizationalUnitActionState,
  formData: FormData
): Promise<CreateOrganizationalUnitActionState> {
  const organizationId = getStringValue(formData, "organizationId");
  const organizationCode = getStringValue(formData, "organizationCode");

  try {
    await createOrganizationalUnit({
      organizationId,
      parentId: getStringValue(formData, "parentId"),
      unitTypeId: getStringValue(formData, "unitTypeId"),
      code: getStringValue(formData, "code"),
      nameEn: getStringValue(formData, "nameEn"),
      nameNe: getStringValue(formData, "nameNe"),
      shortNameEn: getStringValue(formData, "shortNameEn"),
      shortNameNe: getStringValue(formData, "shortNameNe"),
      sortOrder: getStringValue(formData, "sortOrder"),
      status: getStringValue(formData, "status"),
    });

    revalidatePath(`/organizations/${organizationCode}`);
    revalidatePath(`/organizations/${organizationCode}/units`);

    return {
      success: true,
      message: "Organizational unit created successfully.",
    };
  } catch (error) {
    const fieldErrors = getFieldErrors(error);

    if (fieldErrors) {
      return {
        success: false,
        fieldErrors: {
          code: fieldErrors.code,
          parentId: fieldErrors.parentId,
          unitTypeId: fieldErrors.unitTypeId,
          nameEn: fieldErrors.nameEn,
          nameNe: fieldErrors.nameNe,
          shortNameEn: fieldErrors.shortNameEn,
          shortNameNe: fieldErrors.shortNameNe,
          sortOrder: fieldErrors.sortOrder,
          status: fieldErrors.status,
        },
        message: "Please correct the highlighted fields.",
      };
    }

    console.error("Failed to create organizational unit:", error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to create organizational unit.",
    };
  }
}

export async function updateOrganizationalUnitAction(
  _previousState: UpdateOrganizationalUnitActionState,
  formData: FormData
): Promise<UpdateOrganizationalUnitActionState> {
  const organizationCode = getStringValue(formData, "organizationCode");

  try {
    await updateOrganizationalUnit({
      id: getStringValue(formData, "id"),
      parentId: getStringValue(formData, "parentId"),
      unitTypeId: getStringValue(formData, "unitTypeId"),
      nameEn: getStringValue(formData, "nameEn"),
      nameNe: getStringValue(formData, "nameNe"),
      shortNameEn: getStringValue(formData, "shortNameEn"),
      shortNameNe: getStringValue(formData, "shortNameNe"),
      sortOrder: getStringValue(formData, "sortOrder"),
      status: getStringValue(formData, "status"),
    });

    revalidatePath(`/organizations/${organizationCode}`);
    revalidatePath(`/organizations/${organizationCode}/units`);

    return {
      success: true,
      message: "Organizational unit updated successfully.",
    };
  } catch (error) {
    const fieldErrors = getFieldErrors(error);

    if (fieldErrors) {
      return {
        success: false,
        fieldErrors: {
          parentId: fieldErrors.parentId,
          unitTypeId: fieldErrors.unitTypeId,
          nameEn: fieldErrors.nameEn,
          nameNe: fieldErrors.nameNe,
          shortNameEn: fieldErrors.shortNameEn,
          shortNameNe: fieldErrors.shortNameNe,
          sortOrder: fieldErrors.sortOrder,
          status: fieldErrors.status,
        },
        message: "Please correct the highlighted fields.",
      };
    }

    console.error("Failed to update organizational unit:", error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update organizational unit.",
    };
  }
}

export async function deleteOrganizationalUnitAction(
  _previousState: DeleteOrganizationalUnitActionState,
  formData: FormData
): Promise<DeleteOrganizationalUnitActionState> {
  const id = getStringValue(formData, "id");
  const confirmationCode = getStringValue(formData, "confirmationCode");
  const organizationCode = getStringValue(formData, "organizationCode");

  if (id === "") {
    return {
      success: false,
      message: "Organizational unit ID is required.",
    };
  }

  try {
    await deleteOrganizationalUnit(id, confirmationCode);

    revalidatePath(`/organizations/${organizationCode}`);
    revalidatePath(`/organizations/${organizationCode}/units`);

    return {
      success: true,
      message: "Organizational unit deleted successfully.",
    };
  } catch (error) {
    console.error("Failed to delete organizational unit:", error);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete organizational unit.",
    };
  }
}
