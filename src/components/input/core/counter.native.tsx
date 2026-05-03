import React, { useId, useState } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Box, Flex, Clickable, Text } from '../../core';
import type { CounterProps } from '../interfaces';

const sizeMap = {
  small: { button: 24, font: 'xsmall' as const },
  medium: { button: 32, font: 'small' as const },
  large: { button: 40, font: 'medium' as const },
};

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
  const { button: buttonSize, font: fontToken } = sizeMap[size];

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

  return (
    <Flex flexDirection="column" gap="micro">
      {label && !fieldCtx ? (
        <Text fontSize="xsmall" fontWeight="semibold" color="text.primary">
          {label}
        </Text>
      ) : null}
      <Flex
        flexDirection="row"
        alignItems="center"
        gap="micro"
        opacity={effectiveDisabled ? 0.5 : 1}
      >
        <Clickable
          accessibilityLabel="Decrementar"
          onClick={handleDecrement}
          disabled={!canDecrement}
          width={buttonSize}
          height={buttonSize}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="medium"
          borderWidth="hairline"
          borderColor="border.default"
          backgroundColor={!canDecrement ? 'background.subtle' : 'surface.default'}
        >
          <Text
            fontSize={fontToken}
            color={!canDecrement ? 'text.tertiary' : 'text.primary'}
          >
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
              height: buttonSize,
              borderWidth: 1,
              borderColor: theme.colors.border.default,
              borderRadius: 6,
              textAlign: 'center',
              fontSize: theme.fontSizes[fontToken],
              fontWeight: '600',
              color: theme.colors.text.primary,
              backgroundColor: theme.colors.surface.default,
              paddingHorizontal: 0,
              paddingVertical: 0,
            }}
            testID={`${inputId}-input`}
          />
        ) : (
          <Box
            width={48}
            height={buttonSize}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize={fontToken} fontWeight="semibold" color="text.primary">
              {value}
            </Text>
          </Box>
        )}
        <Clickable
          accessibilityLabel="Incrementar"
          onClick={handleIncrement}
          disabled={!canIncrement}
          width={buttonSize}
          height={buttonSize}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="medium"
          borderWidth="hairline"
          borderColor="border.default"
          backgroundColor={!canIncrement ? 'background.subtle' : 'surface.default'}
        >
          <Text
            fontSize={fontToken}
            color={!canIncrement ? 'text.tertiary' : 'text.primary'}
          >
            +
          </Text>
        </Clickable>
      </Flex>
    </Flex>
  );
};

CounterBase.displayName = 'Counter';

/**
 * @platform native
 *
 * `Counter` em React Native: `Clickable.native` (botões −/+) + display do
 * valor (`<Text>` ou `<TextInput numeric>`). `showInput=true` (default)
 * exibe input numérico editável; `showInput=false` exibe apenas o valor.
 * Mesma semântica de `min`/`max`/`step`/`disabled` do web.
 *
 * @see {@link CounterProps}
 */
export const Counter = markFieldAware(CounterBase);
