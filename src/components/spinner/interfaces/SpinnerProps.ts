import type { CSSProperties } from 'react';
import type { SpinnerSize } from '../internal/sizes';

/**
 * @platform shared
 * Indicador de carregamento indeterminado.
 *
 * - Web (`spinner.tsx`): keyframes CSS (`@keyframes arbor-spin` injetado pelo `ArborProvider`).
 * - Native (`spinner.native.tsx`): `Animated.loop` rotacionando o Icon.
 */
export interface SpinnerProps {
  size?: SpinnerSize;
  /** Substitui a cor padrão do stroke (default: `theme.colors.brand.solid`) */
  color?: string;
  /** @default "Carregando" */
  label?: string;
  /** Escape hatch para CSS não coberto pelo sistema */
  style?: CSSProperties;
  className?: string;
}
