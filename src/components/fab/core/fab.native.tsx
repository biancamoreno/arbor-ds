import { TouchableOpacity, Text } from 'react-native';
import { Icon } from '../../core';
import type { FloatingActionButtonProps } from '../interfaces/FabProps';

const SIZE_MAP = { sm: 40, md: 56, lg: 72 } as const;
const ICON_SIZE_MAP = { sm: 16, md: 20, lg: 24 } as const;

const VARIANT_COLORS = {
  primary: { bg: '#18736A', fg: '#FFFFFF' },
  secondary: { bg: '#E5F4F3', fg: '#1A1A1A' },
  surface: { bg: '#FFFFFF', fg: '#1A1A1A' },
} as const;

export function FloatingActionButton({
  icon,
  label,
  size = 'md',
  variant = 'primary',
  position = 'bottom-right',
  offset,
  disabled = false,
  onPress,
  'aria-label': ariaLabel,
}: FloatingActionButtonProps) {
  const dim = SIZE_MAP[size];
  const iconSize = ICON_SIZE_MAP[size];
  const { bg, fg } = VARIANT_COLORS[variant];
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
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label ?? ariaLabel}
      style={[
        positionStyle,
        {
          width: isExtended ? undefined : dim,
          height: dim,
          minWidth: dim,
          borderRadius: 1000,
          backgroundColor: bg,
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          flexDirection: 'row' as const,
          gap: isExtended ? 8 : 0,
          paddingHorizontal: isExtended ? 16 : 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
    >
      <Icon name={icon} size={iconSize} color={fg} decorative />
      {isExtended && (
        <Text style={{ color: fg, fontSize: 14, fontWeight: '500', lineHeight: 20 }}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

FloatingActionButton.displayName = 'FloatingActionButton';
