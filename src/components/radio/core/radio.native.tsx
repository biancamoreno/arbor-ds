import { useId } from 'react';
import { Pressable } from 'react-native';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useControllableState } from '../../../ecosystem/primitives';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Box, Flex, Text } from '../../core';
import { RadioContext, useRadioContext } from '../context/radio-context';
import type { RadioState } from '../context/radio-context';
import type {
  RadioRootProps,
  RadioIndicatorProps,
  RadioLabelProps,
  RadioDescriptionProps,
} from '../interfaces/RadioProps';

type RadioSlot = 'root' | 'control' | 'indicator' | 'dot' | 'label' | 'description';

function resolveState(disabled: boolean, invalid: boolean, checked: boolean): RadioState {
  if (disabled) return 'disabled';
  if (invalid) return 'invalid';
  if (checked) return 'checked';
  return 'idle';
}

function RadioRoot({
  value,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled,
  id: idProp,
  name,
  size = 'medium',
  variant = 'outline',
  children,
}: RadioRootProps) {
  const autoId = useId();
  const fieldCtx = useFieldContext();
  const inputId = fieldCtx?.fieldId ?? idProp ?? autoId;
  const effectiveDisabled = disabled ?? fieldCtx?.disabled ?? false;
  const effectiveInvalid = fieldCtx?.invalid ?? false;

  const [checkedState, setCheckedState] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: (val) => onCheckedChange?.(val),
  });

  const state = resolveState(effectiveDisabled, effectiveInvalid, checkedState);
  const slots = useSlotRecipe<RadioSlot>('radio', { size, variant, state });

  return (
    <RadioContext.Provider
      value={{
        checked: checkedState,
        disabled: effectiveDisabled,
        invalid: effectiveInvalid,
        size,
        variant,
        state,
        inputId,
        value,
        name,
        onChange: () => !effectiveDisabled && setCheckedState(true),
      }}
    >
      <Pressable
        onPress={() => !effectiveDisabled && setCheckedState(true)}
        disabled={effectiveDisabled}
        accessibilityRole="radio"
        accessibilityState={{ checked: checkedState, disabled: effectiveDisabled }}
        nativeID={inputId}
        accessibilityLabelledBy={fieldCtx?.labelId}
      >
        <Box {...slots.root}>
          <Flex {...slots.control}>{children}</Flex>
        </Box>
      </Pressable>
    </RadioContext.Provider>
  );
}

function RadioIndicator(_props: RadioIndicatorProps) {
  const ctx = useRadioContext();
  const slots = useSlotRecipe<RadioSlot>('radio', { size: ctx.size, variant: ctx.variant, state: ctx.state });

  return (
    <Flex {...slots.indicator}>
      <Box {...slots.dot} />
    </Flex>
  );
}

function RadioLabel({ children }: RadioLabelProps) {
  const ctx = useRadioContext();
  const slots = useSlotRecipe<RadioSlot>('radio', { size: ctx.size, variant: ctx.variant, state: ctx.state });
  return <Text {...slots.label}>{children}</Text>;
}

function RadioDescription({ children }: RadioDescriptionProps) {
  const ctx = useRadioContext();
  const slots = useSlotRecipe<RadioSlot>('radio', { size: ctx.size, variant: ctx.variant, state: ctx.state });
  return <Text {...slots.description}>{children}</Text>;
}

RadioRoot.displayName = 'Radio.Root';
RadioIndicator.displayName = 'Radio.Indicator';
RadioLabel.displayName = 'Radio.Label';
RadioDescription.displayName = 'Radio.Description';

markFieldAware(RadioRoot);

/**
 * @platform native
 *
 * `Radio` em React Native (stripped-down — sem moldura de RadioCard): `<Pressable>`
 * exterior com `accessibilityRole="radio"` + `accessibilityState.checked/disabled`.
 * Slots `root`, `control`, `indicator` e `dot` consomem `useSlotRecipe`, mantendo
 * paridade visual com web. Limitações: `_focusVisibleWithin` é no-op (RN não tem
 * `:has`); transição CSS no `dot` é no-op (RN ignora `transition`).
 *
 * @see {@link RadioRootProps}
 */
export const Radio = Object.assign(RadioRoot, {
  Root: RadioRoot,
  Indicator: RadioIndicator,
  Label: RadioLabel,
  Description: RadioDescription,
});
