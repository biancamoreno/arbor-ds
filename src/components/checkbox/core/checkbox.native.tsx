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

function resolveState(isDisabled: boolean, isInvalid: boolean, isChecked: boolean): CheckboxState {
  if (isDisabled) return 'disabled';
  if (isInvalid) return 'invalid';
  if (isChecked) return 'checked';
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

  const [isChecked, setIsChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  });

  const state = resolveState(effectiveDisabled, effectiveInvalid, isChecked || indeterminate);
  const slots = useSlotRecipe<CheckboxSlot>('checkbox', { size, state });

  return (
    <CheckboxContext.Provider
      value={{
        isChecked,
        isIndeterminate: indeterminate,
        isDisabled: effectiveDisabled,
        isInvalid: effectiveInvalid,
        size,
        state,
        inputId,
        name,
        value,
        onChange: setIsChecked,
      }}
    >
      <Pressable
        onPress={() => !effectiveDisabled && setIsChecked(!isChecked)}
        disabled={effectiveDisabled}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isChecked, disabled: effectiveDisabled }}
      >
        <Flex {...slots.root}>{children}</Flex>
      </Pressable>
    </CheckboxContext.Provider>
  );
}

function CheckboxIndicator() {
  const ctx = useCheckboxContext();
  const slots = useSlotRecipe<CheckboxSlot>('checkbox', { size: ctx.size, state: ctx.state });

  const isActive = ctx.isChecked || ctx.isIndeterminate;

  return (
    <Flex {...slots.indicator}>
      {isActive && (
        <Box
          width="10px"
          height="2px"
          backgroundColor="text.inverse"
          style={{
            transform: ctx.isIndeterminate ? [] : [{ rotate: '-45deg' }],
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
