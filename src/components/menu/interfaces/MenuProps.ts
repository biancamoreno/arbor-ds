import type { ReactElement, ReactNode } from 'react';
import type { IconName } from '../../core/icon/interfaces/IconProps';
import type { MenuPlacement } from '../utils/position';

export type { MenuPlacement };

/**
 * @platform shared
 *
 * Menu compound — painel não-modal ancorado ao trigger, similar a Popover, mas
 * com semântica de lista de ações (`role="menu"`/`menuitem`) e navegação por
 * teclado entre itens. Implementação web via Portal + DismissableLayer +
 * FocusScope; implementação nativa em `menu.native.tsx` com `measureInWindow`
 * para ancoragem.
 */
export type MenuRootProps = {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /**
   * Posicionamento padrão do conteúdo em relação ao trigger. Flipa
   * automaticamente para o eixo oposto se não couber no viewport.
   * Default: `'bottom'`.
   */
  placement?: MenuPlacement;
  /** Distância (px) entre trigger e content. Override do tema `menu.offset`. */
  offset?: number;
  /**
   * Rótulo de acessibilidade do menu (React Native canônico). Web mapeia
   * internamente para `aria-label` no container do conteúdo.
   */
  accessibilityLabel?: string;
  /** Descrição adicional de acessibilidade (React Native). */
  accessibilityHint?: string;
  children: ReactNode;
};

export type MenuTriggerProps = {
  children: ReactElement;
  asChild?: boolean;
};

export type MenuContentProps = {
  children: ReactNode;
};

/**
 * Evento de seleção do `Menu.Item`. Chame `event.preventDefault()` no handler
 * para impedir que o menu feche após a seleção — útil para items de toggle
 * (ex: "Mostrar grade") que devem permanecer com o menu aberto.
 */
export type MenuItemSelectEvent = { preventDefault: () => void; defaultPrevented: boolean };

export type MenuItemProps = {
  children: ReactNode;
  /**
   * Callback acionado em clique ou Enter/Space. Recebe um evento com
   * `preventDefault()`; chamando-o, o menu **não** fecha após o select.
   */
  onSelect?: (event: MenuItemSelectEvent) => void;
  disabled?: boolean;
  /**
   * Tom semântico do item. `'critical'` aplica cores de feedback negativo
   * (texto + ícone). Default: `'default'`.
   */
  tone?: 'default' | 'critical';
  /**
   * Ícone opcional no início do item. Aceita `IconName` (string — renderiza
   * `<Icon>` themado por `menu.item.iconSize`/`menu.item.colors.icon`) ou
   * `ReactElement` (controle total do consumer).
   */
  startIcon?: IconName | ReactElement;
  /** Ícone opcional no fim do item — mesmo contrato de `startIcon`. */
  endIcon?: IconName | ReactElement;
};

export type MenuSeparatorProps = Record<string, never>;

export type MenuLabelProps = {
  children: ReactNode;
};
