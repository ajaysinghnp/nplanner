"use client";

import { Trash2 } from "lucide-react";
import { useActionState, useCallback, useEffect, useState } from "react";

import { initialDeleteOrganizationalUnitActionState } from "@/app/(dashboard)/organizations/[code]/units/action-state";
import { deleteOrganizationalUnitAction } from "@/app/(dashboard)/organizations/[code]/units/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type OrganizationalUnit = {
  id: string;
  code: string;
  nameEn: string;
};

type DeleteOrganizationalUnitDialogProps = {
  organizationCode: string;
  unit: OrganizationalUnit;
};

export function DeleteOrganizationalUnitDialog({
  organizationCode,
  unit,
}: DeleteOrganizationalUnitDialogProps) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const handleSuccess = useCallback(() => {
    setOpen(false);
    setFormKey((currentKey) => currentKey + 1);
  }, []);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);

        if (!nextOpen) {
          setFormKey((currentKey) => currentKey + 1);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          size="icon"
          aria-label={`Delete ${unit.nameEn}`}
        >
          <Trash2 className="size-4" />

          <span className="sr-only">Delete {unit.nameEn}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete organizational unit</DialogTitle>

          <DialogDescription>
            This action cannot be undone. To confirm deletion, type the organizational unit code
            exactly as shown.
          </DialogDescription>
        </DialogHeader>

        <DeleteOrganizationalUnitForm
          key={formKey}
          organizationCode={organizationCode}
          unit={unit}
          onSuccess={handleSuccess}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

type DeleteOrganizationalUnitFormProps = {
  organizationCode: string;
  unit: OrganizationalUnit;
  onSuccess: () => void;
  onCancel: () => void;
};

function DeleteOrganizationalUnitForm({
  organizationCode,
  unit,
  onSuccess,
  onCancel,
}: DeleteOrganizationalUnitFormProps) {
  const [state, formAction, isPending] = useActionState(
    deleteOrganizationalUnitAction,
    initialDeleteOrganizationalUnitActionState
  );

  const [confirmationCode, setConfirmationCode] = useState("");

  const isConfirmationValid = confirmationCode === unit.code;

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="id" value={unit.id} />

      <input type="hidden" name="organizationCode" value={organizationCode} />

      <div className="border-destructive/30 bg-destructive/10 rounded-lg border p-4">
        <p className="text-sm">You are about to delete:</p>

        <p className="mt-1 font-semibold">{unit.nameEn}</p>

        <p className="text-muted-foreground mt-1 font-mono text-xs">{unit.code}</p>
      </div>

      {state.message && !state.success ? (
        <div
          className="border-destructive/30 bg-destructive/10 text-destructive rounded-lg border px-3 py-2 text-sm"
          role="alert"
        >
          {state.message}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor={`delete-unit-confirmation-${unit.id}`}>
          Type <span className="font-mono">{unit.code}</span> to confirm
        </Label>

        <Input
          id={`delete-unit-confirmation-${unit.id}`}
          name="confirmationCode"
          value={confirmationCode}
          onChange={(event) => {
            setConfirmationCode(event.target.value);
          }}
          placeholder={unit.code}
          autoComplete="off"
          autoFocus
        />

        {confirmationCode !== "" && !isConfirmationValid ? (
          <p className="text-destructive text-sm">The confirmation code does not match.</p>
        ) : null}
      </div>

      <DialogFooter className="flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" disabled={isPending} onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" variant="destructive" disabled={!isConfirmationValid || isPending}>
          <Trash2 className="size-4" />

          {isPending ? "Deleting..." : "Delete unit"}
        </Button>
      </DialogFooter>
    </form>
  );
}
