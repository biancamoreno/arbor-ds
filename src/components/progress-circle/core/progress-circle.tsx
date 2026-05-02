import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { transition } from '../../../ecosystem/utils/functions';
import { getToneColor } from '../internal/colors';
import type { ProgressCircleProps } from '../interfaces';

/**
 * @platform shared
 *
 * Indicador circular de progresso renderizado em SVG. `progress` é
 * percentual 0-100 (clampado). `indeterminate` ativa rotação contínua
 * quando o progresso não é determinável. `size` em px (default `48`),
 * `strokeWidth` controla a espessura da circunferência (default `4`).
 * `tone` (`brand`/`success`/`warning`/`critical`/`info`) define a cor do
 * traço. `label` é texto SR-only.
 *
 * @see {@link ProgressCircleProps}
 */
export function ProgressCircle({
  progress,
  indeterminate = false,
  size = 48,
  strokeWidth = 4,
  tone = 'brand',
  label,
  style,
  testID,
}: ProgressCircleProps) {
  const theme = useTheme();
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const r = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = indeterminate ? circumference * 0.75 : circumference * (1 - clampedProgress / 100);
  const traceColor = getToneColor(tone, theme);

  return (
    <svg
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      aria-busy={indeterminate || undefined}
      data-testid={testID}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      style={{
        transform: indeterminate ? undefined : 'rotate(-90deg)',
        animation: indeterminate ? 'arbor-spin 1.2s linear infinite' : undefined,
        ...style,
      }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={theme.colors.background.subtle}
        strokeWidth={strokeWidth}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={traceColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: indeterminate ? undefined : transition(['stroke-dashoffset'], 'slow', 'standard') }}
      />
    </svg>
  );
}

ProgressCircle.displayName = 'ProgressCircle';
