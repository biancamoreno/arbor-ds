import type { ReactElement, ReactNode } from 'react';
import type { TooltipPlacement } from '../context/tooltip-context';

/**
 * @platform shared
 * Tooltip compound construído sobre primitivas cross-platform (`Portal`,
 * `DismissableLayer` — ambas com `.native.tsx`). Sem `tooltip.native.tsx` dedicado.
 */
export type TooltipRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  delay?: number;
  disabled?: boolean;
};

export type TooltipTriggerProps = {
  children: ReactElement;
  asChild?: boolean;
};

export type TooltipContentProps = {
  children: ReactNode;
  placement?: TooltipPlacement;
  maxWidth?: string | number;
};
