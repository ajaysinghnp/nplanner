"use client";

import { Plus } from "lucide-react";
import { useActionState, useEffect, useEffectEvent, useState } from "react";

import { initialCreateOrganizationalUnitTypeActionState } from "@/app/(dashboard)/organizations/[code]/units/action-state";
import { createOrganizationalUnitTypeAction } from "@/app/(dashboard)/organizations/[code]/units/actions";
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

type CreateOrganizationalUnitTypeDialogProps = {
  organizationId: string;
  organizationCode: string;
};

export function CreateOrganizationalUnitTypeDialog({
  organizationId,
  organizationCode,
}: CreateOrganizationalUnitTypeDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Add unit type
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create organizational unit type</DialogTitle>

          <DialogDescription>
            Define a type that can be used to classify organizational units, such as a department,
            division, section, branch, or office.
          </DialogDescription>
        </DialogHeader>

        <CreateOrganizationalUnitTypeDialogForm
          organizationId={organizationId}
          organizationCode={organizationCode}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

type CreateOrganizationalUnitTypeDialogFormProps = {
  organizationId: string;
  organizationCode: string;
  onSuccess: () => void;
};

function CreateOrganizationalUnitTypeDialogForm({
  organizationId,
  organizationCode,
  onSuccess,
}: CreateOrganizationalUnitTypeDialogFormProps) {
  const [state, formAction, isPending] = useActionState(
    createOrganizationalUnitTypeAction,
    initialCreateOrganizationalUnitTypeActionState
  );

  const handleSuccess = useEffectEvent(() => {
    onSuccess();
  });

  useEffect(() => {
    if (state.success) {
      handleSuccess();
    }
  }, [state.success]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="organizationId" value={organizationId} />

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
          <Label htmlFor="unit-type-code">
            Code <span className="text-destructive">*</span>
          </Label>

          <Input
            id="unit-type-code"
            name="code"
            placeholder="DEPARTMENT"
            autoComplete="off"
            autoCapitalize="characters"
            defaultValue=""
            aria-invalid={Boolean(state.fieldErrors?.code)}
            aria-describedby={state.fieldErrors?.code ? "unit-type-code-error" : undefined}
          />

          {state.fieldErrors?.code?.[0] ? (
            <p id="unit-type-code-error" className="text-destructive text-sm">
              {state.fieldErrors.code[0]}
            </p>
          ) : (
            <p className="text-muted-foreground text-xs">
              Use uppercase letters, numbers, and hyphens only.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit-type-sort-order">
            Sort order <span className="text-destructive">*</span>
          </Label>

          <Input
            id="unit-type-sort-order"
            name="sortOrder"
            type="number"
            min="0"
            max="999999"
            step="1"
            defaultValue="0"
            aria-invalid={Boolean(state.fieldErrors?.sortOrder)}
            aria-describedby={
              state.fieldErrors?.sortOrder ? "unit-type-sort-order-error" : undefined
            }
          />

          {state.fieldErrors?.sortOrder?.[0] ? (
            <p id="unit-type-sort-order-error" className="text-destructive text-sm">
              {state.fieldErrors.sortOrder[0]}
            </p>
          ) : (
            <p className="text-muted-foreground text-xs">Lower numbers appear first.</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="unit-type-name-en">
          English name <span className="text-destructive">*</span>
        </Label>

        <Input
          id="unit-type-name-en"
          name="nameEn"
          placeholder="Department"
          autoComplete="off"
          defaultValue=""
          aria-invalid={Boolean(state.fieldErrors?.nameEn)}
          aria-describedby={state.fieldErrors?.nameEn ? "unit-type-name-en-error" : undefined}
        />

        {state.fieldErrors?.nameEn?.[0] ? (
          <p id="unit-type-name-en-error" className="text-destructive text-sm">
            {state.fieldErrors.nameEn[0]}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <Label htmlFor="unit-type-name-ne">Nepali name</Label>

        <Input
          id="unit-type-name-ne"
          name="nameNe"
          placeholder="विभाग"
          autoComplete="off"
          defaultValue=""
          aria-invalid={Boolean(state.fieldErrors?.nameNe)}
          aria-describedby={state.fieldErrors?.nameNe ? "unit-type-name-ne-error" : undefined}
        />

        {state.fieldErrors?.nameNe?.[0] ? (
          <p id="unit-type-name-ne-error" className="text-destructive text-sm">
            {state.fieldErrors.nameNe[0]}
          </p>
        ) : null}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="unit-type-short-name-en">English short name</Label>

          <Input
            id="unit-type-short-name-en"
            name="shortNameEn"
            placeholder="Dept."
            autoComplete="off"
            defaultValue=""
            aria-invalid={Boolean(state.fieldErrors?.shortNameEn)}
            aria-describedby={
              state.fieldErrors?.shortNameEn ? "unit-type-short-name-en-error" : undefined
            }
          />

          {state.fieldErrors?.shortNameEn?.[0] ? (
            <p id="unit-type-short-name-en-error" className="text-destructive text-sm">
              {state.fieldErrors.shortNameEn[0]}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="unit-type-short-name-ne">Nepali short name</Label>

          <Input
            id="unit-type-short-name-ne"
            name="shortNameNe"
            placeholder="वि."
            autoComplete="off"
            defaultValue=""
            aria-invalid={Boolean(state.fieldErrors?.shortNameNe)}
            aria-describedby={
              state.fieldErrors?.shortNameNe ? "unit-type-short-name-ne-error" : undefined
            }
          />

          {state.fieldErrors?.shortNameNe?.[0] ? (
            <p id="unit-type-short-name-ne-error" className="text-destructive text-sm">
              {state.fieldErrors.shortNameNe[0]}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="unit-type-status">
          Status <span className="text-destructive">*</span>
        </Label>

        <select
          id="unit-type-status"
          name="status"
          defaultValue="ACTIVE"
          className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-1"
          aria-invalid={Boolean(state.fieldErrors?.status)}
          aria-describedby={state.fieldErrors?.status ? "unit-type-status-error" : undefined}
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="ARCHIVED">Archived</option>
        </select>

        {state.fieldErrors?.status?.[0] ? (
          <p id="unit-type-status-error" className="text-destructive text-sm">
            {state.fieldErrors.status[0]}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" disabled={isPending} onClick={() => onSuccess()}>
          Cancel
        </Button>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Creating..." : "Create unit type"}
        </Button>
      </div>
    </form>
  );
}
