import { useCallback } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useControllableState } from '../../../ecosystem/primitives';
import { Box, Flex, Clickable, Text } from '../../core';
import { Icon } from '../../core';
import { ChipContext, useChipContext } from '../context/chip-context';
import type { ChipRootProps, ChipLabelProps, ChipIconProps, ChipRemoveProps } from '../interfaces';

type ChipSlots = 'root' | 'label' | 'icon' | 'remove';

function ChipRoot(props: ChipRootProps) {
  const {
    children,
    variant = 'subtle',
    size = 'medium',
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
  const slots = useSlotRecipe<ChipSlots>('chip', {
    size,
    selectable: selectable ? 'true' : 'false',
    variant,
    tone,
    selected: selected ? 'true' : 'false',
  });
  const rootStyles = (slots.root ?? {}) as Record<string, unknown>;
  const textColor = rootStyles.color as string | undefined;
  const fontSize = size === 'small' ? 'xsmall' : 'small';

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
          {...slots.root}
          display="flex"
          opacity={disabled ? theme.opacity.medium : 1}
        >
          <Text fontSize={fontSize} fontWeight="medium" color={textColor}>
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
        {...slots.root}
        display="flex"
        opacity={disabled ? theme.opacity.medium : 1}
      >
        <Text fontSize={fontSize} fontWeight="medium" color={textColor}>
          {children}
        </Text>
      </Flex>
    </ChipContext.Provider>
  );
}

function ChipLabel({ children, className, style }: ChipLabelProps) {
  const slots = useSlotRecipe<ChipSlots>('chip');
  return (
    <Box className={className} style={style} {...slots.label}>
      {children}
    </Box>
  );
}

function ChipIcon({ children, className, style }: ChipIconProps) {
  const slots = useSlotRecipe<ChipSlots>('chip');
  return (
    <Flex
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={className}
      style={style}
      {...slots.icon}
      display="flex"
    >
      {children}
    </Flex>
  );
}

function ChipRemove({ label = 'Remover', onClick, className, style }: ChipRemoveProps) {
  const { disabled, selectable } = useChipContext();
  const slots = useSlotRecipe<ChipSlots>('chip', { selectable: selectable ? 'true' : 'false' });

  return (
    <Clickable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={style}
      {...slots.remove}
      display="flex"
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
 * Chip em React Native — paridade com web pós-RFC-0033 / TD-034. Discriminated
 * union via prop `selectable`:
 *
 * - **Decorativo (default):** `<Flex>` (View) puramente visual. Sem
 *   `accessibilityRole`.
 * - **Interativo (`selectable`):** `Clickable.native` com
 *   `accessibilityRole='button'` + `accessibilityState.selected`.
 *
 * Em RN, nested Pressable não tem restrição equivalente ao nested-button do
 * HTML, então `Chip.Remove` mantém `Clickable.native` em ambos os modos.
 * Anatomia e cor resolvidas pela slot recipe `chip`; `<Text>` interno recebe
 * `color` extraído do slot root (RN não cascateia `color` de View para Text).
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
