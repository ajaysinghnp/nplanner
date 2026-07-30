"use client";

import { Plus } from "lucide-react";
import { useActionState, useState } from "react";

import { initialCreateOrganizationActionState } from "@/app/(dashboard)/organizations/action-state";
import { createOrganizationAction } from "@/app/(dashboard)/organizations/actions";
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

export function CreateOrganizationDialog() {
  const [open, setOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(
    createOrganizationAction,
    initialCreateOrganizationActionState
  );

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium shadow-xs transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
        <Plus />
        Add organization
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Create organization</DialogTitle>

          <DialogDescription>
            Add a new organization to NPlanner. Organization codes must be unique and use uppercase
            letters, numbers, and single hyphens.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="grid gap-5">
          <div className="grid gap-2">
            <Label htmlFor="organization-code">Organization code</Label>

            <Input
              autoCapitalize="characters"
              autoComplete="off"
              id="organization-code"
              name="code"
              placeholder="NPLANNER"
              required
            />

            {state.fieldErrors?.code?.map((error) => (
              <p className="text-destructive text-sm" key={error}>
                {error}
              </p>
            ))}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="organization-name-en">Organization name</Label>

            <Input id="organization-name-en" name="nameEn" placeholder="NPlanner" required />

            {state.fieldErrors?.nameEn?.map((error) => (
              <p className="text-destructive text-sm" key={error}>
                {error}
              </p>
            ))}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="organization-name-ne">
                Nepali name
                <span className="text-muted-foreground"> (optional)</span>
              </Label>

              <Input id="organization-name-ne" name="nameNe" placeholder="एनप्लानर" />

              {state.fieldErrors?.nameNe?.map((error) => (
                <p className="text-destructive text-sm" key={error}>
                  {error}
                </p>
              ))}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="organization-short-name-en">
                English short name
                <span className="text-muted-foreground"> (optional)</span>
              </Label>

              <Input id="organization-short-name-en" name="shortNameEn" placeholder="NPlanner" />

              {state.fieldErrors?.shortNameEn?.map((error) => (
                <p className="text-destructive text-sm" key={error}>
                  {error}
                </p>
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="organization-short-name-ne">
              Nepali short name
              <span className="text-muted-foreground"> (optional)</span>
            </Label>

            <Input id="organization-short-name-ne" name="shortNameNe" placeholder="एनप्लानर" />

            {state.fieldErrors?.shortNameNe?.map((error) => (
              <p className="text-destructive text-sm" key={error}>
                {error}
              </p>
            ))}
          </div>

          {state.message ? (
            <p
              aria-live="polite"
              className={
                state.success
                  ? "text-sm text-green-600 dark:text-green-400"
                  : "text-destructive text-sm"
              }
            >
              {state.message}
            </p>
          ) : null}

          <div className="flex justify-end">
            <Button disabled={isPending} type="submit">
              {isPending ? "Creating..." : "Create organization"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
