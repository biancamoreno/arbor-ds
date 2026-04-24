import { createContext, useContext } from 'react';

/**
 * Contract documented in RFC-0013 (naming) and RFC-0014 (field-aware wiring).
 * Fields use HTML/ARIA naming without `is*` prefix.
 */
export type FieldContextValue = {
  fieldId: string;
  descriptionId: string;
  errorId: string;
  disabled: boolean;
  required: boolean;
  invalid: boolean;
  descriptionRegistered: boolean;
  errorRegistered: boolean;
  registerDescription: () => void;
  unregisterDescription: () => void;
  registerError: () => void;
  unregisterError: () => void;
};

export const FieldContext = createContext<FieldContextValue | null>(null);

export function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext);
}
