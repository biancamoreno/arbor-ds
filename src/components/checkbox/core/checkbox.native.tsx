import { useId } from 'react';
import { Pressable } from 'react-native';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useControllableState } from '../../../ecosystem/primitives';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Flex, Icon, Text } from '../../core';
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
  variant = 'outline',
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
  const slots = useSlotRecipe<CheckboxSlot>('checkbox', { size, variant, state });

  const accessibilityChecked = indeterminate ? 'mixed' : checkedState;

  return (
    <CheckboxContext.Provider
      value={{
        checked: checkedState,
        indeterminate,
        disabled: effectiveDisabled,
        invalid: effectiveInvalid,
        size,
        variant,
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
        accessibilityState={{ checked: accessibilityChecked, disabled: effectiveDisabled }}
        nativeID={inputId}
        accessibilityLabelledBy={fieldCtx?.labelId}
      >
        <Flex {...slots.root}>{children}</Flex>
      </Pressable>
    </CheckboxContext.Provider>
  );
}

function CheckboxIndicator(_props: CheckboxIndicatorProps) {
  const ctx = useCheckboxContext();
  const slots = useSlotRecipe<CheckboxSlot>('checkbox', { size: ctx.size, variant: ctx.variant, state: ctx.state });
  const showCheck = ctx.checked && !ctx.indeterminate;
  const showDash = ctx.indeterminate;

  return (
    <Flex {...slots.indicator}>
      {showCheck && <Icon name="Check" size={MARK_SIZE[ctx.size]} decorative />}
      {showDash && <Icon name="Minus" size={MARK_SIZE[ctx.size]} decorative />}
    </Flex>
  );
}

CheckboxIndicator.displayName = 'Checkbox.Indicator';

function CheckboxLabel({ children }: CheckboxLabelProps) {
  const ctx = useCheckboxContext();
  const slots = useSlotRecipe<CheckboxSlot>('checkbox', { size: ctx.size, variant: ctx.variant, state: ctx.state });
  return <Text {...slots.label}>{children}</Text>;
}

CheckboxLabel.displayName = 'Checkbox.Label';

function CheckboxDescription({ children }: CheckboxDescriptionProps) {
  const ctx = useCheckboxContext();
  const slots = useSlotRecipe<CheckboxSlot>('checkbox', { size: ctx.size, variant: ctx.variant, state: ctx.state });
  return <Text {...slots.description}>{children}</Text>;
}

CheckboxDescription.displayName = 'Checkbox.Description';

CheckboxRoot.displayName = 'Checkbox';

markFieldAware(CheckboxRoot);

/**
 * @platform native
 *
 * `Checkbox` em React Native: `Pressable` no Root reflete o estado para
 * leitor de tela (`accessibilityRole="checkbox"` + `accessibilityState.checked`
 * com `'mixed'` para indeterminate). `Indicator` consome o slot recipe
 * `checkbox.indicator` e exibe glifo Lucide (`Check` ou `Minus`) com paridade
 * total ao web.
 *
 * @see {@link CheckboxRootProps}
 */
export const Checkbox = Object.assign(CheckboxRoot, {
  Root: CheckboxRoot,
  Indicator: CheckboxIndicator,
  Label: CheckboxLabel,
  Description: CheckboxDescription,
});
