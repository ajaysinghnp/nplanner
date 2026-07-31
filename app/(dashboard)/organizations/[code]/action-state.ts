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
