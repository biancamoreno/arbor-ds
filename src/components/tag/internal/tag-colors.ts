import type { TagProps } from '../interfaces';

/**
 * Resolve cores semânticas (alias strings) por combinação `tone × selected`.
 * Compartilhado por `tag.tsx` (web) e `tag.native.tsx` para evitar drift visual.
 */
export type TagColors = {
  backgroundColor: string;
  borderColor: string;
  color: string;
};

export function getTagColors(selected: boolean, tone: TagProps['tone'] = 'neutral'): TagColors {
  if (tone === 'brand') {
    return selected
      ? { backgroundColor: 'brand.base', borderColor: 'brand.base', color: 'text.inverse' }
      : { backgroundColor: 'brand.subtle', borderColor: 'brand.soft', color: 'brand.strong' };
  }

  return selected
    ? { backgroundColor: 'text.primary', borderColor: 'text.primary', color: 'text.inverse' }
    : { backgroundColor: 'surface.default', borderColor: 'border.default', color: 'text.primary' };
}
