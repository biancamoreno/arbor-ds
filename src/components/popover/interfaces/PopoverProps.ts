import type { ReactElement, ReactNode } from 'react';
import type { PopoverPlacement } from '../utils/position';

export type { PopoverPlacement };

/**
 * @platform shared
 * Popover compound construído sobre primitivas cross-platform (`Portal`,
 * `FocusScope`, `DismissableLayer` — todas com `.native.tsx`) e implementação
 * dedicada em `popover.native.tsx` para posicionamento absoluto via
 * `measureInWindow`.
 */
export type PopoverRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Posicionamento padrão do conteúdo em relação ao trigger. Flipa
   * automaticamente para o eixo oposto se não couber no viewport.
   * Default: `'bottom'`.
   */
  placement?: PopoverPlacement;
  /** Distância (px) entre trigger e popover. Override do tema `popover.offset`. */
  offset?: number;
  /**
   * Rótulo de acessibilidade do popover (React Native canônico). Web mapeia
   * internamente para `aria-label` no container do conteúdo.
   */
  accessibilityLabel?: string;
  /** Descrição adicional de acessibilidade (React Native). */
  accessibilityHint?: string;
  children: ReactNode;
};

export type PopoverTriggerProps = {
  children: ReactElement;
  asChild?: boolean;
};

export type PopoverContentProps = {
  children: ReactNode;
};

export type PopoverCloseProps = {
  children?: ReactNode;
  /**
   * Rótulo de acessibilidade do botão de fechar (React Native canônico).
   * Web mapeia internamente para `aria-label`. Default: `'Fechar'`.
   */
  accessibilityLabel?: string;
};
