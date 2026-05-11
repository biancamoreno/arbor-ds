import type { CSSProperties } from 'react';
import type { ViewStyle } from 'react-native';
import type { IconButtonProps } from '../interfaces';
import { Button } from './button.native';
import { useTheme } from '../../../ecosystem/styled-system/adapters';

function parsePx(value: string | number): number {
  if (typeof value === 'number') return value;
  return parseFloat(value.replace('px', '')) || 0;
}

/**
 * @platform native
 *
 * `IconButton` em React Native: wrapper sobre `Button.native` que força
 * footprint quadrado/circular consumindo `theme.sizes.control.*` (themable).
 * Mesma API do equivalente web — `aria-label` acaba forwardado e mapeado para
 * `accessibilityLabel` pelo `Clickable.native` usado dentro do `Button.native`.
 *
 * @see {@link IconButtonProps}
 */
export function IconButton({
  children,
  size = 'medium',
  shape = 'circle',
  style,
  ...props
}: IconButtonProps) {
  const theme = useTheme();
  const dimension = parsePx(theme.sizes.control[size]);
  const radiusFull = typeof theme.radii.full === 'number' ? theme.radii.full : parsePx(theme.radii.full);
  const radiusSmall = typeof theme.radii.small === 'number' ? theme.radii.small : parsePx(theme.radii.small);
  const overrideStyle: ViewStyle = {
    width: dimension,
    height: dimension,
    minWidth: dimension,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: shape === 'circle' ? radiusFull : radiusSmall,
  };

  return (
    <Button size={size} {...props} style={{ ...overrideStyle, ...(style as ViewStyle) } as unknown as CSSProperties}>
      {children}
    </Button>
  );
}

IconButton.displayName = 'IconButton';
