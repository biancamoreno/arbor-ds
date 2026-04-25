/**
 * @platform web-only
 * Select compound component — usa APIs DOM e portais exclusivos da web.
 */
import React, { useId, useRef, useEffect } from 'react';
import { useControllableState, useDisclosure } from '../../../ecosystem/primitives';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Box, Flex, Clickable } from '../../core';
import { SelectContext, useSelectContext } from '../context/select-context';
import type { SelectState } from '../context/select-context';
import type {
  SelectRootProps,
  SelectTriggerProps,
  SelectValueProps,
  SelectContentProps,
  SelectItemProps,
} from '../interfaces/SelectProps';

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

  const select = (val: string) => {
    setSelectedValue(val);
    close();
  };

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
      <Box {...slots.root} position="relative">
        {children}
      </Box>
    </SelectContext.Provider>
  );
}

function SelectTrigger({ children }: SelectTriggerProps) {
  const ctx = useSelectContext();
  const fieldCtx = useFieldContext();
  const ref = useRef<HTMLButtonElement>(null);
  const slots = useSlotRecipe<SelectSlot>('select', { size: ctx.size, state: ctx.state });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (ctx.isOpen) { ctx.close(); } else { ctx.open(); }
    }
    if (e.key === 'Escape') ctx.close();
  };

  return (
    <Clickable
      as="button"
      innerRef={ref}
      type="button"
      id={ctx.inputId}
      role="combobox"
      aria-expanded={ctx.isOpen}
      aria-haspopup="listbox"
      aria-describedby={fieldCtx?.descriptionRegistered ? fieldCtx.descriptionId : undefined}
      aria-required={fieldCtx?.required || undefined}
      aria-invalid={fieldCtx?.invalid || undefined}
      aria-errormessage={fieldCtx?.invalid && fieldCtx?.errorRegistered ? fieldCtx.errorId : undefined}
      disabled={ctx.isDisabled}
      onClick={() => (ctx.isOpen ? ctx.close() : ctx.open())}
      onKeyDown={handleKeyDown}
      {...slots.trigger}
      cursor={ctx.isDisabled ? 'not-allowed' : 'pointer'}
      outline="none"
      style={{ boxSizing: 'border-box' }}
    >
      {children}
      <Box as="span" aria-hidden="true" {...slots.icon} marginLeft="micro" fontSize="xsmall">
        {ctx.isOpen ? '▲' : '▼'}
      </Box>
    </Clickable>
  );
}

function SelectValue({ placeholder = 'Select...' }: SelectValueProps) {
  const ctx = useSelectContext();
  const slots = useSlotRecipe<SelectSlot>('select', { size: ctx.size, state: ctx.state });

  return (
    <Box
      as="span"
      {...slots.value}
      textOverflow="ellipsis"
      whiteSpace="nowrap"
      style={{ textAlign: 'left', overflow: 'hidden' }}
    >
      {ctx.selectedValue || placeholder}
    </Box>
  );
}

function SelectContent({ children }: SelectContentProps) {
  const ctx = useSelectContext();
  const ref = useRef<HTMLUListElement>(null);
  const slots = useSlotRecipe<SelectSlot>('select', { size: ctx.size, state: ctx.state });

  useEffect(() => {
    if (!ctx.isOpen) return;

    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        ctx.close();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') ctx.close();
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [ctx]);

  if (!ctx.isOpen) return null;

  return (
    <Box
      as="ul"
      innerRef={ref}
      role="listbox"
      {...slots.content}
      position="absolute"
      style={{
        top: '100%',
        left: 0,
        right: 0,
        zIndex: 50,
        margin: '4px 0 0',
        padding: '4px 0',
        listStyle: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        maxHeight: '200px',
        overflowY: 'auto',
      }}
    >
      {children}
    </Box>
  );
}

function SelectItem({ value, disabled = false, children }: SelectItemProps) {
  const ctx = useSelectContext();
  const isSelected = ctx.selectedValue === value;
  const slots = useSlotRecipe<SelectSlot>('select', { size: ctx.size, state: ctx.state });

  return (
    <Flex
      as="li"
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled || undefined}
      onClick={() => !disabled && ctx.select(value)}
      onKeyDown={(e: React.KeyboardEvent) => {
        if ((e.key === 'Enter' || e.key === ' ') && !disabled) ctx.select(value);
      }}
      tabIndex={disabled ? -1 : 0}
      {...slots.item}
      cursor={disabled ? 'not-allowed' : 'pointer'}
      opacity={disabled ? 0.5 : 1}
      backgroundColor={isSelected ? 'brand.subtle' : 'transparent'}
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
