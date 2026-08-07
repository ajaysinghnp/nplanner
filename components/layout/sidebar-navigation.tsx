"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  getOrganizationCode,
  isBranchActive,
  isCurrentItem,
  navigationItems,
  resolveHref,
  type NavigationItem,
} from "@/conf/navigation";
import { cn } from "@/lib/utils";

type RenderNavigationItemsProps = {
  items: readonly NavigationItem[];
  pathname: string;
  organizationCode?: string;
  depth?: number;
};

function renderNavigationItems({
  items,
  pathname,
  organizationCode,
  depth = 0,
}: RenderNavigationItemsProps): React.ReactNode {
  return items.map((item) => {
    const Icon = item.icon;

    const current = isCurrentItem(item, pathname);
    const branch = isBranchActive(item, pathname);

    const hasChildren = item.children !== undefined && item.children.length > 0;

    /*
     * Organization children only make sense after an organization
     * has been selected and its code is present in the URL.
     */
    const shouldRenderChildren =
      hasChildren && (depth === 0 ? organizationCode !== undefined : true);

    const href = resolveHref(item.href, {
      organizationCode,
    });

    const paddingLeft = `${12 + depth * 20}px`;

    /*
     * An item with children is a group item.
     *
     * For the Organizations group, the group itself is highlighted
     * anywhere inside /organizations/:organizationCode/... .
     *
     * Individual children are highlighted only when their own
     * matcher says they are the current page.
     */
    const className = cn(
      "flex items-center gap-3 rounded-md py-2 pr-3 text-sm font-medium transition-colors",
      current
        ? "bg-accent text-accent-foreground"
        : branch && hasChildren
          ? "text-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    );

    const content = (
      <>
        {Icon && <Icon className="size-4 shrink-0" />}
        <span>{item.label}</span>
      </>
    );

    return (
      <div className="space-y-1" key={`${depth}-${item.label}`}>
        {href ? (
          <Link
            href={href}
            className={className}
            style={{
              paddingLeft,
            }}
          >
            {content}
          </Link>
        ) : (
          <div
            className={className}
            style={{
              paddingLeft,
            }}
          >
            {content}
          </div>
        )}

        {shouldRenderChildren
          ? renderNavigationItems({
              items: item.children!,
              pathname,
              organizationCode,
              depth: depth + 1,
            })
          : null}
      </div>
    );
  });
}

export default function SidebarNavigation() {
  const pathname = usePathname();

  const organizationCode = getOrganizationCode(pathname);

  return (
    <nav className="flex-1 space-y-1 p-4">
      {renderNavigationItems({
        items: navigationItems,
        pathname,
        organizationCode,
      })}
    </nav>
  );
}
