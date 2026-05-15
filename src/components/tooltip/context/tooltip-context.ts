import { createContext, useContext, type MutableRefObject } from 'react';

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';

export type TooltipContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  tooltipId: string;
  triggerRef: MutableRefObject<HTMLElement | null>;
  /**
   * Override numérico (ms) do delay de exibição — quando presente, sobrescreve
   * o valor themable `tooltip.motion.delay.show`. `undefined` deixa o tema decidir.
   */
  delay: number | undefined;
};

export const TooltipContext = createContext<TooltipContextValue | null>(null);

export function useTooltipContext(): TooltipContextValue {
  const ctx = useContext(TooltipContext);
  if (!ctx) throw new Error('Tooltip compound components must be used within Tooltip.Root');
  return ctx;
}
