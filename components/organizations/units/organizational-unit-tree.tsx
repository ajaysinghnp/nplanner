"use client";

import { Building2, ChevronRight, Circle } from "lucide-react";

import { DeleteOrganizationalUnitDialog } from "@/components/organizations/units/delete-organizational-unit-dialog";
import { EditOrganizationalUnitDialog } from "@/components/organizations/units/edit-organizational-unit-dialog";

type UnitTypeOption = {
  id: string;
  code: string;
  nameEn: string;
  nameNe: string | null;
};

type OrganizationalUnit = {
  id: string;
  code: string;
  parentId: string | null;
  unitTypeId: string | null;
  nameEn: string;
  nameNe: string | null;
  shortNameEn: string | null;
  shortNameNe: string | null;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  parent: {
    id: string;
    code: string;
    nameEn: string;
  } | null;
  unitType: {
    id: string;
    code: string;
    nameEn: string;
  } | null;
};

type OrganizationalUnitTreeProps = {
  organizationCode: string;
  units: OrganizationalUnit[];
  unitTypes: UnitTypeOption[];
};

type UnitNode = OrganizationalUnit & {
  children: UnitNode[];
};

export function OrganizationalUnitTree({
  organizationCode,
  units,
  unitTypes,
}: OrganizationalUnitTreeProps) {
  const unitMap = new Map<string, UnitNode>();

  for (const unit of units) {
    unitMap.set(unit.id, {
      ...unit,
      children: [],
    });
  }

  const rootUnits: UnitNode[] = [];

  for (const unit of unitMap.values()) {
    if (unit.parentId === null) {
      rootUnits.push(unit);
      continue;
    }

    const parent = unitMap.get(unit.parentId);

    if (parent) {
      parent.children.push(unit);
    } else {
      // If a parent record is missing, render the unit as a root so it
      // remains visible and manageable.
      rootUnits.push(unit);
    }
  }

  const sortUnits = (items: UnitNode[]) => {
    items.sort((first, second) => {
      if (first.sortOrder !== second.sortOrder) {
        return first.sortOrder - second.sortOrder;
      }

      return first.nameEn.localeCompare(second.nameEn);
    });

    for (const item of items) {
      sortUnits(item.children);
    }
  };

  sortUnits(rootUnits);

  return (
    <div className="divide-y">
      {rootUnits.map((unit) => (
        <OrganizationalUnitTreeNode
          key={unit.id}
          organizationCode={organizationCode}
          unit={unit}
          unitTypes={unitTypes}
          parentUnits={units}
          depth={0}
          visitedUnitIds={new Set()}
        />
      ))}
    </div>
  );
}

type OrganizationalUnitTreeNodeProps = {
  organizationCode: string;
  unit: UnitNode;
  unitTypes: UnitTypeOption[];
  parentUnits: OrganizationalUnit[];
  depth: number;
  visitedUnitIds: Set<string>;
};

function OrganizationalUnitTreeNode({
  organizationCode,
  unit,
  unitTypes,
  parentUnits,
  depth,
  visitedUnitIds,
}: OrganizationalUnitTreeNodeProps) {
  // Prevent accidental infinite recursion if invalid circular data exists.
  if (visitedUnitIds.has(unit.id)) {
    return null;
  }

  const nextVisitedUnitIds = new Set(visitedUnitIds);
  nextVisitedUnitIds.add(unit.id);

  const indentation = Math.min(depth, 6) * 24;

  return (
    <>
      <article
        className="hover:bg-muted/30 flex flex-col gap-4 p-5 transition-colors sm:flex-row sm:items-center sm:justify-between"
        style={{
          paddingLeft: `${20 + indentation}px`,
        }}
      >
        <div className="flex min-w-0 items-start gap-3">
          {depth > 0 ? (
            <ChevronRight
              className="text-muted-foreground mt-2 size-4 shrink-0"
              aria-hidden="true"
            />
          ) : null}

          <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
            <Building2 className="size-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{unit.nameEn}</h3>

              <span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 font-mono text-xs">
                {unit.code}
              </span>

              {unit.unitType ? (
                <span className="border-border text-muted-foreground rounded-md border px-2 py-0.5 text-xs">
                  {unit.unitType.nameEn}
                </span>
              ) : null}
            </div>

            {unit.nameNe ? (
              <p className="text-muted-foreground mt-1 text-sm">{unit.nameNe}</p>
            ) : null}

            <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              <span>Short name: {unit.shortNameEn ?? unit.shortNameNe ?? "Not specified"}</span>

              <span>Sort order: {unit.sortOrder}</span>

              <span>Level: {depth + 1}</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Circle
              className={
                unit.status === "ACTIVE"
                  ? "size-2.5 fill-green-500 text-green-500"
                  : unit.status === "INACTIVE"
                    ? "size-2.5 fill-amber-500 text-amber-500"
                    : "size-2.5 fill-red-500 text-red-500"
              }
              aria-hidden="true"
            />

            <span className="text-muted-foreground text-xs">{unit.status}</span>
          </div>

          <EditOrganizationalUnitDialog
            organizationCode={organizationCode}
            unit={unit}
            unitTypes={unitTypes}
            parentUnits={parentUnits}
          />

          <DeleteOrganizationalUnitDialog organizationCode={organizationCode} unit={unit} />
        </div>
      </article>

      {unit.children.map((child) => (
        <OrganizationalUnitTreeNode
          key={child.id}
          organizationCode={organizationCode}
          unit={child}
          unitTypes={unitTypes}
          parentUnits={parentUnits}
          depth={depth + 1}
          visitedUnitIds={nextVisitedUnitIds}
        />
      ))}
    </>
  );
}
