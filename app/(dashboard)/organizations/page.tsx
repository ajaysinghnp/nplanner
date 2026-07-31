import { Building2, Circle } from "lucide-react";
import Link from "next/link";

import { CreateOrganizationDialog } from "@/components/organizations/create-organization-dialog";
import { DeleteOrganizationDialog } from "@/components/organizations/delete-organization-dialog";
import { EditOrganizationDialog } from "@/components/organizations/edit-organization-dialog";
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

        <CreateOrganizationDialog />
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
          {organizations.map((organization) => {
            const isActive = organization.status === "ACTIVE";

            const shortName =
              organization.shortNameEn ?? organization.shortNameNe ?? "No short name";

            return (
              <article
                key={organization.id}
                className="border-border bg-card hover:border-primary/40 rounded-xl border shadow-sm transition-colors"
              >
                <Link
                  href={`/organizations/${organization.code}`}
                  className="hover:bg-accent/30 focus-visible:ring-ring block rounded-xl p-5 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
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

                    <span className="bg-muted text-muted-foreground shrink-0 rounded-md px-2 py-1 font-mono text-xs">
                      {organization.code}
                    </span>
                  </div>

                  <div className="mt-5 flex min-w-0 items-center gap-4 border-t pt-4">
                    <p className="text-muted-foreground min-w-0 flex-1 truncate text-sm">
                      {shortName}
                    </p>

                    <div className="text-muted-foreground flex shrink-0 items-center gap-1.5">
                      <Circle
                        className={
                          isActive
                            ? "size-2.5 fill-green-500 text-green-500"
                            : "size-2.5 fill-red-500 text-red-500"
                        }
                        aria-hidden="true"
                      />

                      <span className="text-xs">{organization.status}</span>
                    </div>
                  </div>
                </Link>

                <div className="border-border flex items-center justify-end gap-2 border-t px-5 py-3">
                  <EditOrganizationDialog organization={organization} />

                  <DeleteOrganizationDialog organization={organization} />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
