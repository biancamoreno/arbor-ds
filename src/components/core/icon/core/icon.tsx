import { iconSize as iconSizeTokens } from '../../../../foundations';
import { iconMap } from '../internal';
import type { IconProps, IconSize } from '../interfaces/IconProps';

function resolveSize(size: IconSize): number {
  if (typeof size === 'number') return size;
  return iconSizeTokens[size];
}

/**
 * @platform shared
 *
 * Componente de ícone do DS. Renderiza um glifo do `iconMap` curado (RFC-0028)
 * pelo nome (`name`) e resolve `size` por token semântico
 * (`xsmall`/`small`/`medium`/`large`/`xlarge`/`hero`) ou número absoluto. Por
 * default é decorativo (`aria-hidden`); para ícones com significado próprio,
 * passe `decorative={false}` e um `aria-label` descritivo.
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

  const IconComponent = iconMap[name];
  if (!IconComponent) return null;

  return (
    <IconComponent
      size={resolveSize(size)}
      color={color}
      strokeWidth={strokeWidth}
      aria-hidden={isDecorative || undefined}
      aria-label={!isDecorative ? ariaLabel : undefined}
    />
  );
}

Icon.displayName = 'Icon';
