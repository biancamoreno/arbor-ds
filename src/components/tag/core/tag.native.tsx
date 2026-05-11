import { Box, Text } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import type { TagProps } from '../interfaces';

type TagSlots = 'root' | 'label' | 'icon';

/**
 * @platform native
 *
 * Badge textual decorativo (não-interativo) em React Native. `Box` consome a
 * slot recipe `tag` (`tone × variant`) e envolve um `<Text>` cuja cor é
 * herdada do `rootStyles.color` aplicado pela recipe. Sem `Clickable`, sem
 * `accessibilityRole='button'`, sem `accessibilityState`. Para casos
 * interativos use `Chip` (`selectable: boolean`, RFC-0033).
 *
 * @see {@link TagProps}
 */
export function Tag({ children, tone = 'neutral', variant = 'outline', className, style }: TagProps) {
  const slots = useSlotRecipe<TagSlots>('tag', { tone, variant });
  const rootStyles = (slots.root ?? {}) as Record<string, unknown>;
  const textColor = rootStyles.color as string | undefined;

  return (
    <Box className={className} style={style} {...slots.root}>
      <Text color={textColor}>{children}</Text>
    </Box>
  );
}

Tag.displayName = 'Tag';
