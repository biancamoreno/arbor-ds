import React, { useId } from 'react';
import { ArborTransform, useSlotRecipe } from '../../../ecosystem';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Box, Flex, Clickable, Icon } from '../../core';
import type { TextInputProps } from '../interfaces';
import { FieldShell } from './field-shell';

export const TextInput = markFieldAware(
  React.forwardRef<HTMLInputElement, TextInputProps>(
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
      const fieldCtx = useFieldContext();
      const autoId = useId();

      const effectiveError = fieldCtx?.invalid ? (error ?? ' ') : error;
      const effectiveDisabled = disabled ?? fieldCtx?.disabled ?? false;
      const state = effectiveError ? 'error' : effectiveDisabled ? 'disabled' : 'idle';

      const slots = useSlotRecipe<'frame' | 'control'>('input', { size, variant, state });
      const inputId = fieldCtx?.fieldId ?? idProp ?? autoId;

      const handleClear = () => {
        const syntheticEvent = { target: { value: '' } } as React.ChangeEvent<HTMLInputElement>;
        onChange?.(syntheticEvent);
        onValueChange?.('');
      };

      const inputElement = (
        <ArborTransform
          as="div"
          {...slots.frame}
          display="flex"
          alignItems="center"
          gap="micro"
        >
          {leftIcon && (
            <Flex as="span" display="inline-flex" alignItems="center" flexShrink={0}>
              {leftIcon}
            </Flex>
          )}
          <Box
            as="input"
            ref={ref}
            {...slots.control}
            flex={1}
            minWidth={0}
            cursor={effectiveDisabled ? 'not-allowed' : 'auto'}
            id={inputId}
            value={value}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              onChange?.(event);
              onValueChange?.(event.target.value);
            }}
            disabled={effectiveDisabled}
            aria-describedby={fieldCtx?.descriptionRegistered ? fieldCtx.descriptionId : undefined}
            aria-required={fieldCtx?.required || undefined}
            aria-invalid={fieldCtx?.invalid || undefined}
            aria-errormessage={fieldCtx?.invalid && fieldCtx?.errorRegistered ? fieldCtx.errorId : undefined}
            {...rest}
            style={{
              border: 'none',
              backgroundColor: 'transparent',
              outline: 'none',
              fontFamily: 'inherit',
              ...style,
            }}
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
              color="text.tertiary"
            >
              <Icon name="X" size="small" />
            </Clickable>
          )}
          {rightIcon && (
            <Flex as="span" display="inline-flex" alignItems="center" flexShrink={0}>
              {rightIcon}
            </Flex>
          )}
        </ArborTransform>
      );

      if (fieldCtx) return inputElement;

      return (
        <FieldShell label={label} helperText={helperText} error={error}>
          {inputElement}
        </FieldShell>
      );
    },
  ),
);

TextInput.displayName = 'TextInput';
