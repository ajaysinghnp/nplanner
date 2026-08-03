export type OrganizationalUnitTypeTreeItem = {
  id: string;
  parentTypeId: string | null;
  code: string;
  nameEn: string;
  nameNe: string | null;
  shortNameEn: string | null;
  shortNameNe: string | null;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
};

export type OrganizationalUnitTypeTreeNode = OrganizationalUnitTypeTreeItem & {
  children: OrganizationalUnitTypeTreeNode[];
};

function compareOrganizationalUnitTypes(
  first: OrganizationalUnitTypeTreeNode,
  second: OrganizationalUnitTypeTreeNode
) {
  if (first.sortOrder !== second.sortOrder) {
    return first.sortOrder - second.sortOrder;
  }

  return first.nameEn.localeCompare(second.nameEn);
}

export function buildOrganizationalUnitTypeTree(
  unitTypes: OrganizationalUnitTypeTreeItem[]
): OrganizationalUnitTypeTreeNode[] {
  const nodesById = new Map<string, OrganizationalUnitTypeTreeNode>();

  for (const unitType of unitTypes) {
    nodesById.set(unitType.id, {
      ...unitType,
      children: [],
    });
  }

  const rootNodes: OrganizationalUnitTypeTreeNode[] = [];

  for (const node of nodesById.values()) {
    if (node.parentTypeId === null) {
      rootNodes.push(node);

      continue;
    }

    const parentNode = nodesById.get(node.parentTypeId);

    if (parentNode) {
      parentNode.children.push(node);
    } else {
      // If the parent no longer exists, keep the record visible
      // instead of silently removing it from the listing.
      rootNodes.push(node);
    }
  }

  function sortNodes(nodes: OrganizationalUnitTypeTreeNode[]) {
    nodes.sort(compareOrganizationalUnitTypes);

    for (const node of nodes) {
      sortNodes(node.children);
    }
  }

  sortNodes(rootNodes);

  return rootNodes;
}
