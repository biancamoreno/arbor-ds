import type { HTMLAttributes, ReactNode } from 'react';

export type ToastTone = 'neutral' | 'success' | 'warning' | 'critical' | 'info';
export type ToastPlacement =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/** Item de toast gerenciado pelo store */
export interface ToastItem {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** Duração em ms. 0 = persistente. @default 5000 */
  duration?: number;
}

export interface ToastRootProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  tone?: ToastTone;
}

export interface ToastTitleProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export interface ToastDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export interface ToastCloseProps extends HTMLAttributes<HTMLButtonElement> {
  /** @default "Fechar" */
  label?: string;
  onClose?: () => void;
}

export interface ToasterProps {
  placement?: ToastPlacement;
}

/** Input para useToast().toast() */
export type ToastInput = Omit<ToastItem, 'id'>;
