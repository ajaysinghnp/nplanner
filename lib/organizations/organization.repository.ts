import type {
  CreateOrganizationInput,
  UpdateOrganizationInput,
} from "@/lib/organizations/organization.schemas";

import { prisma } from "@/lib/db/prisma";

export function findOrganizations() {
  return prisma.organization.findMany({
    orderBy: {
      nameEn: "asc",
    },
  });
}

export function findOrganizationById(id: string) {
  return prisma.organization.findUnique({
    where: {
      id,
    },
  });
}

export function findOrganizationByCode(code: string) {
  return prisma.organization.findUnique({
    where: {
      code,
    },
  });
}

export function createOrganizationRecord(data: CreateOrganizationInput) {
  return prisma.organization.create({
    data,
  });
}

export function updateOrganizationRecord(data: UpdateOrganizationInput) {
  const { id, ...organizationData } = data;

  return prisma.organization.update({
    where: {
      id,
    },
    data: {
      ...organizationData,
      nameNe: organizationData.nameNe ?? null,
      shortNameEn: organizationData.shortNameEn ?? null,
      shortNameNe: organizationData.shortNameNe ?? null,
    },
  });
}
