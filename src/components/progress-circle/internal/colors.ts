import type { ArborTheme } from '../../../foundations';
import { getFeedbackToneColor } from '../../../foundations';
import type { ProgressCircleProps } from '../interfaces';

type Tone = NonNullable<ProgressCircleProps['tone']>;

/**
 * Resolve a cor do trace ativo a partir do tom semântico.
 *
 * Wrapper fino sobre `getFeedbackToneColor` (RFC-0032) para preservar a
 * superfície local consumida por web e native sem que cada arquivo
 * importe foundations diretamente.
 *
 * @see RFC-0032
 */
export function getToneColor(tone: Tone, theme: ArborTheme): string {
  return getFeedbackToneColor(theme, tone, 'base');
}
