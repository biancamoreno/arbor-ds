import * as lucideNative from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import type { IconProps } from '../interfaces/IconProps';

export function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.75,
  decorative = true,
  'aria-label': ariaLabel,
}: IconProps) {
  const LucideIconComponent = (lucideNative as Record<string, unknown>)[name] as LucideIcon | undefined;
  if (!LucideIconComponent) return null;

  return (
    <LucideIconComponent
      size={typeof size === 'number' ? size : 20}
      color={color === 'currentColor' ? '#000000' : color}
      strokeWidth={strokeWidth}
      accessibilityElementsHidden={decorative}
      accessibilityLabel={decorative ? undefined : ariaLabel}
    />
  );
}

Icon.displayName = 'Icon';
