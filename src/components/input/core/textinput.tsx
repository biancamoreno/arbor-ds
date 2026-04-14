import React from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type { TextInputProps } from '../interfaces';
import { FieldShell, getFieldColors, getFieldFrameStyle } from './shared';

export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
  (
    {
      label,
      error,
      size = 'md',
      variant = 'default',
      leftIcon,
      rightIcon,
      helperText,
      clearable,
      disabled,
      value,
      onChange,
      onValueChange,
      style,
      ...rest
    },
    ref,
  ) => {
    const theme = useTheme();
    const colors = getFieldColors(theme, { error, variant, disabled });
    const frameStyle = getFieldFrameStyle(theme, { size, variant, error, disabled });

    const handleClear = () => {
      const syntheticEvent = { target: { value: '' } } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
      onValueChange?.('');
    };

    return (
      <FieldShell theme={theme} label={label} helperText={helperText} error={error}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            ...frameStyle,
            paddingInline: '12px',
          }}
        >
          {leftIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{leftIcon}</span>}
          <input
            ref={ref}
            value={value}
            onChange={(event) => {
              onChange?.(event);
              onValueChange?.(event.target.value);
            }}
            disabled={disabled}
            style={{
              border: 'none',
              outline: 'none',
              flex: 1,
              backgroundColor: 'transparent',
              color: colors.textColor,
              cursor: disabled ? 'not-allowed' : 'auto',
              fontFamily: 'inherit',
              fontSize: frameStyle.fontSize,
              minWidth: 0,
              ...style,
            }}
            {...rest}
          />
          {clearable && value && (
            <button
              type="button"
              aria-label="Clear input"
              onClick={handleClear}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: colors.placeholderColor,
                fontSize: theme.fontSizes.small,
                padding: 0,
              }}
            >
              x
            </button>
          )}
          {rightIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{rightIcon}</span>}
        </div>
      </FieldShell>
    );
  },
);

TextInput.displayName = 'TextInput';

export default TextInput;
