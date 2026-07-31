"use client";

import { AlertTriangle, LoaderCircle, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import { deleteOrganizationAction } from "@/app/(dashboard)/organizations/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type DeleteOrganizationDialogProps = {
  organization: {
    code: string;
    id: string;
    nameEn: string;
    nameNe: string | null;
  };
  redirectAfterDelete?: boolean;
};

export function DeleteOrganizationDialog({
  organization,
  redirectAfterDelete = false,
}: DeleteOrganizationDialogProps) {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [confirmationCode, setConfirmationCode] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const isConfirmationValid = confirmationCode.trim() === organization.code;

  function handleOpenChange(nextOpen: boolean) {
    if (isDeleting) {
      return;
    }

    setOpen(nextOpen);

    if (!nextOpen) {
      setConfirmationCode("");
      setErrorMessage(undefined);
    }
  }

  async function handleDelete() {
    if (!isConfirmationValid || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage(undefined);

    try {
      const result = await deleteOrganizationAction(organization.id, confirmationCode);

      if (!result.success) {
        setErrorMessage(result.message ?? "Failed to delete the organization.");

        return;
      }

      setOpen(false);
      setConfirmationCode("");

      if (redirectAfterDelete) {
        router.push("/organizations");
        router.refresh();

        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Failed to delete organization:", error);

      setErrorMessage(
        error instanceof Error ? error.message : "Failed to delete the organization."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive" size="sm">
          <Trash2 className="size-4" />
          Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="bg-destructive/10 text-destructive mb-2 flex size-10 items-center justify-center rounded-full">
            <AlertTriangle className="size-5" />
          </div>

          <AlertDialogTitle>Delete organization?</AlertDialogTitle>

          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="text-foreground font-medium">{organization.nameEn}</span>. This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-2">
          <div className="bg-muted rounded-lg border p-4">
            <p className="text-muted-foreground text-xs">Organization code</p>

            <p className="mt-1 font-mono text-sm font-semibold">{organization.code}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`delete-organization-${organization.id}`}>
              Type <span className="font-mono font-semibold">{organization.code}</span> to confirm
            </Label>

            <Input
              id={`delete-organization-${organization.id}`}
              value={confirmationCode}
              onChange={(event) => {
                setConfirmationCode(event.target.value);

                if (errorMessage) {
                  setErrorMessage(undefined);
                }
              }}
              placeholder={organization.code}
              autoComplete="off"
              autoCapitalize="characters"
              disabled={isDeleting}
              aria-invalid={Boolean(errorMessage)}
            />

            {errorMessage ? (
              <p className="text-destructive text-sm" role="alert">
                {errorMessage}
              </p>
            ) : (
              <p className="text-muted-foreground text-xs">
                The organization code must match exactly.
              </p>
            )}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>

          <AlertDialogAction
            type="button"
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
            disabled={!isConfirmationValid || isDeleting}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            {isDeleting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                Delete organization
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
