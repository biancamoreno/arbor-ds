/**
 * @platform native-ready
 * Select compound: web usa DOM (`<button role=combobox>` + listbox `<ul>`) com modelo
 * de foco activedescendant — o foco real fica no trigger; o item ativo é apontado
 * via `aria-activedescendant` e segue setas/Home/End/PageUp/PageDown/type-ahead.
 * Native vive em `select.native.tsx` via `<Modal>` bottom-sheet.
 */
import React, { useId, useRef, useEffect, useLayoutEffect, useState, useCallback, useMemo, Children, isValidElement } from 'react';
import { useControllableState, useDisclosure, Portal, DismissableLayer } from '../../../ecosystem/primitives';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { transition } from '../../../ecosystem/utils/functions';
import { Box, Flex, Clickable, Icon } from '../../core';
import { SelectContext, useSelectContext } from '../context/select-context';
import type { SelectItemEntry, SelectState } from '../context/select-context';
import { extractDisplayText, normalizeForTypeahead } from '../utils/extract-display-text';
import type {
  SelectRootProps,
  SelectTriggerProps,
  SelectValueProps,
  SelectContentProps,
  SelectItemProps,
} from '../interfaces/SelectProps';

type SelectSlot = 'root' | 'trigger' | 'value' | 'icon' | 'content' | 'item' | 'itemText';

const TYPEAHEAD_TIMEOUT_MS = 500;
const PAGE_STEP = 10;

function resolveState(isDisabled: boolean, isInvalid: boolean, isOpen: boolean): SelectState {
  if (isDisabled) return 'disabled';
  if (isInvalid) return 'invalid';
  if (isOpen) return 'open';
  return 'idle';
}

const TriggerRefContext = React.createContext<React.MutableRefObject<HTMLButtonElement | null> | null>(null);

