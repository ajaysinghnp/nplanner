// tests/lib/organizations/organization.service.test.ts
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the repository layer
vi.mock("@/lib/organizations/organization.repository", () => ({
  createOrganizationRecord: vi.fn(),
  deleteOrganizationRecord: vi.fn(),
  findOrganizationByCode: vi.fn(),
  findOrganizationById: vi.fn(),
  findOrganizations: vi.fn(),
  getOrganizationDependencyCounts: vi.fn(),
  updateOrganizationRecord: vi.fn(),
}));

// Mock the schemas — pass-through parse, typed against the real input types
vi.mock("@/lib/organizations/organization.schemas", () => ({
  createOrganizationSchema: {
    parse: vi.fn((input: CreateOrganizationInput) => input),
  },
  updateOrganizationSchema: {
    parse: vi.fn((input: UpdateOrganizationInput) => input),
  },
}));

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
import {
  createOrganization,
  deleteOrganization,
  ensureOrganization,
  getOrganizationByCode,
  getOrganizationById,
  getOrganizations,
  updateOrganization,
} from "@/lib/organizations/organization.service";

// Derived directly from the repository's real return types — no manual
// Prisma type duplication, no dependence on the generated client's output path.
type Organization = NonNullable<Awaited<ReturnType<typeof findOrganizationById>>>;
type DependencyCounts = NonNullable<Awaited<ReturnType<typeof getOrganizationDependencyCounts>>>;

