import { useId } from 'react';
import { Pressable } from 'react-native';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useControllableState } from '../../../ecosystem/primitives';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Box, Flex, Text } from '../../core';
import { CheckboxContext, useCheckboxContext } from '../context/checkbox-context';
import type { CheckboxState } from '../context/checkbox-context';
import type { CheckboxRootProps, CheckboxLabelProps, CheckboxDescriptionProps } from '../interfaces';

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
      <Pressable
        onPress={() => !effectiveDisabled && setCheckedState(!checkedState)}
        disabled={effectiveDisabled}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: checkedState, disabled: effectiveDisabled }}
      >
        <Flex {...slots.root}>{children}</Flex>
      </Pressable>
    </CheckboxContext.Provider>
  );
}

function CheckboxIndicator() {
  const ctx = useCheckboxContext();
  const slots = useSlotRecipe<CheckboxSlot>('checkbox', { size: ctx.size, state: ctx.state });

  const isActive = ctx.checked || ctx.indeterminate;

  return (
    <Flex {...slots.indicator}>
      {isActive && (
        <Box
          width="10px"
          height="2px"
          backgroundColor="text.inverse"
          style={{
            transform: ctx.indeterminate ? [] : [{ rotate: '-45deg' }],
          }}
        />
      )}
    </Flex>
  );
}

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
CheckboxIndicator.displayName = 'Checkbox.Indicator';

markFieldAware(CheckboxRoot);
markFieldAware(CheckboxIndicator);

/**
 * @platform native
 *
 * `Checkbox` em React Native: `Pressable` + `Box` interno como indicator
 * customizado (RN não tem `<input type="checkbox">`). `accessibilityRole`
 * `'checkbox'` + `accessibilityState.checked` espelham o estado para leitor
 * de tela. `indeterminate` é refletido como `'mixed'` em
 * `accessibilityState.checked`.
 *
 * @see {@link CheckboxRootProps}
 */
export const Checkbox = Object.assign(CheckboxRoot, {
  Root: CheckboxRoot,
  Indicator: CheckboxIndicator,
  Label: CheckboxLabel,
  Description: CheckboxDescription,
});
