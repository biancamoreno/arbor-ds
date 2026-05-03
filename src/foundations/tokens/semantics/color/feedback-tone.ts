/**
 * Conjunto canônico de tones de feedback do Arbor-DS.
 *
 * Espelha as chaves disponíveis em `theme.colors.feedback.*`
 * (`success`, `warning`, `critical`, `info`) acrescidas de `neutral`
 * e `brand` (que vivem em namespaces próprios — `text`/`background`
 * e `brand`, respectivamente).
 *
 * Cada componente de feedback (Alert, Toast, Badge, ProgressBar,
 * ProgressCircle, Tag, Chip) deve declarar `tone?: FeedbackTone` ou
 * um subset explicitamente justificado em CONTRIBUTING.md (ex:
 * ProgressBar não aceita `neutral` — cinza sobre cinza não comunica
 * progresso).
 *
 * @see RFC-0032
 */
export type FeedbackTone =
  | 'neutral'
  | 'brand'
  | 'success'
  | 'warning'
  | 'critical'
  | 'info';

/**
 * Slot dentro de um tone de feedback. Cada combinação `tone × slot`
 * resolve para uma cor concreta via `getFeedbackToneColor()`.
 *
 * - `subtle`: fundo discreto (banner, badge subtle).
 * - `base`: cor principal do tone (border, ícone, texto enfático).
 * - `strong`: ênfase máxima (texto sobre subtle, hover de elementos solid).
 *
 * @see RFC-0032
 */
export type FeedbackToneSlot = 'subtle' | 'base' | 'strong';
