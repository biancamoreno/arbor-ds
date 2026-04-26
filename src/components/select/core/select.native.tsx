import { useId, useCallback } from 'react';
import { Modal, Pressable, ScrollView } from 'react-native';
import { useControllableState, useDisclosure } from '../../../ecosystem/primitives';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Box, Flex, Text } from '../../core';
import { SelectContext, useSelectContext } from '../context/select-context';
import type { SelectState } from '../context/select-context';
import type {
  SelectRootProps,
  SelectTriggerProps,
  SelectValueProps,
  SelectContentProps,
  SelectItemProps,
} from '../interfaces/SelectProps';

/**
 * @platform native-ready
 *
 * Select nativo: trigger é `<Pressable accessibilityRole="combobox">`; o conteúdo
 * é apresentado em um `<Modal>` bottom-sheet do RN. A semântica de listbox é
 * adaptada — RN não expõe roles `listbox`/`option` diretamente, então itens usam
 * `accessibilityRole="menuitem"` com `accessibilityState.selected`.
 *
 * O fechamento ao tocar fora se dá pelo overlay full-screen acima do Modal.
 */

type SelectSlot = 'root' | 'trigger' | 'value' | 'icon' | 'content' | 'item' | 'itemText';

function resolveState(isDisabled: boolean, isInvalid: boolean, isOpen: boolean): SelectState {
  if (isDisabled) return 'disabled';
  if (isInvalid) return 'invalid';
  if (isOpen) return 'open';
  return 'idle';
}

function SelectRoot({
  value,
  defaultValue = '',
  onValueChange,
  disabled,
  id: idProp,
  size = 'md',
  children,
}: SelectRootProps) {
  const autoId = useId();
  const fieldCtx = useFieldContext();
  const inputId = fieldCtx?.fieldId ?? idProp ?? autoId;
  const effectiveDisabled = disabled ?? fieldCtx?.disabled ?? false;
  const effectiveInvalid = fieldCtx?.invalid ?? false;

  const [selectedValue, setSelectedValue] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const { isOpen, open, close } = useDisclosure(false);

  const select = useCallback(
    (val: string) => {
      setSelectedValue(val);
      close();
    },
    [setSelectedValue, close],
  );

  const state = resolveState(effectiveDisabled, effectiveInvalid, isOpen);
  const slots = useSlotRecipe<SelectSlot>('select', { size, state });

  return (
    <SelectContext.Provider
      value={{
        isOpen,
        selectedValue,
        isDisabled: effectiveDisabled,
        isInvalid: effectiveInvalid,
        inputId,
        size,
        state,
        open,
        close,
        select,
      }}
    >
      <Box {...slots.root}>{children}</Box>
    </SelectContext.Provider>
  );
}

function SelectTrigger({ children }: SelectTriggerProps) {
  const ctx = useSelectContext();
  const fieldCtx = useFieldContext();
  const slots = useSlotRecipe<SelectSlot>('select', { size: ctx.size, state: ctx.state });

  return (
    <Pressable
      onPress={() => (ctx.isOpen ? ctx.close() : ctx.open())}
      disabled={ctx.isDisabled}
      accessibilityRole="combobox"
      accessibilityState={{ expanded: ctx.isOpen, disabled: ctx.isDisabled }}
      nativeID={ctx.inputId}
      accessibilityLabelledBy={fieldCtx?.labelId}
    >
      <Flex {...slots.trigger}>
        {children}
        <Box {...slots.icon} marginLeft="micro">
          <Text fontSize="xsmall">{ctx.isOpen ? '▲' : '▼'}</Text>
        </Box>
      </Flex>
    </Pressable>
  );
}

function SelectValue({ placeholder = 'Select...' }: SelectValueProps) {
  const ctx = useSelectContext();
  const slots = useSlotRecipe<SelectSlot>('select', { size: ctx.size, state: ctx.state });

  return (
    <Box {...slots.value}>
      <Text numberOfLines={1}>{ctx.selectedValue || placeholder}</Text>
    </Box>
  );
}

function SelectContent({ children }: SelectContentProps) {
  const ctx = useSelectContext();
  const slots = useSlotRecipe<SelectSlot>('select', { size: ctx.size, state: ctx.state });

  return (
    <Modal
      visible={ctx.isOpen}
      transparent
      animationType="fade"
      onRequestClose={ctx.close}
    >
      <Pressable
        onPress={ctx.close}
        accessibilityLabel="close"
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}
      >
        <Pressable onPress={() => {}}>
          <Box {...slots.content} paddingY="small">
            <ScrollView style={{ maxHeight: 320 }}>{children}</ScrollView>
          </Box>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function SelectItem({ value, disabled = false, children }: SelectItemProps) {
  const ctx = useSelectContext();
  const isSelected = ctx.selectedValue === value;
  const slots = useSlotRecipe<SelectSlot>('select', { size: ctx.size, state: ctx.state });

  return (
    <Pressable
      onPress={() => !disabled && ctx.select(value)}
      disabled={disabled}
      accessibilityRole="menuitem"
      accessibilityState={{ selected: isSelected, disabled }}
    >
      <Flex
        {...slots.item}
        backgroundColor={isSelected ? 'brand.subtle' : 'transparent'}
        opacity={disabled ? 0.5 : 1}
      >
        <Text {...slots.itemText}>{children}</Text>
      </Flex>
    </Pressable>
  );
}

SelectRoot.displayName = 'Select.Root';
SelectTrigger.displayName = 'Select.Trigger';
SelectValue.displayName = 'Select.Value';
SelectContent.displayName = 'Select.Content';
SelectItem.displayName = 'Select.Item';

markFieldAware(SelectRoot);
markFieldAware(SelectTrigger);

export const Select = Object.assign(SelectRoot, {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Content: SelectContent,
  Item: SelectItem,
});
