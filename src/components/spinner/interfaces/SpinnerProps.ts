import type { HTMLAttributes } from 'react';

/**
 * @platform native-ready
 * Indicador de carregamento indeterminado.
 *
 * - Web (`spinner.tsx`): keyframes CSS (`@keyframes arbor-spin`).
 * - Native (`spinner.native.tsx`): `Animated.loop` rotacionando o Icon.
 */
export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg';
  /** Substitui a cor padrão do stroke */
  color?: string;
  /** @default "Carregando" */
  label?: string;
}
