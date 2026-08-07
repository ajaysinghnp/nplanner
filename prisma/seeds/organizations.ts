import { STRUCTURES } from "@/conf/org-structures";
import { ORGANIZATIONS } from "@/conf/organizations";
import {
  ensureOrganization,
  getOrganizationByCode,
} from "@/lib/organizations/organization.service";
import {
  createOrganizationalUnitType,
  getOrganizationalUnitTypeByOrganizationIdAndCode,
} from "@/lib/organizations/units/organizational-unit-type.service";
import {
  ensureOrganizationalUnit,
  getOrganizationalUnitByCode,
} from "@/lib/organizations/units/organizational-unit.service";

export async function seedOrganizations(): Promise<void> {
  for (const org of ORGANIZATIONS) {
    const organization = await ensureOrganization(org);

    console.log(`🌱 Organization: ${organization.nameEn} (${organization.code})`);
  }
}

export async function seedOrganizationStructures(): Promise<void> {
  for (const structure of STRUCTURES) {
    const organization = await getOrganizationByCode(structure.organizationCode);

    if (!organization) {
      console.error(
        `❌ Organization with code "${structure.organizationCode}" not found. Skipping structure seeding.`
      );

      continue;
    }

    console.log(`\n🌱 Seeding structure for ${organization.nameEn} (${organization.code})`);

    const unitTypes = structure.unitTypes ?? [];
    const units = structure.units ?? [];

    // Seed unit types first because organizational units can reference them.
    for (const ut of unitTypes) {
      const parentTypeId = ut.parentTypeCode
        ? (
            await getOrganizationalUnitTypeByOrganizationIdAndCode(
              organization.id,
              ut.parentTypeCode
            )
          )?.id
        : undefined;

      const unitType = await createOrganizationalUnitType({
        organizationId: organization.id,
        code: ut.code,
        nameEn: ut.nameEn,
        shortNameEn: ut.shortNameEn,
        sortOrder: ut.sortOrder,
        parentTypeId,
        status: "ACTIVE",
      });

      console.log(`   🌱 Unit type: ${unitType.nameEn} (${unitType.code})`);
    }

    // Seed organizational units after all unit types exist.
    for (const unt of units) {
      const unitType = await getOrganizationalUnitTypeByOrganizationIdAndCode(
        organization.id,
        unt.unitTypeCode
      );

      const parentUnit =
        unt.parentCode !== undefined
          ? await getOrganizationalUnitByCode(organization.id, unt.parentCode)
          : undefined;

      const unit = await ensureOrganizationalUnit({
        organizationId: organization.id,
        code: unt.code,
        nameEn: unt.nameEn,
        shortNameEn: unt.shortNameEn,
        sortOrder: unt.sortOrder,
        unitTypeId: unitType?.id,
        parentId: parentUnit?.id,
        status: "ACTIVE",
      });

      console.log(`   🌱 Unit: ${unit.nameEn} (${unit.code})`);
    }
  }
}
