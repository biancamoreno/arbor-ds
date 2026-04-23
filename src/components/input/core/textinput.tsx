import React, { useId } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useFieldContext } from '../../field/context/field-context';
import { Box, Flex, Clickable, Icon } from '../../core';
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
      <Flex
        alignItems="center"
        gap="micro"
        style={{
          ...frameStyle,
          paddingInline: '12px',
        }}
      >
        {leftIcon && (
          <Flex as="span" display="inline-flex" alignItems="center">
            {leftIcon}
          </Flex>
        )}
        <Box
          as="input"
          innerRef={ref}
          id={inputId}
          value={value}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(event);
            onValueChange?.(event.target.value);
          }}
          disabled={effectiveDisabled}
          aria-describedby={fieldCtx?.descriptionId}
          aria-required={fieldCtx?.isRequired || undefined}
          aria-invalid={fieldCtx?.isInvalid || undefined}
          aria-errormessage={fieldCtx?.isInvalid ? fieldCtx.errorId : undefined}
          flex={1}
          outline="none"
          cursor={effectiveDisabled ? 'not-allowed' : 'auto'}
          minWidth={0}
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            color: colors.textColor,
            fontFamily: 'inherit',
            fontSize: frameStyle.fontSize as unknown as string,
            ...style,
          }}
          {...rest}
        />
        {clearable && value && (
          <Clickable
            as="button"
            type="button"
            aria-label="Limpar"
            onClick={handleClear}
            display="inline-flex"
            alignItems="center"
            flexShrink={0}
            style={{ color: colors.placeholderColor }}
          >
            <Icon name="X" size={14} aria-hidden="true" />
          </Clickable>
        )}
        {rightIcon && (
          <Flex as="span" display="inline-flex" alignItems="center">
            {rightIcon}
          </Flex>
        )}
      </Flex>
    );

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
