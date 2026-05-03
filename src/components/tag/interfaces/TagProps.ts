import type { CSSProperties, ReactNode } from 'react';

/**
 * @platform native-ready
 * Tag interativa cross-platform. Web renderiza `<button>`; native delega ao
 * `Clickable.native` com `accessibilityRole="button"` + `accessibilityState.selected`.
 */
export interface TagProps {
  children: ReactNode;
  /** @default 'neutral' */
  tone?: 'neutral' | 'brand';
  /** @default false */
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}
