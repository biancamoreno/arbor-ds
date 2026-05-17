import { createContext, useContext, type MutableRefObject } from 'react';
import type { PopoverPlacement } from '../utils/position';

export type PopoverContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  contentId: string;
  triggerRef: MutableRefObject<HTMLElement | null>;
  placement: PopoverPlacement;
  offset?: number;
  accessibilityLabel?: string;
};

export const PopoverContext = createContext<PopoverContextValue | null>(null);

export function usePopoverContext(): PopoverContextValue {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error('Popover compound components must be used within Popover');
  return ctx;
}
