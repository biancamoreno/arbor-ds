import type { ReactElement, ReactNode } from 'react';

/**
 * @platform shared
 * Popover compound construído sobre primitivas cross-platform (`Portal`, `FocusScope`,
 * `DismissableLayer` — todas com `.native.tsx`). Sem `popover.native.tsx` dedicado.
 */
export type PopoverRootProps = {
  isOpen?: boolean;
  defaultOpen?: boolean;
  onClose?: () => void;
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
