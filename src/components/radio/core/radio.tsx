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
  size = 'md',
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
  const slots = useSlotRecipe<RadioSlot>('radio', { size, state });

  return (
    <RadioContext.Provider
      value={{
        checked: checkedState,
        disabled: effectiveDisabled,
        invalid: effectiveInvalid,
        size,
        state,
        inputId,
        value,
        name,
        onChange: () => !effectiveDisabled && setCheckedState(true),
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
          checked={checkedState}
          disabled={effectiveDisabled}
          aria-describedby={fieldCtx?.descriptionRegistered ? fieldCtx.descriptionId : undefined}
          aria-required={fieldCtx?.required || undefined}
          aria-invalid={fieldCtx?.invalid || undefined}
          aria-errormessage={fieldCtx?.invalid && fieldCtx?.errorRegistered ? fieldCtx.errorId : undefined}
          onChange={() => !effectiveDisabled && setCheckedState(true)}
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
        backgroundColor={ctx.checked ? 'brand.base' : 'transparent'}
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

/**
 * @platform shared
 *
 * Compound de radio button controlado/uncontrolled. `Root` agrupa input
 * nativo + slots visuais e distribui o estado via `RadioContext`. A prop
 * `value` é obrigatória (identifica este radio dentro do grupo via `name`).
 * Use `onCheckedChange(checked)` para receber transições para `true` (radios
 * não desmarcam ao clicar de novo). Field-aware: herda `disabled`/`invalid`
 * do `<Field>` quando aninhado.
 *
 * @example
 * <Radio value="standard" name="shipping" checked={mode === 'standard'} onCheckedChange={() => setMode('standard')}>
 *   <Radio.Indicator />
 *   <Radio.Label>Entrega padrão</Radio.Label>
 * </Radio>
 *
 * @see {@link RadioRootProps}
 */
export const Radio = Object.assign(RadioRoot, {
  Root: RadioRoot,
  Indicator: RadioIndicator,
  Label: RadioLabel,
  Description: RadioDescription,
});
