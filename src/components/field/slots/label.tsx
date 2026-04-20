import { ArborTransform, useSlotRecipe } from '../../../ecosystem';
import { useFieldContext } from '../context/field-context';
import type { FieldLabelProps } from '../interfaces/FieldProps';

export function FieldLabel({ children }: FieldLabelProps) {
  const ctx = useFieldContext();
  const slots = useSlotRecipe('field', {});
  const labelStyles = (slots as Record<string, unknown>).label as Record<string, unknown> | undefined;

  return (
    <ArborTransform
      as="label"
      htmlFor={ctx?.fieldId}
      color={ctx?.isInvalid ? 'feedback.critical.base' : 'text.primary'}
      {...(labelStyles ?? {})}
    >
      {children}
      {ctx?.isRequired && (
        <ArborTransform as="span" color="feedback.critical.base" aria-hidden="true">
          {' *'}
        </ArborTransform>
      )}
    </ArborTransform>
  );
}
