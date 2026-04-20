import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type { ProgressCircleProps } from '../interfaces';

export function ProgressCircle({
  progress,
  size = 48,
  strokeWidth = 4,
  tone = 'brand',
  label,
  ...props
}: ProgressCircleProps) {
  const theme = useTheme();
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const r = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - clampedProgress / 100);

  const fillColor: Record<NonNullable<ProgressCircleProps['tone']>, string> = {
    brand: theme.colors.brand.base,
    success: theme.colors.feedback.success.base,
    warning: theme.colors.feedback.warning.base,
    critical: theme.colors.feedback.critical.base,
  };

  return (
    <svg
      role="progressbar"
      aria-valuenow={clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      style={{ transform: 'rotate(-90deg)' }}
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
        style={{ transition: 'stroke-dashoffset 0.3s ease' }}
      />
    </svg>
  );
}
