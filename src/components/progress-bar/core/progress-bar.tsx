import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type { ProgressBarProps } from '../interfaces';

const HEIGHT_MAP = { sm: 4, md: 8, lg: 12 } as const;

export function ProgressBar({
  progress,
  label,
  size = 'md',
  tone = 'brand',
  style,
  ...props
}: ProgressBarProps) {
  const theme = useTheme();
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const height = HEIGHT_MAP[size];

  const fillColor: Record<NonNullable<ProgressBarProps['tone']>, string> = {
    brand: theme.colors.brand.base,
    success: theme.colors.feedback.success.base,
    warning: theme.colors.feedback.warning.base,
    critical: theme.colors.feedback.critical.base,
  };

  return (
    <div
      role="progressbar"
      aria-valuenow={clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      {...props}
      style={{
        width: '100%',
        height: `${height}px`,
        borderRadius: theme.radii.full,
        backgroundColor: theme.colors.background.subtle,
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${clampedProgress}%`,
          borderRadius: theme.radii.full,
          backgroundColor: fillColor[tone],
          transition: 'width 0.3s ease',
        }}
      />
    </div>
  );
}
