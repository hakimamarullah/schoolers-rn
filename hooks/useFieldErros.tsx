import { useState } from "react";

export const useFieldErrors = () => {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const clearErrors = () => setFieldErrors({});
  const applyErrors = (data: Record<string, string>) => {
    setFieldErrors(data);
  };

  return { fieldErrors, setFieldErrors, clearErrors, applyErrors };
};
