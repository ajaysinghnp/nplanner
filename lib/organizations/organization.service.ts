import {
  createOrganizationRecord,
  deleteOrganizationRecord,
  findOrganizationByCode,
  findOrganizationById,
  findOrganizations,
  getOrganizationDependencyCounts,
  updateOrganizationRecord,
} from "@/lib/organizations/organization.repository";
import {
  createOrganizationSchema,
  type CreateOrganizationInput,
  type UpdateOrganizationInput,
  updateOrganizationSchema,
} from "@/lib/organizations/organization.schemas";

export async function getOrganizations() {
  return findOrganizations();
}

export async function getOrganizationById(id: string) {
  return findOrganizationById(id);
}

export async function getOrganizationByCode(code: string) {
  return findOrganizationByCode(code);
}

export async function createOrganization(input: CreateOrganizationInput) {
  const data = createOrganizationSchema.parse(input);

  const existingOrganization = await findOrganizationByCode(data.code);

  if (existingOrganization) {
    throw new Error(`An organization with the code "${data.code}" already exists.`);
  }

  return createOrganizationRecord(data);
}

export async function ensureOrganization(input: CreateOrganizationInput) {
  const data = createOrganizationSchema.parse(input);

  const existingOrganization = await findOrganizationByCode(data.code);

  if (existingOrganization) {
    return existingOrganization;
  }

  return createOrganizationRecord(data);
}

export async function updateOrganization(input: UpdateOrganizationInput) {
  const data = updateOrganizationSchema.parse(input);

  const existingOrganization = await findOrganizationById(data.id);

  if (!existingOrganization) {
    throw new Error("Organization not found.");
  }

  return updateOrganizationRecord(data);
}

export async function deleteOrganization(id: string, confirmationCode: string) {
  const organization = await findOrganizationById(id);

  if (!organization) {
    throw new Error("Organization not found.");
  }

  if (confirmationCode !== organization.code) {
    throw new Error(
      "The entered organization code does not match. The organization was not deleted."
    );
  }

  const dependencyResult = await getOrganizationDependencyCounts(id);

  if (!dependencyResult) {
    throw new Error("Organization not found.");
  }

  const { organizationalUnitTypes, organizationalUnits, memberships } = dependencyResult._count;

  const totalDependencies = organizationalUnitTypes + organizationalUnits + memberships;

  if (totalDependencies > 0) {
    const dependencies: string[] = [];

    if (organizationalUnitTypes > 0) {
      dependencies.push(
        `${organizationalUnitTypes} organizational unit type${
          organizationalUnitTypes === 1 ? "" : "s"
        }`
      );
    }

    if (organizationalUnits > 0) {
      dependencies.push(
        `${organizationalUnits} organizational unit${organizationalUnits === 1 ? "" : "s"}`
      );
    }

    if (memberships > 0) {
      dependencies.push(`${memberships} membership${memberships === 1 ? "" : "s"}`);
    }

    throw new Error(
      `This organization cannot be deleted because it has related records: ${dependencies.join(
        ", "
      )}.`
    );
  }

  return deleteOrganizationRecord(id);
}
