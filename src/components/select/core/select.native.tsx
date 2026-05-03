import { useId, useRef, useEffect, useState, useCallback, useMemo, Children, isValidElement } from 'react';
import { Modal, Pressable, ScrollView } from 'react-native';
import { useControllableState, useDisclosure } from '../../../ecosystem/primitives';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Box, Flex, Text, Icon } from '../../core';
import { SelectContext, useSelectContext } from '../context/select-context';
import type { SelectItemEntry, SelectState } from '../context/select-context';
import { extractDisplayText } from '../utils/extract-display-text';
import type {
  SelectRootProps,
  SelectTriggerProps,
  SelectValueProps,
  SelectContentProps,
  SelectItemProps,
} from '../interfaces/SelectProps';

type SelectSlot = 'root' | 'trigger' | 'value' | 'icon' | 'content' | 'item' | 'itemText';

function resolveState(disabled: boolean, invalid: boolean, open: boolean): SelectState {
  if (disabled) return 'disabled';
  if (invalid) return 'invalid';
  if (open) return 'open';
  return 'idle';
}

function sameItemList(a: SelectItemEntry[], b: SelectItemEntry[]): boolean {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    const y = b[i];
    if (x.id !== y.id || x.value !== y.value || x.displayText !== y.displayText || x.disabled !== y.disabled) {
      return false;
    }
  }
  return true;
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
  const listboxId = `${autoId}-listbox`;
  const fieldCtx = useFieldContext();
  const inputId = fieldCtx?.fieldId ?? idProp ?? autoId;
  const effectiveDisabled = disabled ?? fieldCtx?.disabled ?? false;
  const effectiveInvalid = fieldCtx?.invalid ?? false;

  const [selectedValue, setSelectedValue] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const disclosure = useDisclosure(false);
  const open = disclosure.isOpen;

  const [items, setItems] = useState<SelectItemEntry[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  const replaceItems = useCallback((entries: SelectItemEntry[]) => {
    setItems(prev => (sameItemList(prev, entries) ? prev : entries));
  }, []);

  const itemsRef = useRef(items);
  itemsRef.current = items;

  const getDisplayText = useCallback(
    (val: string) => itemsRef.current.find(i => i.value === val)?.displayText,
    [],
  );

  const setOpen = useCallback(
    (next: boolean) => {
      if (next) {
        disclosure.open();
      } else {
        disclosure.close();
        setActiveIndex(-1);
      }
    },
    [disclosure],
  );

  const select = useCallback(
    (val: string) => {
      setSelectedValue(val);
      setOpen(false);
    },
    [setSelectedValue, setOpen],
  );

  const openAtIndex = useCallback(
    (index: number) => {
      setActiveIndex(index);
      disclosure.open();
    },
    [disclosure],
  );

  const state = resolveState(effectiveDisabled, effectiveInvalid, open);
  const slots = useSlotRecipe<SelectSlot>('select', { size, state });

  const ctxValue = useMemo(
    () => ({
      open,
      selectedValue,
      disabled: effectiveDisabled,
      invalid: effectiveInvalid,
      inputId,
      listboxId,
      size,
      state,
      setOpen,
      select,
      items,
      replaceItems,
      getDisplayText,
      activeIndex,
      setActiveIndex,
      openAtIndex,
    }),
    [
      open, selectedValue, effectiveDisabled, effectiveInvalid, inputId, listboxId,
      size, state, setOpen, select, items, replaceItems,
      getDisplayText, activeIndex, openAtIndex,
    ],
  );

  return (
    <SelectContext.Provider value={ctxValue}>
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
      onPress={() => ctx.setOpen(!ctx.open)}
      disabled={ctx.disabled}
      accessibilityRole="combobox"
      accessibilityState={{ expanded: ctx.open, disabled: ctx.disabled }}
      nativeID={ctx.inputId}
      accessibilityLabelledBy={fieldCtx?.labelId}
    >
      <Flex {...slots.trigger}>
        {children}
        <Box {...slots.icon} marginLeft="micro">
          <Icon name="ChevronDown" size="small" decorative />
        </Box>
      </Flex>
    </Pressable>
  );
}

function SelectValue({ placeholder = 'Select...' }: SelectValueProps) {
  const ctx = useSelectContext();
  const slots = useSlotRecipe<SelectSlot>('select', { size: ctx.size, state: ctx.state });
  const display = ctx.selectedValue ? ctx.getDisplayText(ctx.selectedValue) ?? ctx.selectedValue : '';

  return (
    <Box {...slots.value}>
      <Text numberOfLines={1}>{display || placeholder}</Text>
    </Box>
  );
}

function SelectContent({ children }: SelectContentProps) {
  const ctx = useSelectContext();
  const slots = useSlotRecipe<SelectSlot>('select', { size: ctx.size, state: ctx.state });
  const theme = useTheme();

  const entries = useMemo(() => {
    const list: SelectItemEntry[] = [];
    Children.forEach(children, child => {
      if (!isValidElement(child) || child.type !== SelectItem) return;
      const props = child.props as SelectItemProps;
      list.push({
        id: `${ctx.listboxId}-opt-${list.length}`,
        value: props.value,
        displayText: props.displayText ?? extractDisplayText(props.children),
        disabled: !!props.disabled,
      });
    });
    return list;
  }, [children, ctx.listboxId]);

  const { replaceItems } = ctx;
  useEffect(() => {
    replaceItems(entries);
  }, [entries, replaceItems]);

  if (!ctx.open) return null;

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={() => ctx.setOpen(false)}
    >
      <Pressable
        onPress={() => ctx.setOpen(false)}
        accessibilityLabel="close"
        style={{ flex: 1, backgroundColor: theme.colors.background.overlay, justifyContent: 'flex-end' }}
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
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected, disabled }}
    >
      <Flex
        {...slots.item}
        backgroundColor={isSelected ? 'brand.subtle' : 'transparent'}
        opacity={disabled ? 0.5 : 1}
      >
        <Text {...slots.itemText}>{children}</Text>
        {isSelected ? (
          <Box marginLeft="micro">
            <Icon name="Check" size="small" decorative />
          </Box>
        ) : null}
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

/**
 * @platform native
 *
 * `Select` em React Native: trigger é `<Pressable accessibilityRole="combobox">`
 * e o conteúdo é apresentado num `<Modal>` bottom-sheet RN. A semântica de
 * listbox é adaptada — itens usam `accessibilityRole="radio"` com
 * `accessibilityState.selected` (RN não aceita `menuitemradio`; `radio` é o
 * equivalente para "escolha única dentro de um grupo"). Item registry,
 * display-text e chevron `Icon` são compartilhados com web (W1 da RFC-0020).
 * O registry é populado pela enumeração JSX dentro de `Select.Content` —
 * `Select.Item` só renderiza UI; não registra (evita dupla montagem ao
 * abrir/fechar o Modal).
 *
 * @see {@link SelectRootProps}
 */
export const Select = Object.assign(SelectRoot, {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Content: SelectContent,
  Item: SelectItem,
});
