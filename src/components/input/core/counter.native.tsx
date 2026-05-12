import React, { useId, useState } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Box, Flex, Clickable, Text } from '../../core';
import type { CounterProps } from '../interfaces';

type CounterSlot = 'root' | 'label' | 'controls' | 'button' | 'input' | 'display';

const fontSizeBySize = { small: 'xsmall', medium: 'small', large: 'medium' } as const;
const buttonSizePxBySize = { small: 36, medium: 44, large: 52 } as const;

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
  const theme = useTheme();
  const fieldCtx = useFieldContext();
  const autoId = useId();
  const inputId = fieldCtx?.fieldId ?? autoId;

  const effectiveDisabled = disabled ?? fieldCtx?.disabled ?? false;
  const slots = useSlotRecipe<CounterSlot>('counter', {
    size,
    state: effectiveDisabled ? 'disabled' : 'idle',
  });

  const [editValue, setEditValue] = useState(String(value));

  const canDecrement = !effectiveDisabled && value > min;
  const canIncrement = !effectiveDisabled && value < max;

  const handleDecrement = () => {
    if (canDecrement) onValueChange?.(Math.max(value - step, min));
  };
  const handleIncrement = () => {
    if (canIncrement) onValueChange?.(Math.min(value + step, max));
  };

  const handleEditEnd = () => {
    const numValue = parseInt(editValue, 10);
    if (!isNaN(numValue)) {
      const clamped = Math.max(min, Math.min(numValue, max));
      onValueChange?.(clamped);
      setEditValue(String(clamped));
    } else {
      setEditValue(String(value));
    }
  };

  const fontSizeToken = fontSizeBySize[size];
  const buttonPx = buttonSizePxBySize[size];

  return (
    <Box {...slots.root}>
      {label && !fieldCtx ? (
        <Text {...slots.label}>{label}</Text>
      ) : null}
      <Flex {...slots.controls}>
        <Clickable
          accessibilityLabel="Decrementar"
          onClick={handleDecrement}
          disabled={!canDecrement}
          {...slots.button}
          backgroundColor={canDecrement ? 'surface.default' : 'background.subtle'}
        >
          <Text fontSize={fontSizeToken} color={canDecrement ? 'text.primary' : 'text.tertiary'}>
            −
          </Text>
        </Clickable>
        {showInput ? (
          <RNTextInput
            nativeID={inputId}
            value={editValue !== String(value) ? editValue : String(value)}
            onChangeText={setEditValue}
            onBlur={handleEditEnd}
            editable={!effectiveDisabled}
            keyboardType="numeric"
            accessibilityLabelledBy={fieldCtx?.labelId}
            accessibilityState={effectiveDisabled ? { disabled: true } : undefined}
            style={{
              width: 48,
              height: buttonPx,
              borderWidth: theme.borderWidths.hairline,
              borderColor: theme.colors.border.default,
              borderRadius: theme.radii.small,
              textAlign: 'center',
              fontSize: theme.fontSizes[fontSizeToken],
              fontWeight: '600',
              color: theme.colors.text.primary,
              backgroundColor: theme.colors.surface.default,
              paddingHorizontal: 0,
              paddingVertical: 0,
            }}
            testID={`${inputId}-input`}
          />
        ) : (
          <Flex {...slots.display}>
            <Text fontSize={fontSizeToken} fontWeight="semibold" color="text.primary">
              {value}
            </Text>
          </Flex>
        )}
        <Clickable
          accessibilityLabel="Incrementar"
          onClick={handleIncrement}
          disabled={!canIncrement}
          {...slots.button}
          backgroundColor={canIncrement ? 'surface.default' : 'background.subtle'}
        >
          <Text fontSize={fontSizeToken} color={canIncrement ? 'text.primary' : 'text.tertiary'}>
            +
          </Text>
        </Clickable>
      </Flex>
    </Box>
  );
};

CounterBase.displayName = 'Counter';

/**
 * @platform native
 *
 * `Counter` em React Native: `Clickable.native` (botões −/+) + display do
 * valor (`<Text>` ou `<TextInput numeric>`). Geometria, raios e cores
 * compartilhadas com web via `useSlotRecipe('counter', ...)`. RN não dispara
 * `_disabled`/`_before`, então o visual de boundary (background subtle, texto
 * terciário) é aplicado por override explícito no `Clickable`/`Text` quando
 * `canDecrement`/`canIncrement` é `false`. RNTextInput recebe estilo resolvido
 * do tema (pattern do `textinput.native`).
 *
 * @see {@link CounterProps}
 */
export const Counter = markFieldAware(CounterBase);
