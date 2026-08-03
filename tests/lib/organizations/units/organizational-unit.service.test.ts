import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  findOrganizationById: vi.fn(),
  findOrganizationalUnitTypeById: vi.fn(),
  findOrganizationalUnitByCode: vi.fn(),
  findOrganizationalUnitById: vi.fn(),
  getOrganizationalUnits: vi.fn(),
  createOrganizationalUnitRecord: vi.fn(),
  deleteOrganizationalUnitRecord: vi.fn(),
  updateOrganizationalUnitRecord: vi.fn(),
}));

vi.mock("@/lib/organizations/organization.repository", () => ({
  findOrganizationById: mocks.findOrganizationById,
}));

vi.mock("@/lib/organizations/units/organizational-unit-type.repository", () => ({
  findOrganizationalUnitTypeById: mocks.findOrganizationalUnitTypeById,
}));

vi.mock("@/lib/organizations/units/organizational-unit.repository", () => ({
  findOrganizationalUnitByCode: mocks.findOrganizationalUnitByCode,
  findOrganizationalUnitById: mocks.findOrganizationalUnitById,
  getOrganizationalUnits: mocks.getOrganizationalUnits,
  createOrganizationalUnitRecord: mocks.createOrganizationalUnitRecord,
  deleteOrganizationalUnitRecord: mocks.deleteOrganizationalUnitRecord,
  updateOrganizationalUnitRecord: mocks.updateOrganizationalUnitRecord,
}));

const {
  createOrganizationalUnit,
  deleteOrganizationalUnit,
  getOrganizationalUnitById,
  getOrganizationalUnits,
  updateOrganizationalUnit,
} = await import("@/lib/organizations/units/organizational-unit.service");

const organizationId = "organization-1";
const anotherOrganizationId = "organization-2";

const departmentTypeId = "unit-type-department";
const sectionTypeId = "unit-type-section";
const teamTypeId = "unit-type-team";

const departmentUnitId = "unit-department-1";
const sectionUnitId = "unit-section-1";
const teamUnitId = "unit-team-1";

const baseCreateInput = {
  organizationId,
  code: "FINANCE",
  unitTypeId: "",
  parentId: "",
  nameEn: "Finance Department",
  nameNe: "",
  shortNameEn: "Finance",
  shortNameNe: "",
  sortOrder: 0,
  status: "ACTIVE",
};

const baseUpdateInput = {
  id: departmentUnitId,
  unitTypeId: "",
  parentId: "",
  nameEn: "Finance Department Updated",
  nameNe: "",
  shortNameEn: "Finance",
  shortNameNe: "",
  sortOrder: 1,
  status: "ACTIVE",
};

function makeOrganization(overrides: Record<string, unknown> = {}) {
  return {
    id: organizationId,
    code: "ORG",
    nameEn: "Example Organization",
    ...overrides,
  };
}

function makeUnitType(overrides: Record<string, unknown> = {}) {
  return {
    id: departmentTypeId,
    organizationId,
    parentTypeId: null,
    code: "DEPARTMENT",
    nameEn: "Department",
    ...overrides,
  };
}

function makeOrganizationalUnit(overrides: Record<string, unknown> = {}) {
  return {
    id: departmentUnitId,
    organizationId,
    unitTypeId: null,
    parentId: null,
    code: "FINANCE",
    nameEn: "Finance Department",
    nameNe: null,
    shortNameEn: "Finance",
    shortNameNe: null,
    sortOrder: 0,
    status: "ACTIVE",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    ...overrides,
  };
}

