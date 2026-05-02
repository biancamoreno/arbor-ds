import React, { forwardRef, useId } from 'react';
import {
  TextInput as RNTextInput,
  type TextInputProps as RNTextInputProps,
  type KeyboardTypeOptions,
} from 'react-native';
import { useSlotRecipe } from '../../../ecosystem';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Box, Clickable, Icon } from '../../core';
import type { TextInputProps } from '../interfaces';
import { FieldShell } from './field-shell';

/**
 * @platform native-ready
 *
 * Wrapper sobre `<TextInput>` RN com a mesma API pública do TextInput web.
 * - `onChange` (synthetic ChangeEvent) e `onValueChange` (string puro) são suportados.
 * - `type` HTML mapeia para `keyboardType`/`secureTextEntry` RN.
 * - Frame outer recebe `slots.frame` via Box; controle interno é `<TextInput>` com style RN resolvido.
 */

const keyboardTypeMap: Record<string, KeyboardTypeOptions> = {
  email: 'email-address',
  number: 'numeric',
  tel: 'phone-pad',
  url: 'url',
};

const fontSizeBySize = { sm: 'xsmall', md: 'small', lg: 'medium' } as const;

type RNStyle = NonNullable<RNTextInputProps['style']>;

const TextInputComponent = forwardRef<RNTextInput, TextInputProps>(function TextInput(props, ref) {
  const {
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
    type,
    placeholder,
    ...rest
  } = props as TextInputProps & { type?: string; placeholder?: string };

  const fieldCtx = useFieldContext();
  const theme = useTheme();
  const autoId = useId();

  const effectiveError = fieldCtx?.invalid ? (error ?? ' ') : error;
  const effectiveDisabled = disabled ?? fieldCtx?.disabled ?? false;
  const state = effectiveError ? 'error' : effectiveDisabled ? 'disabled' : 'idle';

  const slots = useSlotRecipe<'frame' | 'control'>('input', { size, variant, state });
  const inputId = fieldCtx?.fieldId ?? idProp ?? autoId;

  const fontSizeToken = fontSizeBySize[size];
  const controlStyle: RNStyle = {
    flex: 1,
    minWidth: 0,
    color: theme.colors.text.primary,
    fontSize: theme.fontSizes[fontSizeToken],
    paddingHorizontal: 0,
    paddingVertical: 0,
  };

  const keyboardType: KeyboardTypeOptions = (type ? keyboardTypeMap[type] : undefined) ?? 'default';
  const secureTextEntry = type === 'password';

  const emitChange = (text: string) => {
    onValueChange?.(text);
    if (onChange) {
      const synthetic = { target: { value: text } } as React.ChangeEvent<HTMLInputElement>;
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

  const inputElement = (
    <Box
      {...slots.frame}
      display="flex"
      flexDirection="row"
      alignItems="center"
      gap="micro"
    >
      {leftIcon ? <Box>{leftIcon}</Box> : null}
      <RNTextInput
        ref={ref}
        nativeID={inputId}
        value={value as string | undefined}
        editable={!effectiveDisabled}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.text.tertiary}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        accessibilityLabelledBy={fieldCtx?.labelId}
        accessibilityState={accessibilityState}
        aria-describedby={ariaDescribedBy}
        onChangeText={emitChange}
        style={[controlStyle, style as RNStyle]}
        {...(rest as Record<string, unknown>)}
      />
      {clearable && value ? (
        <Clickable accessibilityLabel="Limpar" onClick={() => emitChange('')}>
          <Icon name="X" size="small" />
        </Clickable>
      ) : null}
      {rightIcon ? <Box>{rightIcon}</Box> : null}
    </Box>
  );

  if (fieldCtx) return inputElement;

  return (
    <FieldShell label={label} helperText={helperText} error={error}>
      {inputElement}
    </FieldShell>
  );
});

TextInputComponent.displayName = 'TextInput';

export const TextInput = markFieldAware(TextInputComponent);
