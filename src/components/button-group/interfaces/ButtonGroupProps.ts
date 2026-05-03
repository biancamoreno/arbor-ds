import type { ReactNode } from 'react';

/**
 * @platform shared
 * Compõe via `Flex` + Context API; sem APIs de plataforma. Funciona em web e native
 * sem `.native.tsx` dedicado.
 */
export interface ButtonGroupProps {
  children: ReactNode;
  orientation?: 'horizontal' | 'vertical';
  attached?: boolean;
  spacing?: string;
  disabled?: boolean;
  'aria-label'?: string;
  'aria-labelledby'?: string;
}
