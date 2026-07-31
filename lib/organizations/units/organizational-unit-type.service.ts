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
  const unitType = await findOrganizationalUnitTypeById(id);

  if (!unitType) {
    throw new Error("Organizational unit type was not found.");
  }

  if (confirmationCode.trim() !== unitType.code) {
    throw new Error("The organizational unit type code does not match.");
  }

  const assignedUnitCount = await countOrganizationalUnitsByUnitTypeId(unitType.id);

  if (assignedUnitCount > 0) {
    throw new Error(
      `This organizational unit type is currently assigned to ${assignedUnitCount} organizational unit${
        assignedUnitCount === 1 ? "" : "s"
      } and cannot be deleted.`
    );
  }

  return deleteOrganizationalUnitTypeRecord(unitType.id);
}
