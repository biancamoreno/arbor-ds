import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Flex } from '../../core';
import { Icon } from '../../core';
import { SIZE_MAP } from '../internal/sizes';
import type { SpinnerProps } from '../interfaces';

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
      color={strokeColor}
      style={{
        width: px,
        height: px,
        animation: 'arbor-spin 0.8s linear infinite',
        ...style,
      }}
      {...props}
    >
      <Icon name="LoaderCircle" size={px} color="currentColor" />
    </Flex>
  );
}

Spinner.displayName = 'Spinner';
