import { createContext, useContext } from 'react';

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

export type TooltipContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  tooltipId: string;
};

export const TooltipContext = createContext<TooltipContextValue | null>(null);

export function useTooltipContext(): TooltipContextValue {
  const ctx = useContext(TooltipContext);
  if (!ctx) throw new Error('Tooltip compound components must be used within Tooltip.Root');
  return ctx;
}
