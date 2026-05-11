import { forwardRef, useEffect, type MouseEvent, type MouseEventHandler, type ReactNode, type Ref } from 'react';
import { ArborTransform, useToken } from '../../../../ecosystem';
import type { ArborAs } from '../../../../ecosystem/styled-system/core/transform/props';
import { transition } from '../../../../foundations';
import { type ClickableProps } from '../interfaces';

const NATIVELY_INTERACTIVE = new Set(['button', 'a']);

/**
 * @platform shared
 *
 * Bloco interativo do DS — substituto para `<button>`/`<a>` quando se quer um
 * elemento "clicável" com props styled-system. `as` default é `'button'`; ao
 * trocar por uma tag não-interativa (ex.: `'div'`, `'span'`) é obrigatório
 * passar `role` para preservar a a11y (em desenvolvimento, um `console.warn`
 * lembra).
 *
 * Bake-ins:
 * - `data-arbor-focusable=""` — anel de foco premium via `focus.ring` token.
 * - `disabled` aplica `opacity.disabled`, `cursor: 'not-allowed'`, `pointerEvents: 'none'`
 *   e bloqueia `onClick` independentemente do `as`.
 * - `_active` baseline com leve fade para feedback de press cru (componentes
 *   acima — Button/FAB/Chip — sobrescrevem via recipe).
 *
 * @see {@link ClickableProps}
 */
export const Clickable = forwardRef<HTMLElement, ClickableProps>(function Clickable(
  { as: asProp = 'button', onClick: onClickProp, disabled, children: childrenProp, testID, ...props },
  ref,
) {
  const as = asProp as ArborAs;
  const onClick = onClickProp as MouseEventHandler<HTMLElement> | undefined;
  const children = childrenProp as ReactNode;
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    const tag = typeof as === 'string' ? as : undefined;
    if (tag && !NATIVELY_INTERACTIVE.has(tag) && !props.role) {
      console.warn(
        `[Clickable] as="${tag}" sem prop \`role\` definida. Adicione role="button" (ou semântico) para garantir acessibilidade.`,
      );
    }
  }, [as, props.role]);

  const legacyRef = props.innerRef as Ref<HTMLElement> | undefined;
  const disabledOpacity = useToken('opacity', 'disabled') as number;

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <ArborTransform
      as={as}
      innerRef={ref ?? legacyRef}
      data-testid={testID as string | undefined}
      data-arbor-focusable=""
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      backgroundColor="transparent"
      border="none"
      cursor={disabled ? 'not-allowed' : 'pointer'}
      opacity={disabled ? disabledOpacity : 1}
      pointerEvents={disabled ? 'none' : 'auto'}
      transition={transition(['opacity', 'background-color', 'border-color'], 'fast')}
      _active={disabled ? undefined : { opacity: 0.85 }}
      {...props}
      disabled={disabled}
      onClick={handleClick}
    >
      {children}
    </ArborTransform>
  );
});

Clickable.displayName = 'Clickable';
