import type { ReactNode } from 'react';

/**
 * @platform web-only
 * Overlay modal que depende de portal DOM e APIs de evento exclusivas da web.
 * Não compatível com React Native sem implementação dedicada.
 */
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
