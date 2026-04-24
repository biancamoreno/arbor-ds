import type { CSSProperties, ReactNode } from 'react';

/**
 * Canonical API (RFC-0013): `disabled`/`required`/`invalid` — no `is*` prefix,
 * aligned with HTML and Radix/Headless UI. Legacy aliases `isDisabled`/`isRequired`/`isInvalid`
 * are still accepted with a dev-only deprecation warning until the next major.
 */
export type FieldRootProps = {
  id?: string;
  disabled?: boolean;
  required?: boolean;
  invalid?: boolean;
  /** @deprecated Use `disabled` (RFC-0013). */
  isDisabled?: boolean;
  /** @deprecated Use `required` (RFC-0013). */
  isRequired?: boolean;
  /** @deprecated Use `invalid` (RFC-0013). */
  isInvalid?: boolean;
  style?: CSSProperties;
  children: ReactNode;
};

export type FieldLabelProps = {
  children: ReactNode;
};

export type FieldControlProps = {
  children: ReactNode;
};

export type FieldDescriptionProps = {
  children: ReactNode;
};

export type FieldErrorProps = {
  children: ReactNode;
};
