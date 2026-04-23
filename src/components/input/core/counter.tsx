import React, { useState } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Box, Flex, Clickable } from '../../core';
import type { CounterProps } from '../interfaces';

export const Counter: React.FC<CounterProps> = ({
  value,
  onChange,
  min = 0,
  max = 999,
  step = 1,
  label,
  size = 'md',
  disabled,
  showInput = true,
}) => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));

  const sizeMap = {
    sm: { button: '24px', font: theme.fontSizes.xsmall, padding: '0.25rem 0.5rem' },
    md: { button: '32px', font: theme.fontSizes.small, padding: '0.5rem 0.75rem' },
    lg: { button: '40px', font: theme.fontSizes.medium, padding: '0.75rem 1rem' },
  };

  const handleDecrement = () => {
    if (!disabled && value > min) onChange?.(Math.max(value - step, min));
  };

  const handleIncrement = () => {
    if (!disabled && value < max) onChange?.(Math.min(value + step, max));
  };

  const handleInputBlur = () => {
    const numValue = parseInt(editValue, 10);
    if (!isNaN(numValue)) {
      const clamped = Math.max(min, Math.min(numValue, max));
      onChange?.(clamped);
      setEditValue(String(clamped));
    } else {
      setEditValue(String(value));
    }
    setIsEditing(false);
  };

  const canDecrement = !disabled && value > min;
  const canIncrement = !disabled && value < max;

  return (
    <Flex flexDirection="column" gap="micro">
      {label && (
        <Box
          as="label"
          fontSize="xsmall"
          fontWeight="semibold"
          color="text.primary"
        >
          {label}
        </Box>
      )}
      <Flex
        alignItems="center"
        gap="4px"
        opacity={disabled ? 0.5 : 1}
        pointerEvents={disabled ? 'none' : 'auto'}
      >
        <Clickable
          as="button"
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="medium"
          cursor={!canDecrement ? 'not-allowed' : 'pointer'}
          style={{
            width: sizeMap[size].button,
            height: sizeMap[size].button,
            border: `1px solid ${theme.colors.border.default}`,
            backgroundColor: !canDecrement ? theme.colors.background.subtle : 'white',
            fontSize: sizeMap[size].font,
            color: !canDecrement ? theme.colors.text.tertiary : theme.colors.text.primary,
            transition: 'background-color 0.2s',
          }}
        >
          −
        </Clickable>
        {showInput ? (
          <Box
            as="input"
            type="number"
            value={isEditing ? editValue : value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditValue(e.target.value)}
            onFocus={() => setIsEditing(true)}
            onBlur={handleInputBlur}
            disabled={disabled}
            borderRadius="medium"
            outline="none"
            style={{
              width: '3rem',
              height: sizeMap[size].button,
              border: `1px solid ${theme.colors.border.default}`,
              textAlign: 'center',
              fontSize: sizeMap[size].font,
              fontWeight: 600,
              cursor: 'text',
              backgroundColor: 'white',
              color: theme.colors.text.primary,
            }}
          />
        ) : (
          <Flex
            as="span"
            alignItems="center"
            justifyContent="center"
            style={{
              width: '3rem',
              height: sizeMap[size].button,
              fontSize: sizeMap[size].font,
              fontWeight: 600,
              color: theme.colors.text.primary,
            }}
          >
            {value}
          </Flex>
        )}
        <Clickable
          as="button"
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="medium"
          cursor={!canIncrement ? 'not-allowed' : 'pointer'}
          style={{
            width: sizeMap[size].button,
            height: sizeMap[size].button,
            border: `1px solid ${theme.colors.border.default}`,
            backgroundColor: !canIncrement ? theme.colors.background.subtle : 'white',
            fontSize: sizeMap[size].font,
            color: !canIncrement ? theme.colors.text.tertiary : theme.colors.text.primary,
            transition: 'background-color 0.2s',
          }}
        >
          +
        </Clickable>
      </Flex>
    </Flex>
  );
};

Counter.displayName = 'Counter';

export default Counter;
