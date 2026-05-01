import { createContext, useContext, type MutableRefObject } from 'react';

export type PopoverContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  titleId: string;
  triggerRef: MutableRefObject<HTMLElement | null>;
};

export const PopoverContext = createContext<PopoverContextValue | null>(null);

export function usePopoverContext(): PopoverContextValue {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error('Popover compound components must be used within Popover.Root');
  return ctx;
}
