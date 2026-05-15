import type { ReactElement, ReactNode } from 'react';
import type { TooltipPlacement } from '../context/tooltip-context';

/**
 * @platform shared
 * Tooltip compound construído sobre primitivas cross-platform (`Portal`,
 * `DismissableLayer`). Possui `tooltip.native.tsx` dedicado com long-press gesture.
 */
export type TooltipRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  /**
   * Override numérico (ms) do delay de exibição no hover/focus. Quando ausente,
   * usa o token themable `tooltip.motion.delay.show` (default `motion.duration.slow`).
   */
  delay?: number;
  disabled?: boolean;
  /**
   * Texto que descreve o trigger para leitores de tela (vocabulário canônico RN;
   * mapeia para `aria-label` no web quando relevante). No native, é o rótulo
   * lido pelo TalkBack/VoiceOver ao focar o trigger. No modo plano, default = `label`.
   */
  accessibilityLabel?: string;
  /**
   * Dica adicional sobre a interação. No native, lido após o `accessibilityLabel`.
   * No web, mapeia para o conteúdo do tooltip (via `aria-describedby`).
   */
  accessibilityHint?: string;
};

/**
 * Props do `Tooltip` (top-level) — atalho declarativo: `children` é o trigger
 * direto, `label` é o conteúdo do tooltip. Pattern alinhado Mantine/Chakra.
 *
 * @example
 * <Tooltip label="Excluir item">
 *   <IconButton accessibilityLabel="Excluir" icon="Trash" />
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
  /** Largura máxima do tooltip. @default token `sizes.tooltip.maxWidth` (240px). */
  maxWidth?: string | number;
  /**
   * No modo plano: o elemento trigger (botão, ícone) — recebe os handlers de
   * abertura via `cloneElement`. No modo compound: passa direto.
   */
  children: ReactNode;
};

export type TooltipTriggerProps = {
  children: ReactElement;
  /**
   * Quando `true` (default web), clona o child injetando os handlers diretamente.
   * Quando `false`, embrulha em `<Box as="span">`.
   */
  asChild?: boolean;
  /**
   * (Native only) Vocabulário a11y canônico RN propagado para o `Pressable`
   * trigger. Default = `label` do `Tooltip` no modo plano.
   */
  accessibilityLabel?: string;
  /** (Native only) Dica adicional sobre a interação long-press. */
  accessibilityHint?: string;
};

export type TooltipContentProps = {
  children: ReactNode;
  placement?: TooltipPlacement;
  maxWidth?: string | number;
};
