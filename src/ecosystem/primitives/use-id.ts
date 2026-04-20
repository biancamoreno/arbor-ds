import { useId as useReactId } from 'react';

export function useId(): string {
  return useReactId();
}

export function useLayoutId(prefix?: string): string {
  const id = useReactId();
  return prefix ? `${prefix}-${id}` : id;
}
