import type { ArborTheme } from './Theme';
import type {
  FeedbackTone,
  FeedbackToneSlot,
} from '../tokens/semantics/color/feedback-tone';

/**
 * Resolve um par `tone × slot` para a cor concreta do tema ativo.
 *
 * Substitui mapeamentos locais que cada componente de feedback (Alert, Toast,
 * Badge, ProgressBar, ProgressCircle, Tag, Chip) mantinha duplicado.
 *
 * Mapeamento de slot semântico para o papel canônico da escala (RFC-0039):
 * - `subtle` → `bgElement` (step 3, fundo discreto)
 * - `base`   → `solid`     (step 9, cor enfática para borda/ícone/fill)
 * - `strong` → `text`      (step 11, texto sobre fundo subtle)
 *
 * Casos especiais:
 * - `neutral` consome `text.*` / `background.subtle` (fora de `feedback.*`).
 * - `brand` consome `colors.brand.*` direto.
 * - demais tons consomem `colors.feedback.{tone}.*` direto.
 *
 * @see RFC-0032
 * @see RFC-0039
 */
export function getFeedbackToneColor(
  theme: ArborTheme,
  tone: FeedbackTone,
  slot: FeedbackToneSlot,
): string {
  if (tone === 'neutral') {
    if (slot === 'subtle') return theme.colors.background.subtle;
    if (slot === 'strong') return theme.colors.text.primary;
    return theme.colors.text.secondary;
  }

  const palette = tone === 'brand' ? theme.colors.brand : theme.colors.feedback[tone];

  if (slot === 'subtle') return palette.bgElement;
  if (slot === 'strong') return palette.text;
  return palette.solid;
}
