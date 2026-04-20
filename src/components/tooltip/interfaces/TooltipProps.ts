import type { ReactElement, ReactNode } from 'react';
import type { TooltipPlacement } from '../context/tooltip-context';

export type TooltipRootProps = {
  isOpen?: boolean;
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

/**
 * @deprecated Use Tooltip.Root + Tooltip.Trigger + Tooltip.Content instead.
 */
export interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  placement?: TooltipPlacement;
  trigger?: 'hover' | 'click';
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  maxWidth?: string | number;
}
