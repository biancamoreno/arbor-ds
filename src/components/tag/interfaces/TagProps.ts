import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * @platform native-ready
 * Tag interativa cross-platform. Web renderiza `<button>`; native delega ao
 * `Clickable.native` com `accessibilityRole="button"` + `accessibilityState.selected`.
 */
export interface TagProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  tone?: 'neutral' | 'brand';
  selected?: boolean;
}
