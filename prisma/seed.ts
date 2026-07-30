import "dotenv/config";

import { prisma } from "@/lib/db/prisma";

import { seedOrganizations } from "./seeds/organizations";

async function main() {
  await seedOrganizations();
}

main()
  .catch((error: unknown) => {
    console.error("Database seed failed:", error);

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
