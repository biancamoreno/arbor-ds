import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Flex, Box, Text } from '../../core';
import { FieldContext, useFieldContext, type FieldContextValue } from '../context/field-context';
import type {
  FieldRootProps,
  FieldLabelProps,
  FieldControlProps,
  FieldDescriptionProps,
  FieldErrorProps,
} from '../interfaces/FieldProps';

const IS_DEV = process.env.NODE_ENV !== 'production';

function warnLegacy(prop: string, replacement: string) {
  if (!IS_DEV) return;
  console.warn(
    `[Arbor-DS][Field] \`${prop}\` is deprecated; use \`${replacement}\` (RFC-0013).`,
  );
}

function FieldRoot({
  id: idProp,
  disabled,
  required,
  invalid,
  isDisabled,
  isRequired,
  isInvalid,
  children,
}: FieldRootProps) {
  const autoId = useId();
  const fieldId = idProp ?? autoId;
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;

  const warnedRef = useRef({ disabled: false, required: false, invalid: false });
  if (IS_DEV) {
    if (isDisabled !== undefined && !warnedRef.current.disabled) {
      warnLegacy('isDisabled', 'disabled');
      warnedRef.current.disabled = true;
    }
    if (isRequired !== undefined && !warnedRef.current.required) {
      warnLegacy('isRequired', 'required');
      warnedRef.current.required = true;
    }
    if (isInvalid !== undefined && !warnedRef.current.invalid) {
      warnLegacy('isInvalid', 'invalid');
      warnedRef.current.invalid = true;
    }
  }

  const effectiveDisabled = disabled ?? isDisabled ?? false;
  const effectiveRequired = required ?? isRequired ?? false;
  const effectiveInvalid = invalid ?? isInvalid ?? false;

  const [descriptionRegistered, setDescriptionRegistered] = useState(0);
  const [errorRegistered, setErrorRegistered] = useState(0);

  const registerDescription = useCallback(() => setDescriptionRegistered((n) => n + 1), []);
  const unregisterDescription = useCallback(() => setDescriptionRegistered((n) => Math.max(0, n - 1)), []);
  const registerError = useCallback(() => setErrorRegistered((n) => n + 1), []);
  const unregisterError = useCallback(() => setErrorRegistered((n) => Math.max(0, n - 1)), []);

  const value = useMemo<FieldContextValue>(
    () => ({
      fieldId,
      descriptionId,
      errorId,
      disabled: effectiveDisabled,
      required: effectiveRequired,
      invalid: effectiveInvalid,
      descriptionRegistered: descriptionRegistered > 0,
      errorRegistered: errorRegistered > 0,
      registerDescription,
      unregisterDescription,
      registerError,
      unregisterError,
    }),
    [
      fieldId,
      descriptionId,
      errorId,
      effectiveDisabled,
      effectiveRequired,
      effectiveInvalid,
      descriptionRegistered,
      errorRegistered,
      registerDescription,
      unregisterDescription,
      registerError,
      unregisterError,
    ],
  );

  return (
    <FieldContext.Provider value={value}>
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
      color={ctx?.invalid ? 'feedback.critical.base' : 'text.primary'}
    >
      {children}
      {ctx?.required ? ' *' : ''}
    </Text>
  );
}

function FieldControl({ children }: FieldControlProps) {
  return <Box>{children}</Box>;
}

function FieldDescription({ children }: FieldDescriptionProps) {
  const ctx = useFieldContext();

  useEffect(() => {
    if (!ctx) return;
    ctx.registerDescription();
    return ctx.unregisterDescription;
  }, [ctx]);

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
  const shouldRender = !ctx || ctx.invalid;

  useEffect(() => {
    if (!ctx || !shouldRender) return;
    ctx.registerError();
    return ctx.unregisterError;
  }, [ctx, shouldRender]);

  if (!shouldRender) return null;

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

FieldRoot.displayName = 'Field.Root';
FieldLabel.displayName = 'Field.Label';
FieldControl.displayName = 'Field.Control';
FieldDescription.displayName = 'Field.Description';
FieldError.displayName = 'Field.Error';

export const Field = Object.assign(FieldRoot, {
  Root: FieldRoot,
  Label: FieldLabel,
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError,
});
