import type { HTMLAttributes } from 'react';

/**
 * @platform shared
 * Indicador de carregamento indeterminado.
 */
export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg';
  /** Substitui a cor padrão do stroke */
  color?: string;
  /** @default "Carregando" */
  label?: string;
}
