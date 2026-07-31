"use client";

import { Pencil } from "lucide-react";
import { useActionState, useEffect, useEffectEvent, useState } from "react";

import { initialUpdateOrganizationalUnitTypeActionState } from "@/app/(dashboard)/organizations/[code]/units/action-state";
import { updateOrganizationalUnitTypeAction } from "@/app/(dashboard)/organizations/[code]/units/actions";
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

type OrganizationalUnitType = {
  id: string;
  code: string;
  nameEn: string;
  nameNe: string | null;
  shortNameEn: string | null;
  shortNameNe: string | null;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
};

type EditOrganizationalUnitTypeDialogProps = {
  organizationCode: string;
  unitType: OrganizationalUnitType;
};

export function EditOrganizationalUnitTypeDialog({
  organizationCode,
  unitType,
}: EditOrganizationalUnitTypeDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="icon" aria-label={`Edit ${unitType.nameEn}`}>
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit organizational unit type</DialogTitle>

          <DialogDescription>
            Update the organizational unit type details. The unit type code cannot be changed.
          </DialogDescription>
        </DialogHeader>

        <EditOrganizationalUnitTypeDialogForm
          organizationCode={organizationCode}
          unitType={unitType}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

type EditOrganizationalUnitTypeDialogFormProps = {
  organizationCode: string;
  unitType: OrganizationalUnitType;
  onClose: () => void;
};

function EditOrganizationalUnitTypeDialogForm({
  organizationCode,
  unitType,
  onClose,
}: EditOrganizationalUnitTypeDialogFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateOrganizationalUnitTypeAction,
    initialUpdateOrganizationalUnitTypeActionState
  );

  const closeDialogOnSuccess = useEffectEvent(() => {
    onClose();
  });

  useEffect(() => {
    if (state.success) {
      closeDialogOnSuccess();
    }
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="id" value={unitType.id} />

      <input type="hidden" name="organizationCode" value={organizationCode} />

      {state.message && !state.success ? (
        <div
          className="border-destructive/30 bg-destructive/10 text-destructive rounded-lg border px-3 py-2 text-sm"
          role="alert"
        >
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`unit-type-code-${unitType.id}`}>Unit type code</Label>

          <Input
            id={`unit-type-code-${unitType.id}`}
            value={unitType.code}
            readOnly
            disabled
            className="font-mono"
          />

          <p className="text-muted-foreground text-xs">
            The unit type code is permanent and cannot be changed.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`unit-type-sort-order-${unitType.id}`}>Sort order</Label>

          <Input
            id={`unit-type-sort-order-${unitType.id}`}
            name="sortOrder"
            type="number"
            min="0"
            max="999999"
            step="1"
            defaultValue={unitType.sortOrder}
            aria-invalid={Boolean(state.fieldErrors?.sortOrder)}
          />

          {state.fieldErrors?.sortOrder?.[0] ? (
            <p className="text-destructive text-sm">{state.fieldErrors.sortOrder[0]}</p>
          ) : (
            <p className="text-muted-foreground text-xs">Lower numbers are displayed first.</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`unit-type-name-en-${unitType.id}`}>
          English name <span className="text-destructive">*</span>
        </Label>

        <Input
          id={`unit-type-name-en-${unitType.id}`}
          name="nameEn"
          defaultValue={unitType.nameEn}
          aria-invalid={Boolean(state.fieldErrors?.nameEn)}
        />

        {state.fieldErrors?.nameEn?.[0] ? (
          <p className="text-destructive text-sm">{state.fieldErrors.nameEn[0]}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`unit-type-name-ne-${unitType.id}`}>Nepali name</Label>

        <Input
          id={`unit-type-name-ne-${unitType.id}`}
          name="nameNe"
          defaultValue={unitType.nameNe ?? ""}
          aria-invalid={Boolean(state.fieldErrors?.nameNe)}
        />

        {state.fieldErrors?.nameNe?.[0] ? (
          <p className="text-destructive text-sm">{state.fieldErrors.nameNe[0]}</p>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`unit-type-short-name-en-${unitType.id}`}>English short name</Label>

          <Input
            id={`unit-type-short-name-en-${unitType.id}`}
            name="shortNameEn"
            defaultValue={unitType.shortNameEn ?? ""}
            aria-invalid={Boolean(state.fieldErrors?.shortNameEn)}
          />

          {state.fieldErrors?.shortNameEn?.[0] ? (
            <p className="text-destructive text-sm">{state.fieldErrors.shortNameEn[0]}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`unit-type-short-name-ne-${unitType.id}`}>Nepali short name</Label>

          <Input
            id={`unit-type-short-name-ne-${unitType.id}`}
            name="shortNameNe"
            defaultValue={unitType.shortNameNe ?? ""}
            aria-invalid={Boolean(state.fieldErrors?.shortNameNe)}
          />

          {state.fieldErrors?.shortNameNe?.[0] ? (
            <p className="text-destructive text-sm">{state.fieldErrors.shortNameNe[0]}</p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`unit-type-status-${unitType.id}`}>Status</Label>

        <select
          id={`unit-type-status-${unitType.id}`}
          name="status"
          defaultValue={unitType.status}
          className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-1"
          aria-invalid={Boolean(state.fieldErrors?.status)}
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="ARCHIVED">Archived</option>
        </select>

        {state.fieldErrors?.status?.[0] ? (
          <p className="text-destructive text-sm">{state.fieldErrors.status[0]}</p>
        ) : null}
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" disabled={isPending} onClick={onClose}>
          Cancel
        </Button>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
