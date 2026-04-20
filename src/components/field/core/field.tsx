import { useId } from 'react';
import { ArborTransform, useSlotRecipe } from '../../../ecosystem';
import { FieldContext } from '../context/field-context';
import { FieldLabel } from '../slots/label';
import { FieldControl } from '../slots/control';
import { FieldDescription } from '../slots/description';
import { FieldError } from '../slots/error';
import type { FieldRootProps } from '../interfaces/FieldProps';

function FieldRoot({
  id: idProp,
  isDisabled = false,
  isRequired = false,
  isInvalid = false,
  style,
  children,
}: FieldRootProps) {
  const autoId = useId();
  const fieldId = idProp ?? autoId;
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;

  const slots = useSlotRecipe('field', {});
  const rootStyles = (slots as Record<string, unknown>).root as Record<string, unknown> | undefined;

  return (
    <FieldContext.Provider value={{ fieldId, descriptionId, errorId, isDisabled, isRequired, isInvalid }}>
      <ArborTransform as="div" {...(rootStyles ?? {})} style={style}>
        {children}
      </ArborTransform>
    </FieldContext.Provider>
  );
}

export const Field = Object.assign(FieldRoot, {
  Root: FieldRoot,
  Label: FieldLabel,
  Control: FieldControl,
  Description: FieldDescription,
  Error: FieldError,
});
