import { Building2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getOrganizations } from "@/lib/organizations/organization.service";

export const dynamic = "force-dynamic";

export default async function OrganizationsPage() {
  const organizations = await getOrganizations();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Organizations</h1>

          <p className="text-muted-foreground">
            Manage organizations and their organizational structure.
          </p>
        </div>

        <Button disabled>
          <Plus />
          Add organization
        </Button>
      </div>

      {organizations.length === 0 ? (
        <div className="border-border bg-card flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
          <Building2 className="text-muted-foreground mb-4 size-10" />

          <h2 className="text-lg font-semibold">No organizations found</h2>

          <p className="text-muted-foreground mt-2 max-w-md text-sm">
            Create an organization to begin managing organizational units, memberships, events, and
            approvals.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {organizations.map((organization) => (
            <article
              key={organization.id}
              className="border-border bg-card rounded-xl border p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                    <Building2 className="size-5" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate font-semibold">{organization.nameEn}</h2>

                    {organization.nameNe ? (
                      <p className="text-muted-foreground truncate text-sm">
                        {organization.nameNe}
                      </p>
                    ) : null}
                  </div>
                </div>

                <span className="bg-muted text-muted-foreground rounded-md px-2 py-1 font-mono text-xs">
                  {organization.code}
                </span>
              </div>

              <div className="text-muted-foreground mt-5 flex items-center justify-between border-t pt-4 text-sm">
                <span>
                  {organization.shortNameEn ?? organization.shortNameNe ?? "No short name"}
                </span>

                <span>{organization.status}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
