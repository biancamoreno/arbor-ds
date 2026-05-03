import type { CSSProperties } from 'react';
import type { FeedbackTone } from '../../../foundations';

/**
 * @platform shared
 *
 * Indicador de progresso circular (0–100) ou indeterminado.
 *
 * Web: `<svg>` + `<circle>` + animação CSS keyframe `arbor-spin`.
 * Native: `react-native-svg` + `Animated.loop` rotacionando o container.
 *
 * Não estende `SVGAttributes<SVGSVGElement>` para preservar paridade
 * cross-platform (atributos DOM-only ficariam vazando em RN).
 */
export interface ProgressCircleProps {
  /** Valor de 0 a 100 (ignorado quando `indeterminate=true`). */
  progress: number;
  /** Quando true, exibe animação de progresso indeterminado. */
  indeterminate?: boolean;
  /** Diâmetro em px. Default: 48. */
  size?: number;
  /** Espessura do traço. Default: 4. */
  strokeWidth?: number;
  /**
   * Subset de `FeedbackTone` excluindo `neutral` — paridade com `ProgressBar`
   * (cinza sobre cinza não comunica progresso).
   *
   * @default 'brand'
   */
  tone?: Exclude<FeedbackTone, 'neutral'>;
  /** Texto descritivo para leitor de tela. */
  label?: string;
  /** Escape hatch para overrides finos. Aplicado ao `<svg>` (web) ou container `Animated.View` (native). */
  style?: CSSProperties;
  /** Test id forwardado para a raiz do componente. */
  testID?: string;
}
