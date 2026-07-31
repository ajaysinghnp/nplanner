// app/(dashboard)/organizations/[code]/page.tsx

import { notFound } from "next/navigation";

import { DeleteOrganizationDialog } from "@/components/organizations/delete-organization-dialog";
import { EditOrganizationDialog } from "@/components/organizations/edit-organization-dialog";
import { getOrganizationByCode } from "@/lib/organizations/organization.service";

type OrganizationDetailsPageProps = {
  params: Promise<{
    code: string;
  }>;
};

export default async function OrganizationDetailsPage({ params }: OrganizationDetailsPageProps) {
  const { code } = await params;

  const organization = await getOrganizationByCode(code);

  if (!organization) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{organization.nameEn}</h1>

            <span className="bg-muted text-muted-foreground rounded-md px-2 py-1 font-mono text-xs">
              {organization.code}
            </span>
          </div>

          {organization.nameNe ? (
            <p className="text-muted-foreground mt-1">{organization.nameNe}</p>
          ) : null}

          <p className="text-muted-foreground mt-2">
            Manage organization information and organizational structure.
          </p>
        </div>

        <div className="mr-8 flex flex-wrap items-center gap-4">
          <EditOrganizationDialog organization={organization} />
          <DeleteOrganizationDialog organization={organization} />
        </div>
      </div>

      <section className="border-border bg-card rounded-xl border p-6">
        <h2 className="text-lg font-semibold">Organization information</h2>

        <dl className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground text-sm">Organization code</dt>

            <dd className="mt-1 font-medium">{organization.code}</dd>
          </div>

          <div>
            <dt className="text-muted-foreground text-sm">Status</dt>

            <dd className="mt-1 font-medium">{organization.status}</dd>
          </div>

          <div>
            <dt className="text-muted-foreground text-sm">English short name</dt>

            <dd className="mt-1 font-medium">{organization.shortNameEn || "Not provided"}</dd>
          </div>

          <div>
            <dt className="text-muted-foreground text-sm">Nepali short name</dt>

            <dd className="mt-1 font-medium">{organization.shortNameNe || "Not provided"}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
