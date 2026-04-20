import { useId } from 'react';
import type { TextStyle } from 'react-native';
import { View, Text as RNText } from 'react-native';
import { FieldContext, useFieldContext } from '../context/field-context';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type {
  FieldRootProps,
  FieldLabelProps,
  FieldControlProps,
  FieldDescriptionProps,
  FieldErrorProps,
} from '../interfaces/FieldProps';

function FieldRoot({
  id: idProp,
  isDisabled = false,
  isRequired = false,
  isInvalid = false,
  children,
}: FieldRootProps) {
  const autoId = useId();
  const fieldId = idProp ?? autoId;
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;

  return (
    <FieldContext.Provider value={{ fieldId, descriptionId, errorId, isDisabled, isRequired, isInvalid }}>
      <View style={{ flexDirection: 'column', gap: 8 }}>{children}</View>
    </FieldContext.Provider>
  );
}

function FieldLabel({ children }: FieldLabelProps) {
  const ctx = useFieldContext();
  const theme = useTheme();

  return (
    <RNText
      accessibilityRole="text"
      style={{
        fontSize: theme.fontSizes.sm,
        fontWeight: theme.fontWeights.medium as TextStyle['fontWeight'],
        color: ctx?.isInvalid ? theme.colors.feedback.critical.base : theme.colors.text.primary,
      }}
    >
      {children}
      {ctx?.isRequired ? ' *' : ''}
    </RNText>
  );
}

function FieldControl({ children }: FieldControlProps) {
  return <View>{children}</View>;
}

function FieldDescription({ children }: FieldDescriptionProps) {
  const ctx = useFieldContext();
  const theme = useTheme();

  return (
    <RNText
      nativeID={ctx?.descriptionId}
      style={{ fontSize: theme.fontSizes.xs, color: theme.colors.text.secondary }}
    >
      {children}
    </RNText>
  );
}

function FieldError({ children }: FieldErrorProps) {
  const ctx = useFieldContext();
  const theme = useTheme();

  if (ctx && !ctx.isInvalid) return null;

  return (
    <RNText
      nativeID={ctx?.errorId}
      accessibilityRole="alert"
      style={{ fontSize: theme.fontSizes.xs, color: theme.colors.feedback.critical.base }}
    >
      {children}
    </RNText>
  );
}

export const Field = Object.assign(FieldRoot, {
  Root: FieldRoot,
  Label: FieldLabel,
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError,
});
