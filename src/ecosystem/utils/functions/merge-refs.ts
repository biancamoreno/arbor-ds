import type { MutableRefObject, Ref, RefCallback } from 'react';

export function mergeRefs<T>(...refs: Array<Ref<T> | undefined | null>): RefCallback<T> {
  return (value: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') {
        ref(value);
      } else {
        (ref as MutableRefObject<T | null>).current = value;
      }
    }
  };
}
