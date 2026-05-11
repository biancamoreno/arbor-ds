import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Flex } from '../../core';
import { Icon } from '../../core';
import type { SpinnerProps } from '../interfaces';

/**
 * @platform shared
 *
 * Indicador de loading rotativo (RFC-0021 — loader unificado consumido também
 * por `Button` em `loading=true`). `size` (default `'medium'`) resolve via
 * `theme.sizes.spinner.{small|medium|large}`. `color` (default `brand.solid`)
 * aceita token semântico ou string CSS. `label` é texto SR-only (`role="status"`
 * + `aria-label`); passe `label=""` quando o contexto já anuncia o loading.
 *
 * Reduced-motion: `prefers-reduced-motion: reduce` é honrado globalmente pelo
 * `ArborProvider` (forçando `animation-duration` para ~0ms), o que congela
 * o spinner. O anúncio para leitores de tela permanece.
 *
 * @see {@link SpinnerProps}
 */
export function Spinner({ size = 'medium', color, label = 'Carregando', style, ...props }: SpinnerProps) {
  const theme = useTheme();
  const px = theme.sizes.spinner[size];
  const strokeColor = color ?? theme.colors.brand.solid;

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
