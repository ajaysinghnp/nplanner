import { prisma } from "@/lib/db/prisma";

import type {
  CreateOrganizationalUnitData,
  UpdateOrganizationalUnitData,
} from "./organizational-unit.schemas";

export function findOrganizationalUnitById(id: string) {
  return prisma.organizationalUnit.findUnique({
    where: {
      id,
    },
    include: {
      organization: true,
      parent: true,
      unitType: true,
    },
  });
}

export function findOrganizationalUnitByCode(organizationId: string, code: string) {
  return prisma.organizationalUnit.findUnique({
    where: {
      organizationId_code: {
        organizationId,
        code,
      },
    },
    include: {
      organization: true,
      parent: true,
      unitType: true,
    },
  });
}

export function getOrganizationalUnits(organizationId: string) {
  return prisma.organizationalUnit.findMany({
    where: {
      organizationId,
    },
    include: {
      parent: {
        select: {
          id: true,
          code: true,
          nameEn: true,
          nameNe: true,
        },
      },
      unitType: {
        select: {
          id: true,
          code: true,
          nameEn: true,
          nameNe: true,
        },
      },
      _count: {
        select: {
          children: true,
          memberships: true,
        },
      },
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

export function createOrganizationalUnitRecord(data: CreateOrganizationalUnitData) {
  return prisma.organizationalUnit.create({
    data: {
      organizationId: data.organizationId,
      parentId: data.parentId || null,
      unitTypeId: data.unitTypeId || null,
      code: data.code,
      nameEn: data.nameEn,
      nameNe: data.nameNe || null,
      shortNameEn: data.shortNameEn || null,
      shortNameNe: data.shortNameNe || null,
      sortOrder: data.sortOrder,
      status: data.status,
    },
  });
}

export function updateOrganizationalUnitRecord(data: UpdateOrganizationalUnitData) {
  const { id, ...updateData } = data;

  return prisma.organizationalUnit.update({
    where: {
      id,
    },
    data: {
      parentId: updateData.parentId || null,
      unitTypeId: updateData.unitTypeId || null,
      nameEn: updateData.nameEn,
      nameNe: updateData.nameNe || null,
      shortNameEn: updateData.shortNameEn || null,
      shortNameNe: updateData.shortNameNe || null,
      sortOrder: updateData.sortOrder,
      status: updateData.status,
    },
  });
}

export function deleteOrganizationalUnitRecord(id: string) {
  return prisma.organizationalUnit.delete({
    where: {
      id,
    },
  });
}
