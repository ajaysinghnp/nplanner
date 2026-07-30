import { Building2, CalendarDays, CheckSquare, ClipboardCheck, Settings } from "lucide-react";

export const navigationItems = [
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
