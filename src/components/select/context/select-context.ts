import { createContext, useContext } from 'react';
import type { SelectSize } from '../interfaces/SelectProps';

export type SelectState = 'idle' | 'open' | 'invalid' | 'disabled';

export type SelectContextValue = {
  isOpen: boolean;
  selectedValue: string;
  isDisabled: boolean;
  isInvalid: boolean;
  inputId: string;
  size: SelectSize;
  state: SelectState;
  open: () => void;
  close: () => void;
  select: (value: string) => void;
};

export const SelectContext = createContext<SelectContextValue | null>(null);

export function useSelectContext(): SelectContextValue {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error('useSelectContext must be used inside Select.Root');
  return ctx;
}
