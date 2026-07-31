"use client";

import { Pencil } from "lucide-react";
import { useActionState, useCallback, useEffect, useState } from "react";

import { initialUpdateOrganizationalUnitActionState } from "@/app/(dashboard)/organizations/[code]/units/action-state";
import { updateOrganizationalUnitAction } from "@/app/(dashboard)/organizations/[code]/units/actions";
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

type OrganizationalUnit = {
  id: string;
  code: string;
  parentId: string | null;
  unitTypeId: string | null;
  nameEn: string;
  nameNe: string | null;
  shortNameEn: string | null;
  shortNameNe: string | null;
  sortOrder: number;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
};

type EditOrganizationalUnitDialogProps = {
  organizationCode: string;
  unit: OrganizationalUnit;
  unitTypes: UnitTypeOption[];
  parentUnits: ParentUnitOption[];
};

export function EditOrganizationalUnitDialog({
  organizationCode,
  unit,
  unitTypes,
  parentUnits,
}: EditOrganizationalUnitDialogProps) {
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
        <Button type="button" variant="outline" size="icon">
          <Pencil className="size-4" />

          <span className="sr-only">Edit {unit.nameEn}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit organizational unit</DialogTitle>

          <DialogDescription>
            Update the details and organizational placement of{" "}
            <span className="font-medium">{unit.nameEn}</span>.
          </DialogDescription>
        </DialogHeader>

        <EditOrganizationalUnitForm
          key={formKey}
          organizationCode={organizationCode}
          unit={unit}
          unitTypes={unitTypes}
          parentUnits={parentUnits}
          onSuccess={handleSuccess}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

type EditOrganizationalUnitFormProps = {
  organizationCode: string;
  unit: OrganizationalUnit;
  unitTypes: UnitTypeOption[];
  parentUnits: ParentUnitOption[];
  onSuccess: () => void;
  onCancel: () => void;
};

function EditOrganizationalUnitForm({
  organizationCode,
  unit,
  unitTypes,
  parentUnits,
  onSuccess,
  onCancel,
}: EditOrganizationalUnitFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateOrganizationalUnitAction,
    initialUpdateOrganizationalUnitActionState
  );

  const [unitTypeId, setUnitTypeId] = useState(unit.unitTypeId ?? "");
  const [parentId, setParentId] = useState(unit.parentId ?? "");
  const [status, setStatus] = useState(unit.status);

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, onSuccess]);

  const availableParentUnits = parentUnits.filter((parentUnit) => parentUnit.id !== unit.id);

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={unit.id} />

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
          <Label htmlFor={`organizational-unit-code-${unit.id}`}>Unit code</Label>

          <Input id={`organizational-unit-code-${unit.id}`} value={unit.code} readOnly disabled />

          <p className="text-muted-foreground text-xs">
            The unit code cannot be changed after creation.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`organizational-unit-sort-order-${unit.id}`}>Sort order</Label>

          <Input
            id={`organizational-unit-sort-order-${unit.id}`}
            name="sortOrder"
            type="number"
            min="0"
            defaultValue={unit.sortOrder}
            aria-invalid={Boolean(state.fieldErrors?.sortOrder)}
          />

          {state.fieldErrors?.sortOrder?.map((error) => (
            <p key={error} className="text-destructive text-sm">
              {error}
            </p>
          ))}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`organizational-unit-name-en-${unit.id}`}>English name</Label>

          <Input
            id={`organizational-unit-name-en-${unit.id}`}
            name="nameEn"
            defaultValue={unit.nameEn}
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
          <Label htmlFor={`organizational-unit-name-ne-${unit.id}`}>Nepali name</Label>

          <Input
            id={`organizational-unit-name-ne-${unit.id}`}
            name="nameNe"
            defaultValue={unit.nameNe ?? ""}
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
          <Label htmlFor={`organizational-unit-short-name-en-${unit.id}`}>English short name</Label>

          <Input
            id={`organizational-unit-short-name-en-${unit.id}`}
            name="shortNameEn"
            defaultValue={unit.shortNameEn ?? ""}
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
          <Label htmlFor={`organizational-unit-short-name-ne-${unit.id}`}>Nepali short name</Label>

          <Input
            id={`organizational-unit-short-name-ne-${unit.id}`}
            name="shortNameNe"
            defaultValue={unit.shortNameNe ?? ""}
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

              {availableParentUnits.map((parentUnit) => (
                <SelectItem key={parentUnit.id} value={parentUnit.id}>
                  {parentUnit.nameEn} ({parentUnit.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {state.fieldErrors?.parentId?.map((error) => (
            <p key={error} className="text-destructive text-sm">
              {error}
            </p>
          ))}
        </div>

        <div className="space-y-2">
          <Label>Status</Label>

          <Select
            value={status}
            onValueChange={(value) => {
              setStatus(value as "ACTIVE" | "INACTIVE" | "ARCHIVED");
            }}
          >
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
        <Button type="button" variant="outline" disabled={isPending} onClick={onCancel}>
          Cancel
        </Button>

        <Button type="submit" disabled={isPending}>
          <Pencil className="size-4" />

          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
