import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * @platform web-only
 * Tag interativa que estende HTMLButtonElement — usa APIs DOM exclusivas da web.
 */
export interface TagProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  tone?: 'neutral' | 'brand';
  selected?: boolean;
}
