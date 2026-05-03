import type { ReactElement, ReactNode } from 'react';
import type { DrawerPlacement } from '../context/drawer-context';

/**
 * @platform shared
 * Drawer compound construído sobre primitivas cross-platform (`Portal`, `FocusScope`,
 * `DismissableLayer` — todas com `.native.tsx`). Sem `drawer.native.tsx` dedicado.
 */
export type DrawerRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: DrawerPlacement;
  children: ReactNode;
};

export type DrawerTriggerProps = {
  children: ReactElement;
  asChild?: boolean;
};

export type DrawerOverlayProps = {
  style?: React.CSSProperties;
};

export type DrawerContentProps = {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
};

export type DrawerTitleProps = {
  children: ReactNode;
};

export type DrawerCloseProps = {
  children?: ReactNode;
  label?: string;
};
