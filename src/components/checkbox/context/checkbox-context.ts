import { createContext, useContext } from 'react';

export type CheckboxSize = 'sm' | 'md' | 'lg';
export type CheckboxState = 'idle' | 'checked' | 'invalid' | 'disabled';

export type CheckboxContextValue = {
  checked: boolean;
  indeterminate: boolean;
  disabled: boolean;
  invalid: boolean;
  size: CheckboxSize;
  state: CheckboxState;
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
