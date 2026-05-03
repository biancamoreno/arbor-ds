import type { ReactElement, ReactNode } from 'react';

/**
 * @platform shared
 * Popover compound construído sobre primitivas cross-platform (`Portal`, `FocusScope`,
 * `DismissableLayer` — todas com `.native.tsx`). Sem `popover.native.tsx` dedicado.
 */
export type PopoverRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
};

export type PopoverTriggerProps = {
  children: ReactElement;
  asChild?: boolean;
};

export type PopoverContentProps = {
  children: ReactNode;
};

export type PopoverCloseProps = {
  children?: ReactNode;
  label?: string;
};
