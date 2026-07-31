import {
  createOrganizationRecord,
  findOrganizationByCode,
  findOrganizationById,
  findOrganizations,
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
