import { Languages, UserCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export function AppHeader() {
  return (
    <header className="bg-background flex h-16 items-center justify-between border-b px-6">
      <div>
        <h1 className="text-lg font-semibold">NPlanner</h1>
        <p className="text-muted-foreground text-xs">Work and event planning system</p>
      </div>

      <div className="flex items-center gap-2">
        <Button size="icon" type="button" variant="ghost">
          <Languages className="size-4" />
          <span className="sr-only">Change language</span>
        </Button>

        <Button className="gap-2" type="button" variant="ghost">
          <UserCircle className="size-5" />
          <span>Guest User</span>
        </Button>
      </div>
    </header>
  );
}
