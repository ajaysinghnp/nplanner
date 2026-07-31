import { Building2, Layers3 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CreateOrganizationalUnitTypeDialog } from "@/components/organizations/units/create-organizational-unit-type-dialog";
import { DeleteOrganizationalUnitTypeDialog } from "@/components/organizations/units/delete-organizational-unit-type-dialog";
import { EditOrganizationalUnitTypeDialog } from "@/components/organizations/units/edit-organizational-unit-type-dialog";
import { Button } from "@/components/ui/button";
import { getOrganizationByCode } from "@/lib/organizations/organization.service";
import { getOrganizationalUnitTypes } from "@/lib/organizations/units/organizational-unit-type.service";

export const dynamic = "force-dynamic";

type OrganizationUnitsPageProps = {
  params: Promise<{
    code: string;
  }>;
};

export default async function OrganizationUnitsPage({ params }: OrganizationUnitsPageProps) {
  const { code } = await params;

  const organization = await getOrganizationByCode(code);

  if (!organization) {
    notFound();
  }

  const unitTypes = await getOrganizationalUnitTypes(organization.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Link
            href="/organizations"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Organizations
          </Link>

          <span className="text-muted-foreground">/</span>

          <Link
            href={`/organizations/${organization.code}`}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {organization.code}
          </Link>

          <span className="text-muted-foreground">/</span>

          <span className="text-foreground">Units</span>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="bg-primary/10 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl">
              <Building2 className="size-5" />
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight">Organizational units</h1>

              <p className="text-muted-foreground mt-1">
                Manage organizational unit types and organizational units for{" "}
                <span className="text-foreground font-medium">{organization.nameEn}</span>.
              </p>
            </div>
          </div>

          <CreateOrganizationalUnitTypeDialog
            organizationId={organization.id}
            organizationCode={organization.code}
          />
        </div>
      </div>

      <section className="border-border bg-card overflow-hidden rounded-xl border">
        <div className="flex items-start gap-3 border-b p-5">
          <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
            <Layers3 className="size-5" />
          </div>

          <div>
            <h2 className="font-semibold">Organizational unit types</h2>

            <p className="text-muted-foreground mt-1 text-sm">
              Define the categories used to classify organizational units, such as departments,
              divisions, branches, offices, or sections.
            </p>
          </div>
        </div>

        {unitTypes.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
            <Layers3 className="text-muted-foreground mb-4 size-10" />

            <h3 className="text-lg font-semibold">No organizational unit types found</h3>

            <p className="text-muted-foreground mt-2 max-w-md text-sm">
              Create an organizational unit type to begin defining the structure of{" "}
              {organization.nameEn}.
            </p>

            <p className="text-muted-foreground mt-5 text-sm">
              Use the <span className="font-medium">Add unit type</span> button above to create the
              first unit type.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {unitTypes.map((unitType) => (
              <article
                key={unitType.id}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
                    <Layers3 className="size-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{unitType.nameEn}</h3>

                      <span className="bg-muted text-muted-foreground rounded-md px-2 py-0.5 font-mono text-xs">
                        {unitType.code}
                      </span>
                    </div>

                    {unitType.nameNe ? (
                      <p className="text-muted-foreground mt-1 text-sm">{unitType.nameNe}</p>
                    ) : null}

                    <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                      <span>
                        Short name:{" "}
                        {unitType.shortNameEn || unitType.shortNameNe || "Not specified"}
                      </span>

                      <span>Sort order: {unitType.sortOrder}</span>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <span className="bg-muted text-muted-foreground rounded-md px-2 py-1 text-xs">
                    {unitType.status}
                  </span>
                  <EditOrganizationalUnitTypeDialog
                    organizationCode={organization.code}
                    unitType={unitType}
                  />
                  <DeleteOrganizationalUnitTypeDialog
                    organizationCode={organization.code}
                    unitType={unitType}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="border-border bg-muted/30 rounded-xl border border-dashed p-6">
        <h2 className="font-semibold">Organizational units</h2>

        <p className="text-muted-foreground mt-1 text-sm">
          Organizational unit management will be added after unit-type management is complete.
        </p>

        <Button variant="outline" className="mt-4" disabled>
          Manage organizational units
        </Button>
      </section>
    </div>
  );
}
