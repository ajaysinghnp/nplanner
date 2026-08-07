"use client";

import Link from "next/link";

import SidebarNavigation from "@/components/layout/sidebar-navigation";

export function AppSidebar() {
  return (
    <aside className="bg-background flex w-64 shrink-0 flex-col border-r">
      <div className="flex h-16 items-center border-b px-6">
        <Link className="text-xl font-semibold tracking-tight" href="/calendar">
          NPlanner
        </Link>
      </div>

      <SidebarNavigation />

      <div className="border-t p-4">
        <p className="text-muted-foreground text-xs">NPlanner — Work and Event Planning</p>
      </div>
    </aside>
  );
}
