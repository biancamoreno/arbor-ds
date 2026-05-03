import { createContext, useContext } from 'react';
import type { SelectSize } from '../interfaces/SelectProps';

export type SelectState = 'idle' | 'open' | 'invalid' | 'disabled';

export type SelectItemEntry = {
  value: string;
  displayText: string;
  disabled: boolean;
  id: string;
};

export type SelectContextValue = {
  open: boolean;
  selectedValue: string;
  disabled: boolean;
  invalid: boolean;
  inputId: string;
  listboxId: string;
  size: SelectSize;
  state: SelectState;
  setOpen: (next: boolean) => void;
  select: (value: string) => void;

  items: SelectItemEntry[];
  replaceItems: (entries: SelectItemEntry[]) => void;
  getDisplayText: (value: string) => string | undefined;

  activeIndex: number;
  setActiveIndex: (index: number) => void;
  openAtIndex: (index: number) => void;
};

export const SelectContext = createContext<SelectContextValue | null>(null);

export function useSelectContext(): SelectContextValue {
  const ctx = useContext(SelectContext);
  if (!ctx) throw new Error('useSelectContext must be used inside Select.Root');
  return ctx;
}
