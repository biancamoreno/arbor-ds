import { useCallback, useId, useMemo, useRef, useState } from 'react';
import { ArborTransform, useSlotRecipe } from '../../../ecosystem';
import { FieldContext, type FieldContextValue } from '../context/field-context';
import { FieldLabel } from '../slots/label';
import { FieldControl } from '../slots/control';
import { FieldDescription } from '../slots/description';
import { FieldError } from '../slots/error';
import type { FieldRootProps } from '../interfaces/FieldProps';

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
  style,
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

  const slots = useSlotRecipe('field', {});
  const rootStyles = (slots as Record<string, unknown>).root as Record<string, unknown> | undefined;

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
      <ArborTransform as="div" {...(rootStyles ?? {})} style={style}>
        {children}
      </ArborTransform>
    </FieldContext.Provider>
  );
}

FieldRoot.displayName = 'Field.Root';

export const Field = Object.assign(FieldRoot, {
  Root: FieldRoot,
  Label: FieldLabel,
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError,
});
