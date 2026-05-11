import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { Box } from '../../core';
import type { ProgressBarProps } from '../interfaces';

type ProgressBarSlots = 'root' | 'fill' | 'indeterminate';

/**
 * @platform shared
 *
 * Barra de progresso linear. `progress` é percentual 0-100 (clampado).
 * `indeterminate` ativa animação contínua quando o progresso não é
 * determinável. `tone` controla a cor do preenchimento; `size` controla a
 * altura. Anatomia/cor/tamanho resolvidos pela slot recipe `progressBar` —
 * override completo via `createTheme({ recipes: { progressBar: ... },
 * components: { progressBar: ... } })`.
 *
 * @see {@link ProgressBarProps}
 */
export function ProgressBar({
  progress,
  indeterminate = false,
  label,
  size = 'medium',
  tone = 'brand',
  className,
  style,
}: ProgressBarProps) {
  const theme = useTheme();
  const slots = useSlotRecipe<ProgressBarSlots>('progressBar', { size, tone });
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const { duration, easing } = theme.components.progressBar.indeterminate;
  const indeterminateAnimation = `arbor-progress-indeterminate ${duration} ${easing} infinite`;

  return (
    <Box
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      aria-busy={indeterminate || undefined}
      className={className}
      style={style}
      {...slots.root}
    >
      {indeterminate ? (
        <Box {...slots.indeterminate} style={{ animation: indeterminateAnimation }} />
      ) : (
        <Box {...slots.fill} style={{ width: `${clampedProgress}%` }} />
      )}
    </Box>
  );
}

ProgressBar.displayName = 'ProgressBar';
