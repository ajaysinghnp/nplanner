-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_organizational_unit_types" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "organizationId" TEXT NOT NULL,
    "parentTypeId" TEXT,
    "code" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameNe" TEXT,
    "shortNameEn" TEXT,
    "shortNameNe" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "organizational_unit_types_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "organizational_unit_types_parentTypeId_fkey" FOREIGN KEY ("parentTypeId") REFERENCES "organizational_unit_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_organizational_unit_types" ("code", "createdAt", "id", "nameEn", "nameNe", "organizationId", "shortNameEn", "shortNameNe", "sortOrder", "status", "updatedAt") SELECT "code", "createdAt", "id", "nameEn", "nameNe", "organizationId", "shortNameEn", "shortNameNe", "sortOrder", "status", "updatedAt" FROM "organizational_unit_types";
DROP TABLE "organizational_unit_types";
ALTER TABLE "new_organizational_unit_types" RENAME TO "organizational_unit_types";
CREATE INDEX "organizational_unit_types_organizationId_idx" ON "organizational_unit_types"("organizationId");
CREATE INDEX "organizational_unit_types_parentTypeId_idx" ON "organizational_unit_types"("parentTypeId");
CREATE UNIQUE INDEX "organizational_unit_types_organizationId_code_key" ON "organizational_unit_types"("organizationId", "code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
