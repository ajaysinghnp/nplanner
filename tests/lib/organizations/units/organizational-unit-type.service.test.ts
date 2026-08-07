import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  findOrganizationalUnitTypesByOrganizationId: vi.fn(),
  findOrganizationalUnitTypeById: vi.fn(),
  findOrganizationalUnitTypeByOrganizationIdAndCode: vi.fn(),

  countChildOrganizationalUnitTypes: vi.fn(),
  countOrganizationalUnitsByUnitTypeId: vi.fn(),

  createOrganizationalUnitTypeRecord: vi.fn(),
  updateOrganizationalUnitTypeRecord: vi.fn(),
  deleteOrganizationalUnitTypeRecord: vi.fn(),
}));

vi.mock("@/lib/organizations/units/organizational-unit-type.repository", () => ({
  findOrganizationalUnitTypesByOrganizationId: mocks.findOrganizationalUnitTypesByOrganizationId,

  findOrganizationalUnitTypeById: mocks.findOrganizationalUnitTypeById,

  findOrganizationalUnitTypeByOrganizationIdAndCode:
    mocks.findOrganizationalUnitTypeByOrganizationIdAndCode,

  countChildOrganizationalUnitTypes: mocks.countChildOrganizationalUnitTypes,

  countOrganizationalUnitsByUnitTypeId: mocks.countOrganizationalUnitsByUnitTypeId,

  createOrganizationalUnitTypeRecord: mocks.createOrganizationalUnitTypeRecord,

  updateOrganizationalUnitTypeRecord: mocks.updateOrganizationalUnitTypeRecord,

  deleteOrganizationalUnitTypeRecord: mocks.deleteOrganizationalUnitTypeRecord,
}));

const {
  getOrganizationalUnitTypes,
  getOrganizationalUnitTypeById,
  getOrganizationalUnitTypeByOrganizationIdAndCode,
  createOrganizationalUnitType,
  updateOrganizationalUnitType,
  deleteOrganizationalUnitType,
} = await import("@/lib/organizations/units/organizational-unit-type.service");

const organizationId = "organization-1";
const anotherOrganizationId = "organization-2";

const departmentTypeId = "unit-type-department";
const sectionTypeId = "unit-type-section";
const teamTypeId = "unit-type-team";

