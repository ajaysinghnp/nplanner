// tests/lib/organizations/units/organizational-unit-type.service.test.ts
import { beforeEach, describe, expect, it, vi } from "vitest";

import { RecordStatus } from "@/generated/prisma/client";

vi.mock("@/lib/organizations/units/organizational-unit-type.repository", () => ({
  countOrganizationalUnitsByUnitTypeId: vi.fn(),
  createOrganizationalUnitTypeRecord: vi.fn(),
  deleteOrganizationalUnitTypeRecord: vi.fn(),
  findOrganizationalUnitTypeById: vi.fn(),
  findOrganizationalUnitTypeByOrganizationIdAndCode: vi.fn(),
  findOrganizationalUnitTypesByOrganizationId: vi.fn(),
  updateOrganizationalUnitTypeRecord: vi.fn(),
}));

vi.mock("@/lib/organizations/units/organizational-unit-type.schemas", () => ({
  createOrganizationalUnitTypeSchema: {
    parse: vi.fn((input: CreateOrganizationalUnitTypeInput): CreateOrganizationalUnitTypeData => ({
      organizationId: input.organizationId,
      code: input.code,
      parentTypeId: input.parentTypeId || undefined,
      nameEn: input.nameEn,
      nameNe: input.nameNe ?? "",
      shortNameEn: input.shortNameEn ?? "",
      shortNameNe: input.shortNameNe ?? "",
      sortOrder: Number(input.sortOrder),
      status: input.status as RecordStatus,
    })),
  },
  updateOrganizationalUnitTypeSchema: {
    parse: vi.fn((input: UpdateOrganizationalUnitTypeInput): UpdateOrganizationalUnitTypeData => ({
      id: input.id,
      parentTypeId: input.parentTypeId || undefined,
      nameEn: input.nameEn,
      nameNe: input.nameNe ?? "",
      shortNameEn: input.shortNameEn ?? "",
      shortNameNe: input.shortNameNe ?? "",
      sortOrder: Number(input.sortOrder),
      status: input.status as RecordStatus,
    })),
  },
}));

import {
  countOrganizationalUnitsByUnitTypeId,
  createOrganizationalUnitTypeRecord,
  deleteOrganizationalUnitTypeRecord,
  findOrganizationalUnitTypeById,
  findOrganizationalUnitTypeByOrganizationIdAndCode,
  findOrganizationalUnitTypesByOrganizationId,
  updateOrganizationalUnitTypeRecord,
} from "@/lib/organizations/units/organizational-unit-type.repository";
import {
  type CreateOrganizationalUnitTypeData,
  createOrganizationalUnitTypeSchema,
  type CreateOrganizationalUnitTypeInput,
  type UpdateOrganizationalUnitTypeData,
  updateOrganizationalUnitTypeSchema,
  type UpdateOrganizationalUnitTypeInput,
} from "@/lib/organizations/units/organizational-unit-type.schemas";
import {
  createOrganizationalUnitType,
  deleteOrganizationalUnitType,
  getOrganizationalUnitTypeById,
  getOrganizationalUnitTypes,
  updateOrganizationalUnitType,
} from "@/lib/organizations/units/organizational-unit-type.service";

// Mock the repository layer
vi.mock("./organizational-unit-type.repository", () => ({
  countOrganizationalUnitsByUnitTypeId: vi.fn(),
  createOrganizationalUnitTypeRecord: vi.fn(),
  deleteOrganizationalUnitTypeRecord: vi.fn(),
  findOrganizationalUnitTypeById: vi.fn(),
  findOrganizationalUnitTypeByOrganizationIdAndCode: vi.fn(),
  findOrganizationalUnitTypesByOrganizationId: vi.fn(),
  updateOrganizationalUnitTypeRecord: vi.fn(),
}));

