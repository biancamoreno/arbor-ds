import { useCallback } from 'react';
import type React from 'react';

export function useComposedRefs<T>(...refs: Array<React.Ref<T>>): React.RefCallback<T> {
  return useCallback((node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = node;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refs);
}
