export type MenuPlacement = 'top' | 'bottom' | 'left' | 'right';

export type Position = { top: number; left: number };

type Rect = { width: number; height: number; top: number; left: number; right: number; bottom: number };

const VIEWPORT_MARGIN = 8;

/**
 * Calcula a posição absoluta (fixed) do Menu relativa ao trigger.
 * Coordenadas já apontam para o canto top/left final do menu — sem `translate`.
 */
export function computePosition(
  trigger: Rect,
  size: { width: number; height: number },
  placement: MenuPlacement,
  offset: number,
): Position {
  switch (placement) {
    case 'top':
      return {
        top: trigger.top - offset - size.height,
        left: trigger.left,
      };
    case 'bottom':
      return {
        top: trigger.bottom + offset,
        left: trigger.left,
      };
    case 'left':
      return {
        top: trigger.top,
        left: trigger.left - offset - size.width,
      };
    case 'right':
      return {
        top: trigger.top,
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
  placement: MenuPlacement,
  offset: number,
  viewport: { width: number; height: number },
): MenuPlacement {
  const fits = (p: MenuPlacement): boolean => {
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

  const opposite: Record<MenuPlacement, MenuPlacement> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  };
  return fits(opposite[placement]) ? opposite[placement] : placement;
}

/**
 * Garante que o menu não saia do viewport — clampa top/left para que o
 * retângulo final fique dentro com `VIEWPORT_MARGIN` de folga em todos os lados.
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

export function getTransformOrigin(placement: MenuPlacement): string {
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
