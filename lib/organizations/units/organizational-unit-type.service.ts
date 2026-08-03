import {
  countOrganizationalUnitsByUnitTypeId,
  createOrganizationalUnitTypeRecord,
  deleteOrganizationalUnitTypeRecord,
  findOrganizationalUnitTypeById,
  findOrganizationalUnitTypeByOrganizationIdAndCode,
  findOrganizationalUnitTypesByOrganizationId,
  updateOrganizationalUnitTypeRecord,
} from "./organizational-unit-type.repository";
import {
  CreateOrganizationalUnitTypeInput,
  createOrganizationalUnitTypeSchema,
  UpdateOrganizationalUnitTypeInput,
  updateOrganizationalUnitTypeSchema,
} from "./organizational-unit-type.schemas";

export async function getOrganizationalUnitTypes(organizationId: string) {
  return findOrganizationalUnitTypesByOrganizationId(organizationId);
}

export async function getOrganizationalUnitTypeById(id: string) {
  return findOrganizationalUnitTypeById(id);
}

async function validateParentType(
  organizationId: string,
  parentTypeId: string | undefined,
  currentTypeId?: string
) {
  if (!parentTypeId) {
    return;
  }

  if (parentTypeId === currentTypeId) {
    throw new Error("An organizational unit type cannot be its own parent.");
  }

  const parentType = await findOrganizationalUnitTypeById(parentTypeId);

  if (!parentType) {
    throw new Error("The selected parent organizational unit type was not found.");
  }

  if (parentType.organizationId !== organizationId) {
    throw new Error(
      "The selected parent organizational unit type belongs to another organization."
    );
  }

  if (!currentTypeId) {
    return;
  }

  const visitedTypeIds = new Set<string>();
  let ancestor = parentType;

  while (ancestor.parentTypeId) {
    if (visitedTypeIds.has(ancestor.id)) {
      throw new Error("The organizational unit type hierarchy contains a circular relationship.");
    }

    visitedTypeIds.add(ancestor.id);

    if (ancestor.parentTypeId === currentTypeId) {
      throw new Error(
        "The selected parent organizational unit type would create a circular hierarchy."
      );
    }

    const nextAncestor = await findOrganizationalUnitTypeById(ancestor.parentTypeId);

    if (!nextAncestor) {
      break;
    }

    ancestor = nextAncestor;
  }
}

export async function createOrganizationalUnitType(input: CreateOrganizationalUnitTypeInput) {
  const data = createOrganizationalUnitTypeSchema.parse(input);

  const existingUnitType = await findOrganizationalUnitTypeByOrganizationIdAndCode(
    data.organizationId,
    data.code
  );

  if (existingUnitType) {
    throw new Error(
      `An organizational unit type with the code "${data.code}" already exists in this organization.`
    );
  }

  await validateParentType(data.organizationId, data.parentTypeId);

  return createOrganizationalUnitTypeRecord(data);
}

export async function updateOrganizationalUnitType(input: UpdateOrganizationalUnitTypeInput) {
  const data = updateOrganizationalUnitTypeSchema.parse(input);

  const existingUnitType = await findOrganizationalUnitTypeById(data.id);

  if (!existingUnitType) {
    throw new Error("Organizational unit type was not found.");
  }

  await validateParentType(existingUnitType.organizationId, data.parentTypeId, data.id);

  return updateOrganizationalUnitTypeRecord(data);
}

export async function deleteOrganizationalUnitType(id: string, confirmationCode: string) {
  const unitTypeId = id.trim();
  const normalizedConfirmationCode = confirmationCode.trim();

  if (!unitTypeId) {
    throw new Error("Organizational unit type ID is required.");
  }

  if (!normalizedConfirmationCode) {
    throw new Error("Unit type code confirmation is required.");
  }

  const existingUnitType = await findOrganizationalUnitTypeById(unitTypeId);

  if (!existingUnitType) {
    throw new Error("Organizational unit type was not found.");
  }

  if (existingUnitType.code !== normalizedConfirmationCode) {
    throw new Error("The entered unit type code does not match.");
  }

  const assignedUnitCount = await countOrganizationalUnitsByUnitTypeId(existingUnitType.id);

  if (assignedUnitCount > 0) {
    throw new Error(
      "This organizational unit type cannot be deleted because it is assigned to existing organizational units. Archive it instead."
    );
  }

  return deleteOrganizationalUnitTypeRecord(existingUnitType.id);
}