function makeUnitType(overrides: Record<string, unknown> = {}) {
  return {
    id: departmentTypeId,
    organizationId,
    parentTypeId: null,
    code: "DEPARTMENT",
    nameEn: "Department",
    nameNe: null,
    shortNameEn: "Dept.",
    shortNameNe: null,
    sortOrder: 0,
    status: "ACTIVE" as const,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

const baseCreateInput = {
  organizationId,
  code: "DEPARTMENT",
  nameEn: "Department",
  nameNe: "",
  shortNameEn: "Dept.",
  shortNameNe: "",
  sortOrder: 0,
  parentTypeId: undefined,
  status: "ACTIVE" as const,
};

const baseUpdateInput = {
  id: departmentTypeId,
  nameEn: "Department Updated",
  nameNe: "",
  shortNameEn: "Dept.",
  shortNameNe: "",
  sortOrder: 1,
  parentTypeId: undefined,
  status: "ACTIVE" as const,
};

describe("organizational-unit-type.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.findOrganizationalUnitTypesByOrganizationId.mockResolvedValue([]);

    mocks.findOrganizationalUnitTypeById.mockResolvedValue(null);

    mocks.findOrganizationalUnitTypeByOrganizationIdAndCode.mockResolvedValue(null);

    mocks.countChildOrganizationalUnitTypes.mockResolvedValue(0);

    mocks.countOrganizationalUnitsByUnitTypeId.mockResolvedValue(0);

    mocks.createOrganizationalUnitTypeRecord.mockImplementation(async (data) => ({
      id: "created-unit-type",
      ...data,
    }));

    mocks.updateOrganizationalUnitTypeRecord.mockImplementation(async (data) => ({
      ...makeUnitType(),
      ...data,
    }));

    mocks.deleteOrganizationalUnitTypeRecord.mockImplementation(async (id) =>
      makeUnitType({
        id,
      })
    );
  });

  describe("getOrganizationalUnitTypes", () => {
    it("delegates to the repository with the organization ID", async () => {
      const unitTypes = [
        makeUnitType({
          id: departmentTypeId,
          code: "DEPARTMENT",
        }),
        makeUnitType({
          id: sectionTypeId,
          code: "SECTION",
          parentTypeId: departmentTypeId,
        }),
      ];

      mocks.findOrganizationalUnitTypesByOrganizationId.mockResolvedValue(unitTypes);

      const result = await getOrganizationalUnitTypes(organizationId);

      expect(mocks.findOrganizationalUnitTypesByOrganizationId).toHaveBeenCalledOnce();

      expect(mocks.findOrganizationalUnitTypesByOrganizationId).toHaveBeenCalledWith(
        organizationId
      );

      expect(result).toBe(unitTypes);
    });
  });

  describe("getOrganizationalUnitTypeById", () => {
    it("delegates to the repository with the unit type ID", async () => {
      const unitType = makeUnitType();

      mocks.findOrganizationalUnitTypeById.mockResolvedValue(unitType);

      const result = await getOrganizationalUnitTypeById(departmentTypeId);

      expect(mocks.findOrganizationalUnitTypeById).toHaveBeenCalledOnce();

      expect(mocks.findOrganizationalUnitTypeById).toHaveBeenCalledWith(departmentTypeId);

      expect(result).toBe(unitType);
    });
  });

  describe("getOrganizationalUnitTypeByOrganizationIdAndCode", () => {
    it("delegates to the repository with organization ID and code", async () => {
      const unitType = makeUnitType();

      mocks.findOrganizationalUnitTypeByOrganizationIdAndCode.mockResolvedValue(unitType);

      const result = await getOrganizationalUnitTypeByOrganizationIdAndCode(
        organizationId,
        "DEPARTMENT"
      );

      expect(mocks.findOrganizationalUnitTypeByOrganizationIdAndCode).toHaveBeenCalledOnce();

      expect(mocks.findOrganizationalUnitTypeByOrganizationIdAndCode).toHaveBeenCalledWith(
        organizationId,
        "DEPARTMENT"
      );

      expect(result).toBe(unitType);
    });
  });

  describe("createOrganizationalUnitType", () => {
    it("validates input, checks duplicate code, and creates a root unit type", async () => {
      const result = await createOrganizationalUnitType(baseCreateInput);

      expect(mocks.findOrganizationalUnitTypeByOrganizationIdAndCode).toHaveBeenCalledWith(
        organizationId,
        "DEPARTMENT"
      );

      expect(mocks.findOrganizationalUnitTypeById).not.toHaveBeenCalled();

      expect(mocks.createOrganizationalUnitTypeRecord).toHaveBeenCalledWith(baseCreateInput);

      expect(result).toMatchObject({
        id: "created-unit-type",
        organizationId,
        code: "DEPARTMENT",
        nameEn: "Department",
      });
    });

    it("throws if a unit type with the same code already exists in the organization", async () => {
      mocks.findOrganizationalUnitTypeByOrganizationIdAndCode.mockResolvedValue(makeUnitType());

      await expect(createOrganizationalUnitType(baseCreateInput)).rejects.toThrow(
        'An organizational unit type with the code "DEPARTMENT" already exists in this organization.'
      );

      expect(mocks.createOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });

    it("creates successfully when a valid parentTypeId in the same organization is given", async () => {
      const parentType = makeUnitType({
        id: departmentTypeId,
        code: "DEPARTMENT",
      });

      mocks.findOrganizationalUnitTypeById.mockResolvedValue(parentType);

      await createOrganizationalUnitType({
        ...baseCreateInput,
        code: "SECTION",
        nameEn: "Section",
        parentTypeId: departmentTypeId,
      });

      expect(mocks.findOrganizationalUnitTypeById).toHaveBeenCalledWith(departmentTypeId);

      expect(mocks.createOrganizationalUnitTypeRecord).toHaveBeenCalledWith(
        expect.objectContaining({
          organizationId,
          code: "SECTION",
          parentTypeId: departmentTypeId,
        })
      );
    });

    it("throws if the given parentTypeId does not exist", async () => {
      mocks.findOrganizationalUnitTypeById.mockResolvedValue(null);

      await expect(
        createOrganizationalUnitType({
          ...baseCreateInput,
          parentTypeId: departmentTypeId,
        })
      ).rejects.toThrow("The selected parent organizational unit type was not found.");

      expect(mocks.createOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });

    it("throws if the given parentTypeId belongs to a different organization", async () => {
      mocks.findOrganizationalUnitTypeById.mockResolvedValue(
        makeUnitType({
          id: departmentTypeId,
          organizationId: anotherOrganizationId,
        })
      );

      await expect(
        createOrganizationalUnitType({
          ...baseCreateInput,
          parentTypeId: departmentTypeId,
        })
      ).rejects.toThrow(
        "The selected parent organizational unit type belongs to another organization."
      );

      expect(mocks.createOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });
  });

  describe("updateOrganizationalUnitType", () => {
    it("validates input, confirms existence, and updates without a parent", async () => {
      const existingType = makeUnitType({
        id: departmentTypeId,
      });

      const updatedType = makeUnitType({
        id: departmentTypeId,
        nameEn: "Department Updated",
        sortOrder: 1,
      });

      mocks.findOrganizationalUnitTypeById.mockResolvedValue(existingType);

      mocks.updateOrganizationalUnitTypeRecord.mockResolvedValue(updatedType);

      const result = await updateOrganizationalUnitType(baseUpdateInput);

      expect(mocks.findOrganizationalUnitTypeById).toHaveBeenCalledWith(departmentTypeId);

      expect(mocks.updateOrganizationalUnitTypeRecord).toHaveBeenCalledWith(baseUpdateInput);

      expect(result).toBe(updatedType);
    });

    it("throws if the unit type does not exist", async () => {
      mocks.findOrganizationalUnitTypeById.mockResolvedValue(null);

      await expect(updateOrganizationalUnitType(baseUpdateInput)).rejects.toThrow(
        "Organizational unit type was not found."
      );

      expect(mocks.updateOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });

    it("throws if parentTypeId is set to itself", async () => {
      mocks.findOrganizationalUnitTypeById.mockImplementation(async (id: string) => {
        if (id === departmentTypeId) {
          return makeUnitType({
            id: departmentTypeId,
          });
        }

        return null;
      });

      await expect(
        updateOrganizationalUnitType({
          ...baseUpdateInput,
          parentTypeId: departmentTypeId,
        })
      ).rejects.toThrow("An organizational unit type cannot be its own parent.");

      expect(mocks.updateOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });

    it("throws if the given parentTypeId does not exist", async () => {
      const existingType = makeUnitType({
        id: sectionTypeId,
        parentTypeId: null,
      });

      mocks.findOrganizationalUnitTypeById
        .mockResolvedValueOnce(existingType)
        .mockResolvedValueOnce(null);

      await expect(
        updateOrganizationalUnitType({
          ...baseUpdateInput,
          id: sectionTypeId,
          parentTypeId: departmentTypeId,
        })
      ).rejects.toThrow("The selected parent organizational unit type was not found.");

      expect(mocks.updateOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });

    it("throws if the given parentTypeId belongs to another organization", async () => {
      const existingType = makeUnitType({
        id: sectionTypeId,
      });

      const otherOrganizationType = makeUnitType({
        id: departmentTypeId,
        organizationId: anotherOrganizationId,
      });

      mocks.findOrganizationalUnitTypeById
        .mockResolvedValueOnce(existingType)
        .mockResolvedValueOnce(otherOrganizationType);

      await expect(
        updateOrganizationalUnitType({
          ...baseUpdateInput,
          id: sectionTypeId,
          parentTypeId: departmentTypeId,
        })
      ).rejects.toThrow(
        "The selected parent organizational unit type belongs to another organization."
      );

      expect(mocks.updateOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });

    it("throws on a direct circular hierarchy", async () => {
      const currentType = makeUnitType({
        id: departmentTypeId,
        parentTypeId: null,
      });

      const parentType = makeUnitType({
        id: sectionTypeId,
        parentTypeId: departmentTypeId,
      });

      mocks.findOrganizationalUnitTypeById.mockImplementation(async (id: string) => {
        if (id === departmentTypeId) {
          return currentType;
        }

        if (id === sectionTypeId) {
          return parentType;
        }

        return null;
      });

      await expect(
        updateOrganizationalUnitType({
          ...baseUpdateInput,
          parentTypeId: sectionTypeId,
        })
      ).rejects.toThrow(
        "The selected parent organizational unit type would create a circular hierarchy."
      );

      expect(mocks.updateOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });

    it("throws on a deeper circular hierarchy", async () => {
      const currentType = makeUnitType({
        id: departmentTypeId,
        parentTypeId: null,
      });

      const middleType = makeUnitType({
        id: sectionTypeId,
        parentTypeId: departmentTypeId,
      });

      const proposedParentType = makeUnitType({
        id: teamTypeId,
        parentTypeId: sectionTypeId,
      });

      mocks.findOrganizationalUnitTypeById.mockImplementation(async (id: string) => {
        if (id === departmentTypeId) {
          return currentType;
        }

        if (id === sectionTypeId) {
          return middleType;
        }

        if (id === teamTypeId) {
          return proposedParentType;
        }

        return null;
      });

      await expect(
        updateOrganizationalUnitType({
          ...baseUpdateInput,
          parentTypeId: teamTypeId,
        })
      ).rejects.toThrow(
        "The selected parent organizational unit type would create a circular hierarchy."
      );

      expect(mocks.updateOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });

    it("updates successfully with a valid non-circular parentTypeId", async () => {
      const currentType = makeUnitType({
        id: sectionTypeId,
        parentTypeId: null,
      });

      const parentType = makeUnitType({
        id: departmentTypeId,
        parentTypeId: null,
      });

      mocks.findOrganizationalUnitTypeById.mockImplementation(async (id: string) => {
        if (id === sectionTypeId) {
          return currentType;
        }

        if (id === departmentTypeId) {
          return parentType;
        }

        return null;
      });

      await updateOrganizationalUnitType({
        ...baseUpdateInput,
        id: sectionTypeId,
        parentTypeId: departmentTypeId,
      });

      expect(mocks.updateOrganizationalUnitTypeRecord).toHaveBeenCalledWith(
        expect.objectContaining({
          id: sectionTypeId,
          parentTypeId: departmentTypeId,
        })
      );
    });
  });

  describe("deleteOrganizationalUnitType", () => {
    it("throws if the trimmed id is empty", async () => {
      await expect(deleteOrganizationalUnitType("   ", "DEPARTMENT")).rejects.toThrow(
        "Organizational unit type ID is required."
      );

      expect(mocks.findOrganizationalUnitTypeById).not.toHaveBeenCalled();

      expect(mocks.deleteOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });

    it("throws if the trimmed confirmation code is empty", async () => {
      await expect(deleteOrganizationalUnitType(departmentTypeId, "   ")).rejects.toThrow(
        "Unit type code confirmation is required."
      );

      expect(mocks.findOrganizationalUnitTypeById).not.toHaveBeenCalled();

      expect(mocks.deleteOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });

    it("throws if the unit type does not exist", async () => {
      mocks.findOrganizationalUnitTypeById.mockResolvedValue(null);

      await expect(deleteOrganizationalUnitType(departmentTypeId, "DEPARTMENT")).rejects.toThrow(
        "Organizational unit type was not found."
      );

      expect(mocks.deleteOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });

    it("throws if the confirmation code does not match", async () => {
      mocks.findOrganizationalUnitTypeById.mockResolvedValue(makeUnitType());

      await expect(deleteOrganizationalUnitType(departmentTypeId, "WRONG")).rejects.toThrow(
        "The entered unit type code does not match."
      );

      expect(mocks.countOrganizationalUnitsByUnitTypeId).not.toHaveBeenCalled();

      expect(mocks.countChildOrganizationalUnitTypes).not.toHaveBeenCalled();

      expect(mocks.deleteOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });

    it("throws if organizational units are still assigned to this type", async () => {
      mocks.findOrganizationalUnitTypeById.mockResolvedValue(
        makeUnitType({
          id: departmentTypeId,
          code: "DEPARTMENT",
        })
      );

      mocks.countOrganizationalUnitsByUnitTypeId.mockResolvedValue(3);

      mocks.countChildOrganizationalUnitTypes.mockResolvedValue(0);

      await expect(deleteOrganizationalUnitType(departmentTypeId, "DEPARTMENT")).rejects.toThrow(
        "This organizational unit type cannot be deleted because it has related records: 3 organizational units. Archive it instead."
      );

      expect(mocks.countOrganizationalUnitsByUnitTypeId).toHaveBeenCalledOnce();

      expect(mocks.countOrganizationalUnitsByUnitTypeId).toHaveBeenCalledWith(departmentTypeId);

      expect(mocks.countChildOrganizationalUnitTypes).toHaveBeenCalledOnce();

      expect(mocks.countChildOrganizationalUnitTypes).toHaveBeenCalledWith(departmentTypeId);

      expect(mocks.deleteOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });

    it("deletes the unit type when no organizational units are assigned", async () => {
      const unitType = makeUnitType({
        id: departmentTypeId,
        code: "DEPARTMENT",
      });

      mocks.findOrganizationalUnitTypeById.mockResolvedValue(unitType);

      mocks.countOrganizationalUnitsByUnitTypeId.mockResolvedValue(0);

      mocks.countChildOrganizationalUnitTypes.mockResolvedValue(0);

      mocks.deleteOrganizationalUnitTypeRecord.mockResolvedValue(unitType);

      const result = await deleteOrganizationalUnitType(
        `  ${departmentTypeId}  `,
        "  DEPARTMENT  "
      );

      expect(mocks.findOrganizationalUnitTypeById).toHaveBeenCalledWith(departmentTypeId);

      expect(mocks.countOrganizationalUnitsByUnitTypeId).toHaveBeenCalledWith(departmentTypeId);

      expect(mocks.countChildOrganizationalUnitTypes).toHaveBeenCalledWith(departmentTypeId);

      expect(mocks.deleteOrganizationalUnitTypeRecord).toHaveBeenCalledOnce();

      expect(mocks.deleteOrganizationalUnitTypeRecord).toHaveBeenCalledWith(departmentTypeId);

      expect(result).toBe(unitType);
    });

    it("rejects deletion when the type has child unit types", async () => {
      const parentType = makeUnitType({
        id: departmentTypeId,
        code: "DEPARTMENT",
      });

      mocks.findOrganizationalUnitTypeById.mockResolvedValue(parentType);

      mocks.countOrganizationalUnitsByUnitTypeId.mockResolvedValue(0);

      mocks.countChildOrganizationalUnitTypes.mockResolvedValue(2);

      await expect(deleteOrganizationalUnitType(departmentTypeId, "DEPARTMENT")).rejects.toThrow(
        "This organizational unit type cannot be deleted because it has related records: 2 child organizational unit types. Archive it instead."
      );

      expect(mocks.countOrganizationalUnitsByUnitTypeId).toHaveBeenCalledWith(departmentTypeId);

      expect(mocks.countChildOrganizationalUnitTypes).toHaveBeenCalledWith(departmentTypeId);

      expect(mocks.deleteOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });

    it("rejects deletion when the type has both child types and assigned units", async () => {
      const unitType = makeUnitType({
        id: departmentTypeId,
        code: "DEPARTMENT",
      });

      mocks.findOrganizationalUnitTypeById.mockResolvedValue(unitType);

      mocks.countOrganizationalUnitsByUnitTypeId.mockResolvedValue(3);

      mocks.countChildOrganizationalUnitTypes.mockResolvedValue(2);

      await expect(deleteOrganizationalUnitType(departmentTypeId, "DEPARTMENT")).rejects.toThrow(
        "This organizational unit type cannot be deleted because it has related records: 2 child organizational unit types, 3 organizational units. Archive it instead."
      );

      expect(mocks.countOrganizationalUnitsByUnitTypeId).toHaveBeenCalledWith(departmentTypeId);

      expect(mocks.countChildOrganizationalUnitTypes).toHaveBeenCalledWith(departmentTypeId);

      expect(mocks.deleteOrganizationalUnitTypeRecord).not.toHaveBeenCalled();
    });

    it("allows deletion when there are no child types and no assigned units", async () => {
      const unitType = makeUnitType({
        id: departmentTypeId,
        code: "DEPARTMENT",
      });

      mocks.findOrganizationalUnitTypeById.mockResolvedValue(unitType);

      mocks.countOrganizationalUnitsByUnitTypeId.mockResolvedValue(0);

      mocks.countChildOrganizationalUnitTypes.mockResolvedValue(0);

      mocks.deleteOrganizationalUnitTypeRecord.mockResolvedValue(unitType);

      const result = await deleteOrganizationalUnitType(departmentTypeId, "DEPARTMENT");

      expect(mocks.countOrganizationalUnitsByUnitTypeId).toHaveBeenCalledWith(departmentTypeId);

      expect(mocks.countChildOrganizationalUnitTypes).toHaveBeenCalledWith(departmentTypeId);

      expect(mocks.deleteOrganizationalUnitTypeRecord).toHaveBeenCalledWith(departmentTypeId);

      expect(result).toBe(unitType);
    });
  });
});
