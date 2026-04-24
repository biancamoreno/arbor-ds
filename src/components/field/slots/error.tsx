import { useEffect } from 'react';
import { ArborTransform, useSlotRecipe } from '../../../ecosystem';
import { useFieldContext } from '../context/field-context';
import type { FieldErrorProps } from '../interfaces/FieldProps';

export function FieldError({ children }: FieldErrorProps) {
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
    <ArborTransform
      as="p"
      id={ctx?.errorId}
      role="alert"
      color="feedback.critical.base"
      {...(errorStyles ?? {})}
    >
      {children}
    </ArborTransform>
  );
}

FieldError.displayName = 'Field.Error';
