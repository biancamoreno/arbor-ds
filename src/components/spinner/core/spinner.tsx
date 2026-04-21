import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Icon } from '../../core';
import type { SpinnerProps } from '../interfaces';

const SIZE_MAP = { sm: 16, md: 24, lg: 40 } as const;

export function Spinner({ size = 'md', color, label = 'Carregando', style, ...props }: SpinnerProps) {
  const theme = useTheme();
  const px = SIZE_MAP[size];
  const strokeColor = color ?? theme.colors.brand.base;

  return (
    <span
      role="status"
      aria-label={label}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: strokeColor,
        animation: 'arbor-spin 0.8s linear infinite',
        width: px,
        height: px,
        ...style,
      }}
      {...props}
    >
      <Icon name="LoaderCircle" size={px} color="currentColor" aria-hidden="true" />
    </span>
  );
}
