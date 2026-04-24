import type { ComponentType, ElementType } from 'react';

/**
 * Marker that a component fully owns the wiring with `useFieldContext`.
 * Field.Control skips cloneElement injection when this marker is present.
 * See RFC-0014.
 */
export type FieldAwareComponent = {
  isFieldAware?: boolean;
};

/**
 * Declare a component as Field-aware. Attaches the `isFieldAware` marker
 * and returns the component with its original type preserved.
 */
export function markFieldAware<T extends ElementType | ComponentType<unknown>>(
  component: T,
): T {
  (component as unknown as FieldAwareComponent).isFieldAware = true;
  return component;
}

/**
 * Detect whether a component is Field-aware, unwrapping memo/forwardRef.
 */
export function isFieldAwareComponent(type: unknown): boolean {
  if (type == null) return false;
  if (typeof type !== 'function' && typeof type !== 'object') return false;

  const candidate = type as FieldAwareComponent & {
    render?: FieldAwareComponent;
    type?: FieldAwareComponent;
  };
  if (candidate.isFieldAware === true) return true;
  if (candidate.render?.isFieldAware === true) return true;
  if (candidate.type?.isFieldAware === true) return true;
  return false;
}
