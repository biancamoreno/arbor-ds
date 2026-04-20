import type { HTMLAttributes, ReactNode } from 'react';

/**
 * @platform web-only
 * Badge que estende HTMLAttributes<HTMLSpanElement> — usa tipos HTML exclusivos da web.
 */
export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'critical';
}
