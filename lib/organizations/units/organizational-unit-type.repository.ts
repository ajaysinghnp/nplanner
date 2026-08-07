import type {
  CreateOrganizationalUnitTypeData,
  UpdateOrganizationalUnitTypeData,
} from "@/lib/organizations/units/organizational-unit-type.schemas";

import { prisma } from "@/lib/db/prisma";

export function findOrganizationalUnitTypesByOrganizationId(organizationId: string) {
  return prisma.organizationalUnitType.findMany({
    where: {
      organizationId,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        nameEn: "asc",
      },
    ],
  });
}

export function findOrganizationalUnitTypeById(id: string) {
  return prisma.organizationalUnitType.findUnique({
    where: {
      id,
    },
  });
}

export function findOrganizationalUnitTypeByOrganizationIdAndCode(
  organizationId: string,
  code: string
) {
  return prisma.organizationalUnitType.findUnique({
    where: {
      organizationId_code: {
        organizationId,
        code,
      },
    },
  });
}

export function createOrganizationalUnitTypeRecord(data: CreateOrganizationalUnitTypeData) {
  return prisma.organizationalUnitType.create({
    data: {
      ...data,
      parentTypeId: data.parentTypeId ?? null,
    },
  });
}

export function updateOrganizationalUnitTypeRecord(data: UpdateOrganizationalUnitTypeData) {
  const { id, parentTypeId, ...updateData } = data;

  return prisma.organizationalUnitType.update({
    where: {
      id,
    },
    data: {
      ...updateData,
      parentTypeId: parentTypeId ?? null,
    },
  });
}

export function countOrganizationalUnitsByUnitTypeId(unitTypeId: string) {
  return prisma.organizationalUnit.count({
    where: {
      unitTypeId,
    },
  });
}

export async function countOrganizationalUnitTypesByParentTypeId(parentTypeId: string) {
  return prisma.organizationalUnitType.count({
    where: {
      parentTypeId,
    },
  });
}

export async function countChildOrganizationalUnitTypes(parentTypeId: string): Promise<number> {
  return prisma.organizationalUnitType.count({
    where: {
      parentTypeId,
    },
  });
}

export function deleteOrganizationalUnitTypeRecord(id: string) {
  return prisma.organizationalUnitType.delete({
    where: {
      id,
    },
  });
}
