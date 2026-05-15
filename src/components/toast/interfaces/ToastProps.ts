import type { CSSProperties, ReactNode } from 'react';
import type { FeedbackTone } from '../../../foundations';

/**
 * @platform shared
 *
 * Notificação transitória — pode ser usada em duas formas:
 * - Composto (Toast.Root/Icon/Title/Description/Close) para layout customizado.
 * - Imperativo via `useToast().toast(input)` + `<Toaster />` montado uma vez.
 *
 * Não estende `HTMLAttributes` para preservar paridade cross-platform
 * (props DOM-only ficariam vazando em React Native).
 */

/** Conjunto canônico `FeedbackTone` (RFC-0032). `brand` cobre "novidade do produto". */
export type ToastTone = FeedbackTone;

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
  /** Ícone custom (substitui o ícone tone-default). `ReactNode` (use `<Icon name="..." />`). */
  icon?: ReactNode;
  tone?: ToastTone;
  /** Duração em ms. 0 = persistente. @default 5000 */
  duration?: number;
  /**
   * Posição na tela onde este toast deve aparecer. Quando omitido, o `Toaster`
   * usa seu `defaultPlacement`. Permite chamadas individuais escolherem stack
   * (ex.: alerta crítico em `top-center`, confirmação em `bottom-right`).
   */
  placement?: ToastPlacement;
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

export interface ToastIconProps {
  children?: ReactNode;
  style?: CSSProperties;
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
  /**
   * Texto a11y do botão. Mapeado para `aria-label` em web e
   * `accessibilityLabel` em native.
   * @default 'Fechar'
   */
  accessibilityLabel?: string;
  onClose?: () => void;
  style?: CSSProperties;
  testID?: string;
  className?: string;
}

export interface ToasterProps {
  /**
   * Placement default usado quando o input do `toast()` não especifica
   * `placement`. O Toaster monta um stack por placement ativo no store, então
   * toasts disparados com placements distintos coexistem em containers
   * separados — esta prop só governa o fallback para toasts sem placement
   * próprio.
   * @default 'bottom-right'
   */
  placement?: ToastPlacement;
}

/** Input para `useToast().toast()`. */
export type ToastInput = Omit<ToastItem, 'id'>;
