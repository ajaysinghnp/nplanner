function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>

          <p className="text-muted-foreground text-sm">
            View and manage application, language, calendar dataset, and user settings.
          </p>
        </div>
      </div>

      <div className="bg-background rounded-lg border p-6">
        <p className="text-muted-foreground text-sm">
          Application, language, calendar dataset, and user settings will be available here.
        </p>
      </div>
    </div>
  );
}

export default SettingsPage;
