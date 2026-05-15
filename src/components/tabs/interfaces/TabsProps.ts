import type { CSSProperties, ReactNode } from 'react';

/** @platform shared */
export type TabsVariant = 'underline' | 'pill';

/** @platform shared */
export type TabsSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';

/** @platform shared */
export type TabsOrientation = 'horizontal' | 'vertical';

/** @platform shared */
export type TabsIndicatorPosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * @platform shared
 *
 * `Tabs` compound. `Root` controla o `value` ativo (controlled/uncontrolled)
 * e `orientation`. `List` agrupa os triggers e dona da identidade visual
 * (`variant`, `size`, `fullWidth`). `Trigger` é cada aba; `Content` é o
 * painel revelado quando `value` casa com o trigger ativo.
 *
 * Web: keyboard nav `ArrowUp/Down/Left/Right` (de acordo com `orientation`),
 * `Home`/`End`, foco visível WCAG 2.4.7 no Trigger e no Content.
 * Native: touch-only com `accessibilityRole='tab'/'tablist'`.
 */
export interface TabsRootProps {
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: TabsOrientation;
  className?: string;
  style?: CSSProperties;
}

/** @platform shared */
export interface TabsListProps {
  children: ReactNode;
  /** Identidade visual do grupo. Default: `'underline'`. */
  variant?: TabsVariant;
  /** Tamanho aplicado a todos os triggers do grupo. Default: `'medium'`. */
  size?: TabsSize;
  /** Distribui os triggers para preencher a largura disponível (`flex: 1` em cada). */
  fullWidth?: boolean;
  /**
   * Posição do indicador (slot `indicator`) quando `variant='underline'`.
   * Default: `'bottom'` em horizontal; `'right'` em vertical. Em
   * `variant='pill'` é ignorado (indicator cobre todo o trigger ativo).
   */
  indicatorPosition?: TabsIndicatorPosition;
  className?: string;
  style?: CSSProperties;
}

/** @platform shared */
export interface TabsTriggerProps {
  /**
   * Conteúdo livre do trigger. O Trigger envolve `children` num container
   * interno (`triggerContent`) com `inline-flex + gap` — composição livre
   * de texto, ícones, badges, contadores, etc. O **indicador de estado
   * ativo** (slot `indicator`) acompanha este container, não o button
   * inteiro (que tem padding).
   *
   * @example
   * <Tabs.Trigger value="inbox">
   *   <Icon name="Mail" size="small" decorative />
   *   Caixa de entrada
   *   <Badge tone="info">12</Badge>
   * </Tabs.Trigger>
   */
  children: ReactNode;
  /** Identificador único — deve casar com o `value` de um `Tabs.Content`. */
  value: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** @platform shared */
export interface TabsContentProps {
  children: ReactNode;
  value: string;
  className?: string;
  style?: CSSProperties;
}
