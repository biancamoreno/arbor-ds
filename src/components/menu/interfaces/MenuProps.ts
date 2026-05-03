import type { ReactElement, ReactNode } from 'react';

/**
 * @platform shared
 * Menu compound construído sobre primitivas cross-platform (`Portal`, `FocusScope`,
 * `DismissableLayer` — todas com `.native.tsx`). Sem `menu.native.tsx` dedicado.
 */
export type MenuRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
};

export type MenuTriggerProps = {
  children: ReactElement;
  asChild?: boolean;
};

export type MenuContentProps = {
  children: ReactNode;
  label?: string;
};

export type MenuItemProps = {
  children: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
};

export type MenuSeparatorProps = Record<string, never>;

export type MenuLabelProps = {
  children: ReactNode;
};
