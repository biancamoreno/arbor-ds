import type { CSSProperties } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type { BadgeProps } from '../interfaces/BadgeProps';

function getToneStyle(tone: BadgeProps['tone'], theme: ReturnType<typeof useTheme>): CSSProperties {
  switch (tone) {
    case 'brand':
      return { backgroundColor: theme.colors.brand.subtle, color: theme.colors.brand.strong };
    case 'success':
      return { backgroundColor: theme.colors.feedback.success.subtle, color: theme.colors.feedback.success.strong };
    case 'warning':
      return { backgroundColor: theme.colors.feedback.warning.subtle, color: theme.colors.feedback.warning.strong };
    case 'critical':
      return { backgroundColor: theme.colors.feedback.critical.subtle, color: theme.colors.feedback.critical.strong };
    default:
      return { backgroundColor: theme.colors.background.subtle, color: theme.colors.text.primary };
  }
}

export function Badge({ children, tone = 'neutral', style, ...props }: BadgeProps) {
  const theme = useTheme();

  return (
    <span
      {...props}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: theme.radii.full,
        padding: '4px 10px',
        fontSize: theme.fontSizes.xsmall,
        fontWeight: theme.fontWeights.medium,
        ...getToneStyle(tone, theme),
        ...style,
      }}
    >
      {children}
    </span>
  );
}
