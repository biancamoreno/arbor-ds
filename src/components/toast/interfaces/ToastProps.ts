import type { CSSProperties, ReactNode } from 'react';

/**
 * @platform shared
 *
 * Notificação transitória — pode ser usada em duas formas:
 * - Composto (Toast.Root/Title/Description/Close) para layout customizado.
 * - Imperativo via `useToast().toast(input)` + `<Toaster />` montado uma vez.
 *
 * Não estende `HTMLAttributes` para preservar paridade cross-platform
 * (props DOM-only ficariam vazando em React Native).
 */

export type ToastTone = 'neutral' | 'success' | 'warning' | 'critical' | 'info';

export type ToastPlacement =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

/** Item de toast gerenciado pelo store. */
export interface ToastItem {
  id: string;
  title?: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  /** Duração em ms. 0 = persistente. @default 5000 */
  duration?: number;
}

export interface ToastRootProps {
  children: ReactNode;
  /** @default 'neutral' */
  tone?: ToastTone;
  /** Escape hatch para overrides finos. */
  style?: CSSProperties;
  /** Test id forwardado para a raiz do componente. */
  testID?: string;
  className?: string;
}

export interface ToastTitleProps {
  children: ReactNode;
  style?: CSSProperties;
  testID?: string;
  className?: string;
}

export interface ToastDescriptionProps {
  children: ReactNode;
  style?: CSSProperties;
  testID?: string;
  className?: string;
}

export interface ToastCloseProps {
  /** @default 'Fechar' */
  label?: string;
  onClose?: () => void;
  style?: CSSProperties;
  testID?: string;
  className?: string;
}

export interface ToasterProps {
  /** @default 'bottom-right' */
  placement?: ToastPlacement;
}

/** Input para `useToast().toast()`. */
export type ToastInput = Omit<ToastItem, 'id'>;
