import React from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Box, Flex, Text } from '../../core';
import type { TextAreaProps } from '../interfaces';
import { FieldShell, getFieldColors, getFieldFrameStyle } from './shared';

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
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
      ...rest
    },
    ref,
  ) => {
    const theme = useTheme();
    const colors = getFieldColors(theme, { error, variant, disabled });
    const frameStyle = getFieldFrameStyle(theme, { size, variant, error, disabled });
    const charCount = (value as string)?.length || 0;

    return (
      <FieldShell theme={theme} label={label} helperText={helperText} error={error}>
        <Box
          as="textarea"
          innerRef={ref}
          rows={rows}
          value={value}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
            onChange?.(event);
            onValueChange?.(event.target.value);
          }}
          disabled={disabled}
          maxLength={maxLength}
          style={{
            ...frameStyle,
            fontFamily: 'inherit',
            color: colors.textColor,
            cursor: disabled ? 'not-allowed' : 'auto',
            outline: 'none',
            resize: 'vertical',
            ...style,
          }}
          {...rest}
        />
        {showCharCount && maxLength && (
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
        )}
      </FieldShell>
    );
  },
);

TextArea.displayName = 'TextArea';

export default TextArea;
