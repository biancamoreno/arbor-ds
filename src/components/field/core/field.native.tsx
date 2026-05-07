import React, { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { useSlotRecipe } from '../../../ecosystem';
import { Box, Text } from '../../core';
import { FieldContext, useFieldContext, type FieldContextValue } from '../context/field-context';
import { isFieldAwareComponent } from '../utils/is-field-aware';
import type {
  FieldRootProps,
  FieldLabelProps,
  FieldControlProps,
  FieldDescriptionProps,
  FieldErrorProps,
} from '../interfaces/FieldProps';

function FieldRoot({
  id: idProp,
  disabled = false,
  required = false,
  invalid = false,
  style,
  children,
}: FieldRootProps) {
  const autoId = useId();
  const fieldId = idProp ?? autoId;
  const labelId = `${fieldId}-label`;
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;

  const [descriptionRegistered, setDescriptionRegistered] = useState(0);
  const [errorRegistered, setErrorRegistered] = useState(0);

  const registerDescription = useCallback(() => setDescriptionRegistered((n) => n + 1), []);
  const unregisterDescription = useCallback(
    () => setDescriptionRegistered((n) => Math.max(0, n - 1)),
    [],
  );
  const registerError = useCallback(() => setErrorRegistered((n) => n + 1), []);
  const unregisterError = useCallback(() => setErrorRegistered((n) => Math.max(0, n - 1)), []);

  const slots = useSlotRecipe('field', {});
  const rootStyles = (slots as Record<string, unknown>).root as Record<string, unknown> | undefined;

  const value = useMemo<FieldContextValue>(
    () => ({
      fieldId,
      labelId,
      descriptionId,
      errorId,
      disabled,
      required,
      invalid,
      descriptionRegistered: descriptionRegistered > 0,
      errorRegistered: errorRegistered > 0,
      registerDescription,
      unregisterDescription,
      registerError,
      unregisterError,
    }),
    [
      fieldId,
      labelId,
      descriptionId,
      errorId,
      disabled,
      required,
      invalid,
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
      <Box {...(rootStyles ?? {})} style={style as never}>
        {children}
      </Box>
    </FieldContext.Provider>
  );
}

function FieldLabel({ children }: FieldLabelProps) {
  const ctx = useFieldContext();
  const slots = useSlotRecipe('field', {});
  const labelStyles = (slots as Record<string, unknown>).label as Record<string, unknown> | undefined;

  return (
    <Text
      nativeID={ctx?.labelId}
      accessibilityRole="text"
      color={ctx?.invalid ? 'feedback.critical.solid' : 'text.primary'}
      {...(labelStyles ?? {})}
    >
      {children}
      {ctx?.required ? ' *' : ''}
    </Text>
  );
}

function FieldControl({ children }: FieldControlProps) {
  const ctx = useFieldContext();

  if (!ctx || !React.isValidElement(children)) {
    return <>{children}</>;
  }

  if (isFieldAwareComponent(children.type)) {
    return <>{children}</>;
  }

  const { fieldId, labelId, descriptionId, errorId, disabled, invalid, descriptionRegistered, errorRegistered } = ctx;

  const injectedProps: Record<string, unknown> = {
    nativeID: fieldId,
    accessibilityLabelledBy: labelId,
  };

  const a11yState: Record<string, boolean> = {};
  if (disabled) {
    a11yState.disabled = true;
    injectedProps.editable = false;
  }
  if (invalid) {
    injectedProps.accessibilityInvalid = true;
  }
  if (Object.keys(a11yState).length > 0) {
    injectedProps.accessibilityState = a11yState;
  }

  if (descriptionRegistered) {
    const describedBy: string[] = [descriptionId];
    if (invalid && errorRegistered) describedBy.push(errorId);
    injectedProps['aria-describedby'] = describedBy.join(' ');
  } else if (invalid && errorRegistered) {
    injectedProps['aria-describedby'] = errorId;
  }

  return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, injectedProps);
}

function FieldDescription({ children }: FieldDescriptionProps) {
  const ctx = useFieldContext();
  const slots = useSlotRecipe('field', {});
  const descriptionStyles = (slots as Record<string, unknown>).description as
    | Record<string, unknown>
    | undefined;

  useEffect(() => {
    if (!ctx) return;
    ctx.registerDescription();
    return ctx.unregisterDescription;
  }, [ctx]);

  return (
    <Text nativeID={ctx?.descriptionId} color="text.secondary" {...(descriptionStyles ?? {})}>
      {children}
    </Text>
  );
}

function FieldError({ children }: FieldErrorProps) {
  const ctx = useFieldContext();
  const slots = useSlotRecipe('field', {});
  const errorStyles = (slots as Record<string, unknown>).error as Record<string, unknown> | undefined;

  const shouldRender = !ctx || ctx.invalid;

  useEffect(() => {
    if (!ctx || !shouldRender) return;
    ctx.registerError();
    return ctx.unregisterError;
  }, [ctx, shouldRender]);

  if (!shouldRender) return null;

  return (
    <Text
      nativeID={ctx?.errorId}
      accessibilityRole="alert"
      color="feedback.critical.solid"
      {...(errorStyles ?? {})}
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

/**
 * @platform native
 *
 * `Field` em React Native (TD-009 — implementação unificada). Consome o mesmo
 * slot recipe `field` do web e mapeia HTML/ARIA para o equivalente RN:
 * - `htmlFor` → `accessibilityLabelledBy` (via `labelId` no context).
 * - `aria-describedby`/`aria-errormessage` → `accessibilityDescribedBy`
 *   injetado em `FieldControl`.
 * - `id` HTML → `nativeID` em label, description, error e control.
 * - `disabled` → `accessibilityState.disabled` + `editable={false}` para
 *   filhos que expõem `editable`.
 *
 * @see {@link FieldRootProps}
 */
export const Field = Object.assign(FieldRoot, {
  Root: FieldRoot,
  Label: FieldLabel,
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError,
});
