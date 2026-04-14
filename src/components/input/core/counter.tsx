import React, { useState } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
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
    sm: {
      button: '24px',
      font: theme.fontSizes.xsmall,
      padding: '0.25rem 0.5rem',
    },
    md: {
      button: '32px',
      font: theme.fontSizes.small,
      padding: '0.5rem 0.75rem',
    },
    lg: {
      button: '40px',
      font: theme.fontSizes.medium,
      padding: '0.75rem 1rem',
    },
  };

  const handleDecrement = () => {
    if (!disabled && value > min) {
      const newValue = Math.max(value - step, min);
      onChange?.(newValue);
    }
  };

  const handleIncrement = () => {
    if (!disabled && value < max) {
      const newValue = Math.min(value + step, max);
      onChange?.(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {label && (
        <label
          style={{
            fontSize: theme.fontSizes.xsmall,
            fontWeight: 600,
            color: theme.colors.text.primary,
          }}
        >
          {label}
        </label>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          opacity: disabled ? 0.5 : 1,
          pointerEvents: disabled ? 'none' : 'auto',
        }}
      >
        {/* Decrement button */}
        <button
          type="button"
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          style={{
            width: sizeMap[size].button,
            height: sizeMap[size].button,
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: theme.radii.medium,
            backgroundColor: !canDecrement ? theme.colors.background.subtle : 'white',
            cursor: !canDecrement ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: sizeMap[size].font,
            color: !canDecrement ? theme.colors.text.tertiary : theme.colors.text.primary,
            transition: 'background-color 0.2s',
          }}
        >
          −
        </button>

        {/* Value display / editable input */}
        {showInput ? (
          <input
            type="number"
            value={isEditing ? editValue : value}
            onChange={handleInputChange}
            onFocus={() => setIsEditing(true)}
            onBlur={handleInputBlur}
            disabled={disabled}
            style={{
              width: '3rem',
              height: sizeMap[size].button,
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.radii.medium,
              textAlign: 'center',
              fontSize: sizeMap[size].font,
              fontWeight: 600,
              cursor: 'text',
              outline: 'none',
              backgroundColor: 'white',
              color: theme.colors.text.primary,
            }}
          />
        ) : (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '3rem',
              height: sizeMap[size].button,
              fontSize: sizeMap[size].font,
              fontWeight: 600,
              color: theme.colors.text.primary,
            }}
          >
            {value}
          </span>
        )}

        {/* Increment button */}
        <button
          type="button"
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          style={{
            width: sizeMap[size].button,
            height: sizeMap[size].button,
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: theme.radii.medium,
            backgroundColor: !canIncrement ? theme.colors.background.subtle : 'white',
            cursor: !canIncrement ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: sizeMap[size].font,
            color: !canIncrement ? theme.colors.text.tertiary : theme.colors.text.primary,
            transition: 'background-color 0.2s',
          }}
        >
          +
        </button>
      </div>
    </div>
  );
};

Counter.displayName = 'Counter';

export default Counter;
