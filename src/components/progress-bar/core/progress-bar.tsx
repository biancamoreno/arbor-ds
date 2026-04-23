import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Box } from '../../core';
import { transition } from '../../../ecosystem/utils/functions';
import type { ProgressBarProps } from '../interfaces';

const HEIGHT_MAP = { sm: 4, md: 8, lg: 12 } as const;

export function ProgressBar({
  progress,
  indeterminate = false,
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
    <Box
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : clampedProgress}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      aria-busy={indeterminate || undefined}
      {...props}
      position="relative"
      width="100%"
      borderRadius="full"
      backgroundColor="background.subtle"
      overflow="hidden"
      style={{ height, ...style }}
    >
      {indeterminate ? (
        <Box
          position="absolute"
          height="100%"
          borderRadius="full"
          style={{
            width: '35%',
            backgroundColor: fillColor[tone],
            animation: 'arbor-progress-indeterminate 2.1s cubic-bezier(0.65,0.815,0.735,0.395) infinite',
          }}
        />
      ) : (
        <Box
          height="100%"
          borderRadius="full"
          style={{
            width: `${clampedProgress}%`,
            backgroundColor: fillColor[tone],
            transition: transition(['width'], 'slow', 'standard'),
          }}
        />
      )}
    </Box>
  );
}
