import { createContext, useContext } from 'react';

export type RadioContextValue = {
  isChecked: boolean;
  isDisabled: boolean;
  inputId: string;
  value: string;
  name?: string;
  onChange: () => void;
};

export const RadioContext = createContext<RadioContextValue | null>(null);

export function useRadioContext(): RadioContextValue {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error('useRadioContext must be used inside Radio.Root');
  return ctx;
}
