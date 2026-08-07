import {
  Building2,
  CalendarDays,
  CheckSquare,
  ClipboardCheck,
  FolderTree,
  Network,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavigationHref = string | ((params: { organizationCode?: string }) => string);

export type NavigationItem = {
  label: string;
  href?: NavigationHref;
  icon?: LucideIcon;

  /**
   * Optional explicit matcher for active-state handling.
   *
   * This allows a navigation item's href and its active URL patterns
   * to be different, which is useful for dynamic organization routes.
   */
  isActive?: (pathname: string) => boolean;

  /**
   * Children are rendered recursively by the navigation component.
   */
  children?: NavigationItem[];
};

export function resolveHref(
  href: NavigationHref | undefined,
  params?: { organizationCode?: string }
): string | undefined {
  if (!href) {
    return undefined;
  }

  if (typeof href === "function") {
    return href(params ?? {});
  }

  return href;
}

export function isDynamicHref(href: NavigationHref | undefined): boolean {
  if (!href) {
    return false;
  }

  if (typeof href === "function") {
    return true;
  }

  return href.includes("[");
}

/**
 * Extracts the organization code from:
 *
 * /organizations/:organizationCode
 * /organizations/:organizationCode/...
 *
 * Returns undefined for:
 *
 * /organizations
 */
export function getOrganizationCode(pathname: string): string | undefined {
  const match = pathname.match(/^\/organizations\/([^/]+)(?:\/|$)/);

  return match?.[1];
}

/**
 * Organization group is active for:
 *
 * /organizations
 * /organizations/:organizationCode
 * /organizations/:organizationCode/...
 */
export function isOrganizationActive(pathname: string): boolean {
  return pathname === "/organizations" || pathname.startsWith("/organizations/");
}

/**
 * Organization overview is active only for:
 *
 * /organizations/:organizationCode
 */
export function isOrganizationOverviewActive(pathname: string): boolean {
  return /^\/organizations\/[^/]+$/.test(pathname);
}

/**
 * Organizational Units is active for:
 *
 * /organizations/:organizationCode/units
 * /organizations/:organizationCode/units/:unitCode
 */
export function isOrganizationalUnitsActive(pathname: string): boolean {
  return /^\/organizations\/[^/]+\/units(?:\/[^/]+)?$/.test(pathname);
}

/**
 * Unit Types is active for:
 *
 * /organizations/:organizationCode/unit-types
 * /organizations/:organizationCode/unit-types/:unitTypeCode
 */
export function isOrganizationalUnitTypesActive(pathname: string): boolean {
  return /^\/organizations\/[^/]+\/unit-types(?:\/[^/]+)?$/.test(pathname);
}

export function isCurrentItem(item: NavigationItem, pathname: string): boolean {
  if (item.isActive) {
    return item.isActive(pathname);
  }

  const href = resolveHref(item.href);

  return href !== undefined && pathname === href;
}

export function isBranchActive(item: NavigationItem, pathname: string): boolean {
  if (isCurrentItem(item, pathname)) {
    return true;
  }

  return item.children?.some((child) => isBranchActive(child, pathname)) ?? false;
}

export const navigationItems: NavigationItem[] = [
  {
    label: "Calendar",
    href: "/calendar",
    icon: CalendarDays,
  },
  {
    label: "Events",
    href: "/events",
    icon: CheckSquare,
  },
  {
    label: "Approvals",
    href: "/approvals",
    icon: ClipboardCheck,
  },
  {
    label: "Organizations",
    href: "/organizations",
    icon: Building2,
    isActive: isOrganizationActive,
    children: [
      {
        label: "Overview",
        href: ({ organizationCode }) =>
          organizationCode ? `/organizations/${organizationCode}` : "/organizations",
        icon: Building2,
        isActive: isOrganizationOverviewActive,
      },
      {
        label: "Organizational Units",
        href: ({ organizationCode }) =>
          organizationCode ? `/organizations/${organizationCode}/units` : "/organizations",
        icon: Network,
        isActive: isOrganizationalUnitsActive,
      },
      {
        label: "Unit Types",
        href: ({ organizationCode }) =>
          organizationCode ? `/organizations/${organizationCode}/unit-types` : "/organizations",
        icon: FolderTree,
        isActive: isOrganizationalUnitTypesActive,
      },
    ],
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];
