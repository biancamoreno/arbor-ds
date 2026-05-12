import { useEffect } from 'react';
import { ArborTransform, useSlotRecipe } from '../../../ecosystem';
import { useFieldContext } from '../context/field-context';
import type { FieldDescriptionProps } from '../interfaces/FieldProps';

export function FieldDescription({ children }: FieldDescriptionProps) {
  const ctx = useFieldContext();
  const slots = useSlotRecipe('field', { invalid: ctx?.invalid ?? false });
  const descriptionStyles = (slots as Record<string, unknown>).description as Record<string, unknown> | undefined;

  useEffect(() => {
    if (!ctx) return;
    ctx.registerDescription();
    return ctx.unregisterDescription;
  }, [ctx]);

  return (
    <ArborTransform as="p" id={ctx?.descriptionId} {...(descriptionStyles ?? {})}>
      {children}
    </ArborTransform>
  );
}

FieldDescription.displayName = 'Field.Description';
