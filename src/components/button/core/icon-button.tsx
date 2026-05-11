import type { IconButtonProps } from '../interfaces';
import { Button } from './button';
import { useTheme } from '../../../ecosystem/styled-system/adapters';

/**
 * @platform shared
 *
 * `Button` quadrado que recebe apenas um ícone via `children`. Tamanho fixo via
 * `theme.sizes.control.{small|medium|large}` (themable) e formato controlado por
 * `shape` (`circle` — default usa `theme.radii.full`; `square` usa
 * `theme.radii.small`). Reutiliza variantes/loading/disabled do `Button`.
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
  const dimension = theme.sizes.control[size];
  const radius = shape === 'circle' ? theme.radii.full : theme.radii.small;

  return (
    <Button
      size={size}
      style={{
        width: dimension,
        height: dimension,
        minWidth: dimension,
        padding: 0,
        borderRadius: radius,
        ...style,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

IconButton.displayName = 'IconButton';
