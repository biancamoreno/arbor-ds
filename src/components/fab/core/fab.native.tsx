import { Text } from 'react-native';
import { Clickable, Icon } from '../../core';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type { FloatingActionButtonProps } from '../interfaces/FabProps';

const SIZE_MAP = { small: 40, medium: 56, large: 72 } as const;
const ICON_SIZE_MAP = { small: 16, medium: 20, large: 24 } as const;

/**
 * @platform native
 *
 * `FloatingActionButton` em React Native: usa `Clickable.native` posicionado
 * absolutamente dentro da tela (sem `position: fixed` — RN não suporta;
 * `position: 'absolute'` é colocado pelo container do app). Sem animação de
 * entrada nem `prefers-reduced-motion` — a versão simplificada do FAB web.
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
  const variantColors = {
    primary: { bg: theme.colors.brand.base, fg: theme.colors.text.inverse },
    secondary: { bg: theme.colors.brand.subtle, fg: theme.colors.text.primary },
    surface: { bg: theme.colors.surface.default, fg: theme.colors.text.primary },
  } as const;
  const { bg, fg } = variantColors[variant];
  const isExtended = !!label;

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
      onClick={disabled ? undefined : (onPress as unknown as React.MouseEventHandler<HTMLElement>)}
      disabled={disabled}
      aria-label={label ?? ariaLabel}
      style={{
        ...positionStyle,
        width: isExtended ? undefined : dim,
        height: dim,
        minWidth: dim,
        borderRadius: 1000,
        backgroundColor: bg,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: isExtended ? 8 : 0,
        paddingHorizontal: isExtended ? 16 : 0,
        elevation: 8,
        shadowColor: theme.colors.shadow.color,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Icon name={icon} size={iconSize} color={fg} decorative />
      {isExtended && (
        <Text style={{ color: fg, fontSize: 14, fontWeight: '500', lineHeight: 20 }}>
          {label}
        </Text>
      )}
    </Clickable>
  );
}

FloatingActionButton.displayName = 'FloatingActionButton';
