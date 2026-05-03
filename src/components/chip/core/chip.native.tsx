import { useCallback } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useControllableState } from '../../../ecosystem/primitives';
import { Box, Flex, Clickable, Text } from '../../core';
import { Icon } from '../../core';
import { transition, getFeedbackToneColor, type ArborTheme, type FeedbackTone } from '../../../foundations';
import { ChipContext, useChipContext } from '../context/chip-context';
import type { ChipRootProps, ChipLabelProps, ChipIconProps, ChipRemoveProps } from '../interfaces';

type ChipColors = {
  backgroundColor: string;
  color: string;
  borderColor: string;
};

function getChipColors(
  theme: ArborTheme,
  variant: NonNullable<ChipRootProps['variant']>,
  tone: FeedbackTone,
  selected: boolean,
): ChipColors {
  const base = getFeedbackToneColor(theme, tone, 'base');
  const subtle = getFeedbackToneColor(theme, tone, 'subtle');
  const strong = getFeedbackToneColor(theme, tone, 'strong');

  if (variant === 'filled') {
    return selected
      ? { backgroundColor: base, color: theme.colors.text.inverse, borderColor: 'transparent' }
      : { backgroundColor: subtle, color: strong, borderColor: 'transparent' };
  }

  if (variant === 'outlined') {
    return {
      backgroundColor: 'transparent',
      color: selected ? base : theme.colors.text.secondary,
      borderColor: selected ? base : theme.colors.border.default,
    };
  }

  return {
    backgroundColor: selected ? subtle : 'transparent',
    color: selected ? strong : theme.colors.text.secondary,
    borderColor: theme.colors.border.subtle,
  };
}

function ChipRoot(props: ChipRootProps) {
  const {
    children,
    variant = 'subtle',
    size = 'md',
    disabled = false,
    tone = 'neutral',
    className,
    style,
  } = props;
  const selectable = props.selectable === true;

  const [selected, setSelected] = useControllableState({
    value: selectable ? props.selected : false,
    defaultValue: selectable ? props.defaultSelected ?? false : false,
    onChange: selectable ? props.onSelectedChange : undefined,
  });

  const theme = useTheme();
  const colors = getChipColors(theme, variant, tone, selected);
  const paddingX = size === 'sm' ? 'micro' : 'small';
  const paddingY = size === 'sm' ? 'nano' : 'micro';
  const fontSize = size === 'sm' ? 'xsmall' : 'small';

  const handleToggle = useCallback(() => {
    if (disabled) return;
    setSelected(!selected);
  }, [disabled, selected, setSelected]);

  const contextValue = {
    variant,
    tone,
    selected,
    disabled,
    selectable,
  };

  if (selectable) {
    return (
      <ChipContext.Provider value={contextValue}>
        <Clickable
          accessibilityRole="button"
          accessibilityState={{ selected, disabled: !!disabled }}
          disabled={disabled}
          onClick={handleToggle}
          className={className}
          style={style}
          display="flex"
          alignItems="center"
          gap="nano"
          paddingX={paddingX}
          paddingY={paddingY}
          minHeight={32}
          borderRadius="full"
          borderWidth="hairline"
          borderStyle="solid"
          backgroundColor={colors.backgroundColor}
          borderColor={colors.borderColor}
          opacity={disabled ? theme.opacity.medium : 1}
        >
          <Text fontSize={fontSize} fontWeight="medium" color={colors.color}>
            {children}
          </Text>
        </Clickable>
      </ChipContext.Provider>
    );
  }

  return (
    <ChipContext.Provider value={contextValue}>
      <Flex
        className={className}
        style={style}
        display="flex"
        alignItems="center"
        gap="nano"
        paddingX={paddingX}
        paddingY={paddingY}
        borderRadius="full"
        borderWidth="hairline"
        borderStyle="solid"
        backgroundColor={colors.backgroundColor}
        borderColor={colors.borderColor}
        opacity={disabled ? theme.opacity.medium : 1}
      >
        <Text fontSize={fontSize} fontWeight="medium" color={colors.color}>
          {children}
        </Text>
      </Flex>
    </ChipContext.Provider>
  );
}

function ChipLabel({ children, className, style }: ChipLabelProps) {
  return (
    <Box className={className} style={style}>
      {children}
    </Box>
  );
}

function ChipIcon({ children, className, style }: ChipIconProps) {
  return (
    <Flex
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={className}
      style={style}
      display="flex"
      alignItems="center"
      flexShrink={0}
    >
      {children}
    </Flex>
  );
}

function ChipRemove({ label = 'Remover', onClick, className, style }: ChipRemoveProps) {
  const { disabled } = useChipContext();

  // Em RN, nested Pressable é aceitável (sem regra HTML equivalente). Mantemos
  // Clickable.native em ambos os modos do Root para paridade visual.
  return (
    <Clickable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={style}
      display="flex"
      alignItems="center"
      justifyContent="center"
      minWidth={44}
      minHeight={44}
      width={14}
      height={14}
      flexShrink={0}
      borderRadius="full"
      backgroundColor="transparent"
      marginLeft="micro"
      transition={transition(['background-color', 'color'], 'fast')}
    >
      <Icon name="X" size="xsmall" decorative />
    </Clickable>
  );
}

ChipRoot.displayName = 'Chip.Root';
ChipLabel.displayName = 'Chip.Label';
ChipIcon.displayName = 'Chip.Icon';
ChipRemove.displayName = 'Chip.Remove';

/**
 * @platform native
 *
 * Chip em React Native — paridade com web pós-RFC-0033. Discriminated union
 * via prop `selectable`:
 *
 * - **Decorativo (default):** `<Flex>` (View) puramente visual. Sem
 *   `accessibilityRole`.
 * - **Interativo (`selectable`):** `Clickable.native` com
 *   `accessibilityRole='button'` + `accessibilityState.selected`.
 *
 * Em RN, nested Pressable não tem restrição equivalente ao nested-button do
 * HTML, então `Chip.Remove` mantém `Clickable.native` em ambos os modos.
 *
 * @see {@link ChipRootProps}
 * @see RFC-0033
 */
export const Chip = Object.assign(ChipRoot, {
  Root: ChipRoot,
  Label: ChipLabel,
  Icon: ChipIcon,
  Remove: ChipRemove,
});
