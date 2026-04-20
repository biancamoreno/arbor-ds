import React from 'react';
import { useFieldContext } from '../context/field-context';
import type { FieldControlProps } from '../interfaces/FieldProps';

export function FieldControl({ children }: FieldControlProps) {
  const ctx = useFieldContext();

  if (!ctx || !React.isValidElement(children)) {
    return <>{children}</>;
  }

  const { fieldId, descriptionId, errorId, isDisabled, isRequired, isInvalid } = ctx;

  const injectedProps: Record<string, unknown> = {
    id: fieldId,
    'aria-describedby': descriptionId,
  };

  if (isRequired) injectedProps['aria-required'] = true;
  if (isInvalid) {
    injectedProps['aria-invalid'] = true;
    injectedProps['aria-errormessage'] = errorId;
  }
  if (isDisabled) injectedProps['disabled'] = true;

  return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, injectedProps);
}
