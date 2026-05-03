import type { CSSProperties, ReactNode } from 'react';
import type { FeedbackTone } from '../../../foundations';

/**
 * @platform native-ready
 * Tag interativa cross-platform. Web renderiza `<button>`; native delega ao
 * `Clickable.native` com `accessibilityRole="button"` + `accessibilityState.selected`.
 */
export interface TagProps {
  children: ReactNode;
  /**
   * Conjunto canônico `FeedbackTone` (RFC-0032). Use feedback tones
   * (`success`/`warning`/`critical`/`info`) com parcimônia em filtros agrupados —
   * carnaval visual quebra a varredura. Diretriz: 1 tone de feedback por grupo.
   *
   * @default 'neutral'
   */
  tone?: FeedbackTone;
  /** @default false */
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}
