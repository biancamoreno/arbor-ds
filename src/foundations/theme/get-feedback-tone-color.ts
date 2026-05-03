import type { ArborTheme } from './Theme';
import type {
  FeedbackTone,
  FeedbackToneSlot,
} from '../tokens/semantics/color/feedback-tone';

/**
 * Resolve um par `tone × slot` para a cor concreta do tema ativo.
 *
 * Substitui mapeamentos locais (`TONE_COLORS`, `TONE_BORDER`,
 * `getTagColors`, `getChipColors`) que cada componente de feedback
 * mantinha duplicado — eliminando drift e centralizando a decisão de
 * paleta num único ponto de override (`createTheme()`).
 *
 * Mapeamento:
 * - `neutral` consome `text.*` / `background.subtle` (fora de `feedback.*`).
 * - `brand` consome `brand.*` (fora de `feedback.*`).
 * - demais tons consomem `feedback.{tone}.{slot}` direto.
 *
 * @see RFC-0032
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

  if (tone === 'brand') {
    if (slot === 'subtle') return theme.colors.brand.subtle;
    if (slot === 'strong') return theme.colors.brand.strong;
    return theme.colors.brand.base;
  }

  return theme.colors.feedback[tone][slot];
}
