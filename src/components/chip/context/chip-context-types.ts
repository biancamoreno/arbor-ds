import type { FeedbackTone } from '../../../foundations';

/**
 * Subset de props compartilhadas entre `ChipDecorativeProps` e
 * `ChipSelectableProps` — extraído para o context evitar dependência
 * circular com `ChipRootProps` (discriminated union).
 *
 * @see RFC-0033
 */
export interface ChipBaseProps {
  variant?: 'filled' | 'outlined' | 'subtle';
  tone?: FeedbackTone;
}
