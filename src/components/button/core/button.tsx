import { Clickable } from '../../core';
import type { ButtonProps } from '../interfaces';
import { useTheme } from '../../../ecosystem/styled-system/adapters';

const Spinner = () => (
  <span
    aria-hidden="true"
    style={{
      display: 'inline-block',
      animation: 'spin 0.8s linear infinite',
      marginRight: '0.5rem',
    }}
  >
    ...
  </span>
);

const buttonSizeMap = {
  sm: {
    paddingInline: '12px',
    paddingBlock: '4px',
  },
  md: {
    paddingInline: '16px',
    paddingBlock: '8px',
  },
  lg: {
    paddingInline: '20px',
    paddingBlock: '12px',
  },
} as const;

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  style,
  ...rest
}: ButtonProps) {
  const theme = useTheme();
  const isDisabled = loading || disabled;

  const variantStyles = {
    primary: {
      backgroundColor: theme.colors.interactive.default,
      borderColor: theme.colors.interactive.default,
      color: theme.colors.text.inverse,
    },
    secondary: {
      backgroundColor: theme.colors.brand.subtle,
      borderColor: theme.colors.brand.soft,
      color: theme.colors.text.primary,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.border.default,
      color: theme.colors.text.primary,
    },
  } as const;

  return (
    <Clickable
      as="button"
      type={type}
      alignItems="center"
      display="inline-flex"
      gap="8px"
      justifyContent="center"
      borderRadius="small"
      borderStyle="solid"
      borderWidth="hairline"
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
      opacity={isDisabled ? 0.6 : 1}
      pointerEvents={isDisabled ? 'none' : 'auto'}
      onClick={isDisabled ? undefined : onClick}
      style={{
        ...buttonSizeMap[size],
        fontSize: size === 'lg' ? theme.fontSizes.medium : theme.fontSizes.small,
        fontWeight: theme.fontWeights.medium,
        lineHeight: 1,
        transition: 'background-color 0.2s ease, border-color 0.2s ease, opacity 0.2s ease',
        ...variantStyles[variant],
        ...style,
      }}
      {...variantStyles[variant]}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </Clickable>
  );
}
