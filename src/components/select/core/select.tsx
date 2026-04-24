/**
 * @platform web-only
 * Select compound component — usa APIs DOM e portais exclusivos da web.
 */
import React, { useId, useRef, useEffect } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useControllableState, useDisclosure } from '../../../ecosystem/primitives';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Box, Flex, Clickable } from '../../core';
import { SelectContext, useSelectContext } from '../context/select-context';
import type {
  SelectRootProps,
  SelectTriggerProps,
  SelectValueProps,
  SelectContentProps,
  SelectItemProps,
  SelectSize,
} from '../interfaces/SelectProps';

const triggerHeight: Record<SelectSize, string> = {
  sm: '32px',
  md: '40px',
  lg: '48px',
};

const triggerFontSize: Record<SelectSize, number> = {
  sm: 12,
  md: 14,
  lg: 16,
};

const triggerPadding: Record<SelectSize, string> = {
  sm: '0 12px',
  md: '0 16px',
  lg: '0 18px',
};

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

  return (
    <SelectContext.Provider
      value={{ isOpen, selectedValue, isDisabled: effectiveDisabled, inputId, size, open, close, select }}
    >
      <Box position="relative" width="100%">
        {children}
      </Box>
    </SelectContext.Provider>
  );
}

function SelectTrigger({ children }: SelectTriggerProps) {
  const theme = useTheme();
  const ctx = useSelectContext();
  const fieldCtx = useFieldContext();
  const ref = useRef<HTMLButtonElement>(null);

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
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
      borderRadius="nano"
      cursor={ctx.isDisabled ? 'not-allowed' : 'pointer'}
      opacity={ctx.isDisabled ? 0.6 : 1}
      outline="none"
      style={{
        height: triggerHeight[ctx.size],
        padding: triggerPadding[ctx.size],
        fontSize: triggerFontSize[ctx.size],
        border: `1px solid ${fieldCtx?.invalid ? theme.colors.feedback.critical.base : theme.colors.border.default}`,
        backgroundColor: theme.colors.surface.default,
        color: theme.colors.text.primary,
        boxSizing: 'border-box',
      }}
    >
      {children}
      <Box as="span" aria-hidden="true" style={{ marginLeft: 8, fontSize: 10 }}>
        {ctx.isOpen ? '▲' : '▼'}
      </Box>
    </Clickable>
  );
}

function SelectValue({ placeholder = 'Select...' }: SelectValueProps) {
  const ctx = useSelectContext();

  return (
    <Box
      as="span"
      flex={1}
      textOverflow="ellipsis"
      whiteSpace="nowrap"
      style={{
        textAlign: 'left',
        overflow: 'hidden',
        color: ctx.selectedValue ? 'inherit' : undefined,
      }}
    >
      {ctx.selectedValue || placeholder}
    </Box>
  );
}

function SelectContent({ children }: SelectContentProps) {
  const theme = useTheme();
  const ctx = useSelectContext();
  const ref = useRef<HTMLUListElement>(null);

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
      position="absolute"
      backgroundColor="surface.default"
      borderRadius="nano"
      style={{
        top: '100%',
        left: 0,
        right: 0,
        zIndex: 50,
        margin: '4px 0 0',
        padding: '4px 0',
        listStyle: 'none',
        border: `1px solid ${theme.colors.border.default}`,
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
  const theme = useTheme();
  const ctx = useSelectContext();
  const isSelected = ctx.selectedValue === value;

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
      alignItems="center"
      cursor={disabled ? 'not-allowed' : 'pointer'}
      opacity={disabled ? 0.5 : 1}
      color="text.primary"
      outline="none"
      userSelect="none"
      style={{
        padding: '8px 16px',
        fontSize: 14,
        backgroundColor: isSelected ? theme.colors.brand.subtle : 'transparent',
      }}
    >
      {children}
    </Flex>
  );
}

markFieldAware(SelectRoot);
markFieldAware(SelectTrigger);

export const Select = Object.assign(SelectRoot, {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Value: SelectValue,
  Content: SelectContent,
  Item: SelectItem,
});
