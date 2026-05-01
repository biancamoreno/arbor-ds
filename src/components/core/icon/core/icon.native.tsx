import * as lucideNative from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { iconSize as iconSizeTokens } from '../../../../foundations';
import { useTheme } from '../../../../ecosystem/styled-system/adapters';
import type { IconProps, IconSize } from '../interfaces/IconProps';

function resolveSize(size: IconSize): number {
  if (typeof size === 'number') return size;
  return iconSizeTokens[size];
}

export function Icon(props: IconProps) {
  const {
    name,
    size = 'md',
    color = 'currentColor',
    strokeWidth = 1.75,
    decorative,
  } = props;
  const ariaLabel = (props as { 'aria-label'?: string })['aria-label'];
  const isDecorative = decorative !== false;
  const theme = useTheme();

  const LucideIconComponent = (lucideNative as Record<string, unknown>)[name] as LucideIcon | undefined;
  if (!LucideIconComponent) return null;

  return (
    <LucideIconComponent
      size={resolveSize(size)}
      color={color === 'currentColor' ? theme.colors.text.primary : color}
      strokeWidth={strokeWidth}
      accessibilityElementsHidden={isDecorative}
      accessibilityLabel={isDecorative ? undefined : ariaLabel}
    />
  );
}

Icon.displayName = 'Icon';
