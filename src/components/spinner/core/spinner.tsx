import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Flex } from '../../core';
import { Icon } from '../../core';
import { SIZE_MAP } from '../internal/sizes';
import type { SpinnerProps } from '../interfaces';

/**
 * @platform shared
 *
 * Indicador de loading rotativo (RFC-0021 — loader unificado consumido também
 * por `Button` em `loading=true`). `size` (default `'md'`) e `color` (token
 * semântico ou string CSS, default `brand.base`). `label` é texto SR-only
 * (`role="status"` + `aria-label`); passe `label=""` quando o contexto já
 * anuncia o loading.
 *
 * @see {@link SpinnerProps}
 */
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
