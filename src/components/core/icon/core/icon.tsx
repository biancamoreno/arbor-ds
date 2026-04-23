import { icons } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { IconProps } from '../interfaces/IconProps';

export function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  decorative = true,
  'aria-label': ariaLabel,
  ...rest
}: IconProps) {
  const LucideIconComponent = icons[name] as LucideIcon | undefined;
  if (!LucideIconComponent) return null;

  if (process.env.NODE_ENV !== 'production' && !decorative && !ariaLabel) {
    console.warn(`[Icon] name="${name}": decorative=false requires aria-label for accessibility.`);
  }

  return (
    <LucideIconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      aria-hidden={decorative || undefined}
      aria-label={!decorative ? ariaLabel : undefined}
      {...(rest as object)}
    />
  );
}

Icon.displayName = 'Icon';
