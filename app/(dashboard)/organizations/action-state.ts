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
