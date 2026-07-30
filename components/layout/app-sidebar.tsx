"use client";

import { Building2, CalendarDays, CheckSquare, ClipboardCheck, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navigationItems = [
  {
    href: "/calendar",
    icon: CalendarDays,
    label: "Calendar",
  },
  {
    href: "/events",
    icon: CheckSquare,
    label: "Events",
  },
  {
    href: "/approvals",
    icon: ClipboardCheck,
    label: "Approvals",
  },
  {
    href: "/organizations",
    icon: Building2,
    label: "Organizations",
  },
  {
    href: "/settings",
    icon: Settings,
    label: "Settings",
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-background flex w-64 shrink-0 flex-col border-r">
      <div className="flex h-16 items-center border-b px-6">
        <Link className="text-xl font-semibold tracking-tight" href="/calendar">
          NPlanner
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navigationItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;

          return (
            <Link
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              href={href}
              key={href}
            >
              <Icon className="size-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <p className="text-muted-foreground text-xs">NPlanner — Work and Event Planning</p>
      </div>
    </aside>
  );
}
