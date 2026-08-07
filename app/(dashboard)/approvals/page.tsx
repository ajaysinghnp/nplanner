function ApprovalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Approvals</h2>

          <p className="text-muted-foreground text-sm">
            View and manage workflow approvals and revision requests.
          </p>
        </div>
      </div>

      <div className="bg-background rounded-lg border p-6">
        <p className="text-muted-foreground text-sm">
          Pending event approvals and revision requests will be available here.
        </p>
      </div>
    </div>
  );
}

export default ApprovalsPage;