function clamp(value: number, min: number, max: number) {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function findEnabledIndex(items: SelectItemEntry[], from: number, dir: 1 | -1): number {
  if (items.length === 0) return -1;
  const len = items.length;
  let i = from;
  for (let step = 0; step < len; step++) {
    if (i >= 0 && i < len && !items[i].disabled) return i;
    i += dir;
    if (i < 0 || i >= len) return -1;
  }
  return -1;
}

function findFirstEnabled(items: SelectItemEntry[]): number {
  return findEnabledIndex(items, 0, 1);
}

function findLastEnabled(items: SelectItemEntry[]): number {
  return findEnabledIndex(items, items.length - 1, -1);
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

  const { isOpen, open, close } = useDisclosure(false);

  const [items, setItems] = useState<SelectItemEntry[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const replaceItems = useCallback((entries: SelectItemEntry[]) => {
    setItems(prev => (sameItemList(prev, entries) ? prev : entries));
  }, []);

  const itemsRef = useRef(items);
  itemsRef.current = items;

  const getDisplayText = useCallback(
    (val: string) => itemsRef.current.find(i => i.value === val)?.displayText,
    [],
  );

  const focusTrigger = useCallback(() => {
    triggerRef.current?.focus();
  }, []);

  const closeAndFocus = useCallback(() => {
    close();
    setActiveIndex(-1);
    focusTrigger();
  }, [close, focusTrigger]);

  const select = useCallback(
    (val: string) => {
      setSelectedValue(val);
      close();
      setActiveIndex(-1);
      focusTrigger();
    },
    [setSelectedValue, close, focusTrigger],
  );

  const openAtIndex = useCallback(
    (index: number) => {
      setActiveIndex(index);
      open();
    },
    [open],
  );

  const state = resolveState(effectiveDisabled, effectiveInvalid, isOpen);
  const slots = useSlotRecipe<SelectSlot>('select', { size, state });

  const ctxValue = useMemo(
    () => ({
      isOpen,
      selectedValue,
      isDisabled: effectiveDisabled,
      isInvalid: effectiveInvalid,
      inputId,
      listboxId,
      size,
      state,
      open,
      close: closeAndFocus,
      select,
      items,
      replaceItems,
      getDisplayText,
      activeIndex,
      setActiveIndex,
      openAtIndex,
    }),
    [
      isOpen, selectedValue, effectiveDisabled, effectiveInvalid, inputId, listboxId,
      size, state, open, closeAndFocus, select, items, replaceItems,
      getDisplayText, activeIndex, openAtIndex,
    ],
  );

  return (
    <SelectContext.Provider value={ctxValue}>
      <TriggerRefContext.Provider value={triggerRef}>
        <Box {...slots.root} position="relative">
          {children}
        </Box>
      </TriggerRefContext.Provider>
    </SelectContext.Provider>
  );
}

function SelectTrigger({ children }: SelectTriggerProps) {
  const ctx = useSelectContext();
  const fieldCtx = useFieldContext();
  const triggerRefCtx = React.useContext(TriggerRefContext);
  const slots = useSlotRecipe<SelectSlot>('select', { size: ctx.size, state: ctx.state });

  const typeaheadBuffer = useRef('');
  const typeaheadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const findByTypeahead = useCallback(
    (query: string): number => {
      const norm = normalizeForTypeahead(query);
      if (!norm) return -1;
      return ctx.items.findIndex(
        i => !i.disabled && normalizeForTypeahead(i.displayText).startsWith(norm),
      );
    },
    [ctx.items],
  );

  const handleTypeahead = useCallback(
    (key: string) => {
      typeaheadBuffer.current += key.toLowerCase();
      if (typeaheadTimer.current) clearTimeout(typeaheadTimer.current);
      typeaheadTimer.current = setTimeout(() => {
        typeaheadBuffer.current = '';
      }, TYPEAHEAD_TIMEOUT_MS);

      const idx = findByTypeahead(typeaheadBuffer.current);
      if (idx >= 0) ctx.setActiveIndex(idx);
    },
    [ctx, findByTypeahead],
  );

  useEffect(() => () => {
    if (typeaheadTimer.current) clearTimeout(typeaheadTimer.current);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (ctx.isDisabled) return;
    const { items, isOpen, activeIndex, selectedValue } = ctx;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const selectedIdx = items.findIndex(i => i.value === selectedValue && !i.disabled);
        const target = selectedIdx >= 0 ? selectedIdx : findFirstEnabled(items);
        if (target >= 0) ctx.openAtIndex(target);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const selectedIdx = items.findIndex(i => i.value === selectedValue && !i.disabled);
        const target = selectedIdx >= 0 ? selectedIdx : findFirstEnabled(items);
        if (target >= 0) ctx.openAtIndex(target);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const target = findLastEnabled(items);
        if (target >= 0) ctx.openAtIndex(target);
        return;
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      ctx.close();
      return;
    }

    if (e.key === 'Tab') {
      ctx.close();
      return;
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (activeIndex >= 0 && !items[activeIndex]?.disabled) {
        ctx.select(items[activeIndex].value);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = findEnabledIndex(items, activeIndex + 1, 1);
      if (next >= 0) ctx.setActiveIndex(next);
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = findEnabledIndex(items, activeIndex - 1, -1);
      if (prev >= 0) ctx.setActiveIndex(prev);
      return;
    }

    if (e.key === 'Home') {
      e.preventDefault();
      const target = findFirstEnabled(items);
      if (target >= 0) ctx.setActiveIndex(target);
      return;
    }

    if (e.key === 'End') {
      e.preventDefault();
      const target = findLastEnabled(items);
      if (target >= 0) ctx.setActiveIndex(target);
      return;
    }

    if (e.key === 'PageDown') {
      e.preventDefault();
      const candidate = clamp(activeIndex + PAGE_STEP, 0, items.length - 1);
      const target = findEnabledIndex(items, candidate, -1);
      if (target >= 0) ctx.setActiveIndex(target);
      return;
    }

    if (e.key === 'PageUp') {
      e.preventDefault();
      const candidate = clamp(activeIndex - PAGE_STEP, 0, items.length - 1);
      const target = findEnabledIndex(items, candidate, 1);
      if (target >= 0) ctx.setActiveIndex(target);
      return;
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      handleTypeahead(e.key);
    }
  };

  const activeId =
    ctx.isOpen && ctx.activeIndex >= 0 && ctx.activeIndex < ctx.items.length
      ? ctx.items[ctx.activeIndex].id
      : undefined;

  return (
    <Clickable
      as="button"
      innerRef={triggerRefCtx as React.MutableRefObject<HTMLButtonElement | null>}
      type="button"
      id={ctx.inputId}
      role="combobox"
      aria-expanded={ctx.isOpen}
      aria-haspopup="listbox"
      aria-controls={ctx.listboxId}
      aria-activedescendant={activeId}
      aria-describedby={fieldCtx?.descriptionRegistered ? fieldCtx.descriptionId : undefined}
      aria-required={fieldCtx?.required || undefined}
      aria-invalid={fieldCtx?.invalid || undefined}
      aria-errormessage={fieldCtx?.invalid && fieldCtx?.errorRegistered ? fieldCtx.errorId : undefined}
      disabled={ctx.isDisabled}
      onClick={() => {
        if (ctx.isOpen) {
          ctx.close();
        } else {
          const selectedIdx = ctx.items.findIndex(i => i.value === ctx.selectedValue && !i.disabled);
          const target = selectedIdx >= 0 ? selectedIdx : findFirstEnabled(ctx.items);
          ctx.openAtIndex(target);
        }
      }}
      onKeyDown={handleKeyDown}
      {...slots.trigger}
      cursor={ctx.isDisabled ? 'not-allowed' : 'pointer'}
      style={{ boxSizing: 'border-box' }}
    >
      {children}
      <Box
        as="span"
        aria-hidden="true"
        {...slots.icon}
        marginLeft="micro"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          transition: transition(['transform'], 'fast'),
          transform: ctx.isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}
      >
        <Icon name="ChevronDown" size="sm" decorative />
      </Box>
    </Clickable>
  );
}

function SelectValue({ placeholder = 'Select...' }: SelectValueProps) {
  const ctx = useSelectContext();
  const slots = useSlotRecipe<SelectSlot>('select', { size: ctx.size, state: ctx.state });
  const display = ctx.selectedValue ? ctx.getDisplayText(ctx.selectedValue) ?? ctx.selectedValue : '';

  return (
    <Box
      as="span"
      {...slots.value}
      textOverflow="ellipsis"
      whiteSpace="nowrap"
      style={{ textAlign: 'left', overflow: 'hidden' }}
    >
      {display || placeholder}
    </Box>
  );
}

type ListboxPosition = { top: number; left: number; width: number };

function SelectContent({ children }: SelectContentProps) {
  const ctx = useSelectContext();
  const ref = useRef<HTMLUListElement>(null);
  const slots = useSlotRecipe<SelectSlot>('select', { size: ctx.size, state: ctx.state });
  const triggerRefCtx = React.useContext(TriggerRefContext);
  const [position, setPosition] = useState<ListboxPosition | null>(null);

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

  useLayoutEffect(() => {
    if (!ctx.isOpen) {
      setPosition(null);
      return;
    }
    const update = () => {
      const trigger = triggerRefCtx?.current;
      if (!trigger || typeof trigger.getBoundingClientRect !== 'function') return;
      const rect = trigger.getBoundingClientRect();
      setPosition({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [ctx.isOpen, triggerRefCtx]);

  useEffect(() => {
    if (!ctx.isOpen) return;
    if (ctx.activeIndex < 0 || ctx.activeIndex >= ctx.items.length) return;
    const id = ctx.items[ctx.activeIndex].id;
    const el = typeof document !== 'undefined' ? document.getElementById(id) : null;
    if (el && typeof el.scrollIntoView === 'function') {
      el.scrollIntoView({ block: 'nearest' });
    }
  }, [ctx.activeIndex, ctx.isOpen, ctx.items]);

  if (!ctx.isOpen || !position) return null;

  return (
    <Portal>
      <DismissableLayer
        onDismiss={ctx.close}
        excludeRef={triggerRefCtx ?? undefined}
        disableEscapeKey
      >
        <Box
          as="ul"
          innerRef={ref}
          role="listbox"
          id={ctx.listboxId}
          {...slots.content}
          boxShadow="lg"
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            width: position.width,
            zIndex: 50,
            margin: 0,
            padding: '4px 0',
            listStyle: 'none',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
        >
          {children}
        </Box>
      </DismissableLayer>
    </Portal>
  );
}

function SelectItem({ value, disabled = false, children }: SelectItemProps) {
  const ctx = useSelectContext();
  const isSelected = ctx.selectedValue === value;
  const slots = useSlotRecipe<SelectSlot>('select', { size: ctx.size, state: ctx.state });

  const ownIndex = ctx.items.findIndex(i => i.value === value);
  const id = ownIndex >= 0 ? ctx.items[ownIndex].id : undefined;
  const isActive = ownIndex >= 0 && ownIndex === ctx.activeIndex;

  return (
    <Flex
      as="li"
      id={id}
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      onClick={() => !disabled && ctx.select(value)}
      onMouseEnter={() => {
        if (!disabled && ownIndex >= 0) ctx.setActiveIndex(ownIndex);
      }}
      {...slots.item}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      opacity={disabled ? 0.5 : 1}
      backgroundColor={
        isSelected ? 'brand.subtle' : isActive ? 'background.interactive' : 'transparent'
      }
      outline="none"
      userSelect="none"
    >
      {children}
    </Flex>
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
