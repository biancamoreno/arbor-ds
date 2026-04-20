import React, { useId } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useFieldContext } from '../../field/context/field-context';
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
      id: idProp,
      ...rest
    },
    ref,
  ) => {
    const theme = useTheme();
    const fieldCtx = useFieldContext();
    const autoId = useId();

    const effectiveError = fieldCtx?.isInvalid ? (error ?? ' ') : error;
    const effectiveDisabled = disabled ?? fieldCtx?.isDisabled ?? false;

    const colors = getFieldColors(theme, { error: effectiveError, variant, disabled: effectiveDisabled });
    const frameStyle = getFieldFrameStyle(theme, { size, variant, error: effectiveError, disabled: effectiveDisabled });

    const inputId = fieldCtx?.fieldId ?? idProp ?? autoId;

    const handleClear = () => {
      const syntheticEvent = { target: { value: '' } } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(syntheticEvent);
      onValueChange?.('');
    };

    const inputElement = (
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
          id={inputId}
          value={value}
          onChange={(event) => {
            onChange?.(event);
            onValueChange?.(event.target.value);
          }}
          disabled={effectiveDisabled}
          aria-describedby={fieldCtx?.descriptionId}
          aria-required={fieldCtx?.isRequired || undefined}
          aria-invalid={fieldCtx?.isInvalid || undefined}
          aria-errormessage={fieldCtx?.isInvalid ? fieldCtx.errorId : undefined}
          style={{
            border: 'none',
            outline: 'none',
            flex: 1,
            backgroundColor: 'transparent',
            color: colors.textColor,
            cursor: effectiveDisabled ? 'not-allowed' : 'auto',
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
            ×
          </button>
        )}
        {rightIcon && <span style={{ display: 'flex', alignItems: 'center' }}>{rightIcon}</span>}
      </div>
    );

    // When inside a Field.Root, Field handles label/description/error rendering
    if (fieldCtx) return inputElement;

    return (
      <FieldShell theme={theme} label={label} helperText={helperText} error={error}>
        {inputElement}
      </FieldShell>
    );
  },
);

TextInput.displayName = 'TextInput';

export default TextInput;
