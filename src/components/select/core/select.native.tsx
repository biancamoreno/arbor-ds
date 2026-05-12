import { useId, useRef, useEffect, useState, useCallback, useMemo, Children, isValidElement, type ReactNode } from 'react';
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
  SelectProps,
  SelectOption,
} from '../interfaces/SelectProps';

type SelectSlot =
  | 'root'
  | 'trigger'
  | 'value'
  | 'icon'
  | 'content'
  | 'item'
  | 'itemLabel'
  | 'itemDescription'
  | 'itemAdornment'
  | 'itemCheck'
  | 'itemText'
  | 'emptyMessage';

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
  size = 'medium',
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

function parseMaxHeight(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
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

  const maxHeight = parseMaxHeight(
    theme.sizes?.selectContent?.maxHeight?.[ctx.size],
    240,
  );

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
          <Box {...slots.content}>
            <ScrollView style={{ maxHeight }}>{children}</ScrollView>
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
        backgroundColor={isSelected ? 'brand.bgElement' : 'transparent'}
        opacity={disabled ? 0.5 : 1}
      >
        {typeof children === 'string' || typeof children === 'number' ? (
          <Text {...slots.itemText}>{children}</Text>
        ) : (
          children
        )}
        {isSelected ? (
          <Box {...slots.itemCheck} marginLeft="auto">
            <Icon name="Check" size="small" decorative />
          </Box>
        ) : null}
      </Flex>
    </Pressable>
  );
}

function RichOptionLayout({ option }: { option: SelectOption }) {
  const ctx = useSelectContext();
  const slots = useSlotRecipe<SelectSlot>('select', { size: ctx.size, state: ctx.state });
  const hasDescription = option.description !== undefined;

  return (
    <>
      {option.startSlot !== undefined && (
        <Box {...slots.itemAdornment}>{option.startSlot}</Box>
      )}
      {hasDescription ? (
        <Box flex={1}>
          {typeof option.label === 'string' || typeof option.label === 'number' ? (
            <Text {...slots.itemLabel}>{option.label}</Text>
          ) : (
            <Box {...slots.itemLabel}>{option.label}</Box>
          )}
          {typeof option.description === 'string' || typeof option.description === 'number' ? (
            <Text {...slots.itemDescription}>{option.description}</Text>
          ) : (
            <Box {...slots.itemDescription}>{option.description}</Box>
          )}
        </Box>
      ) : typeof option.label === 'string' || typeof option.label === 'number' ? (
        <Text {...slots.itemLabel}>{option.label}</Text>
      ) : (
        <Box {...slots.itemLabel}>{option.label}</Box>
      )}
    </>
  );
}

function EmptyMessageSlot({ children }: { children: ReactNode }) {
  const ctx = useSelectContext();
  const slots = useSlotRecipe<SelectSlot>('select', { size: ctx.size, state: ctx.state });
  return (
    <Box {...slots.emptyMessage}>
      {typeof children === 'string' || typeof children === 'number' ? (
        <Text>{children}</Text>
      ) : (
        children
      )}
    </Box>
  );
}

function warnRichOptions(options: SelectOption[]): void {
  if (process.env.NODE_ENV === 'production') return;
  for (const opt of options) {
    if (typeof opt.label === 'string' || opt.displayText !== undefined) continue;
    const extracted = extractDisplayText(opt.label);
    if (!extracted) {
      console.warn(
        `[Arbor-DS:Select] option value="${opt.value}" has a ReactNode \`label\` ` +
          'but no `displayText`, and automatic extraction produced an empty string. ' +
          'Type-ahead and the trigger value display will fall back to the option `value`. ' +
          'Provide `displayText` explicitly when `label` is not plain text.',
      );
    }
  }
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
 * Select em React Native: trigger é `<Pressable accessibilityRole="combobox">`
 * e o conteúdo é apresentado num `<Modal>` bottom-sheet. Itens usam
 * `accessibilityRole="radio"` com `accessibilityState.selected` (RN não aceita
 * `menuitemradio`; `radio` é o equivalente para "escolha única dentro de um
 * grupo"). API plana paritária com web (RFC-0043, PCV-22): `<Select options=...
 * placeholder=... emptyMessage=... />` é o caminho recomendado; compound
 * (`Select.Root`/.../`.Item`) cobre layouts não-triviais.
 *
 * @see {@link SelectProps}
 */
function SelectFlat({
  options,
  placeholder,
  emptyMessage,
  children,
  ...rootProps
}: SelectProps) {
  const usesFlatApi = options !== undefined || children === undefined;
  if (!usesFlatApi) {
    return <SelectRoot {...rootProps}>{children}</SelectRoot>;
  }

  if (options) warnRichOptions(options);

  const resolvedPlaceholder = placeholder ?? 'Select...';
  const showEmpty =
    options !== undefined && options.length === 0 && emptyMessage !== undefined;

  return (
    <SelectRoot {...rootProps}>
      <SelectTrigger>
        <SelectValue placeholder={resolvedPlaceholder} />
      </SelectTrigger>
      <SelectContent>
        {showEmpty ? (
          <EmptyMessageSlot>{emptyMessage}</EmptyMessageSlot>
        ) : (
          options?.map(opt => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              displayText={
                opt.displayText ??
                (typeof opt.label === 'string' ? opt.label : undefined)
              }
            >
              <RichOptionLayout option={opt} />
            </SelectItem>
          ))
        )}
      </SelectContent>
    </SelectRoot>
  );
}

SelectFlat.displayName = 'Select';
markFieldAware(SelectFlat);

export const Select = Object.assign(SelectFlat, {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Content: SelectContent,
  Item: SelectItem,
});
