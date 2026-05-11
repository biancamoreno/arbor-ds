import { Box } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import type { TagProps } from '../interfaces';

type TagSlots = 'root' | 'label' | 'icon';

/**
 * @platform shared
 *
 * Badge textual decorativo (não-interativo). Renderiza um `<span>` estilizado
 * com `tone × variant`. Para casos selecionáveis ou removíveis use `Chip`
 * (`selectable: boolean` + `Chip.Remove`, RFC-0033).
 *
 * Anatomia e cor resolvidas pela slot recipe `tag` (RFC-0040 PR1 + TD-034) —
 * produto consumidor consegue override completo via
 * `createTheme({ recipes: { tag: ... }, components: { tag: ... } })`.
 *
 * @see {@link TagProps}
 */
export function Tag({ children, tone = 'neutral', variant = 'outline', className, style }: TagProps) {
  const slots = useSlotRecipe<TagSlots>('tag', { tone, variant });

  return (
    <Box as="span" className={className} style={style} {...slots.root}>
      {children}
    </Box>
  );
}

Tag.displayName = 'Tag';
