import { createContext, useContext } from 'react';

export type FieldContextValue = {
  fieldId: string;
  descriptionId: string;
  errorId: string;
  isDisabled: boolean;
  isRequired: boolean;
  isInvalid: boolean;
};

export const FieldContext = createContext<FieldContextValue | null>(null);

export function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext);
}
