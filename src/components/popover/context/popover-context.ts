import { createContext, useContext } from 'react';

export type PopoverContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  titleId: string;
};

export const PopoverContext = createContext<PopoverContextValue | null>(null);

export function usePopoverContext(): PopoverContextValue {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error('Popover compound components must be used within Popover.Root');
  return ctx;
}
