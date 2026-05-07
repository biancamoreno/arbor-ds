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
 * Slot semântico dentro de um tone de feedback. Cada combinação `tone × slot`
 * resolve para uma cor concreta via `getFeedbackToneColor()`, que mapeia para
 * os papéis canônicos da escala (RFC-0039):
 *
 * - `subtle` → `bgElement` (fundo discreto: banner, badge outline, alert subtle).
 * - `base`   → `solid`     (cor enfática: border, ícone, fill de progresso).
 * - `strong` → `text`      (texto sobre fundo subtle, ênfase máxima).
 *
 * @see RFC-0032
 * @see RFC-0039
 */
export type FeedbackToneSlot = 'subtle' | 'base' | 'strong';
