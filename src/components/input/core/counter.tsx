import React, { useId, useState } from 'react';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Box, Flex, Clickable } from '../../core';
import type { CounterProps } from '../interfaces';

type CounterSlot = 'root' | 'label' | 'controls' | 'button' | 'input' | 'display';

const CounterBase: React.FC<CounterProps> = ({
  value,
  onValueChange,
  min = 0,
  max = 999,
  step = 1,
  label,
  size = 'medium',
  disabled,
  showInput = true,
}) => {
  const fieldCtx = useFieldContext();
  const autoId = useId();
  const inputId = fieldCtx?.fieldId ?? autoId;

  const effectiveDisabled = disabled ?? fieldCtx?.disabled ?? false;
  const slots = useSlotRecipe<CounterSlot>('counter', {
    size,
    state: effectiveDisabled ? 'disabled' : 'idle',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));

  const canDecrement = !effectiveDisabled && value > min;
  const canIncrement = !effectiveDisabled && value < max;

  const handleDecrement = () => {
    if (canDecrement) onValueChange?.(Math.max(value - step, min));
  };

  const handleIncrement = () => {
    if (canIncrement) onValueChange?.(Math.min(value + step, max));
  };

  const handleInputBlur = () => {
    const numValue = parseInt(editValue, 10);
    if (!isNaN(numValue)) {
      const clamped = Math.max(min, Math.min(numValue, max));
      onValueChange?.(clamped);
      setEditValue(String(clamped));
    } else {
      setEditValue(String(value));
    }
    setIsEditing(false);
  };

  return (
    <Box {...slots.root}>
      {label && !fieldCtx && (
        <Box as="label" htmlFor={inputId} {...slots.label}>
          {label}
        </Box>
      )}
      <Flex {...slots.controls}>
        <Clickable
          as="button"
          type="button"
          aria-label="Decrementar"
          onClick={handleDecrement}
          disabled={!canDecrement}
          {...slots.button}
        >
          −
        </Clickable>
        {showInput ? (
          <Box
            as="input"
            id={inputId}
            type="number"
            value={isEditing ? editValue : value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value)}
            onFocus={() => setIsEditing(true)}
            onBlur={handleInputBlur}
            disabled={effectiveDisabled}
            aria-describedby={fieldCtx?.descriptionRegistered ? fieldCtx.descriptionId : undefined}
            aria-required={fieldCtx?.required || undefined}
            aria-invalid={fieldCtx?.invalid || undefined}
            aria-errormessage={fieldCtx?.invalid && fieldCtx?.errorRegistered ? fieldCtx.errorId : undefined}
            {...slots.input}
          />
        ) : (
          <Flex as="span" {...slots.display}>
            {value}
          </Flex>
        )}
        <Clickable
          as="button"
          type="button"
          aria-label="Incrementar"
          onClick={handleIncrement}
          disabled={!canIncrement}
          {...slots.button}
        >
          +
        </Clickable>
      </Flex>
    </Box>
  );
};

CounterBase.displayName = 'Counter';

/**
 * @platform shared
 *
 * Stepper numérico Field-aware. Botões `−` e `+` carregam touch target 44×44
 * via overlay `_before` (WCAG 2.5.5) e visualizam estado de boundary via
 * `:disabled` nativo (sem JS pintando cor). Input central é editável por
 * default (`showInput` `true`) ou exibe apenas valor (`showInput` `false`).
 * `step` controla o salto (default `1`); `min`/`max` (default `0` e `999`)
 * fazem clamp tanto via setas quanto via blur do input. Quando aninhado em
 * `<Field>`, herda `disabled` e cabeia `aria-*`.
 *
 * @see {@link CounterProps}
 */
export const Counter = markFieldAware(CounterBase);
