import { useCallback, useRef, useState } from 'react';

export function useControllableState<T>(options: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}): [T, (next: T) => void] {
  const { value, defaultValue, onChange } = options;
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<T>(defaultValue);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) {
        setInternalValue(next);
      }
      onChangeRef.current?.(next);
    },
    [isControlled],
  );

  return [isControlled ? (value as T) : internalValue, setValue];
}
