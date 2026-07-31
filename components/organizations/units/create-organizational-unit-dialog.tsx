"use client";

import { Plus } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

import { initialCreateOrganizationalUnitActionState } from "@/app/(dashboard)/organizations/[code]/units/action-state";
import { createOrganizationalUnitAction } from "@/app/(dashboard)/organizations/[code]/units/actions";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type UnitTypeOption = {
  id: string;
  code: string;
  nameEn: string;
  nameNe: string | null;
};

type ParentUnitOption = {
  id: string;
  code: string;
  nameEn: string;
  nameNe: string | null;
};

type CreateOrganizationalUnitDialogProps = {
  organizationId: string;
  organizationCode: string;
  unitTypes: UnitTypeOption[];
  parentUnits: ParentUnitOption[];
};

export function CreateOrganizationalUnitDialog({
  organizationId,
  organizationCode,
  unitTypes,
  parentUnits,
}: CreateOrganizationalUnitDialogProps) {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

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
        <Button type="button">
          <Plus className="size-4" />
          Add unit
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add organizational unit</DialogTitle>

          <DialogDescription>
            Create an organizational unit and optionally assign its type and parent unit.
          </DialogDescription>
        </DialogHeader>

        <CreateOrganizationalUnitForm
          key={formKey}
          organizationId={organizationId}
          organizationCode={organizationCode}
          unitTypes={unitTypes}
          parentUnits={parentUnits}
          onSuccess={() => {
            setOpen(false);
            setFormKey((currentKey) => currentKey + 1);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

type CreateOrganizationalUnitFormProps = {
  organizationId: string;
  organizationCode: string;
  unitTypes: UnitTypeOption[];
  parentUnits: ParentUnitOption[];
  onSuccess: () => void;
};

function CreateOrganizationalUnitForm({
  organizationId,
  organizationCode,
  unitTypes,
  parentUnits,
  onSuccess,
}: CreateOrganizationalUnitFormProps) {
  const [state, formAction, isPending] = useActionState(
    createOrganizationalUnitAction,
    initialCreateOrganizationalUnitActionState
  );

  const [unitTypeId, setUnitTypeId] = useState("");
  const [parentId, setParentId] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="organizationId" value={organizationId} />

      <input type="hidden" name="organizationCode" value={organizationCode} />

      <input type="hidden" name="unitTypeId" value={unitTypeId} />

      <input type="hidden" name="parentId" value={parentId} />

      <input type="hidden" name="status" value={status} />

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
          <Label htmlFor="organizational-unit-code">Unit code</Label>

          <Input
            id="organizational-unit-code"
            name="code"
            placeholder="HEAD-OFFICE"
            autoComplete="off"
            aria-invalid={Boolean(state.fieldErrors?.code)}
          />

          {state.fieldErrors?.code?.map((error) => (
            <p key={error} className="text-destructive text-sm">
              {error}
            </p>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizational-unit-sort-order">Sort order</Label>

          <Input
            id="organizational-unit-sort-order"
            name="sortOrder"
            type="number"
            min="0"
            defaultValue="0"
            aria-invalid={Boolean(state.fieldErrors?.sortOrder)}
          />

          {state.fieldErrors?.sortOrder?.map((error) => (
            <p key={error} className="text-destructive text-sm">
              {error}
            </p>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizational-unit-name-en">English name</Label>

          <Input
            id="organizational-unit-name-en"
            name="nameEn"
            placeholder="Head Office"
            autoComplete="off"
            aria-invalid={Boolean(state.fieldErrors?.nameEn)}
          />

          {state.fieldErrors?.nameEn?.map((error) => (
            <p key={error} className="text-destructive text-sm">
              {error}
            </p>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizational-unit-name-ne">Nepali name</Label>

          <Input
            id="organizational-unit-name-ne"
            name="nameNe"
            placeholder="प्रधान कार्यालय"
            autoComplete="off"
            aria-invalid={Boolean(state.fieldErrors?.nameNe)}
          />

          {state.fieldErrors?.nameNe?.map((error) => (
            <p key={error} className="text-destructive text-sm">
              {error}
            </p>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizational-unit-short-name-en">English short name</Label>

          <Input
            id="organizational-unit-short-name-en"
            name="shortNameEn"
            placeholder="HO"
            autoComplete="off"
            aria-invalid={Boolean(state.fieldErrors?.shortNameEn)}
          />

          {state.fieldErrors?.shortNameEn?.map((error) => (
            <p key={error} className="text-destructive text-sm">
              {error}
            </p>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor="organizational-unit-short-name-ne">Nepali short name</Label>

          <Input
            id="organizational-unit-short-name-ne"
            name="shortNameNe"
            placeholder="प्र.का."
            autoComplete="off"
            aria-invalid={Boolean(state.fieldErrors?.shortNameNe)}
          />

          {state.fieldErrors?.shortNameNe?.map((error) => (
            <p key={error} className="text-destructive text-sm">
              {error}
            </p>
          ))}
        </div>

        <div className="space-y-2">
          <Label>Unit type</Label>

          <Select
            value={unitTypeId || "__none__"}
            onValueChange={(value) => {
              setUnitTypeId(value === "__none__" ? "" : value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a unit type" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="__none__">No unit type</SelectItem>

              {unitTypes.map((unitType) => (
                <SelectItem key={unitType.id} value={unitType.id}>
                  {unitType.nameEn} ({unitType.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Parent unit</Label>

          <Select
            value={parentId || "__none__"}
            onValueChange={(value) => {
              setParentId(value === "__none__" ? "" : value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a parent unit" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="__none__">No parent unit</SelectItem>

              {parentUnits.map((parentUnit) => (
                <SelectItem key={parentUnit.id} value={parentUnit.id}>
                  {parentUnit.nameEn} ({parentUnit.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>

              <SelectItem value="INACTIVE">Inactive</SelectItem>

              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>

          {state.fieldErrors?.status?.map((error) => (
            <p key={error} className="text-destructive text-sm">
              {error}
            </p>
          ))}
        </div>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t pt-5 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={() => {
            window.dispatchEvent(
              new KeyboardEvent("keydown", {
                key: "Escape",
              })
            );
          }}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={isPending}>
          <Plus className="size-4" />

          {isPending ? "Creating..." : "Create unit"}
        </Button>
      </div>
    </form>
  );
}
