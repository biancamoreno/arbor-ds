import { getFeedbackToneColor, type ArborTheme, type FeedbackTone } from '../../../foundations';

/**
 * Resolve cores semânticas de Tag por combinação `tone × selected`.
 * Compartilhado por `tag.tsx` (web) e `tag.native.tsx` para evitar drift
 * visual cross-platform.
 *
 * Pattern unificado pós-RFC-0032:
 * - `selected=false` (outline): bg=`subtle`, text=`strong`, border=`base`.
 * - `selected=true` (solid):    bg=`base`,   text=`inverse`, border=`base`.
 *
 * Funciona para os 6 tones canônicos via `getFeedbackToneColor`.
 *
 * @see RFC-0032
 */
export type TagColors = {
  backgroundColor: string;
  borderColor: string;
  color: string;
};

export function getTagColors(
  theme: ArborTheme,
  selected: boolean,
  tone: FeedbackTone = 'neutral',
): TagColors {
  const base = getFeedbackToneColor(theme, tone, 'base');
  if (selected) {
    return {
      backgroundColor: base,
      borderColor: base,
      color: theme.colors.text.inverse,
    };
  }
  return {
    backgroundColor: getFeedbackToneColor(theme, tone, 'subtle'),
    borderColor: base,
    color: getFeedbackToneColor(theme, tone, 'strong'),
  };
}
