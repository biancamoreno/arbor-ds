import React, { useEffect, useId, useRef } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useControllableState } from '../../../ecosystem/primitives';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Box, Flex, Text } from '../../core';
import { CheckboxContext, useCheckboxContext } from '../context/checkbox-context';
import type { CheckboxState } from '../context/checkbox-context';
import type {
  CheckboxRootProps,
  CheckboxIndicatorProps,
  CheckboxLabelProps,
  CheckboxDescriptionProps,
} from '../interfaces';

type CheckboxSlot = 'root' | 'indicator' | 'label' | 'description';

function resolveState(disabled: boolean, invalid: boolean, checked: boolean): CheckboxState {
  if (disabled) return 'disabled';
  if (invalid) return 'invalid';
  if (checked) return 'checked';
  return 'idle';
}

function CheckboxRoot({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  indeterminate = false,
  size = 'md',
  id: idProp,
  name,
  value,
  children,
}: CheckboxRootProps) {
  const autoId = useId();
  const fieldCtx = useFieldContext();
  const inputId = fieldCtx?.fieldId ?? idProp ?? autoId;
  const effectiveDisabled = disabled ?? fieldCtx?.disabled ?? false;
  const effectiveInvalid = fieldCtx?.invalid ?? false;

  const [checkedState, setCheckedState] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  const state = resolveState(effectiveDisabled, effectiveInvalid, checkedState || indeterminate);
  const slots = useSlotRecipe<CheckboxSlot>('checkbox', { size, state });

  return (
    <CheckboxContext.Provider
      value={{
        checked: checkedState,
        indeterminate,
        disabled: effectiveDisabled,
        invalid: effectiveInvalid,
        size,
        state,
        inputId,
        name,
        value,
        onChange: setCheckedState,
      }}
    >
      <Flex
        as="label"
        {...slots.root}
        cursor={effectiveDisabled ? 'not-allowed' : 'pointer'}
        htmlFor={inputId}
      >
        {children}
      </Flex>
    </CheckboxContext.Provider>
  );
}

const CheckboxIndicator = React.forwardRef<HTMLInputElement, CheckboxIndicatorProps>(({ style, ...props }, ref) => {
  const theme = useTheme();
  const ctx = useCheckboxContext();
  const fieldCtx = useFieldContext();
  const internalRef = useRef<HTMLInputElement | null>(null);
  const slots = useSlotRecipe<CheckboxSlot>('checkbox', { size: ctx.size, state: ctx.state });

  useEffect(() => {
    if (internalRef.current) {
      internalRef.current.indeterminate = ctx.indeterminate && !ctx.checked;
    }
  }, [ctx.checked, ctx.indeterminate]);

  return (
    <Box
      as="input"
      {...props}
      {...slots.indicator}
      innerRef={(node: HTMLInputElement | null) => {
        internalRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
      }}
      id={ctx.inputId}
      type="checkbox"
      name={ctx.name}
      value={ctx.value}
      checked={ctx.checked}
      disabled={ctx.disabled}
      aria-describedby={fieldCtx?.descriptionRegistered ? fieldCtx.descriptionId : undefined}
      aria-required={fieldCtx?.required || undefined}
      aria-invalid={fieldCtx?.invalid || undefined}
      aria-errormessage={fieldCtx?.invalid && fieldCtx?.errorRegistered ? fieldCtx.errorId : undefined}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => { if (!ctx.disabled) ctx.onChange(e.target.checked); }}
      cursor={ctx.disabled ? 'not-allowed' : 'pointer'}
      style={{ accentColor: theme.colors.interactive.default, ...style }}
    />
  );
});

CheckboxIndicator.displayName = 'Checkbox.Indicator';

function CheckboxLabel({ children }: CheckboxLabelProps) {
  const ctx = useCheckboxContext();
  const slots = useSlotRecipe<CheckboxSlot>('checkbox', { size: ctx.size, state: ctx.state });
  return <Text as="span" {...slots.label}>{children}</Text>;
}

CheckboxLabel.displayName = 'Checkbox.Label';

function CheckboxDescription({ children }: CheckboxDescriptionProps) {
  const ctx = useCheckboxContext();
  const slots = useSlotRecipe<CheckboxSlot>('checkbox', { size: ctx.size, state: ctx.state });
  return <Text as="span" {...slots.description}>{children}</Text>;
}

CheckboxDescription.displayName = 'Checkbox.Description';

CheckboxRoot.displayName = 'Checkbox';

markFieldAware(CheckboxRoot);
markFieldAware(CheckboxIndicator);

/**
 * @platform shared
 *
 * Compound de checkbox controlado/uncontrolled. `Root` distribui o estado
 * (`checked`/`indeterminate`/`disabled`/`invalid`) via `CheckboxContext` para
 * `Indicator` (input nativo estilizado), `Label` e `Description`. Field-aware:
 * herda `disabled` e `invalid` do `<Field>` quando aninhado. Use
 * `onCheckedChange(checked)` para receber a mudança já desencapsulada do
 * evento; `indeterminate` representa estado terciário (mais usado em
 * tree-checkboxes).
 *
 * @example
 * <Checkbox checked={agree} onCheckedChange={setAgree}>
 *   <Checkbox.Indicator />
 *   <Checkbox.Label>Aceito os termos</Checkbox.Label>
 * </Checkbox>
 *
 * @see {@link CheckboxRootProps}
 */
export const Checkbox = Object.assign(CheckboxRoot, {
  Root: CheckboxRoot,
  Indicator: CheckboxIndicator,
  Label: CheckboxLabel,
  Description: CheckboxDescription,
});
