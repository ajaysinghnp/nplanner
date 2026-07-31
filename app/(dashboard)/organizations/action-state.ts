export type CreateOrganizationActionState = {
  fieldErrors?: {
    code?: string[];
    nameEn?: string[];
    nameNe?: string[];
    shortNameEn?: string[];
    shortNameNe?: string[];
  };
  message?: string;
  success: boolean;
};

export const initialCreateOrganizationActionState: CreateOrganizationActionState = {
  success: false,
};

export type UpdateOrganizationActionState = {
  fieldErrors?: {
    nameEn?: string[];
    nameNe?: string[];
    shortNameEn?: string[];
    shortNameNe?: string[];
  };
  message?: string;
  success: boolean;
};

export const initialUpdateOrganizationActionState: UpdateOrganizationActionState = {
  success: false,
};

export type DeleteOrganizationActionState = {
  message?: string;
  success: boolean;
};

export const initialDeleteOrganizationActionState: DeleteOrganizationActionState = {
  success: false,
};
