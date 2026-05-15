import type { TooltipPlacement } from '../context/tooltip-context';

export type Position = { top: number; left: number };

type Rect = { width: number; height: number; top: number; left: number; right: number; bottom: number };

const VIEWPORT_MARGIN = 8;

/**
 * Calcula a posição absoluta (fixed) do tooltip considerando o `placement`
 * pedido. A coordenada retornada já assume o transform de centralização
 * aplicado no consumidor (`translate(-50%, -100%)` em `top`, etc.).
 */
export function computePosition(rect: Rect, placement: TooltipPlacement, offset: number): Position {
  switch (placement) {
    case 'right':
      return { top: rect.top + rect.height / 2, left: rect.right + offset };
    case 'bottom':
      return { top: rect.bottom + offset, left: rect.left + rect.width / 2 };
    case 'left':
      return { top: rect.top + rect.height / 2, left: rect.left - offset };
    case 'top':
    default:
      return { top: rect.top - offset, left: rect.left + rect.width / 2 };
  }
}

/**
 * Decide se o `placement` original cabe no viewport, considerando o tamanho
 * estimado do tooltip. Quando não cabe, retorna o eixo oposto (flip).
 */
export function resolvePlacement(
  triggerRect: Rect,
  tooltipSize: { width: number; height: number },
  placement: TooltipPlacement,
  offset: number,
  viewport: { width: number; height: number },
): TooltipPlacement {
  const fits = (p: TooltipPlacement): boolean => {
    switch (p) {
      case 'top':
        return triggerRect.top - offset - tooltipSize.height >= VIEWPORT_MARGIN;
      case 'bottom':
        return triggerRect.bottom + offset + tooltipSize.height <= viewport.height - VIEWPORT_MARGIN;
      case 'left':
        return triggerRect.left - offset - tooltipSize.width >= VIEWPORT_MARGIN;
      case 'right':
        return triggerRect.right + offset + tooltipSize.width <= viewport.width - VIEWPORT_MARGIN;
    }
  };

  if (fits(placement)) return placement;

  const opposite: Record<TooltipPlacement, TooltipPlacement> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left',
  };
  return fits(opposite[placement]) ? opposite[placement] : placement;
}

/**
 * Após posicionamento, aplica clamp dentro do viewport para evitar que o
 * tooltip saia da tela horizontalmente/verticalmente (ex.: trigger próximo
 * à borda esquerda com `placement='top'` deslocaria o tooltip para fora).
 */
export function clampPosition(
  position: Position,
  placement: TooltipPlacement,
  tooltipSize: { width: number; height: number },
  viewport: { width: number; height: number },
): Position {
  let { top, left } = position;

  if (placement === 'top' || placement === 'bottom') {
    const halfW = tooltipSize.width / 2;
    const minLeft = VIEWPORT_MARGIN + halfW;
    const maxLeft = viewport.width - VIEWPORT_MARGIN - halfW;
    left = Math.max(minLeft, Math.min(maxLeft, left));
  } else {
    const halfH = tooltipSize.height / 2;
    const minTop = VIEWPORT_MARGIN + halfH;
    const maxTop = viewport.height - VIEWPORT_MARGIN - halfH;
    top = Math.max(minTop, Math.min(maxTop, top));
  }

  return { top, left };
}

export function getTransform(placement: TooltipPlacement, scale: number): string {
  const base = ((): string => {
    switch (placement) {
      case 'right': return 'translate(0, -50%)';
      case 'bottom': return 'translate(-50%, 0)';
      case 'left': return 'translate(-100%, -50%)';
      case 'top':
      default: return 'translate(-50%, -100%)';
    }
  })();
  return `${base} scale(${scale})`;
}

export function getTransformOrigin(placement: TooltipPlacement): string {
  switch (placement) {
    case 'right': return 'left center';
    case 'bottom': return 'top center';
    case 'left': return 'right center';
    case 'top':
    default: return 'bottom center';
  }
}
