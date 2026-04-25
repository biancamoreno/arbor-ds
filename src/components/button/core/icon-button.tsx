import type { IconButtonProps } from '../interfaces';
import { Button } from './button';

const iconButtonSizeMap = {
  sm: { width: '32px', height: '32px', padding: 0 },
  md: { width: '40px', height: '40px', padding: 0 },
  lg: { width: '48px', height: '48px', padding: 0 },
} as const;

export function IconButton({
  children,
  size = 'md',
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
