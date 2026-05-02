import { iconSize as iconSizeTokens } from '../../../../foundations';
import { useTheme } from '../../../../ecosystem/styled-system/adapters';
import { iconMap } from '../internal/icon-map.native';
import type { IconProps, IconSize } from '../interfaces/IconProps';

function resolveSize(size: IconSize): number {
  if (typeof size === 'number') return size;
  return iconSizeTokens[size];
}

/**
 * @platform native
 *
 * Implementação React Native do `Icon`. Resolve `color: 'currentColor'` para
 * `theme.colors.text.primary` (RN não herda cor por padrão) e mapeia
 * `decorative`/`aria-label` para `accessibilityElementsHidden`/
 * `accessibilityLabel`.
 *
 * @see {@link IconProps}
 */
export function Icon(props: IconProps) {
  const {
    name,
    size = 'medium',
    color = 'currentColor',
    strokeWidth = 1.75,
    decorative,
  } = props;
  const ariaLabel = (props as { 'aria-label'?: string })['aria-label'];
  const isDecorative = decorative !== false;
  const theme = useTheme();

  const IconComponent = iconMap[name];
  if (!IconComponent) return null;

  return (
    <IconComponent
      size={resolveSize(size)}
      color={color === 'currentColor' ? theme.colors.text.primary : color}
      strokeWidth={strokeWidth}
      accessibilityElementsHidden={isDecorative}
      accessibilityLabel={isDecorative ? undefined : ariaLabel}
    />
  );
}

Icon.displayName = 'Icon';
