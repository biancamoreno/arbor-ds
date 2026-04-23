import { useId } from 'react';
import { Flex, Box, Text } from '../../core';
import { FieldContext, useFieldContext } from '../context/field-context';
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
      <Flex flexDirection="column" gap="micro">
        {children}
      </Flex>
    </FieldContext.Provider>
  );
}

function FieldLabel({ children }: FieldLabelProps) {
  const ctx = useFieldContext();

  return (
    <Text
      as="span"
      accessibilityRole="text"
      fontSize="sm"
      fontWeight="medium"
      color={ctx?.isInvalid ? 'feedback.critical.base' : 'text.primary'}
    >
      {children}
      {ctx?.isRequired ? ' *' : ''}
    </Text>
  );
}

function FieldControl({ children }: FieldControlProps) {
  return <Box>{children}</Box>;
}

function FieldDescription({ children }: FieldDescriptionProps) {
  const ctx = useFieldContext();

  return (
    <Text
      as="span"
      nativeID={ctx?.descriptionId}
      fontSize="xs"
      color="text.secondary"
    >
      {children}
    </Text>
  );
}

function FieldError({ children }: FieldErrorProps) {
  const ctx = useFieldContext();

  if (ctx && !ctx.isInvalid) return null;

  return (
    <Text
      as="span"
      nativeID={ctx?.errorId}
      accessibilityRole="alert"
      fontSize="xs"
      color="feedback.critical.base"
    >
      {children}
    </Text>
  );
}

export const Field = Object.assign(FieldRoot, {
  Root: FieldRoot,
  Label: FieldLabel,
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError,
});
