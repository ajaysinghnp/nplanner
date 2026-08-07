"use client";

import { Trash2 } from "lucide-react";
import { useActionState, useCallback, useEffect, useState } from "react";

import { initialDeleteOrganizationalUnitTypeActionState } from "@/app/(dashboard)/organizations/[code]/unit-types/action-state";
import { deleteOrganizationalUnitTypeAction } from "@/app/(dashboard)/organizations/[code]/unit-types/actions";
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
};

type DeleteOrganizationalUnitTypeDialogProps = {
  organizationCode: string;
  unitType: OrganizationalUnitType;
};

export function DeleteOrganizationalUnitTypeDialog({
  organizationCode,
  unitType,
}: DeleteOrganizationalUnitTypeDialogProps) {
  const [open, setOpen] = useState(false);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={`Delete ${unitType.nameEn}`}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete organizational unit type</DialogTitle>

          <DialogDescription>
            This action permanently deletes the organizational unit type and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DeleteOrganizationalUnitTypeForm
          organizationCode={organizationCode}
          unitType={unitType}
          onClose={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
}

type DeleteOrganizationalUnitTypeFormProps = {
  organizationCode: string;
  unitType: OrganizationalUnitType;
  onClose: () => void;
};

function DeleteOrganizationalUnitTypeForm({
  organizationCode,
  unitType,
  onClose,
}: DeleteOrganizationalUnitTypeFormProps) {
  const [confirmationCode, setConfirmationCode] = useState("");

  const [state, formAction, isPending] = useActionState(
    deleteOrganizationalUnitTypeAction,
    initialDeleteOrganizationalUnitTypeActionState
  );

  useEffect(() => {
    if (state.success) {
      onClose();
    }
  }, [state.success, onClose]);

  const isConfirmationValid = confirmationCode.trim() === unitType.code;

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

      <div className="space-y-2">
        <p className="text-sm">
          You are about to permanently delete{" "}
          <span className="font-semibold">{unitType.nameEn}</span>.
        </p>

        <p className="text-muted-foreground text-sm">
          To confirm, type the organizational unit type code{" "}
          <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-xs">{unitType.code}</code>{" "}
          below.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`confirmation-code-${unitType.id}`}>Organizational unit type code</Label>

        <Input
          id={`confirmation-code-${unitType.id}`}
          name="confirmationCode"
          value={confirmationCode}
          onChange={(event) => setConfirmationCode(event.target.value)}
          placeholder={unitType.code}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          className="font-mono"
          aria-invalid={confirmationCode.length > 0 && !isConfirmationValid}
        />

        {confirmationCode.length > 0 && !isConfirmationValid ? (
          <p className="text-destructive text-sm">The entered code does not match.</p>
        ) : null}
      </div>

      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" disabled={isPending} onClick={onClose}>
          Cancel
        </Button>

        <Button type="submit" variant="destructive" disabled={isPending || !isConfirmationValid}>
          <Trash2 className="size-4" />

          {isPending ? "Deleting..." : "Delete unit type"}
        </Button>
      </div>
    </form>
  );
}
