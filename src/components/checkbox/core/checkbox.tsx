import { useEffect, useId, useRef } from 'react';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useControllableState } from '../../../ecosystem/primitives';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Box, Flex, Icon, Text } from '../../core';
import { CheckboxContext, useCheckboxContext } from '../context/checkbox-context';
import type { CheckboxSize, CheckboxState } from '../context/checkbox-context';
import type {
  CheckboxRootProps,
  CheckboxIndicatorProps,
  CheckboxLabelProps,
  CheckboxDescriptionProps,
} from '../interfaces';

type CheckboxSlot = 'root' | 'indicator' | 'label' | 'description';

const MARK_SIZE: Record<CheckboxSize, 'xsmall' | 'small' | 'medium'> = {
  small: 'xsmall',
  medium: 'small',
  large: 'small',
};

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
  size = 'medium',
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
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [checkedState, setCheckedState] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  const state = resolveState(effectiveDisabled, effectiveInvalid, checkedState || indeterminate);
  const slots = useSlotRecipe<CheckboxSlot>('checkbox', { size, state });

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate && !checkedState;
    }
  }, [indeterminate, checkedState]);

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
      <Box
        as="label"
        {...slots.root}
        htmlFor={inputId}
        cursor={effectiveDisabled ? 'not-allowed' : 'pointer'}
      >
        <Box
          as="input"
          innerRef={inputRef}
          id={inputId}
          type="checkbox"
          name={name}
          value={value}
          checked={checkedState}
          disabled={effectiveDisabled}
          aria-describedby={fieldCtx?.descriptionRegistered ? fieldCtx.descriptionId : undefined}
          aria-required={fieldCtx?.required || undefined}
          aria-invalid={fieldCtx?.invalid || undefined}
          aria-errormessage={fieldCtx?.invalid && fieldCtx?.errorRegistered ? fieldCtx.errorId : undefined}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => { if (!effectiveDisabled) setCheckedState(e.target.checked); }}
          position="absolute"
          opacity={0}
          width="1px"
          height="1px"
          margin="-1px"
          padding={0}
          overflow="hidden"
          pointerEvents="none"
        />
        {children}
      </Box>
    </CheckboxContext.Provider>
  );
}

function CheckboxIndicator(_props: CheckboxIndicatorProps) {
  const ctx = useCheckboxContext();
  const slots = useSlotRecipe<CheckboxSlot>('checkbox', { size: ctx.size, state: ctx.state });
  const showCheck = ctx.checked && !ctx.indeterminate;
  const showDash = ctx.indeterminate;

  return (
    <Flex as="span" aria-hidden="true" {...slots.indicator}>
      {showCheck && <Icon name="Check" size={MARK_SIZE[ctx.size]} decorative />}
      {showDash && <Icon name="Minus" size={MARK_SIZE[ctx.size]} decorative />}
    </Flex>
  );
}

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

/**
 * @platform shared
 *
 * Compound de checkbox controlado/uncontrolled. `Root` renderiza um
 * `<input type="checkbox">` visualmente escondido (mantém form submission,
 * navegação por teclado e role nativa) e distribui o estado via
 * `CheckboxContext` para `Indicator` (caixa visual + glifo Lucide
 * `Check`/`Minus`), `Label` e `Description`. Field-aware: herda
 * `disabled`/`invalid` do `<Field>` quando aninhado.
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
