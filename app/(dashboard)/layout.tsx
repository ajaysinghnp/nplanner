import type { ReactNode } from "react";

import { DashboardShell } from "@/components/layout/dashboard-shell";

type DashboardLayoutProps = {
  children: ReactNode;
};

function DashboardLayout({ children }: DashboardLayoutProps) {
  return <DashboardShell>{children}</DashboardShell>;
}

export default DashboardLayout;
