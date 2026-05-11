import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { transition } from '../../../ecosystem/utils/functions';
import { getFeedbackToneColor } from '../../../foundations';
import type { ProgressCircleProps } from '../interfaces';

/**
 * @platform shared
 *
 * Indicador circular de progresso renderizado em SVG. `progress` é
 * percentual 0-100 (clampado). `indeterminate` ativa rotação contínua
 * quando o progresso não é determinável. `size` é nominal SP-1
 * (`small`/`medium`/`large`) — diâmetro e strokeWidth resolvem via
 * `theme.components.progressCircle.{size,strokeWidth}.{size}`.
 * `tone` define a cor do traço. `label` é texto SR-only para leitores.
 *
 * @see {@link ProgressCircleProps}
 */
export function ProgressCircle({
  progress,
  indeterminate = false,
  size = 'medium',
  strokeWidth,
  tone = 'brand',
  label,
  style,
  testID,
}: ProgressCircleProps) {
  const theme = useTheme();
  const tokens = theme.components.progressCircle;
  const diameter = tokens.size[size];
  const stroke = strokeWidth ?? tokens.strokeWidth[size];
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const r = (diameter - stroke * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = indeterminate
    ? circumference * tokens.indeterminate.offsetRatio
    : circumference * (1 - clampedProgress / 100);
  const traceColor = getFeedbackToneColor(theme, tone, 'base');
  const trackColor = theme.colors.background.subtle;

  return (
    <svg
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      aria-busy={indeterminate || undefined}
      data-testid={testID}
      width={diameter}
      height={diameter}
      viewBox={`0 0 ${diameter} ${diameter}`}
      fill="none"
      style={{
        transform: indeterminate ? undefined : 'rotate(-90deg)',
        animation: indeterminate ? `arbor-spin ${tokens.indeterminate.duration} linear infinite` : undefined,
        ...style,
      }}
    >
      <circle
        cx={diameter / 2}
        cy={diameter / 2}
        r={r}
        stroke={trackColor}
        strokeWidth={stroke}
      />
      <circle
        cx={diameter / 2}
        cy={diameter / 2}
        r={r}
        stroke={traceColor}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: indeterminate ? undefined : transition(['stroke-dashoffset'], 'slow', 'standard') }}
      />
    </svg>
  );
}

ProgressCircle.displayName = 'ProgressCircle';
