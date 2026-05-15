import type { CSSProperties, ReactNode } from 'react';

interface AccordionRootCommonProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * @platform shared
 *
 * Accordion (compound). Discriminated union por `type`:
 *
 * - `type: 'single'` (default): apenas um item aberto. `value`/`defaultValue`
 *   são `string`. `collapsible` (default `true`) permite fechar o item ativo
 *   clicando nele de novo. `onValueChange(value: string)` recebe `''` quando
 *   nada está aberto.
 * - `type: 'multiple'`: vários itens podem coexistir abertos. `value`/
 *   `defaultValue` são `string[]`. `onValueChange(value: string[])`.
 *
 * Web: keyboard nav (`ArrowUp`/`ArrowDown`/`Home`/`End`), foco visível WCAG e
 * grid-row animation. Native: render condicional do `Content` + chevron swap.
 */
export type AccordionRootProps =
  | (AccordionRootCommonProps & {
      type?: 'single';
      value?: string;
      defaultValue?: string;
      onValueChange?: (value: string) => void;
      /** Permite fechar o item ativo. Default: `true`. */
      collapsible?: boolean;
    })
  | (AccordionRootCommonProps & {
      type: 'multiple';
      value?: string[];
      defaultValue?: string[];
      onValueChange?: (value: string[]) => void;
    });

/** @platform shared */
export interface AccordionItemProps {
  children: ReactNode;
  /** Identificador único do item dentro do `Accordion`. */
  value: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

/** @platform shared */
export interface AccordionTriggerProps {
  children: ReactNode;
  /**
   * Ícone (ou qualquer ReactNode) renderizado à esquerda do label. Anatomia fixa
   * `[startIcon | label | chevron]`. Cross-platform — passe `<Icon name="..." />`
   * do DS para resolver tamanho e cor por tema.
   */
  startIcon?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/** @platform shared */
export interface AccordionContentProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}