function makeOrganization(overrides: Partial<Organization> = {}): Organization {
  return {
    id: "clx0000000000000000000001",
    code: "NRB-01",
    nameEn: "Nepal Rastra Bank",
    nameNe: null,
    shortNameEn: null,
    shortNameNe: null,
    status: "ACTIVE",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

function makeDependencyCounts(
  overrides: Partial<DependencyCounts["_count"]> = {}
): DependencyCounts {
  return {
    _count: {
      organizationalUnitTypes: 0,
      organizationalUnits: 0,
      memberships: 0,
      ...overrides,
    },
  };
}

describe("organization.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getOrganizations", () => {
    it("delegates to findOrganizations", async () => {
      const orgs: Organization[] = [
        makeOrganization({ id: "org-1", code: "NRB-01" }),
        makeOrganization({ id: "org-2", code: "NRB-02" }),
      ];
      vi.mocked(findOrganizations).mockResolvedValue(orgs);

      const result = await getOrganizations();

      expect(findOrganizations).toHaveBeenCalledOnce();
      expect(result).toBe(orgs);
    });
  });

  describe("getOrganizationById", () => {
    it("delegates to findOrganizationById", async () => {
      const org = makeOrganization();
      vi.mocked(findOrganizationById).mockResolvedValue(org);

      const result = await getOrganizationById(org.id);

      expect(findOrganizationById).toHaveBeenCalledWith(org.id);
      expect(result).toBe(org);
    });
  });

  describe("getOrganizationByCode", () => {
    it("delegates to findOrganizationByCode", async () => {
      const org = makeOrganization();
      vi.mocked(findOrganizationByCode).mockResolvedValue(org);

      const result = await getOrganizationByCode(org.code);

      expect(findOrganizationByCode).toHaveBeenCalledWith(org.code);
      expect(result).toBe(org);
    });
  });

  describe("createOrganization", () => {
    const input: CreateOrganizationInput = {
      code: "NRB-01",
      nameEn: "Nepal Rastra Bank",
      nameNe: "",
      shortNameEn: "",
      shortNameNe: "",
    };

    it("validates input, checks for a duplicate code, and creates the record", async () => {
      const created = makeOrganization({ code: input.code, nameEn: input.nameEn });

      vi.mocked(findOrganizationByCode).mockResolvedValue(null);
      vi.mocked(createOrganizationRecord).mockResolvedValue(created);

      const result = await createOrganization(input);

      expect(createOrganizationSchema.parse).toHaveBeenCalledWith(input);
      expect(findOrganizationByCode).toHaveBeenCalledWith(input.code);
      expect(createOrganizationRecord).toHaveBeenCalledWith(input);
      expect(result).toBe(created);
    });

    it("throws if an organization with the same code already exists", async () => {
      vi.mocked(findOrganizationByCode).mockResolvedValue(makeOrganization({ code: input.code }));

      await expect(createOrganization(input)).rejects.toThrow(
        `An organization with the code "${input.code}" already exists.`
      );
      expect(createOrganizationRecord).not.toHaveBeenCalled();
    });
  });

  describe("ensureOrganization", () => {
    const input: CreateOrganizationInput = {
      code: "NRB-01",
      nameEn: "Nepal Rastra Bank",
      nameNe: "",
      shortNameEn: "",
      shortNameNe: "",
    };

    it("returns the existing organization without creating a new one", async () => {
      const existing = makeOrganization({ code: input.code });
      vi.mocked(findOrganizationByCode).mockResolvedValue(existing);

      const result = await ensureOrganization(input);

      expect(result).toBe(existing);
      expect(createOrganizationRecord).not.toHaveBeenCalled();
    });

    it("creates a new organization when none exists", async () => {
      const created = makeOrganization({ code: input.code });
      vi.mocked(findOrganizationByCode).mockResolvedValue(null);
      vi.mocked(createOrganizationRecord).mockResolvedValue(created);

      const result = await ensureOrganization(input);

      expect(createOrganizationRecord).toHaveBeenCalledWith(input);
      expect(result).toBe(created);
    });
  });

  describe("updateOrganization", () => {
    const input: UpdateOrganizationInput = {
      id: "clx0000000000000000000001",
      nameEn: "Nepal Rastra Bank Updated",
      nameNe: "",
      shortNameEn: "",
      shortNameNe: "",
    };

    it("validates input, confirms existence, and updates the record", async () => {
      const existing = makeOrganization({ id: input.id, nameEn: "Old Name" });
      const updated = makeOrganization({ id: input.id, nameEn: input.nameEn });

      vi.mocked(findOrganizationById).mockResolvedValue(existing);
      vi.mocked(updateOrganizationRecord).mockResolvedValue(updated);

      const result = await updateOrganization(input);

      expect(updateOrganizationSchema.parse).toHaveBeenCalledWith(input);
      expect(findOrganizationById).toHaveBeenCalledWith(input.id);
      expect(updateOrganizationRecord).toHaveBeenCalledWith(input);
      expect(result).toBe(updated);
    });

    it("throws if the organization does not exist", async () => {
      vi.mocked(findOrganizationById).mockResolvedValue(null);

      await expect(updateOrganization(input)).rejects.toThrow("Organization not found.");
      expect(updateOrganizationRecord).not.toHaveBeenCalled();
    });
  });

  describe("deleteOrganization", () => {
    it("throws if the organization does not exist", async () => {
      vi.mocked(findOrganizationById).mockResolvedValue(null);

      await expect(deleteOrganization("missing-id", "ABC")).rejects.toThrow(
        "Organization not found."
      );
    });

    it("throws if the confirmation code does not match", async () => {
      const org = makeOrganization({ code: "NRB-01" });
      vi.mocked(findOrganizationById).mockResolvedValue(org);

      await expect(deleteOrganization(org.id, "WRONG-CODE")).rejects.toThrow(
        "The entered organization code does not match. The organization was not deleted."
      );
      expect(getOrganizationDependencyCounts).not.toHaveBeenCalled();
    });

    it("throws if the dependency lookup returns nothing", async () => {
      const org = makeOrganization({ code: "NRB-01" });
      vi.mocked(findOrganizationById).mockResolvedValue(org);
      vi.mocked(getOrganizationDependencyCounts).mockResolvedValue(null);

      await expect(deleteOrganization(org.id, org.code)).rejects.toThrow("Organization not found.");
    });

    it("throws a descriptive error listing all dependency types when present", async () => {
      const org = makeOrganization({ code: "NRB-01" });
      vi.mocked(findOrganizationById).mockResolvedValue(org);
      vi.mocked(getOrganizationDependencyCounts).mockResolvedValue(
        makeDependencyCounts({
          organizationalUnitTypes: 2,
          organizationalUnits: 1,
          memberships: 3,
        })
      );

      await expect(deleteOrganization(org.id, org.code)).rejects.toThrow(
        "This organization cannot be deleted because it has related records: 2 organizational unit types, 1 organizational unit, 3 memberships."
      );
      expect(deleteOrganizationRecord).not.toHaveBeenCalled();
    });

    it("uses correct singular/plural wording for a single dependency", async () => {
      const org = makeOrganization({ code: "NRB-01" });
      vi.mocked(findOrganizationById).mockResolvedValue(org);
      vi.mocked(getOrganizationDependencyCounts).mockResolvedValue(
        makeDependencyCounts({ organizationalUnits: 1 })
      );

      await expect(deleteOrganization(org.id, org.code)).rejects.toThrow(
        "related records: 1 organizational unit."
      );
    });

    it("deletes the organization when there are no dependencies", async () => {
      const org = makeOrganization({ code: "NRB-01" });
      vi.mocked(findOrganizationById).mockResolvedValue(org);
      vi.mocked(getOrganizationDependencyCounts).mockResolvedValue(makeDependencyCounts());
      vi.mocked(deleteOrganizationRecord).mockResolvedValue(org);

      const result = await deleteOrganization(org.id, org.code);

      expect(deleteOrganizationRecord).toHaveBeenCalledWith(org.id);
      expect(result).toBe(org);
    });
  });
});
