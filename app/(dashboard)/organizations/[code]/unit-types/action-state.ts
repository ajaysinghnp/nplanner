export type CreateOrganizationalUnitTypeActionState = {
  fieldErrors?: {
    parentTypeId?: string[];
    code?: string[];
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

export const initialCreateOrganizationalUnitTypeActionState: CreateOrganizationalUnitTypeActionState =
  {
    success: false,
  };

export type UpdateOrganizationalUnitTypeActionState = {
  fieldErrors?: {
    parentTypeId?: string[];
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

export const initialUpdateOrganizationalUnitTypeActionState: UpdateOrganizationalUnitTypeActionState =
  {
    success: false,
  };

export type DeleteOrganizationalUnitTypeActionState = {
  message?: string;
  success: boolean;
};

export const initialDeleteOrganizationalUnitTypeActionState: DeleteOrganizationalUnitTypeActionState =
  {
    success: false,
  };
