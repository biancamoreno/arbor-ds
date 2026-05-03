import type { CSSProperties } from 'react';
import type { FeedbackTone } from '../../../foundations';

/**
 * @platform shared
 *
 * Barra de progresso determinada (0–100) ou indeterminada.
 *
 * Não estende `HTMLAttributes<HTMLDivElement>` para preservar paridade
 * cross-platform — atributos DOM-only ficariam vazando em RN.
 */
export interface ProgressBarProps {
  /** Valor de 0 a 100 (ignorado quando indeterminate=true) */
  progress: number;
  /** Quando true, exibe animação de progresso indeterminado */
  indeterminate?: boolean;
  /** Texto descritivo para leitores de tela */
  label?: string;
  size?: 'small' | 'medium' | 'large';
  /**
   * Subset de `FeedbackTone` excluindo `neutral` — cinza sobre cinza não
   * comunica progresso (justificativa em CONTRIBUTING.md §"Feedback tones").
   *
   * @default 'brand'
   */
  tone?: Exclude<FeedbackTone, 'neutral'>;
  /** Escape hatch para CSS não coberto pelo sistema */
  style?: CSSProperties;
  className?: string;
}
