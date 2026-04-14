import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface TagProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
  tone?: 'neutral' | 'brand';
  selected?: boolean;
}
