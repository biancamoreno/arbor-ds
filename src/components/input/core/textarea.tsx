import React, { useId } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Box, Flex, Text } from '../../core';
import type { TextAreaProps } from '../interfaces';
import { FieldShell, getFieldColors, getFieldFrameStyle } from './shared';

export const TextArea = markFieldAware(
  React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (
      {
        label,
        error,
        size = 'md',
        variant = 'default',
        helperText,
        disabled,
        value,
        onChange,
        onValueChange,
        rows = 4,
        maxLength,
        showCharCount,
        style,
        id: idProp,
        ...rest
      },
      ref,
    ) => {
      const theme = useTheme();
      const fieldCtx = useFieldContext();
      const autoId = useId();

      const effectiveError = fieldCtx?.invalid ? (error ?? ' ') : error;
      const effectiveDisabled = disabled ?? fieldCtx?.disabled ?? false;
      const inputId = fieldCtx?.fieldId ?? idProp ?? autoId;

      const colors = getFieldColors(theme, { error: effectiveError, variant, disabled: effectiveDisabled });
      const frameStyle = getFieldFrameStyle(theme, { size, variant, error: effectiveError, disabled: effectiveDisabled });
      const charCount = (value as string)?.length || 0;

      const textareaElement = (
        <Box
          as="textarea"
          ref={ref}
          id={inputId}
          rows={rows}
          value={value}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            onChange?.(event);
            onValueChange?.(event.target.value);
          }}
          disabled={effectiveDisabled}
          maxLength={maxLength}
          aria-describedby={fieldCtx?.descriptionRegistered ? fieldCtx.descriptionId : undefined}
          aria-required={fieldCtx?.required || undefined}
          aria-invalid={fieldCtx?.invalid || undefined}
          aria-errormessage={fieldCtx?.invalid && fieldCtx?.errorRegistered ? fieldCtx.errorId : undefined}
          style={{
            ...frameStyle,
            fontFamily: 'inherit',
            color: colors.textColor,
            cursor: effectiveDisabled ? 'not-allowed' : 'auto',
            outline: 'none',
            resize: 'vertical',
            ...style,
          }}
          {...rest}
        />
      );

      const charCountEl = showCharCount && maxLength && (
        <Flex justifyContent="flex-end">
          <Text
            as="span"
            fontSize="xsmall"
            style={{
              color: charCount > maxLength * 0.9
                ? theme.colors.feedback.critical.base
                : theme.colors.text.secondary,
            }}
          >
            {charCount} / {maxLength}
          </Text>
        </Flex>
      );

      if (fieldCtx) {
        return (
          <>
            {textareaElement}
            {charCountEl}
          </>
        );
      }

      return (
        <FieldShell theme={theme} label={label} helperText={helperText} error={error}>
          {textareaElement}
          {charCountEl}
        </FieldShell>
      );
    },
  ),
);

TextArea.displayName = 'TextArea';
