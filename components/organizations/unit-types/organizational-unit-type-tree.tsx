import { Circle, CornerDownRight, Layers3 } from "lucide-react";

import { DeleteOrganizationalUnitTypeDialog } from "@/components/organizations/unit-types/delete-organizational-unit-type-dialog";
import { EditOrganizationalUnitTypeDialog } from "@/components/organizations/unit-types/edit-organizational-unit-type-dialog";
import {
  buildOrganizationalUnitTypeTree,
  type OrganizationalUnitTypeTreeItem,
  type OrganizationalUnitTypeTreeNode,
} from "@/lib/organizations/units/organizational-unit-type.tree";

type OrganizationalUnitTypeTreeProps = {
  organizationCode: string;
  unitTypes: OrganizationalUnitTypeTreeItem[];
};

export function OrganizationalUnitTypeTree({
  organizationCode,
  unitTypes,
}: OrganizationalUnitTypeTreeProps) {
  const tree = buildOrganizationalUnitTypeTree(unitTypes);

  return (
    <div className="divide-y">
      {tree.map((node) => (
        <OrganizationalUnitTypeTreeNodeItem
          key={node.id}
          organizationCode={organizationCode}
          node={node}
          unitTypes={unitTypes}
          depth={0}
        />
      ))}
    </div>
  );
}

type OrganizationalUnitTypeTreeNodeItemProps = {
  organizationCode: string;
  node: OrganizationalUnitTypeTreeNode;
  unitTypes: OrganizationalUnitTypeTreeItem[];
  depth: number;
};

function OrganizationalUnitTypeTreeNodeItem({
  organizationCode,
  node,
  unitTypes,
  depth,
}: OrganizationalUnitTypeTreeNodeItemProps) {
  const isChild = depth > 0;

  return (
    <div>
      <article
        className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
        style={{
          paddingLeft: `${1.25 + depth * 2}rem`,
        }}
      >
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex w-5 shrink-0 justify-center pt-2">
            {isChild ? <CornerDownRight className="text-muted-foreground size-4" /> : null}
          </div>

          <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
            <Layers3 className="size-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold">{node.nameEn}</h3>

              <span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 font-mono text-xs">
                {node.code}
              </span>
            </div>

            {node.nameNe ? (
              <p className="text-muted-foreground mt-1 text-sm">{node.nameNe}</p>
            ) : null}

            <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
              <span>Short name: {node.shortNameEn || node.shortNameNe || "Not specified"}</span>

              <span>Sort order: {node.sortOrder}</span>

              {isChild ? <span>Level: {depth + 1}</span> : <span>Root type</span>}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Circle
            className={
              node.status === "ACTIVE"
                ? "size-2.5 fill-green-500 text-green-500"
                : node.status === "INACTIVE"
                  ? "size-2.5 fill-amber-500 text-amber-500"
                  : "size-2.5 fill-red-500 text-red-500"
            }
            aria-hidden="true"
          />
          <span className="bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs">
            {node.status}
          </span>

          <EditOrganizationalUnitTypeDialog
            organizationCode={organizationCode}
            unitType={node}
            unitTypes={unitTypes}
          />

          <DeleteOrganizationalUnitTypeDialog organizationCode={organizationCode} unitType={node} />
        </div>
      </article>

      {node.children.length > 0 ? (
        <div className="border-border border-l">
          {node.children.map((childNode) => (
            <OrganizationalUnitTypeTreeNodeItem
              key={childNode.id}
              organizationCode={organizationCode}
              node={childNode}
              unitTypes={unitTypes}
              depth={depth + 1}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
