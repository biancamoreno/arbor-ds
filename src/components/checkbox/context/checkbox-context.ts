import { createContext, useContext } from 'react';

export type CheckboxContextValue = {
  isChecked: boolean;
  isIndeterminate: boolean;
  isDisabled: boolean;
  inputId: string;
  name?: string;
  value?: string;
  onChange: (checked: boolean) => void;
};

export const CheckboxContext = createContext<CheckboxContextValue | null>(null);

export function useCheckboxContext(): CheckboxContextValue {
  const ctx = useContext(CheckboxContext);
  if (!ctx) throw new Error('useCheckboxContext must be used inside Checkbox.Root');
  return ctx;
}
