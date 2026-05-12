import { ArborTransform, useSlotRecipe } from '../../../ecosystem';
import { useFieldContext } from '../context/field-context';
import type { FieldLabelProps } from '../interfaces/FieldProps';

export function FieldLabel({ children }: FieldLabelProps) {
  const ctx = useFieldContext();
  const slots = useSlotRecipe('field', { invalid: ctx?.invalid ?? false });
  const labelStyles = (slots as Record<string, unknown>).label as Record<string, unknown> | undefined;
  const requiredStyles = (slots as Record<string, unknown>).requiredIndicator as
    | Record<string, unknown>
    | undefined;

  return (
    <ArborTransform as="label" htmlFor={ctx?.fieldId} {...(labelStyles ?? {})}>
      {children}
      {ctx?.required && (
        <ArborTransform as="span" aria-hidden="true" {...(requiredStyles ?? {})}>
          {' *'}
        </ArborTransform>
      )}
    </ArborTransform>
  );
}

FieldLabel.displayName = 'Field.Label';
