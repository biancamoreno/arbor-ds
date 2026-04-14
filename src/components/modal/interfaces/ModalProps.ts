import type { ReactNode } from 'react';

export interface ModalProps {
  open: boolean;
  title?: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  closeLabel?: string;
  closeOnOverlayClick?: boolean;
  onOpenChange?: (open: boolean) => void;
}
