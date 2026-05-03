import { createContext, useContext } from 'react';
import type { RadioSize } from '../interfaces/RadioProps';

export type RadioState = 'idle' | 'checked' | 'invalid' | 'disabled';

export type RadioContextValue = {
  checked: boolean;
  disabled: boolean;
  invalid: boolean;
  size: RadioSize;
  state: RadioState;
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
