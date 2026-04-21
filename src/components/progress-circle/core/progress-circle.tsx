import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { transition } from '../../../ecosystem/utils/functions';
import type { ProgressCircleProps } from '../interfaces';

export function ProgressCircle({
  progress,
  indeterminate = false,
  size = 48,
  strokeWidth = 4,
  tone = 'brand',
  label,
  style,
  ...props
}: ProgressCircleProps) {
  const theme = useTheme();
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const r = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = indeterminate ? circumference * 0.75 : circumference * (1 - clampedProgress / 100);

  const fillColor: Record<NonNullable<ProgressCircleProps['tone']>, string> = {
    brand: theme.colors.brand.base,
    success: theme.colors.feedback.success.base,
    warning: theme.colors.feedback.warning.base,
    critical: theme.colors.feedback.critical.base,
  };

  return (
    <svg
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      aria-busy={indeterminate || undefined}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      style={{
        transform: indeterminate ? undefined : 'rotate(-90deg)',
        animation: indeterminate ? 'arbor-spin 1.2s linear infinite' : undefined,
        ...style,
      }}
      {...props}
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
        stroke={fillColor[tone]}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: indeterminate ? undefined : transition(['stroke-dashoffset'], 'slow', 'standard') }}
      />
    </svg>
  );
}
