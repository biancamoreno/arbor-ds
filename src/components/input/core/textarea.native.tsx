import React, { forwardRef, useId } from 'react';
import {
  TextInput as RNTextInput,
  type TextInputProps as RNTextInputProps,
} from 'react-native';
import { useSlotRecipe } from '../../../ecosystem';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Box, Flex, Text } from '../../core';
import type { TextAreaProps } from '../interfaces';
import { FieldShell } from './field-shell';

const fontSizeBySize = { small: 'xsmall', medium: 'small', large: 'medium' } as const;

type RNStyle = NonNullable<RNTextInputProps['style']>;

const TextAreaComponent = forwardRef<RNTextInput, TextAreaProps>(function TextArea(props, ref) {
  const {
    label,
    error,
    size = 'medium',
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
    placeholder,
    ...rest
  } = props as TextAreaProps & { placeholder?: string; rows?: number };

  const fieldCtx = useFieldContext();
  const theme = useTheme();
  const autoId = useId();

  const effectiveError = fieldCtx?.invalid ? (error ?? ' ') : error;
  const effectiveDisabled = disabled ?? fieldCtx?.disabled ?? false;
  const state = effectiveError ? 'error' : effectiveDisabled ? 'disabled' : 'idle';

  const slots = useSlotRecipe<'frame' | 'control'>('input', { size, variant, state });
  const inputId = fieldCtx?.fieldId ?? idProp ?? autoId;
  const charCount = (value as string)?.length || 0;

  const fontSizeToken = fontSizeBySize[size];
  const lineHeight = theme.fontSizes[fontSizeToken] * 1.4;
  const controlStyle: RNStyle = {
    color: theme.colors.text.primary,
    fontSize: theme.fontSizes[fontSizeToken],
    minHeight: lineHeight * rows,
    paddingHorizontal: 0,
    paddingVertical: 0,
    textAlignVertical: 'top',
  };

  const emitChange = (text: string) => {
    onValueChange?.(text);
    if (onChange) {
      const synthetic = { target: { value: text } } as React.ChangeEvent<HTMLTextAreaElement>;
      onChange(synthetic);
    }
  };

  const accessibilityState = effectiveDisabled ? { disabled: true } : undefined;
  const ariaDescribedBy = fieldCtx?.descriptionRegistered
    ? fieldCtx.invalid && fieldCtx.errorRegistered
      ? `${fieldCtx.descriptionId} ${fieldCtx.errorId}`
      : fieldCtx.descriptionId
    : fieldCtx?.invalid && fieldCtx?.errorRegistered
      ? fieldCtx.errorId
      : undefined;

  const textareaElement = (
    <Box {...slots.frame}>
      <RNTextInput
        ref={ref}
        nativeID={inputId}
        multiline
        numberOfLines={rows}
        value={value as string | undefined}
        editable={!effectiveDisabled}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.tertiary}
        maxLength={maxLength}
        accessibilityLabelledBy={fieldCtx?.labelId}
        accessibilityState={accessibilityState}
        aria-describedby={ariaDescribedBy}
        onChangeText={emitChange}
        style={[controlStyle, style as RNStyle]}
        {...(rest as Record<string, unknown>)}
      />
    </Box>
  );

  const charCountEl = showCharCount && maxLength ? (
    <Flex justifyContent="flex-end">
      <Text
        fontSize="xsmall"
        color={charCount > maxLength * 0.9 ? 'feedback.critical.solid' : 'text.secondary'}
      >
        {charCount} / {maxLength}
      </Text>
    </Flex>
  ) : null;

  if (fieldCtx) {
    return (
      <>
        {textareaElement}
        {charCountEl}
      </>
    );
  }

  return (
    <FieldShell label={label} helperText={helperText} error={error}>
      {textareaElement}
      {charCountEl}
    </FieldShell>
  );
});

TextAreaComponent.displayName = 'TextArea';

/**
 * @platform native
 *
 * `TextArea` em React Native: `<TextInput multiline>` RN com a mesma API
 * pública do equivalente web. `rows` mapeia para `numberOfLines` (Android) +
 * altura mínima derivada. `showCharCount` + `maxLength` mantêm a mesma
 * semântica do web.
 *
 * @see {@link TextAreaProps}
 */
export const TextArea = markFieldAware(TextAreaComponent);
