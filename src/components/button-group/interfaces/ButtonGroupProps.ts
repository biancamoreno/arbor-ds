import type { ReactNode } from 'react';

export interface ButtonGroupProps {
  children: ReactNode;
  orientation?: 'horizontal' | 'vertical';
  attached?: boolean;
  spacing?: string;
  isDisabled?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}
