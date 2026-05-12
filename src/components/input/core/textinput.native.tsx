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

const keyboardTypeMap: Record<string, KeyboardTypeOptions> = {
  email: 'email-address',
  number: 'numeric',
  tel: 'phone-pad',
  url: 'url',
};

type RNStyle = NonNullable<RNTextInputProps['style']>;

function readToken(record: Record<string, unknown> | undefined, key: string): unknown {
  return record ? record[key] : undefined;
}

function resolveAliasColor(colors: Record<string, unknown>, alias: string | undefined): string | undefined {
  if (!alias) return undefined;
  return alias.split('.').reduce<unknown>(
    (acc, key) => (acc as Record<string, unknown> | undefined)?.[key],
    colors,
  ) as string | undefined;
}

const TextInputComponent = forwardRef<RNTextInput, TextInputProps>(function TextInput(props, ref) {
  const {
    label,
    error,
    size = 'medium',
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

  const slots = useSlotRecipe<'frame' | 'control' | 'clearButton'>('input', { size, variant, state });
  const inputId = fieldCtx?.fieldId ?? idProp ?? autoId;

  const controlFontSize = readToken(slots.control as Record<string, unknown>, 'fontSize') as
    | number
    | string
    | undefined;
  const controlColor = readToken(slots.control as Record<string, unknown>, 'color') as
    | string
    | undefined;

  const controlStyle: RNStyle = {
    flex: 1,
    minWidth: 0,
    color: controlColor ?? theme.colors.text.primary,
    fontSize: controlFontSize as number | undefined,
    paddingHorizontal: 0,
    paddingVertical: 0,
  };

  const placeholderColor = resolveAliasColor(
    theme.colors as Record<string, unknown>,
    theme.components.input.colors.placeholder,
  ) ?? theme.colors.text.tertiary;

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
        placeholderTextColor={placeholderColor}
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
        <Clickable accessibilityLabel="Limpar" onClick={() => emitChange('')} {...slots.clearButton}>
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

/**
 * @platform native
 *
 * `TextInput` em React Native: wrapper sobre `<TextInput>` RN com a mesma API
 * pública do equivalente web. `onChange` (synthetic ChangeEvent) e
 * `onValueChange` (string) são ambos suportados; `type` HTML mapeia para
 * `keyboardType`/`secureTextEntry` RN. Frame externo é um `Box` consumindo
 * `slots.frame`; o controle interno é o `<TextInput>` nativo com style
 * resolvido a partir dos slots da recipe `input`.
 *
 * @see {@link TextInputProps}
 */
export const TextInput = markFieldAware(TextInputComponent);