// Mock schemas — parse must reflect the REAL input -> output transformation:
// sortOrder: string | number -> number, status: string -> RecordStatus,
// parentTypeId: "" | undefined -> undefined
vi.mock("./organizational-unit-type.schemas", () => ({
  createOrganizationalUnitTypeSchema: {
    parse: vi.fn((input: CreateOrganizationalUnitTypeInput): CreateOrganizationalUnitTypeData => ({
      organizationId: input.organizationId,
      code: input.code,
      parentTypeId: input.parentTypeId || undefined,
      nameEn: input.nameEn,
      nameNe: input.nameNe ?? "",
      shortNameEn: input.shortNameEn ?? "",
      shortNameNe: input.shortNameNe ?? "",
      sortOrder: Number(input.sortOrder),
      status: input.status as RecordStatus,
    })),
  },
  updateOrganizationalUnitTypeSchema: {
    parse: vi.fn((input: UpdateOrganizationalUnitTypeInput): UpdateOrganizationalUnitTypeData => ({
      id: input.id,
      parentTypeId: input.parentTypeId || undefined,
      nameEn: input.nameEn,
      nameNe: input.nameNe ?? "",
      shortNameEn: input.shortNameEn ?? "",
      shortNameNe: input.shortNameNe ?? "",
      sortOrder: Number(input.sortOrder),
      status: input.status as RecordStatus,
    })),
  },
}));

// Derived from the repository's real return type — no manual Prisma type duplication
type OrganizationalUnitType = NonNullable<
  Awaited<ReturnType<typeof findOrganizationalUnitTypeById>>
>;

