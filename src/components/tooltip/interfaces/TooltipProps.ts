import type { ReactElement, ReactNode } from 'react';
import type { TooltipPlacement } from '../context/tooltip-context';

/**
 * @platform shared
 * Tooltip compound construído sobre primitivas cross-platform (`Portal`,
 * `DismissableLayer` — ambas com `.native.tsx`). Sem `tooltip.native.tsx` dedicado.
 */
export type TooltipRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  delay?: number;
  disabled?: boolean;
};

/**
 * Props do `Tooltip` (top-level) — atalho declarativo: `children` é o trigger
 * direto, `label` é o conteúdo do tooltip. Pattern alinhado Mantine/Chakra.
 *
 * @example
 * <Tooltip label="Excluir item">
 *   <IconButton aria-label="Excluir" icon="Trash" />
 * </Tooltip>
 *
 * Para anatomia custom (placement avançado, content rich em ReactNode), use
 * o compound: `<Tooltip.Root>` + `<Tooltip.Trigger />` + `<Tooltip.Content />`.
 */
export type TooltipProps = Omit<TooltipRootProps, 'children'> & {
  /** Conteúdo curto exibido no tooltip. Quando presente, ativa modo plano. */
  label?: ReactNode;
  /** Posicionamento do tooltip relativo ao trigger. @default 'top' */
  placement?: TooltipPlacement;
  /** Largura máxima do tooltip. @default 240 */
  maxWidth?: string | number;
  /**
   * No modo plano: o elemento trigger (botão, ícone) — recebe os handlers de
   * abertura via `cloneElement`. No modo compound: passa direto.
   */
  children: ReactNode;
};

export type TooltipTriggerProps = {
  children: ReactElement;
  asChild?: boolean;
};

export type TooltipContentProps = {
  children: ReactNode;
  placement?: TooltipPlacement;
  maxWidth?: string | number;
};
