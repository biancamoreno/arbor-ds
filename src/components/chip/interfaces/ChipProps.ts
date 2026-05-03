import type { CSSProperties, ReactNode } from 'react';
import type { FeedbackTone } from '../../../foundations';

/**
 * @platform shared
 *
 * Discriminated union — `selectable` decide o contrato:
 *
 * - `selectable=false` (default): `Chip.Root` é `<span>` decorativo (RN: View).
 *   Sem foco, sem teclado, sem `aria-pressed`. `selected` e
 *   `onSelectedChange` são tipo-erro (`never`).
 * - `selectable=true`: `Chip.Root` vira botão focável (`<button>` web,
 *   `Clickable.native`) com `aria-pressed` / `accessibilityState.selected`
 *   + ativação por Space/Enter. `selected` controla o estado; ausente,
 *   `defaultSelected` cobre o caso não-controlado.
 *
 * @see RFC-0033
 */
export type ChipRootProps = ChipDecorativeProps | ChipSelectableProps;

interface ChipBaseProps {
  children: ReactNode;
  /** @default 'subtle' */
  variant?: 'filled' | 'outlined' | 'subtle';
  /** @default 'medium' */
  size?: 'small' | 'medium';
  disabled?: boolean;
  /** Conjunto canônico `FeedbackTone` (RFC-0032). @default 'neutral' */
  tone?: FeedbackTone;
  className?: string;
  style?: CSSProperties;
}

export interface ChipDecorativeProps extends ChipBaseProps {
  /** @default false */
  selectable?: false;
  selected?: never;
  defaultSelected?: never;
  onSelectedChange?: never;
}

export interface ChipSelectableProps extends ChipBaseProps {
  selectable: true;
  /** Estado controlado. */
  selected?: boolean;
  /** Estado inicial não-controlado. @default false */
  defaultSelected?: boolean;
  /** Notificação canônica RFC-0015 (value-only). */
  onSelectedChange?: (selected: boolean) => void;
}

export interface ChipLabelProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface ChipIconProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface ChipRemoveProps {
  /** @default "Remover" */
  label?: string;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}
