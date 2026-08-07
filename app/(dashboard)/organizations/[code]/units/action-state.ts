// Action states for organizational unit operations

export type CreateOrganizationalUnitActionState = {
  fieldErrors?: {
    code?: string[];
    parentId?: string[];
    unitTypeId?: string[];
    nameEn?: string[];
    nameNe?: string[];
    shortNameEn?: string[];
    shortNameNe?: string[];
    sortOrder?: string[];
    status?: string[];
  };
  message?: string;
  success: boolean;
};

export const initialCreateOrganizationalUnitActionState: CreateOrganizationalUnitActionState = {
  success: false,
};

export type UpdateOrganizationalUnitActionState = {
  fieldErrors?: {
    parentId?: string[];
    unitTypeId?: string[];
    nameEn?: string[];
    nameNe?: string[];
    shortNameEn?: string[];
    shortNameNe?: string[];
    sortOrder?: string[];
    status?: string[];
  };
  message?: string;
  success: boolean;
};

export const initialUpdateOrganizationalUnitActionState: UpdateOrganizationalUnitActionState = {
  success: false,
};

export type DeleteOrganizationalUnitActionState = {
  message?: string;
  success: boolean;
};

export const initialDeleteOrganizationalUnitActionState: DeleteOrganizationalUnitActionState = {
  success: false,
};
