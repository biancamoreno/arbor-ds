import type { CSSProperties } from 'react';
import type { ViewStyle } from 'react-native';
import type { IconButtonProps } from '../interfaces';
import { Button } from './button.native';

const iconButtonSizeMap = {
  small: { width: 32, height: 32 },
  medium: { width: 40, height: 40 },
  large: { width: 48, height: 48 },
} as const;

/**
 * @platform native
 *
 * `IconButton` em React Native: wrapper sobre `Button.native` que força
 * footprint quadrado/circular. Mesma API do equivalente web — `aria-label`
 * acaba forwardado e mapeado para `accessibilityLabel` pelo `Clickable.native`
 * usado dentro do `Button.native`.
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