function makeUnitType(overrides: Partial<OrganizationalUnitType> = {}): OrganizationalUnitType {
  return {
    id: "ut-1",
    organizationId: "org-1",
    parentTypeId: null,
    code: "DEPT",
    nameEn: "Department",
    nameNe: null,
    shortNameEn: null,
    shortNameNe: null,
    sortOrder: 0,
    status: RecordStatus.ACTIVE,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

const baseCreateInput: CreateOrganizationalUnitTypeInput = {
  organizationId: "org-1",
  code: "DEPT",
  nameEn: "Department",
  sortOrder: 0,
  status: RecordStatus.ACTIVE,
};

const baseUpdateInput: UpdateOrganizationalUnitTypeInput = {
  id: "ut-1",
  nameEn: "Department Updated",
  sortOrder: 1,
  status: RecordStatus.ACTIVE,
};

describe("organizational-unit-type.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getOrganizationalUnitTypes", () => {
    it("delegates to findOrganizationalUnitTypesByOrganizationId", async () => {
      const unitTypes = [makeUnitType({ id: "ut-1" }), makeUnitType({ id: "ut-2" })];
      vi.mocked(findOrganizationalUnitTypesByOrganizationId).mockResolvedValue(unitTypes);

      const result = await getOrganizationalUnitTypes("org-1");

      expect(findOrganizationalUnitTypesByOrganizationId).toHaveBeenCalledWith("org-1");
      expect(result).toBe(unitTypes);
    });
  });

  describe("getOrganizationalUnitTypeById", () => {
    it("delegates to findOrganizationalUnitTypeById", async () => {
      const unitType = makeUnitType();
      vi.mocked(findOrganizationalUnitTypeById).mockResolvedValue(unitType);

      const result = await getOrganizationalUnitTypeById("ut-1");

      expect(findOrganizationalUnitTypeById).toHaveBeenCalledWith("ut-1");
      expect(result).toBe(unitType);
    });
  });

  describe("createOrganizationalUnitType", () => {
    it("validates input, checks for a duplicate code, and creates the record (no parent)", async () => {
      const created = makeUnitType();
      vi.mocked(findOrganizationalUnitTypeByOrganizationIdAndCode).mockResolvedValue(null);
      vi.mocked(createOrganizationalUnitTypeRecord).mockResolvedValue(created);

      const result = await createOrganizationalUnitType(baseCreateInput);

      expect(createOrganizationalUnitTypeSchema.parse).toHaveBeenCalledWith(baseCreateInput);
      expect(findOrganizationalUnitTypeByOrganizationIdAndCode).toHaveBeenCalledWith(
        "org-1",
        "DEPT"
      );
      expect(findOrganizationalUnitTypeById).not.toHaveBeenCalled();
      expect(createOrganizationalUnitTypeRecord).toHaveBeenCalled();
      expect(result).toBe(created);
    });

    it("throws if a unit type with the same code already exists in the organization", async () => {
      vi.mocked(findOrganizationalUnitTypeByOrganizationIdAndCode).mockResolvedValue(
        makeUnitType()
      );

      await expect(createOrganizationalUnitType(baseCreateInput)).rejects.toThrow(
        'An organizational unit type with the code "DEPT" already exists in this organization.'
      );
      expect(createOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });

    it("creates successfully when a valid parentTypeId in the same organization is given", async () => {
      const parent = makeUnitType({ id: "ut-parent", organizationId: "org-1" });
      const created = makeUnitType({ parentTypeId: "ut-parent" });

      vi.mocked(findOrganizationalUnitTypeByOrganizationIdAndCode).mockResolvedValue(null);
      vi.mocked(findOrganizationalUnitTypeById).mockResolvedValue(parent);
      vi.mocked(createOrganizationalUnitTypeRecord).mockResolvedValue(created);

      const result = await createOrganizationalUnitType({
        ...baseCreateInput,
        parentTypeId: "ut-parent",
      });

      expect(findOrganizationalUnitTypeById).toHaveBeenCalledWith("ut-parent");
      expect(result).toBe(created);
    });

    it("throws if the given parentTypeId does not exist", async () => {
      vi.mocked(findOrganizationalUnitTypeByOrganizationIdAndCode).mockResolvedValue(null);
      vi.mocked(findOrganizationalUnitTypeById).mockResolvedValue(null);

      await expect(
        createOrganizationalUnitType({ ...baseCreateInput, parentTypeId: "missing-parent" })
      ).rejects.toThrow("The selected parent organizational unit type was not found.");
      expect(createOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });

    it("throws if the given parentTypeId belongs to a different organization", async () => {
      const parent = makeUnitType({ id: "ut-parent", organizationId: "org-2" });
      vi.mocked(findOrganizationalUnitTypeByOrganizationIdAndCode).mockResolvedValue(null);
      vi.mocked(findOrganizationalUnitTypeById).mockResolvedValue(parent);

      await expect(
        createOrganizationalUnitType({ ...baseCreateInput, parentTypeId: "ut-parent" })
      ).rejects.toThrow(
        "The selected parent organizational unit type belongs to another organization."
      );
      expect(createOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });
  });

  describe("updateOrganizationalUnitType", () => {
    it("validates input, confirms existence, and updates the record (no parent)", async () => {
      const existing = makeUnitType({ id: "ut-1", organizationId: "org-1" });
      const updated = makeUnitType({ id: "ut-1", nameEn: "Department Updated", sortOrder: 1 });

      vi.mocked(findOrganizationalUnitTypeById).mockResolvedValue(existing);
      vi.mocked(updateOrganizationalUnitTypeRecord).mockResolvedValue(updated);

      const result = await updateOrganizationalUnitType(baseUpdateInput);

      expect(updateOrganizationalUnitTypeSchema.parse).toHaveBeenCalledWith(baseUpdateInput);
      expect(findOrganizationalUnitTypeById).toHaveBeenCalledWith("ut-1");
      expect(updateOrganizationalUnitTypeRecord).toHaveBeenCalled();
      expect(result).toBe(updated);
    });

    it("throws if the unit type does not exist", async () => {
      vi.mocked(findOrganizationalUnitTypeById).mockResolvedValue(null);

      await expect(updateOrganizationalUnitType(baseUpdateInput)).rejects.toThrow(
        "Organizational unit type was not found."
      );
      expect(updateOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });

    it("throws if parentTypeId is set to itself", async () => {
      const existing = makeUnitType({ id: "ut-1", organizationId: "org-1" });
      vi.mocked(findOrganizationalUnitTypeById).mockResolvedValue(existing);

      await expect(
        updateOrganizationalUnitType({ ...baseUpdateInput, id: "ut-1", parentTypeId: "ut-1" })
      ).rejects.toThrow("An organizational unit type cannot be its own parent.");
      expect(updateOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });

    it("throws if the given parentTypeId does not exist", async () => {
      const existing = makeUnitType({ id: "ut-1", organizationId: "org-1" });
      vi.mocked(findOrganizationalUnitTypeById)
        .mockResolvedValueOnce(existing) // lookup of the record being updated
        .mockResolvedValueOnce(null); // lookup of the proposed parent

      await expect(
        updateOrganizationalUnitType({
          ...baseUpdateInput,
          id: "ut-1",
          parentTypeId: "missing-parent",
        })
      ).rejects.toThrow("The selected parent organizational unit type was not found.");
      expect(updateOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });

    it("throws if the given parentTypeId belongs to a different organization", async () => {
      const existing = makeUnitType({ id: "ut-1", organizationId: "org-1" });
      const otherOrgParent = makeUnitType({ id: "ut-parent", organizationId: "org-2" });

      vi.mocked(findOrganizationalUnitTypeById)
        .mockResolvedValueOnce(existing)
        .mockResolvedValueOnce(otherOrgParent);

      await expect(
        updateOrganizationalUnitType({ ...baseUpdateInput, id: "ut-1", parentTypeId: "ut-parent" })
      ).rejects.toThrow(
        "The selected parent organizational unit type belongs to another organization."
      );
      expect(updateOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });

    it("throws on a direct circular hierarchy (parent's parent is the current record)", async () => {
      // A (ut-1, being updated) tries to set its parent to B (ut-2),
      // but B's parent is already A -> circular
      const recordBeingUpdated = makeUnitType({
        id: "ut-1",
        organizationId: "org-1",
        parentTypeId: null,
      });
      const proposedParent = makeUnitType({
        id: "ut-2",
        organizationId: "org-1",
        parentTypeId: "ut-1",
      });

      // 1. Direct circular hierarchy test
      vi.mocked(findOrganizationalUnitTypeById).mockImplementation(((id: string) => {
        if (id === "ut-1") return Promise.resolve(recordBeingUpdated);
        if (id === "ut-2") return Promise.resolve(proposedParent);
        return Promise.resolve(null);
      }) as typeof findOrganizationalUnitTypeById);

      await expect(
        updateOrganizationalUnitType({ ...baseUpdateInput, id: "ut-1", parentTypeId: "ut-2" })
      ).rejects.toThrow(
        "The selected parent organizational unit type would create a circular hierarchy."
      );
      expect(updateOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });

    it("throws on a deeper circular hierarchy (walks multiple ancestors)", async () => {
      // A (ut-1) tries to set its parent to C (ut-3).
      // C's parent is B (ut-2), B's parent is A (ut-1) -> circular, found two hops up
      const recordBeingUpdated = makeUnitType({
        id: "ut-1",
        organizationId: "org-1",
        parentTypeId: null,
      });
      const middleAncestor = makeUnitType({
        id: "ut-2",
        organizationId: "org-1",
        parentTypeId: "ut-1",
      });
      const proposedParent = makeUnitType({
        id: "ut-3",
        organizationId: "org-1",
        parentTypeId: "ut-2",
      });

      // 2. Deeper circular hierarchy test
      vi.mocked(findOrganizationalUnitTypeById).mockImplementation(((id: string) => {
        if (id === "ut-1") return Promise.resolve(recordBeingUpdated);
        if (id === "ut-2") return Promise.resolve(middleAncestor);
        if (id === "ut-3") return Promise.resolve(proposedParent);
        return Promise.resolve(null);
      }) as typeof findOrganizationalUnitTypeById);

      await expect(
        updateOrganizationalUnitType({ ...baseUpdateInput, id: "ut-1", parentTypeId: "ut-3" })
      ).rejects.toThrow(
        "The selected parent organizational unit type would create a circular hierarchy."
      );
      expect(updateOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });

    it("updates successfully with a valid, non-circular parentTypeId", async () => {
      const recordBeingUpdated = makeUnitType({ id: "ut-1", organizationId: "org-1" });
      const validParent = makeUnitType({
        id: "ut-2",
        organizationId: "org-1",
        parentTypeId: null,
      });
      const updated = makeUnitType({ id: "ut-1", parentTypeId: "ut-2" });

      // 3. Successful update with valid parentTypeId
      vi.mocked(findOrganizationalUnitTypeById).mockImplementation(((id: string) => {
        if (id === "ut-1") return Promise.resolve(recordBeingUpdated);
        if (id === "ut-2") return Promise.resolve(validParent);
        return Promise.resolve(null);
      }) as typeof findOrganizationalUnitTypeById);
      vi.mocked(updateOrganizationalUnitTypeRecord).mockResolvedValue(updated);

      const result = await updateOrganizationalUnitType({
        ...baseUpdateInput,
        id: "ut-1",
        parentTypeId: "ut-2",
      });

      expect(result).toBe(updated);
    });
  });

  describe("deleteOrganizationalUnitType", () => {
    it("throws if the trimmed id is empty", async () => {
      await expect(deleteOrganizationalUnitType("   ", "DEPT")).rejects.toThrow(
        "Organizational unit type ID is required."
      );
      expect(findOrganizationalUnitTypeById).not.toHaveBeenCalled();
    });

    it("throws if the trimmed confirmation code is empty", async () => {
      await expect(deleteOrganizationalUnitType("ut-1", "   ")).rejects.toThrow(
        "Unit type code confirmation is required."
      );
      expect(findOrganizationalUnitTypeById).not.toHaveBeenCalled();
    });

    it("throws if the unit type does not exist", async () => {
      vi.mocked(findOrganizationalUnitTypeById).mockResolvedValue(null);

      await expect(deleteOrganizationalUnitType("ut-1", "DEPT")).rejects.toThrow(
        "Organizational unit type was not found."
      );
    });

    it("throws if the confirmation code does not match", async () => {
      vi.mocked(findOrganizationalUnitTypeById).mockResolvedValue(makeUnitType({ code: "DEPT" }));

      await expect(deleteOrganizationalUnitType("ut-1", "WRONG")).rejects.toThrow(
        "The entered unit type code does not match."
      );
      expect(countOrganizationalUnitsByUnitTypeId).not.toHaveBeenCalled();
    });

    it("throws if organizational units are still assigned to this type", async () => {
      vi.mocked(findOrganizationalUnitTypeById).mockResolvedValue(
        makeUnitType({ id: "ut-1", code: "DEPT" })
      );
      vi.mocked(countOrganizationalUnitsByUnitTypeId).mockResolvedValue(3);

      await expect(deleteOrganizationalUnitType("ut-1", "DEPT")).rejects.toThrow(
        "This organizational unit type cannot be deleted because it is assigned to existing organizational units. Archive it instead."
      );
      expect(deleteOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });

    it("deletes the unit type when no units are assigned, trimming id/code first", async () => {
      const unitType = makeUnitType({ id: "ut-1", code: "DEPT" });
      vi.mocked(findOrganizationalUnitTypeById).mockResolvedValue(unitType);
      vi.mocked(countOrganizationalUnitsByUnitTypeId).mockResolvedValue(0);
      vi.mocked(deleteOrganizationalUnitTypeRecord).mockResolvedValue(unitType);

      const result = await deleteOrganizationalUnitType("  ut-1  ", "  DEPT  ");

      expect(findOrganizationalUnitTypeById).toHaveBeenCalledWith("ut-1");
      expect(countOrganizationalUnitsByUnitTypeId).toHaveBeenCalledWith("ut-1");
      expect(deleteOrganizationalUnitTypeRecord).toHaveBeenCalledWith("ut-1");
      expect(result).toBe(unitType);
    });
  });
});
