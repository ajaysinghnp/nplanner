"use client";

import { Pencil } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

import type { Organization } from "@/generated/prisma/client";

import { initialUpdateOrganizationActionState } from "@/app/(dashboard)/organizations/[code]/action-state";
import { updateOrganizationAction } from "@/app/(dashboard)/organizations/[code]/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EditOrganizationDialogProps = {
  organization: Organization;
};

export function EditOrganizationDialog({ organization }: EditOrganizationDialogProps) {
  const [open, setOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(
    updateOrganizationAction,
    initialUpdateOrganizationActionState
  );

  useEffect(() => {
    if (!state.success) {
      return;
    }

    const closeDialogTimeout = window.setTimeout(() => {
      setOpen(false);
    }, 0);

    return () => {
      window.clearTimeout(closeDialogTimeout);
    };
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="sm">
          <Pencil className="size-4" />

          <span className="p-4">Edit</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit organization</DialogTitle>

          <DialogDescription>
            Update the organization information. The organization code cannot be changed after
            creation.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="grid gap-5">
          <input type="hidden" name="id" value={organization.id} />

          <div className="grid gap-2">
            <Label htmlFor={`organization-code-${organization.id}`}>Organization code</Label>

            <Input
              id={`organization-code-${organization.id}`}
              value={organization.code}
              readOnly
              disabled
            />

            <p className="text-muted-foreground text-xs">
              Organization codes are permanent and cannot be changed.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`organization-name-en-${organization.id}`}>
              Organization name (English)
            </Label>

            <Input
              id={`organization-name-en-${organization.id}`}
              name="nameEn"
              defaultValue={organization.nameEn}
              placeholder="Enter the organization name"
              autoComplete="organization"
              required
              disabled={isPending}
            />

            {state.fieldErrors?.nameEn ? (
              <p className="text-destructive text-sm">{state.fieldErrors.nameEn[0]}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor={`organization-name-ne-${organization.id}`}>
              Organization name (Nepali)
            </Label>

            <Input
              id={`organization-name-ne-${organization.id}`}
              name="nameNe"
              defaultValue={organization.nameNe ?? ""}
              placeholder="संस्थाको नाम लेख्नुहोस्"
              disabled={isPending}
            />

            {state.fieldErrors?.nameNe ? (
              <p className="text-destructive text-sm">{state.fieldErrors.nameNe[0]}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor={`organization-short-name-en-${organization.id}`}>
                Short name (English)
              </Label>

              <Input
                id={`organization-short-name-en-${organization.id}`}
                name="shortNameEn"
                defaultValue={organization.shortNameEn ?? ""}
                placeholder="Enter the short name"
                disabled={isPending}
              />

              {state.fieldErrors?.shortNameEn ? (
                <p className="text-destructive text-sm">{state.fieldErrors.shortNameEn[0]}</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor={`organization-short-name-ne-${organization.id}`}>
                Short name (Nepali)
              </Label>

              <Input
                id={`organization-short-name-ne-${organization.id}`}
                name="shortNameNe"
                defaultValue={organization.shortNameNe ?? ""}
                placeholder="छोटो नाम लेख्नुहोस्"
                disabled={isPending}
              />

              {state.fieldErrors?.shortNameNe ? (
                <p className="text-destructive text-sm">{state.fieldErrors.shortNameNe[0]}</p>
              ) : null}
            </div>
          </div>

          {state.message && !state.success ? (
            <div
              className="border-destructive/30 bg-destructive/10 text-destructive rounded-md border px-3 py-2 text-sm"
              role="alert"
            >
              {state.message}
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
