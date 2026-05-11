import type { CSSProperties, ReactNode } from 'react';
import type { FeedbackTone } from '../../../foundations';

/**
 * @platform shared
 * Badge textual decorativo, cross-platform.
 *
 * Tag não é interativo: não aceita `onClick`/`selected`/`disabled`. Para
 * comportamentos selecionáveis ou removíveis use `Chip` (`selectable` /
 * `Chip.Remove` — RFC-0033).
 */
export interface TagProps {
  children: ReactNode;
  /**
   * Conjunto canônico `FeedbackTone` (RFC-0032). Use feedback tones
   * (`success`/`warning`/`critical`/`info`) com parcimônia em grupos —
   * carnaval visual quebra a varredura. Diretriz: 1 tone de feedback por grupo.
   *
   * @default 'neutral'
   */
  tone?: FeedbackTone;
  /**
   * Decoração visual: `'outline'` (padrão, mais discreto, com borda e bg leve)
   * ou `'solid'` (mais enfático, preenchimento opaco).
   *
   * @default 'outline'
   */
  variant?: 'solid' | 'outline';
  className?: string;
  style?: CSSProperties;
}
