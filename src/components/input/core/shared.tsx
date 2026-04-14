import type { CSSProperties, ReactNode } from 'react';
import type { ArborTheme } from '../../../foundations';
import type { FieldBaseProps, FieldSize } from '../interfaces';

export function getFieldColors(theme: ArborTheme, options: Pick<FieldBaseProps, 'disabled' | 'error' | 'variant'>) {
  const borderColor = options.error
    ? theme.colors.feedback.critical.base
    : theme.colors.border.default;

  return {
    backgroundColor: options.variant === 'filled' ? theme.colors.background.subtle : theme.colors.surface.default,
    borderColor,
    labelColor: options.error ? theme.colors.feedback.critical.base : theme.colors.text.primary,
    helperColor: options.error ? theme.colors.feedback.critical.base : theme.colors.text.secondary,
    textColor: options.disabled ? theme.colors.text.disabled : theme.colors.text.primary,
    placeholderColor: theme.colors.text.tertiary,
  };
}

export function getFieldSizeStyles(theme: ArborTheme, size: FieldSize = 'md') {
  const map = {
    sm: {
      fontSize: theme.fontSizes.xsmall,
      minHeight: '32px',
      paddingInline: '12px',
      paddingBlock: '6px',
    },
    md: {
      fontSize: theme.fontSizes.small,
      minHeight: '40px',
      paddingInline: '16px',
      paddingBlock: '8px',
    },
    lg: {
      fontSize: theme.fontSizes.medium,
      minHeight: '48px',
      paddingInline: '18px',
      paddingBlock: '10px',
    },
  } as const;

  return map[size];
}

export function getFieldFrameStyle(theme: ArborTheme, options: Pick<FieldBaseProps, 'size' | 'variant' | 'error' | 'disabled'>) {
  const colors = getFieldColors(theme, options);
  const sizeStyles = getFieldSizeStyles(theme, options.size);

  return {
    ...sizeStyles,
    width: '100%',
    border: `1px solid ${colors.borderColor}`,
    borderRadius: theme.radii.small,
    backgroundColor: colors.backgroundColor,
    color: colors.textColor,
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    opacity: options.disabled ? 0.6 : 1,
  } satisfies CSSProperties;
}

export function FieldShell({
  theme,
  label,
  helperText,
  error,
  children,
}: {
  theme: ArborTheme;
  label?: string;
  helperText?: string;
  error?: string;
  children: ReactNode;
}) {
  const colors = getFieldColors(theme, { error });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label
          style={{
            color: colors.labelColor,
            fontSize: theme.fontSizes.xsmall,
            fontWeight: theme.fontWeights.medium,
          }}
        >
          {label}
        </label>
      )}
      {children}
      {(error || helperText) && (
        <span
          style={{
            color: colors.helperColor,
            fontSize: theme.fontSizes.xsmall,
          }}
        >
          {error ?? helperText}
        </span>
      )}
    </div>
  );
}
