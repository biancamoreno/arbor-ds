import type { ReactNode } from 'react';

/**
 * Tamanho do compound `Select`. Mapeia para densidade de padding e fontSize
 * dos slots `trigger`/`item` na recipe `select`.
 */
export type SelectSize = 'small' | 'medium' | 'large';

/**
 * @platform shared
 *
 * Props da raiz do compound `Select` (RFC-0020). Em web implementa o padrão
 * WAI-ARIA "Select-Only Combobox" (foco no trigger + `aria-activedescendant`
 * no listbox); em native usa `<Modal>` bottom-sheet RN. Suporta navegação
 * por setas/Home/End/PageUp/PageDown e type-ahead NFD-normalizado
 * (timeout 500ms). Field-aware: quando aninhado em `<Field>`, herda
 * `disabled`/`invalid`/`required` do `FieldContext`.
 */
export interface SelectRootProps {
  /**
   * Valor selecionado (modo controlado). Deve casar com o `value` de algum
   * `Select.Item` filho.
   */
  value?: string;
  /**
   * Valor selecionado inicial (modo uncontrolled). Ignorado quando `value`
   * é informado.
   */
  defaultValue?: string;
  /**
   * Disparado quando o usuário escolhe um item, com o `value` do item
   * selecionado.
   */
  onValueChange?: (value: string) => void;
  /**
   * Desabilita o select inteiro. Em `<Field>`, prefira passar `disabled` no
   * `Field.Root`.
   */
  disabled?: boolean;
  /**
   * ID do trigger. Quando aninhado em `<Field>`, o ID do `FieldContext` tem
   * precedência.
   * @default `useId()`
   */
  id?: string;
  /**
   * Tamanho do compound (afeta densidade do trigger e dos itens).
   * @default 'medium'
   */
  size?: SelectSize;
  /**
   * Slots do compound (`Select.Trigger`, `Select.Content`, `Select.Item`,
   * etc.).
   */
  children: ReactNode;
}

/**
 * @platform shared
 *
 * Props de `Select.Trigger` — botão que abre o listbox e exibe o valor
 * selecionado. Recebe semântica `role="combobox"` em web e
 * `accessibilityRole="combobox"` em native. Por default renderiza
 * `Select.Value` + chevron `Icon`; passe `children` para customizar
 * inteiramente.
 */
export interface SelectTriggerProps {
  /** Conteúdo customizado do trigger. Quando omitido, usa o layout default. */
  children?: ReactNode;
}

/**
 * @platform shared
 *
 * Props de `Select.Value` — exibe o `displayText` do item selecionado dentro
 * do trigger. Quando nada está selecionado, exibe `placeholder`.
 */
export interface SelectValueProps {
  /**
   * Texto exibido quando não há item selecionado (estado inicial). Renderizado
   * com cor de placeholder via recipe.
   */
  placeholder?: string;
}

/**
 * @platform shared
 *
 * Props de `Select.Content` — listbox com os itens selecionáveis. Em web é
 * montado em `Portal` ao abrir; em native vira o conteúdo do `<Modal>`
 * bottom-sheet. O registry de itens é populado pela enumeração JSX (apenas
 * `Select.Item` direto entra no registry; nodes intermediários são
 * permitidos mas não-selecionáveis).
 */
export interface SelectContentProps {
  /** Lista de `Select.Item` (e nodes auxiliares opcionais). */
  children: ReactNode;
}

/**
 * @platform shared
 *
 * Props de um item selecionável dentro de `Select.Content`. Cada item
 * registra-se no compound via `value` (chave única).
 */
export interface SelectItemProps {
  /**
   * Identificador único do item — usado como chave do select e como argumento
   * de `onValueChange` quando este item é escolhido.
   */
  value: string;
  /**
   * Quando `true`, o item é renderizado mas não selecionável (não responde a
   * clique, navegação por seta pula, type-ahead ignora).
   * @default false
   */
  disabled?: boolean;
  /**
   * Texto plano usado pelo `SelectValue` (display) e por type-ahead. Default:
   * extraído recursivamente de `children`. Defina explicitamente quando
   * `children` não for trivial (ex.: contiver `Icon` + texto, ou nodes que
   * não traduzam para string limpa).
   */
  displayText?: string;
  /** Conteúdo visual do item. */
  children: ReactNode;
}

/**
 * @platform shared
 *
 * Item tipado consumido pela API plana `<Select options={...} />` (RFC-0043).
 * Estrutura denominador-comum (Mantine/Chakra-aligned). Para casos exóticos
 * — grupos com sub-headers customizados, ordenação atípica, separadores —
 * use a API compound (`Select.Root`/`Select.Item`).
 */
export interface SelectOption {
  /** Identificador único — passado a `onValueChange` quando selecionado. */
  value: string;
  /** Rótulo principal do item. Pode ser `string` ou `ReactNode`. */
  label: ReactNode;
  /**
   * Item renderizado mas não-selecionável (a11y `aria-disabled`,
   * navegação pula, type-ahead ignora).
   * @default false
   */
  disabled?: boolean;
  /**
   * Texto plano para `Select.Value` e type-ahead. Obrigatório quando
   * `label` não é string. Em dev, se `label` é `ReactNode` e a extração
   * automática resulta em string vazia, um warning é emitido.
   */
  displayText?: string;
  /** Ornamento à esquerda do label (geralmente `Icon`). */
  startSlot?: ReactNode;
  /** Texto secundário abaixo do label (xs, text.secondary). */
  description?: ReactNode;
}

/**
 * @platform shared
 *
 * Props da API plana `Select` (RFC-0043). Migração compound→plano em
 * PCV-22. O caminho recomendado para o caso comum é passar `options[]`;
 * o compound (`Select.Root`/`Select.Trigger`/`Select.Content`/`Select.Item`)
 * permanece exportado e cobre layouts não-triviais (grupos com sub-headers,
 * separadores, anatomia customizada).
 *
 * Discriminação por prop: `options !== undefined || children === undefined`
 * ativa o modo plano; caso contrário, delega aos filhos compound. Modo
 * mixed (passar `options` e filhos compound simultaneamente) é proibido —
 * `options` ganha e os filhos são ignorados.
 */
export interface SelectProps extends Omit<SelectRootProps, 'children'> {
  /** Lista de opções tipadas. Quando definida, ativa o modo plano. */
  options?: SelectOption[];
  /**
   * Texto exibido quando nenhum item está selecionado.
   * @default 'Select...'
   */
  placeholder?: string;
  /**
   * Mensagem exibida quando `options` é uma lista vazia (`[]`). Quando
   * omitido, o listbox abre vazio.
   */
  emptyMessage?: ReactNode;
  /**
   * Slots compound (`Select.Trigger`/`Select.Content`/`Select.Item`).
   * Ignorado quando `options` é definido.
   */
  children?: ReactNode;
}
