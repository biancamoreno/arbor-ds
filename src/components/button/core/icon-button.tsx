import type { IconButtonProps } from '../interfaces';
import { Button } from './button';

const iconButtonSizeMap = {
  small: { width: '32px', height: '32px', padding: 0 },
  medium: { width: '40px', height: '40px', padding: 0 },
  large: { width: '48px', height: '48px', padding: 0 },
} as const;

/**
 * @platform shared
 *
 * `Button` quadrado que recebe apenas um ícone via `children`. Tamanho fixo por
 * size token (`small` 32px / `medium` 40px / `large` 48px) e formato controlado por
 * `shape` (`circle` — default, `square`). Reutiliza variantes/loading/disabled
 * do `Button`.
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
  return (
    <Button
      size={size}
      style={{
        ...iconButtonSizeMap[size],
        minWidth: iconButtonSizeMap[size].width,
        borderRadius: shape === 'circle' ? '999px' : '12px',
        ...style,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

IconButton.displayName = 'IconButton';
