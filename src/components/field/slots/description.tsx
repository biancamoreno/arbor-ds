import { ArborTransform, useSlotRecipe } from '../../../ecosystem';
import { useFieldContext } from '../context/field-context';
import type { FieldDescriptionProps } from '../interfaces/FieldProps';

export function FieldDescription({ children }: FieldDescriptionProps) {
  const ctx = useFieldContext();
  const slots = useSlotRecipe('field', {});
  const descriptionStyles = (slots as Record<string, unknown>).description as Record<string, unknown> | undefined;

  return (
    <ArborTransform
      as="p"
      id={ctx?.descriptionId}
      color="text.secondary"
      {...(descriptionStyles ?? {})}
    >
      {children}
    </ArborTransform>
  );
}
