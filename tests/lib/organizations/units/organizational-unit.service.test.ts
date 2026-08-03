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

const { createOrganizationalUnit } =
  await import("@/lib/organizations/units/organizational-unit.service");

const organizationId = "organization-1";

const departmentTypeId = "unit-type-department";
const sectionTypeId = "unit-type-section";

const departmentUnitId = "unit-department-1";

const baseInput = {
  organizationId,
  code: "FINANCE",
  nameEn: "Finance Department",
  nameNe: "",
  shortNameEn: "Finance",
  shortNameNe: "",
  sortOrder: 0,
  status: "ACTIVE",
};

describe("createOrganizationalUnit", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mocks.findOrganizationById.mockResolvedValue({
      id: organizationId,
      code: "ORG",
      nameEn: "Example Organization",
    });

    mocks.findOrganizationalUnitByCode.mockResolvedValue(null);

    mocks.findOrganizationalUnitTypeById.mockResolvedValue(null);

    mocks.findOrganizationalUnitById.mockResolvedValue(null);

    mocks.createOrganizationalUnitRecord.mockImplementation(async (data) => ({
      id: "created-unit",
      ...data,
    }));
  });

  it("creates a root organizational unit without a unit type or parent", async () => {
    const result = await createOrganizationalUnit({
      ...baseInput,
      unitTypeId: "",
      parentId: "",
    });

    expect(mocks.createOrganizationalUnitRecord).toHaveBeenCalledWith({
      ...baseInput,
      unitTypeId: "",
      parentId: "",
    });

    expect(result).toMatchObject({
      id: "created-unit",
      organizationId,
      code: "FINANCE",
      nameEn: "Finance Department",
    });
  });

  it("creates a root organizational unit with a valid unit type", async () => {
    mocks.findOrganizationalUnitTypeById.mockResolvedValue({
      id: departmentTypeId,
      organizationId,
      parentTypeId: null,
      code: "DEPARTMENT",
      nameEn: "Department",
    });

    await createOrganizationalUnit({
      ...baseInput,
      unitTypeId: departmentTypeId,
      parentId: "",
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

  it("creates a child unit when its parent has the required parent unit type", async () => {
    mocks.findOrganizationalUnitTypeById.mockResolvedValue({
      id: sectionTypeId,
      organizationId,
      parentTypeId: departmentTypeId,
      code: "SECTION",
      nameEn: "Section",
    });

    mocks.findOrganizationalUnitById.mockResolvedValue({
      id: departmentUnitId,
      organizationId,
      unitTypeId: departmentTypeId,
      code: "FINANCE",
      nameEn: "Finance Department",
    });

    await createOrganizationalUnit({
      ...baseInput,
      code: "FINANCE-ADMIN",
      nameEn: "Finance Administration Section",
      unitTypeId: sectionTypeId,
      parentId: departmentUnitId,
    });

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

    await expect(
      createOrganizationalUnit({
        ...baseInput,
        unitTypeId: "",
        parentId: "",
      })
    ).rejects.toThrow("Organization was not found.");

    expect(mocks.createOrganizationalUnitRecord).not.toHaveBeenCalled();
  });

  it("rejects a duplicate organizational-unit code", async () => {
    mocks.findOrganizationalUnitByCode.mockResolvedValue({
      id: "existing-unit",
      organizationId,
      code: baseInput.code,
    });

    await expect(
      createOrganizationalUnit({
        ...baseInput,
        unitTypeId: "",
        parentId: "",
      })
    ).rejects.toThrow('An organizational unit with code "FINANCE" already exists.');

    expect(mocks.createOrganizationalUnitRecord).not.toHaveBeenCalled();
  });

  it("rejects a unit type that does not exist", async () => {
    await expect(
      createOrganizationalUnit({
        ...baseInput,
        unitTypeId: departmentTypeId,
        parentId: "",
      })
    ).rejects.toThrow("The selected organizational unit type was not found.");

    expect(mocks.createOrganizationalUnitRecord).not.toHaveBeenCalled();
  });

  it("rejects a unit type from another organization", async () => {
    mocks.findOrganizationalUnitTypeById.mockResolvedValue({
      id: departmentTypeId,
      organizationId: "another-organization",
      parentTypeId: null,
      code: "DEPARTMENT",
      nameEn: "Department",
    });

    await expect(
      createOrganizationalUnit({
        ...baseInput,
        unitTypeId: departmentTypeId,
        parentId: "",
      })
    ).rejects.toThrow("The selected organizational unit type belongs to another organization.");

    expect(mocks.createOrganizationalUnitRecord).not.toHaveBeenCalled();
  });

  it("rejects a parent unit that does not exist", async () => {
    await expect(
      createOrganizationalUnit({
        ...baseInput,
        unitTypeId: "",
        parentId: departmentUnitId,
      })
    ).rejects.toThrow("The selected parent organizational unit was not found.");

    expect(mocks.createOrganizationalUnitRecord).not.toHaveBeenCalled();
  });

  it("rejects a parent unit from another organization", async () => {
    mocks.findOrganizationalUnitById.mockResolvedValue({
      id: departmentUnitId,
      organizationId: "another-organization",
      unitTypeId: departmentTypeId,
      code: "OTHER",
      nameEn: "Other Department",
    });

    await expect(
      createOrganizationalUnit({
        ...baseInput,
        unitTypeId: "",
        parentId: departmentUnitId,
      })
    ).rejects.toThrow("The selected parent organizational unit belongs to another organization.");

    expect(mocks.createOrganizationalUnitRecord).not.toHaveBeenCalled();
  });
});
