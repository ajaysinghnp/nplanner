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

  return createOrganizationalUnitTypeRecord(data);
}

export async function updateOrganizationalUnitType(input: UpdateOrganizationalUnitTypeInput) {
  const data = updateOrganizationalUnitTypeSchema.parse(input);

  const existingUnitType = await findOrganizationalUnitTypeById(data.id);

  if (!existingUnitType) {
    throw new Error("Organizational unit type was not found.");
  }

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
