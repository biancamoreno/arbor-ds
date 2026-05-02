import type { ArborTheme } from '../../../foundations';
import type { ProgressCircleProps } from '../interfaces';

type Tone = NonNullable<ProgressCircleProps['tone']>;

/**
 * Resolve a cor do trace ativo a partir do tom semântico.
 *
 * Compartilhado entre `progress-circle.tsx` (web) e `progress-circle.native.tsx`
 * para evitar drift de paleta — alterações de tons só precisam acontecer aqui.
 */
export function getToneColor(tone: Tone, theme: ArborTheme): string {
  switch (tone) {
    case 'success':
      return theme.colors.feedback.success.base;
    case 'warning':
      return theme.colors.feedback.warning.base;
    case 'critical':
      return theme.colors.feedback.critical.base;
    case 'brand':
    default:
      return theme.colors.brand.base;
  }
}
