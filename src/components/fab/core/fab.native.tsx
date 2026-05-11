import { Clickable, Icon, Text } from '../../core';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type { FloatingActionButtonProps } from '../interfaces/FabProps';

const SIZE_MAP = { small: 44, medium: 56, large: 72 } as const;
const ICON_SIZE_MAP = { small: 'small', medium: 'medium', large: 'large' } as const;

const variantColorTokens = {
  primary: { bg: 'interactive.default' as const, fg: 'text.inverse' as const },
  secondary: { bg: 'brand.bgElement' as const, fg: 'text.primary' as const },
  surface: { bg: 'surface.default' as const, fg: 'text.primary' as const },
};

/**
 * @platform native
 *
 * `FloatingActionButton` em React Native: usa `Clickable.native` posicionado
 * absolutamente dentro da tela (sem `position: fixed` — RN não suporta;
 * `position: 'absolute'` é colocado pelo container do app). Sem animação de
 * entrada nem `prefers-reduced-motion` — a versão simplificada do FAB web.
 *
 * Cores via tokens semânticos (paridade com web). Shadow (elevation +
 * shadowOffset/Opacity/Radius) é particularidade de plataforma RN — mantida
 * em literal por API nativa não ter equivalente cross-platform via tokens.
 *
 * @see {@link FloatingActionButtonProps}
 */
export function FloatingActionButton({
  icon,
  label,
  size = 'medium',
  variant = 'primary',
  position = 'bottom-right',
  offset,
  disabled = false,
  onPress,
  'aria-label': ariaLabel,
}: FloatingActionButtonProps) {
  const theme = useTheme();
  const dim = SIZE_MAP[size];
  const iconSize = ICON_SIZE_MAP[size];
  const isExtended = !!label;
  const variantTokens = variantColorTokens[variant];
  const radiusFull =
    typeof theme.radii.full === 'number' ? theme.radii.full : parseFloat(String(theme.radii.full)) || 1000;
  const shadowColor = theme.colors.shadow.color;

  if (process.env.NODE_ENV !== 'production' && !label && !ariaLabel) {
    console.warn('[FloatingActionButton] aria-label is required when label is not provided.');
  }

  const positionStyle =
    position !== 'none'
      ? ({
          position: 'absolute' as const,
          bottom: offset?.bottom ?? 16,
          ...(position === 'bottom-right' && { right: offset?.right ?? 16 }),
          ...(position === 'bottom-left' && { left: offset?.left ?? 16 }),
        } as const)
      : {};

  return (
    <Clickable
      onClick={onPress as unknown as React.MouseEventHandler<HTMLElement>}
      disabled={disabled}
      aria-label={label ?? ariaLabel}
      backgroundColor={variantTokens.bg}
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      gap={isExtended ? 'micro' : undefined}
      paddingX={isExtended ? 'small' : undefined}
      width={isExtended ? undefined : dim}
      height={dim}
      minWidth={dim}
      style={{
        ...positionStyle,
        borderRadius: radiusFull,
        elevation: 8,
        shadowColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      }}
    >
      <Icon name={icon} size={iconSize} color={variantTokens.fg} decorative />
      {isExtended && (
        <Text as="span" variant="label" color={variantTokens.fg}>
          {label}
        </Text>
      )}
    </Clickable>
  );
}

FloatingActionButton.displayName = 'FloatingActionButton';
