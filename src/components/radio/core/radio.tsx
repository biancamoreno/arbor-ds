import { useId } from 'react';
import { useControllableState } from '../../../ecosystem/primitives';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
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
          width="1px"
          height="1px"
          margin="-1px"
          padding={0}
          overflow="hidden"
          pointerEvents="none"
        />
        <Flex aria-hidden="true" {...slots.control}>
          {children}
        </Flex>
      </Box>
    </RadioContext.Provider>
  );
}

function RadioIndicator(_props: RadioIndicatorProps) {
  const ctx = useRadioContext();
  const slots = useSlotRecipe<RadioSlot>('radio', { size: ctx.size, variant: ctx.variant, state: ctx.state });

  return (
    <Flex as="span" aria-hidden="true" {...slots.indicator}>
      <Box as="span" {...slots.dot} />
    </Flex>
  );
}

function RadioLabel({ children }: RadioLabelProps) {
  const ctx = useRadioContext();
  const slots = useSlotRecipe<RadioSlot>('radio', { size: ctx.size, variant: ctx.variant, state: ctx.state });
  return (
    <Text as="span" {...slots.label}>
      {children}
    </Text>
  );
}

function RadioDescription({ children }: RadioDescriptionProps) {
  const ctx = useRadioContext();
  const slots = useSlotRecipe<RadioSlot>('radio', { size: ctx.size, variant: ctx.variant, state: ctx.state });
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
 * Compound de radio button clássico (sem moldura/highlight de linha — pattern
 * stripped-down). `Root` renderiza um `<input type="radio">` visualmente
 * escondido (mantém form submission, navegação por teclado, role nativa) e
 * distribui o estado via `RadioContext`. `Indicator` é o círculo bordado +
 * dot interno (consome slot `dot` da recipe). Field-aware: herda
 * `disabled`/`invalid` do `<Field>` quando aninhado.
 *
 * Para o pattern de "card selecionável" (radio embutido em uma área clicável
 * com borda + highlight), componha `<Card interactive><Radio /></Card>`.
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
