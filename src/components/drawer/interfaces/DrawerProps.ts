import type { ReactNode } from 'react';

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
