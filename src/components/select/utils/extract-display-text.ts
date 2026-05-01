import { Children, isValidElement, type ReactNode } from 'react';

export function extractDisplayText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);

  if (Array.isArray(node)) {
    return node.map(extractDisplayText).join('').trim();
  }

  if (isValidElement(node)) {
    const children = (node.props as { children?: ReactNode }).children;
    if (children !== undefined) {
      return Children.toArray(children).map(extractDisplayText).join('').trim();
    }
  }

  return '';
}

const DIACRITICS_RANGE = /[̀-ͯ]/g;

export function normalizeForTypeahead(value: string): string {
  return value.normalize('NFD').replace(DIACRITICS_RANGE, '').toLowerCase();
}
