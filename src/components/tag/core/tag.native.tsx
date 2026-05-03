import { Clickable, Text } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import type { TagProps } from '../interfaces';

type TagSlots = 'root' | 'label' | 'icon';

/**
 * @platform native
 *
 * `Tag` em React Native — `Clickable.native` com mesmo modelo visual do web.
 * Aceita o conjunto canônico `FeedbackTone` (RFC-0032) e `selected`
 * (preenchimento sólido vs. outline). `disabled` bloqueia o press e propaga
 * em `accessibilityState`. Anatomia e cor resolvidas pela slot recipe `tag`
 * (TD-034).
 *
 * @see {@link TagProps}
 */
export function Tag({ children, tone = 'neutral', selected = false, disabled, onClick, className, style }: TagProps) {
  const slots = useSlotRecipe<TagSlots>('tag', { tone, selected: selected ? 'true' : 'false' });
  const rootStyles = (slots.root ?? {}) as Record<string, unknown>;
  const textColor = rootStyles.color as string | undefined;

  return (
    <Clickable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected, disabled: !!disabled }}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={style}
      {...slots.root}
      display="flex"
      opacity={disabled ? 0.5 : 1}
    >
      <Text fontSize="xsmall" fontWeight="medium" color={textColor}>
        {children}
      </Text>
    </Clickable>
  );
}

Tag.displayName = 'Tag';
