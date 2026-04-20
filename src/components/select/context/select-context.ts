import { createContext, useContext } from 'react';

export type SelectContextValue = {
  isOpen: boolean;
  selectedValue: string;
  isDisabled: boolean;
  inputId: string;
  size: 'sm' | 'md' | 'lg';
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
