import type { CSSProperties } from 'react';
import type { ViewStyle } from 'react-native';
import type { IconButtonProps } from '../interfaces';
import { Button } from './button.native';

/**
 * @platform native-ready
 *
 * Wrapper sobre `Button.native` que força footprint quadrado/circular para um ícone.
 * Mesma API do `IconButton` web — `aria-label` é obrigatório no tipo, mas em RN
 * precisa também de `accessibilityLabel` no `Clickable.native` (já tratado no Button).
 */

const iconButtonSizeMap = {
  sm: { width: 32, height: 32 },
  md: { width: 40, height: 40 },
  lg: { width: 48, height: 48 },
} as const;

export function IconButton({
  children,
  size = 'md',
  shape = 'circle',
  style,
  ...props
}: IconButtonProps) {
  const sizing = iconButtonSizeMap[size];
  const overrideStyle: ViewStyle = {
    width: sizing.width,
    height: sizing.height,
    minWidth: sizing.width,
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: shape === 'circle' ? 999 : 12,
  };

  return (
    <Button size={size} {...props} style={{ ...overrideStyle, ...(style as ViewStyle) } as unknown as CSSProperties}>
      {children}
    </Button>
  );
}

IconButton.displayName = 'IconButton';