describe("organizational-unit.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.findOrganizationById.mockResolvedValue(makeOrganization());

    mocks.findOrganizationalUnitByCode.mockResolvedValue(null);

    mocks.findOrganizationalUnitTypeById.mockResolvedValue(null);

    mocks.findOrganizationalUnitById.mockResolvedValue(null);

    mocks.getOrganizationalUnits.mockResolvedValue([]);

    mocks.createOrganizationalUnitRecord.mockImplementation(async (data) => ({
      id: "created-unit",
      ...data,
    }));

    mocks.updateOrganizationalUnitRecord.mockImplementation(async (data) => ({
      ...makeOrganizationalUnit(),
      ...data,
    }));

    mocks.deleteOrganizationalUnitRecord.mockImplementation(async (id) =>
      makeOrganizationalUnit({ id })
    );
  });

  describe("getOrganizationalUnits", () => {
    it("delegates to the repository with the organization ID", async () => {
      const units = [
        makeOrganizationalUnit({
          id: departmentUnitId,
          code: "FINANCE",
        }),
        makeOrganizationalUnit({
          id: sectionUnitId,
          code: "FINANCE-ADMIN",
        }),
      ];

      mocks.getOrganizationalUnits.mockResolvedValue(units);

      const result = await getOrganizationalUnits(organizationId);

      expect(mocks.getOrganizationalUnits).toHaveBeenCalledOnce();
      expect(mocks.getOrganizationalUnits).toHaveBeenCalledWith(organizationId);
      expect(result).toBe(units);
    });
  });

  describe("getOrganizationalUnitById", () => {
    it("delegates to the repository with the unit ID", async () => {
      const unit = makeOrganizationalUnit();

      mocks.findOrganizationalUnitById.mockResolvedValue(unit);

      const result = await getOrganizationalUnitById(departmentUnitId);

      expect(mocks.findOrganizationalUnitById).toHaveBeenCalledOnce();
      expect(mocks.findOrganizationalUnitById).toHaveBeenCalledWith(departmentUnitId);
      expect(result).toBe(unit);
    });
  });

  describe("createOrganizationalUnit", () => {
    it("creates a root organizational unit without a unit type or parent", async () => {
      const result = await createOrganizationalUnit(baseCreateInput);

      expect(mocks.findOrganizationById).toHaveBeenCalledWith(organizationId);

      expect(mocks.findOrganizationalUnitByCode).toHaveBeenCalledWith(
        organizationId,
        baseCreateInput.code
      );

      expect(mocks.findOrganizationalUnitTypeById).not.toHaveBeenCalled();

      expect(mocks.findOrganizationalUnitById).not.toHaveBeenCalled();

      expect(mocks.createOrganizationalUnitRecord).toHaveBeenCalledWith(baseCreateInput);

      expect(result).toMatchObject({
        id: "created-unit",
        organizationId,
        code: "FINANCE",
        nameEn: "Finance Department",
      });
    });

    it("creates a root organizational unit with a valid unit type", async () => {
      mocks.findOrganizationalUnitTypeById.mockResolvedValue(
        makeUnitType({
          id: departmentTypeId,
        })
      );

      await createOrganizationalUnit({
        ...baseCreateInput,
        unitTypeId: departmentTypeId,
      });

      expect(mocks.findOrganizationalUnitTypeById).toHaveBeenCalledWith(departmentTypeId);

      expect(mocks.createOrganizationalUnitRecord).toHaveBeenCalledWith(
        expect.objectContaining({
          organizationId,
          unitTypeId: departmentTypeId,
          parentId: "",
        })
      );
    });

    it("creates a child organizational unit with a valid parent in the same organization", async () => {
      mocks.findOrganizationalUnitTypeById.mockResolvedValue(
        makeUnitType({
          id: sectionTypeId,
          parentTypeId: departmentTypeId,
          code: "SECTION",
          nameEn: "Section",
        })
      );

      mocks.findOrganizationalUnitById.mockResolvedValue(
        makeOrganizationalUnit({
          id: departmentUnitId,
          unitTypeId: departmentTypeId,
          parentId: null,
        })
      );

      await createOrganizationalUnit({
        ...baseCreateInput,
        code: "FINANCE-ADMIN",
        nameEn: "Finance Administration Section",
        unitTypeId: sectionTypeId,
        parentId: departmentUnitId,
      });

      expect(mocks.findOrganizationalUnitTypeById).toHaveBeenCalledWith(sectionTypeId);

      expect(mocks.findOrganizationalUnitById).toHaveBeenCalledWith(departmentUnitId);

      expect(mocks.createOrganizationalUnitRecord).toHaveBeenCalledWith(
        expect.objectContaining({
          code: "FINANCE-ADMIN",
          unitTypeId: sectionTypeId,
          parentId: departmentUnitId,
        })
      );
    });

    it("rejects creation when the organization does not exist", async () => {
      mocks.findOrganizationById.mockResolvedValue(null);

      await expect(createOrganizationalUnit(baseCreateInput)).rejects.toThrow(
        "Organization was not found."
      );

      expect(mocks.findOrganizationalUnitByCode).not.toHaveBeenCalled();

      expect(mocks.createOrganizationalUnitRecord).not.toHaveBeenCalled();
    });

    it("rejects a duplicate organizational-unit code", async () => {
      mocks.findOrganizationalUnitByCode.mockResolvedValue(
        makeOrganizationalUnit({
          id: "existing-unit",
          code: baseCreateInput.code,
        })
      );

      await expect(createOrganizationalUnit(baseCreateInput)).rejects.toThrow(
        'An organizational unit with code "FINANCE" already exists.'
      );

      expect(mocks.createOrganizationalUnitRecord).not.toHaveBeenCalled();
    });

    it("rejects a unit type that does not exist", async () => {
      await expect(
        createOrganizationalUnit({
          ...baseCreateInput,
          unitTypeId: departmentTypeId,
        })
      ).rejects.toThrow("The selected organizational unit type was not found.");

      expect(mocks.createOrganizationalUnitRecord).not.toHaveBeenCalled();
    });

    it("rejects a unit type from another organization", async () => {
      mocks.findOrganizationalUnitTypeById.mockResolvedValue(
        makeUnitType({
          id: departmentTypeId,
          organizationId: anotherOrganizationId,
        })
      );

      await expect(
        createOrganizationalUnit({
          ...baseCreateInput,
          unitTypeId: departmentTypeId,
        })
      ).rejects.toThrow("The selected organizational unit type belongs to another organization.");

      expect(mocks.createOrganizationalUnitRecord).not.toHaveBeenCalled();
    });

    it("rejects a parent unit that does not exist", async () => {
      await expect(
        createOrganizationalUnit({
          ...baseCreateInput,
          parentId: departmentUnitId,
        })
      ).rejects.toThrow("The selected parent organizational unit was not found.");

      expect(mocks.createOrganizationalUnitRecord).not.toHaveBeenCalled();
    });

    it("rejects a parent unit from another organization", async () => {
      mocks.findOrganizationalUnitById.mockResolvedValue(
        makeOrganizationalUnit({
          id: departmentUnitId,
          organizationId: anotherOrganizationId,
        })
      );

      await expect(
        createOrganizationalUnit({
          ...baseCreateInput,
          parentId: departmentUnitId,
        })
      ).rejects.toThrow("The selected parent organizational unit belongs to another organization.");

      expect(mocks.createOrganizationalUnitRecord).not.toHaveBeenCalled();
    });
  });

  describe("updateOrganizationalUnit", () => {
    it("updates an existing root organizational unit without a unit type or parent", async () => {
      const existingUnit = makeOrganizationalUnit({
        id: departmentUnitId,
        unitTypeId: null,
        parentId: null,
      });

      const updatedUnit = makeOrganizationalUnit({
        id: departmentUnitId,
        nameEn: baseUpdateInput.nameEn,
        sortOrder: baseUpdateInput.sortOrder,
      });

      mocks.findOrganizationalUnitById.mockResolvedValue(existingUnit);

      mocks.updateOrganizationalUnitRecord.mockResolvedValue(updatedUnit);

      const result = await updateOrganizationalUnit(baseUpdateInput);

      expect(mocks.findOrganizationalUnitById).toHaveBeenCalledOnce();

      expect(mocks.findOrganizationalUnitById).toHaveBeenCalledWith(departmentUnitId);

      expect(mocks.findOrganizationalUnitTypeById).not.toHaveBeenCalled();

      expect(mocks.updateOrganizationalUnitRecord).toHaveBeenCalledWith(baseUpdateInput);

      expect(result).toBe(updatedUnit);
    });

    it("updates an existing unit with a valid unit type", async () => {
      const existingUnit = makeOrganizationalUnit({
        id: departmentUnitId,
        unitTypeId: departmentTypeId,
      });

      const unitType = makeUnitType({
        id: departmentTypeId,
      });

      mocks.findOrganizationalUnitById.mockResolvedValue(existingUnit);

      mocks.findOrganizationalUnitTypeById.mockResolvedValue(unitType);

      await updateOrganizationalUnit({
        ...baseUpdateInput,
        unitTypeId: departmentTypeId,
      });

      expect(mocks.findOrganizationalUnitTypeById).toHaveBeenCalledWith(departmentTypeId);

      expect(mocks.updateOrganizationalUnitRecord).toHaveBeenCalledWith(
        expect.objectContaining({
          id: departmentUnitId,
          unitTypeId: departmentTypeId,
        })
      );
    });

    it("updates an existing unit with a valid parent in the same organization", async () => {
      const existingUnit = makeOrganizationalUnit({
        id: sectionUnitId,
        unitTypeId: sectionTypeId,
        parentId: null,
      });

      const proposedParent = makeOrganizationalUnit({
        id: departmentUnitId,
        unitTypeId: departmentTypeId,
        parentId: null,
      });

      mocks.findOrganizationalUnitById.mockImplementation(async (id: string) => {
        if (id === sectionUnitId) {
          return existingUnit;
        }

        if (id === departmentUnitId) {
          return proposedParent;
        }

        return null;
      });

      await updateOrganizationalUnit({
        ...baseUpdateInput,
        id: sectionUnitId,
        unitTypeId: "",
        parentId: departmentUnitId,
      });

      expect(mocks.findOrganizationalUnitById).toHaveBeenCalledWith(sectionUnitId);

      expect(mocks.findOrganizationalUnitById).toHaveBeenCalledWith(departmentUnitId);

      expect(mocks.updateOrganizationalUnitRecord).toHaveBeenCalledWith(
        expect.objectContaining({
          id: sectionUnitId,
          parentId: departmentUnitId,
        })
      );
    });

    it("rejects an update when the organizational unit does not exist", async () => {
      mocks.findOrganizationalUnitById.mockResolvedValue(null);

      await expect(updateOrganizationalUnit(baseUpdateInput)).rejects.toThrow(
        "Organizational unit was not found."
      );

      expect(mocks.updateOrganizationalUnitRecord).not.toHaveBeenCalled();
    });

    it("rejects a unit type that does not exist during update", async () => {
      mocks.findOrganizationalUnitById.mockResolvedValue(
        makeOrganizationalUnit({
          id: departmentUnitId,
        })
      );

      mocks.findOrganizationalUnitTypeById.mockResolvedValue(null);

      await expect(
        updateOrganizationalUnit({
          ...baseUpdateInput,
          unitTypeId: departmentTypeId,
        })
      ).rejects.toThrow("The selected organizational unit type was not found.");

      expect(mocks.updateOrganizationalUnitRecord).not.toHaveBeenCalled();
    });

    it("rejects a unit type from another organization during update", async () => {
      mocks.findOrganizationalUnitById.mockResolvedValue(
        makeOrganizationalUnit({
          id: departmentUnitId,
        })
      );

      mocks.findOrganizationalUnitTypeById.mockResolvedValue(
        makeUnitType({
          id: departmentTypeId,
          organizationId: anotherOrganizationId,
        })
      );

      await expect(
        updateOrganizationalUnit({
          ...baseUpdateInput,
          unitTypeId: departmentTypeId,
        })
      ).rejects.toThrow("The selected organizational unit type belongs to another organization.");

      expect(mocks.updateOrganizationalUnitRecord).not.toHaveBeenCalled();
    });

    it("rejects an organizational unit as its own parent", async () => {
      mocks.findOrganizationalUnitById.mockResolvedValue(
        makeOrganizationalUnit({
          id: departmentUnitId,
        })
      );

      await expect(
        updateOrganizationalUnit({
          ...baseUpdateInput,
          parentId: departmentUnitId,
        })
      ).rejects.toThrow("An organizational unit cannot be its own parent.");

      expect(mocks.updateOrganizationalUnitRecord).not.toHaveBeenCalled();
    });

    it("rejects a parent unit that does not exist during update", async () => {
      const existingUnit = makeOrganizationalUnit({
        id: sectionUnitId,
      });

      mocks.findOrganizationalUnitById
        .mockResolvedValueOnce(existingUnit)
        .mockResolvedValueOnce(null);

      await expect(
        updateOrganizationalUnit({
          ...baseUpdateInput,
          id: sectionUnitId,
          parentId: departmentUnitId,
        })
      ).rejects.toThrow("The selected parent organizational unit was not found.");

      expect(mocks.updateOrganizationalUnitRecord).not.toHaveBeenCalled();
    });

    it("rejects a parent unit from another organization during update", async () => {
      const existingUnit = makeOrganizationalUnit({
        id: sectionUnitId,
      });

      const otherOrganizationParent = makeOrganizationalUnit({
        id: departmentUnitId,
        organizationId: anotherOrganizationId,
      });

      mocks.findOrganizationalUnitById
        .mockResolvedValueOnce(existingUnit)
        .mockResolvedValueOnce(otherOrganizationParent);

      await expect(
        updateOrganizationalUnit({
          ...baseUpdateInput,
          id: sectionUnitId,
          parentId: departmentUnitId,
        })
      ).rejects.toThrow("The selected parent organizational unit belongs to another organization.");

      expect(mocks.updateOrganizationalUnitRecord).not.toHaveBeenCalled();
    });

    it("rejects a direct circular organizational-unit hierarchy", async () => {
      const unitBeingUpdated = makeOrganizationalUnit({
        id: departmentUnitId,
        parentId: null,
      });

      const proposedParent = makeOrganizationalUnit({
        id: sectionUnitId,
        parentId: departmentUnitId,
      });

      mocks.findOrganizationalUnitById.mockImplementation(async (id: string) => {
        if (id === departmentUnitId) {
          return unitBeingUpdated;
        }

        if (id === sectionUnitId) {
          return proposedParent;
        }

        return null;
      });

      await expect(
        updateOrganizationalUnit({
          ...baseUpdateInput,
          id: departmentUnitId,
          parentId: sectionUnitId,
        })
      ).rejects.toThrow(
        "The selected parent would create a circular organizational-unit hierarchy."
      );

      expect(mocks.updateOrganizationalUnitRecord).not.toHaveBeenCalled();
    });

    it("rejects a deeper circular organizational-unit hierarchy", async () => {
      const unitBeingUpdated = makeOrganizationalUnit({
        id: departmentUnitId,
        parentId: null,
      });

      const middleAncestor = makeOrganizationalUnit({
        id: sectionUnitId,
        parentId: departmentUnitId,
      });

      const proposedParent = makeOrganizationalUnit({
        id: teamUnitId,
        parentId: sectionUnitId,
      });

      mocks.findOrganizationalUnitById.mockImplementation(async (id: string) => {
        if (id === departmentUnitId) {
          return unitBeingUpdated;
        }

        if (id === sectionUnitId) {
          return middleAncestor;
        }

        if (id === teamUnitId) {
          return proposedParent;
        }

        return null;
      });

      await expect(
        updateOrganizationalUnit({
          ...baseUpdateInput,
          id: departmentUnitId,
          parentId: teamUnitId,
        })
      ).rejects.toThrow(
        "The selected parent would create a circular organizational-unit hierarchy."
      );

      expect(mocks.updateOrganizationalUnitRecord).not.toHaveBeenCalled();
    });

    it("updates successfully with a valid non-circular parent", async () => {
      const unitBeingUpdated = makeOrganizationalUnit({
        id: sectionUnitId,
        parentId: null,
      });

      const validParent = makeOrganizationalUnit({
        id: departmentUnitId,
        parentId: null,
      });

      const updatedUnit = makeOrganizationalUnit({
        id: sectionUnitId,
        parentId: departmentUnitId,
      });

      mocks.findOrganizationalUnitById.mockImplementation(async (id: string) => {
        if (id === sectionUnitId) {
          return unitBeingUpdated;
        }

        if (id === departmentUnitId) {
          return validParent;
        }

        return null;
      });

      mocks.updateOrganizationalUnitRecord.mockResolvedValue(updatedUnit);

      const result = await updateOrganizationalUnit({
        ...baseUpdateInput,
        id: sectionUnitId,
        parentId: departmentUnitId,
      });

      expect(mocks.updateOrganizationalUnitRecord).toHaveBeenCalledWith(
        expect.objectContaining({
          id: sectionUnitId,
          parentId: departmentUnitId,
        })
      );

      expect(result).toBe(updatedUnit);
    });
  });

  describe("deleteOrganizationalUnit", () => {
    it("rejects deletion when the organizational unit does not exist", async () => {
      mocks.findOrganizationalUnitById.mockResolvedValue(null);

      await expect(deleteOrganizationalUnit("missing-unit", "MISSING")).rejects.toThrow(
        "Organizational unit was not found."
      );

      expect(mocks.getOrganizationalUnits).not.toHaveBeenCalled();

      expect(mocks.deleteOrganizationalUnitRecord).not.toHaveBeenCalled();
    });

    it("rejects deletion when the confirmation code does not match", async () => {
      const unit = makeOrganizationalUnit({
        id: departmentUnitId,
        code: "FINANCE",
      });

      mocks.findOrganizationalUnitById.mockResolvedValue(unit);

      await expect(deleteOrganizationalUnit(departmentUnitId, "WRONG-CODE")).rejects.toThrow(
        "The confirmation code does not match the organizational unit code."
      );

      expect(mocks.getOrganizationalUnits).not.toHaveBeenCalled();

      expect(mocks.deleteOrganizationalUnitRecord).not.toHaveBeenCalled();
    });

    it("rejects deletion when the organizational unit has child units", async () => {
      const unit = makeOrganizationalUnit({
        id: departmentUnitId,
        code: "FINANCE",
      });

      const childUnit = makeOrganizationalUnit({
        id: sectionUnitId,
        code: "FINANCE-ADMIN",
        parentId: departmentUnitId,
      });

      mocks.findOrganizationalUnitById.mockResolvedValue(unit);

      mocks.getOrganizationalUnits.mockResolvedValue([unit, childUnit]);

      await expect(deleteOrganizationalUnit(departmentUnitId, "FINANCE")).rejects.toThrow(
        "This organizational unit cannot be deleted because it has child organizational units."
      );

      expect(mocks.deleteOrganizationalUnitRecord).not.toHaveBeenCalled();
    });

    it("deletes the organizational unit when it has no child units", async () => {
      const unit = makeOrganizationalUnit({
        id: departmentUnitId,
        code: "FINANCE",
      });

      const unrelatedUnit = makeOrganizationalUnit({
        id: sectionUnitId,
        code: "HR",
        parentId: null,
      });

      mocks.findOrganizationalUnitById.mockResolvedValue(unit);

      mocks.getOrganizationalUnits.mockResolvedValue([unit, unrelatedUnit]);

      mocks.deleteOrganizationalUnitRecord.mockResolvedValue(unit);

      const result = await deleteOrganizationalUnit(departmentUnitId, "FINANCE");

      expect(mocks.getOrganizationalUnits).toHaveBeenCalledWith(organizationId);

      expect(mocks.deleteOrganizationalUnitRecord).toHaveBeenCalledOnce();

      expect(mocks.deleteOrganizationalUnitRecord).toHaveBeenCalledWith(departmentUnitId);

      expect(result).toBe(unit);
    });
  });
});
