import React from 'react';
import { useFieldContext } from '../context/field-context';
import { isFieldAwareComponent } from '../utils/is-field-aware';
import type { FieldControlProps } from '../interfaces/FieldProps';

export function FieldControl({ children }: FieldControlProps) {
  const ctx = useFieldContext();

  if (!ctx || !React.isValidElement(children)) {
    return <>{children}</>;
  }

  if (isFieldAwareComponent(children.type)) {
    return <>{children}</>;
  }

  const { fieldId, descriptionId, errorId, disabled, required, invalid, descriptionRegistered, errorRegistered } = ctx;

  const injectedProps: Record<string, unknown> = { id: fieldId };

  if (descriptionRegistered) injectedProps['aria-describedby'] = descriptionId;
  if (required) injectedProps['aria-required'] = true;
  if (invalid) {
    injectedProps['aria-invalid'] = true;
    if (errorRegistered) injectedProps['aria-errormessage'] = errorId;
  }
  if (disabled) injectedProps['disabled'] = true;

  return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, injectedProps);
}

FieldControl.displayName = 'Field.Control';
