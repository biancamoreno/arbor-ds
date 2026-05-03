import { Clickable } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import type { TagProps } from '../interfaces';

type TagSlots = 'root' | 'label' | 'icon';

function TagComponent({ children, tone = 'neutral', selected = false, disabled, onClick, className, style }: TagProps) {
  const slots = useSlotRecipe<TagSlots>('tag', { tone, selected: selected ? 'true' : 'false' });

  return (
    <Clickable
      as="button"
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={style}
      {...slots.root}
      cursor={disabled ? 'not-allowed' : 'pointer'}
    >
      {children}
    </Clickable>
  );
}

TagComponent.displayName = 'Tag';

/**
 * @platform shared
 *
 * Pílula clicável simples — variante elementar do `Chip`. Aceita o conjunto
 * canônico `FeedbackTone` (RFC-0032) e `selected` (alterna preenchimento
 * sólido vs. outline). Diferente de `Chip`, não é compound: o conteúdo é
 * flat. Use para tags filtráveis em listas, badges de status interativos ou
 * pílulas de seleção simples. Web expõe `aria-pressed={selected}`; native
 * expõe `accessibilityState.selected`.
 *
 * Anatomia e cor (`tone × selected`) resolvidas pela slot recipe `tag`
 * (TD-034) — produto consumidor consegue override completo via `createTheme`.
 *
 * @see {@link TagProps}
 */
export const Tag = TagComponent;
