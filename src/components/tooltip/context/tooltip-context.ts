import { createContext, useContext, type MutableRefObject } from 'react';

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

export type TooltipContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  tooltipId: string;
  triggerRef: MutableRefObject<HTMLElement | null>;
};

export const TooltipContext = createContext<TooltipContextValue | null>(null);

export function useTooltipContext(): TooltipContextValue {
  const ctx = useContext(TooltipContext);
  if (!ctx) throw new Error('Tooltip compound components must be used within Tooltip.Root');
  return ctx;
}
