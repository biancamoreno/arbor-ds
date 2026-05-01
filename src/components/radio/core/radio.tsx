import { useId } from 'react';
import { useControllableState } from '../../../ecosystem/primitives';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useTransition } from '../../../ecosystem/utils/functions/use-transition';
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

type RadioSlot = 'root' | 'control' | 'indicator' | 'label' | 'description';

function resolveState(isDisabled: boolean, isInvalid: boolean, isChecked: boolean): RadioState {
  if (isDisabled) return 'disabled';
  if (isInvalid) return 'invalid';
  if (isChecked) return 'checked';
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
  size = 'md',
  children,
}: RadioRootProps) {
  const autoId = useId();
  const fieldCtx = useFieldContext();
  const inputId = fieldCtx?.fieldId ?? idProp ?? autoId;
  const effectiveDisabled = disabled ?? fieldCtx?.disabled ?? false;
  const effectiveInvalid = fieldCtx?.invalid ?? false;

  const [isChecked, setIsChecked] = useControllableState({
    value: checked,
    defaultValue: defaultChecked,
    onChange: (val) => onCheckedChange?.(val),
  });

  const state = resolveState(effectiveDisabled, effectiveInvalid, isChecked);
  const slots = useSlotRecipe<RadioSlot>('radio', { size, state });

  return (
    <RadioContext.Provider
      value={{
        isChecked,
        isDisabled: effectiveDisabled,
        isInvalid: effectiveInvalid,
        size,
        state,
        inputId,
        value,
        name,
        onChange: () => !effectiveDisabled && setIsChecked(true),
      }}
    >
      <Box
        as="label"
        {...slots.root}
        cursor={effectiveDisabled ? 'not-allowed' : 'pointer'}
      >
        <Box
          as="input"
          id={inputId}
          type="radio"
          name={name}
          value={value}
          checked={isChecked}
          disabled={effectiveDisabled}
          aria-describedby={fieldCtx?.descriptionRegistered ? fieldCtx.descriptionId : undefined}
          aria-required={fieldCtx?.required || undefined}
          aria-invalid={fieldCtx?.invalid || undefined}
          aria-errormessage={fieldCtx?.invalid && fieldCtx?.errorRegistered ? fieldCtx.errorId : undefined}
          onChange={() => !effectiveDisabled && setIsChecked(true)}
          position="absolute"
          opacity={0}
          pointerEvents="none"
        />
        <Flex aria-hidden="true" {...slots.control}>
          {children}
        </Flex>
      </Box>
    </RadioContext.Provider>
  );
}

function RadioIndicator({ style }: RadioIndicatorProps) {
  const ctx = useRadioContext();
  const slots = useSlotRecipe<RadioSlot>('radio', { size: ctx.size, state: ctx.state });
  const transitionFn = useTransition();

  return (
    <Flex as="span" aria-hidden="true" {...slots.indicator} style={style}>
      <Box
        as="span"
        width={10}
        height={10}
        borderRadius="full"
        backgroundColor={ctx.isChecked ? 'brand.base' : 'transparent'}
        transition={transitionFn('background-color', 'fast')}
      />
    </Flex>
  );
}

function RadioLabel({ children }: RadioLabelProps) {
  const ctx = useRadioContext();
  const slots = useSlotRecipe<RadioSlot>('radio', { size: ctx.size, state: ctx.state });
  return (
    <Text as="span" {...slots.label} style={{ minWidth: 0 }}>
      {children}
    </Text>
  );
}

function RadioDescription({ children }: RadioDescriptionProps) {
  const ctx = useRadioContext();
  const slots = useSlotRecipe<RadioSlot>('radio', { size: ctx.size, state: ctx.state });
  return <Text as="span" {...slots.description}>{children}</Text>;
}

RadioRoot.displayName = 'Radio.Root';
RadioIndicator.displayName = 'Radio.Indicator';
RadioLabel.displayName = 'Radio.Label';
RadioDescription.displayName = 'Radio.Description';

markFieldAware(RadioRoot);

export const Radio = Object.assign(RadioRoot, {
  Root: RadioRoot,
  Indicator: RadioIndicator,
  Label: RadioLabel,
  Description: RadioDescription,
});
