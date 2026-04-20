import type { ReactElement, ReactNode } from 'react';
import type { DrawerPlacement } from '../context/drawer-context';

export type DrawerRootProps = {
  isOpen?: boolean;
  defaultOpen?: boolean;
  onClose?: () => void;
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

/**
 * @deprecated Use Drawer.Root + Drawer.Content instead.
 * Legado mantido para retrocompatibilidade.
 */
export interface DrawerProps {
  open: boolean;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  placement?: 'left' | 'right' | 'bottom';
  size?: 'sm' | 'md' | 'lg';
  closeLabel?: string;
  closeOnOverlayClick?: boolean;
  onOpenChange?: (open: boolean) => void;
}
