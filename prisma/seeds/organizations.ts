import { ORGANIZATIONS } from "@/conf/organizations";
import { ensureOrganization } from "@/lib/organizations/organization.service";

export async function seedOrganizations() {
  ORGANIZATIONS.forEach(async (org) => {
    const organization = await ensureOrganization(org);
    console.log(`🌱 Organization: ${organization.nameEn} (${organization.code})`);
  });
}
