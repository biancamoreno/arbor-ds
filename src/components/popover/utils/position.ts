export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';

export type Position = { top: number; left: number };

type Rect = { width: number; height: number; top: number; left: number; right: number; bottom: number };

const VIEWPORT_MARGIN = 8;

/**
 * Calcula a posição absoluta (fixed) do Popover relativa ao trigger.
 * Não aplica `translate(...)` — coordenadas já apontam para o canto top/left
 * final do popover.
 */
export function computePosition(
  trigger: Rect,
  size: { width: number; height: number },
  placement: PopoverPlacement,
  offset: number,
): Position {
  switch (placement) {
    case 'top':
      return {
        top: trigger.top - offset - size.height,
        left: trigger.left + (trigger.width - size.width) / 2,
      };
    case 'bottom':
      return {
        top: trigger.bottom + offset,
        left: trigger.left + (trigger.width - size.width) / 2,
      };
    case 'left':
      return {
        top: trigger.top + (trigger.height - size.height) / 2,
        left: trigger.left - offset - size.width,
      };
    case 'right':
      return {
        top: trigger.top + (trigger.height - size.height) / 2,
        left: trigger.right + offset,
      };
  }
}

/**
 * Verifica se o `placement` pedido cabe no viewport. Se não couber, flipa
 * para o eixo oposto. Se nenhum dos dois couber, mantém o original (clamp
 * fará o ajuste final).
 */
export function resolvePlacement(
  trigger: Rect,
  size: { width: number; height: number },
  placement: PopoverPlacement,
  offset: number,
  viewport: { width: number; height: number },
): PopoverPlacement {
  const fits = (p: PopoverPlacement): boolean => {
    switch (p) {
      case 'top':
        return trigger.top - offset - size.height >= VIEWPORT_MARGIN;
      case 'bottom':
        return trigger.bottom + offset + size.height <= viewport.height - VIEWPORT_MARGIN;
      case 'left':
        return trigger.left - offset - size.width >= VIEWPORT_MARGIN;
      case 'right':
        return trigger.right + offset + size.width <= viewport.width - VIEWPORT_MARGIN;
    }
  };

  if (fits(placement)) return placement;

  const opposite: Record<PopoverPlacement, PopoverPlacement> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  };
  return fits(opposite[placement]) ? opposite[placement] : placement;
}

/**
 * Garante que o popover não saia do viewport — clampa top/left para que o
 * retângulo final fique dentro com `VIEWPORT_MARGIN` de folga em todos os
 * lados.
 */
export function clampPosition(
  position: Position,
  size: { width: number; height: number },
  viewport: { width: number; height: number },
): Position {
  const minLeft = VIEWPORT_MARGIN;
  const maxLeft = viewport.width - VIEWPORT_MARGIN - size.width;
  const minTop = VIEWPORT_MARGIN;
  const maxTop = viewport.height - VIEWPORT_MARGIN - size.height;

  return {
    top: Math.max(minTop, Math.min(maxTop, position.top)),
    left: Math.max(minLeft, Math.min(maxLeft, position.left)),
  };
}

export function getTransformOrigin(placement: PopoverPlacement): string {
  switch (placement) {
    case 'top':
      return 'center bottom';
    case 'bottom':
      return 'center top';
    case 'left':
      return 'right center';
    case 'right':
      return 'left center';
  }
}
