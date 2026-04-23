import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Flex } from '../../core';
import { Icon } from '../../core';
import type { SpinnerProps } from '../interfaces';

const SIZE_MAP = { sm: 16, md: 24, lg: 40 } as const;

export function Spinner({ size = 'md', color, label = 'Carregando', style, ...props }: SpinnerProps) {
  const theme = useTheme();
  const px = SIZE_MAP[size];
  const strokeColor = color ?? theme.colors.brand.base;

  return (
    <Flex
      as="span"
      role="status"
      aria-label={label}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      style={{
        width: px,
        height: px,
        color: strokeColor,
        animation: 'arbor-spin 0.8s linear infinite',
        ...style,
      }}
      {...props}
    >
      <Icon name="LoaderCircle" size={px} color="currentColor" aria-hidden="true" />
    </Flex>
  );
}
