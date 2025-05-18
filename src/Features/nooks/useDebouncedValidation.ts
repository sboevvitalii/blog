"use client";

import { useEffect, useState } from "react";
import {
  FieldValues,
  Path,
  UseFormClearErrors,
  UseFormSetError,
  UseFormWatch,
} from "react-hook-form";

interface DebouncedValidationOptions<TFileValues extends FieldValues> {
  watch: UseFormWatch<TFileValues>;
  setError: UseFormSetError<TFileValues>;
  clearErrors: UseFormClearErrors<TFileValues>;
  fieldName: Path<TFileValues>;
  validationFn: (value: string) => Promise<boolean>;
  delay?: number;
  errorMessage?: string;
  minLength?: number;
}

export const useDebouncedValidation = <TFieldValues extends FieldValues>({
  watch,
  setError,
  clearErrors,
  fieldName,
  validationFn,
  delay = 500,
  errorMessage = "Уже занято",
  minLength = 3,
}: DebouncedValidationOptions<TFieldValues>) => {
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    const subscribtion = watch((value, { name }) => {
      if (name !== fieldName) return;

      const FieldValue = value[fieldName] as string;
      if (!FieldValue || FieldValue.length < minLength) {
        clearErrors(fieldName);
        return;
      }
      setIsValidating(true);
      const timer = setTimeout(async () => {
        try {
          const isAvailable = await validationFn(FieldValue);
          if (!isAvailable) {
            setError(fieldName, { type: "manual", message: errorMessage });
          } else {
            clearErrors(fieldName);
          }
        } catch (error) {
          console.error("Validation error:", error);
        } finally {
          setIsValidating(false);
        }
      }, delay);

      return () => clearTimeout(timer);
    });
    return () => subscribtion.unsubscribe();
  }, [
    watch,
    setError,
    clearErrors,
    fieldName,
    validationFn,
    delay,
    errorMessage,
    minLength,
  ]);
  return { isValidating };
};
