export function getStringValue(formData: FormData, key: string) {
  const value = formData.get(key);

  return typeof value === "string" ? value : "";
}

export function getFieldErrors(error: unknown): Record<string, string[] | undefined> | undefined {
  if (
    typeof error === "object" &&
    error !== null &&
    "flatten" in error &&
    typeof error.flatten === "function"
  ) {
    const flattenedError = error.flatten();

    if (
      typeof flattenedError === "object" &&
      flattenedError !== null &&
      "fieldErrors" in flattenedError
    ) {
      return flattenedError.fieldErrors as Record<string, string[] | undefined>;
    }
  }

  return undefined;
}
