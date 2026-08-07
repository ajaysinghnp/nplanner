function EventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Events</h2>

          <p className="text-muted-foreground text-sm">
            View and manage events, filters, status, priority, progress, and date-range views.
          </p>
        </div>
      </div>

      <div className="bg-background rounded-lg border p-6">
        <p className="text-muted-foreground text-sm">
          Event list, filters, status, priority, progress, and date-range views will be available
          here.
        </p>
      </div>
    </div>
  );
}

export default EventsPage;
