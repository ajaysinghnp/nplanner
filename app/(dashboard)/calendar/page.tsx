import { Button } from "@/components/ui/button";

function CalendarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Calendar</h2>

          <p className="text-muted-foreground text-sm">
            View and manage work plans, events, and schedules.
          </p>
        </div>

        <Button type="button">Add event</Button>
      </div>

      <div className="bg-background rounded-lg border p-6">
        <p className="text-muted-foreground text-sm">
          The Nepali and Gregorian calendar interface will be implemented here.
        </p>
      </div>
    </div>
  );
}

export default CalendarPage;
