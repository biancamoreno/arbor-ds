import React, { useId, useState } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Box, Flex, Clickable } from '../../core';
import type { CounterProps } from '../interfaces';

const CounterBase: React.FC<CounterProps> = ({
  value,
  onValueChange,
  min = 0,
  max = 999,
  step = 1,
  label,
  size = 'md',
  disabled,
  showInput = true,
}) => {
  const theme = useTheme();
  const fieldCtx = useFieldContext();
  const autoId = useId();
  const inputId = fieldCtx?.fieldId ?? autoId;

  const effectiveDisabled = disabled ?? fieldCtx?.disabled ?? false;

  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value));

  const sizeMap = {
    sm: { button: '32px', font: theme.fontSizes.xsmall, padding: '0.25rem 0.5rem' },
    md: { button: '40px', font: theme.fontSizes.small, padding: '0.5rem 0.75rem' },
    lg: { button: '48px', font: theme.fontSizes.medium, padding: '0.75rem 1rem' },
  };

  const hitTargetOverlay = {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '44px',
    minHeight: '44px',
  } as const;

  const handleDecrement = () => {
    if (!effectiveDisabled && value > min) onValueChange?.(Math.max(value - step, min));
  };

  const handleIncrement = () => {
    if (!effectiveDisabled && value < max) onValueChange?.(Math.min(value + step, max));
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

  const canDecrement = !effectiveDisabled && value > min;
  const canIncrement = !effectiveDisabled && value < max;

  return (
    <Flex flexDirection="column" gap="micro">
      {label && !fieldCtx && (
        <Box
          as="label"
          htmlFor={inputId}
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
        opacity={effectiveDisabled ? 0.5 : 1}
        pointerEvents={effectiveDisabled ? 'none' : 'auto'}
      >
        <Clickable
          as="button"
          type="button"
          aria-label="Decrementar"
          onClick={handleDecrement}
          disabled={effectiveDisabled || value <= min}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="medium"
          cursor={!canDecrement ? 'not-allowed' : 'pointer'}
          position="relative"
          _before={hitTargetOverlay}
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
          aria-label="Incrementar"
          onClick={handleIncrement}
          disabled={effectiveDisabled || value >= max}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="medium"
          cursor={!canIncrement ? 'not-allowed' : 'pointer'}
          position="relative"
          _before={hitTargetOverlay}
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

CounterBase.displayName = 'Counter';

export const Counter = markFieldAware(CounterBase);
