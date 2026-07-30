import { prisma } from "@/lib/db/prisma";

export async function checkDatabaseConnection() {
  const organizationCount = await prisma.organization.count();

  return {
    connected: true,
    organizationCount,
  };
}
