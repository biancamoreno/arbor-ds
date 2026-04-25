import { useCallback, useId, useMemo, useState } from 'react';
import { ArborTransform, useSlotRecipe } from '../../../ecosystem';
import { FieldContext, type FieldContextValue } from '../context/field-context';
import { FieldLabel } from '../slots/label';
import { FieldControl } from '../slots/control';
import { FieldDescription } from '../slots/description';
import { FieldError } from '../slots/error';
import type { FieldRootProps } from '../interfaces/FieldProps';

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
  const unregisterDescription = useCallback(() => setDescriptionRegistered((n) => Math.max(0, n - 1)), []);
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
