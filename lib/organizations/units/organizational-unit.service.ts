import { findOrganizationById } from "../organization.repository";
import { findOrganizationalUnitTypeById } from "./organizational-unit-type.repository";
import {
  createOrganizationalUnitRecord,
  deleteOrganizationalUnitRecord,
  findOrganizationalUnitByCode,
  findOrganizationalUnitById,
  getOrganizationalUnits,
  updateOrganizationalUnitRecord,
} from "./organizational-unit.repository";
import {
  createOrganizationalUnitSchema,
  updateOrganizationalUnitSchema,
  type CreateOrganizationalUnitInput,
  type UpdateOrganizationalUnitInput,
} from "./organizational-unit.schemas";

export { getOrganizationalUnits };

export async function getOrganizationalUnitById(id: string) {
  return findOrganizationalUnitById(id);
}

export async function createOrganizationalUnit(input: CreateOrganizationalUnitInput) {
  const data = createOrganizationalUnitSchema.parse(input);

  const organization = await findOrganizationById(data.organizationId);

  if (!organization) {
    throw new Error("Organization was not found.");
  }

  const existingUnit = await findOrganizationalUnitByCode(data.organizationId, data.code);

  if (existingUnit) {
    throw new Error(`An organizational unit with code "${data.code}" already exists.`);
  }

  const unitType = await validateUnitType(data.organizationId, data.unitTypeId);

  const parentUnit = await validateParentUnit(data.organizationId, data.parentId);

  validateUnitTypeParentRelationship(unitType, parentUnit);

  return createOrganizationalUnitRecord(data);
}

export async function updateOrganizationalUnit(input: UpdateOrganizationalUnitInput) {
  const data = updateOrganizationalUnitSchema.parse(input);

  const existingUnit = await findOrganizationalUnitById(data.id);

  if (!existingUnit) {
    throw new Error("Organizational unit was not found.");
  }

  const unitType = await validateUnitType(existingUnit.organizationId, data.unitTypeId);

  const parentUnit = await validateParentUnit(
    existingUnit.organizationId,
    data.parentId,
    existingUnit.id
  );

  validateUnitTypeParentRelationship(unitType, parentUnit);

  if (data.parentId) {
    await validateNoHierarchyCycle(existingUnit.id, data.parentId);
  }

  return updateOrganizationalUnitRecord(data);
}

export async function deleteOrganizationalUnit(id: string, confirmationCode: string) {
  const existingUnit = await findOrganizationalUnitById(id);

  if (!existingUnit) {
    throw new Error("Organizational unit was not found.");
  }

  if (confirmationCode.trim() !== existingUnit.code) {
    throw new Error("The confirmation code does not match the organizational unit code.");
  }

  const units = await getOrganizationalUnits(existingUnit.organizationId);

  const hasChildren = units.some((unit) => unit.parentId === existingUnit.id);

  if (hasChildren) {
    throw new Error(
      "This organizational unit cannot be deleted because it has child organizational units."
    );
  }

  return deleteOrganizationalUnitRecord(existingUnit.id);
}

async function validateUnitType(organizationId: string, unitTypeId: string) {
  if (unitTypeId === "") {
    return null;
  }

  const unitType = await findOrganizationalUnitTypeById(unitTypeId);

  if (!unitType) {
    throw new Error("The selected organizational unit type was not found.");
  }

  if (unitType.organizationId !== organizationId) {
    throw new Error("The selected organizational unit type belongs to another organization.");
  }

  return unitType;
}

async function validateParentUnit(
  organizationId: string,
  parentId: string,
  currentUnitId?: string
) {
  if (parentId === "") {
    return null;
  }

  if (parentId === currentUnitId) {
    throw new Error("An organizational unit cannot be its own parent.");
  }

  const parentUnit = await findOrganizationalUnitById(parentId);

  if (!parentUnit) {
    throw new Error("The selected parent organizational unit was not found.");
  }

  if (parentUnit.organizationId !== organizationId) {
    throw new Error("The selected parent organizational unit belongs to another organization.");
  }

  return parentUnit;
}

function validateUnitTypeParentRelationship(
  unitType: Awaited<ReturnType<typeof findOrganizationalUnitTypeById>> | null,
  parentUnit: Awaited<ReturnType<typeof findOrganizationalUnitById>> | null
) {
  if (!unitType) {
    return;
  }

  if (!unitType.parentTypeId) {
    if (parentUnit) {
      throw new Error(
        `"${unitType.nameEn}" is a root unit type and cannot have a parent organizational unit.`
      );
    }

    return;
  }

  if (!parentUnit) {
    throw new Error(
      `An organizational unit of type "${unitType.nameEn}" must have a parent organizational unit.`
    );
  }

  if (parentUnit.unitTypeId !== unitType.parentTypeId) {
    throw new Error(
      `The selected parent organizational unit must have the parent type configured for "${unitType.nameEn}".`
    );
  }
}

async function validateNoHierarchyCycle(unitId: string, proposedParentId: string) {
  let currentParentId: string | null = proposedParentId;

  while (currentParentId) {
    if (currentParentId === unitId) {
      throw new Error("The selected parent would create a circular organizational-unit hierarchy.");
    }

    const currentUnit = await findOrganizationalUnitById(currentParentId);

    if (!currentUnit) {
      break;
    }

    currentParentId = currentUnit.parentId;
  }
}
