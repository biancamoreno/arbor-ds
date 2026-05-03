/**
 * @platform shared
 *
 * Props do `Counter` — stepper numérico Field-aware. Field-aware: quando
 * aninhado em `<Field>`, herda `disabled` e cabeia aria automaticamente.
 */
export interface CounterProps {
  /** Valor numérico atual. Componente é controlado — o consumidor mantém o estado. */
  value: number;
  /** Disparado a cada mudança (clique nos botões −/+ ou edição do input). */
  onValueChange?: (value: number) => void;
  /**
   * Limite inferior (inclusivo). O botão `−` desabilita ao atingir.
   * @default 0
   */
  min?: number;
  /**
   * Limite superior (inclusivo). O botão `+` desabilita ao atingir.
   * @default 999
   */
  max?: number;
  /**
   * Incremento aplicado por cada clique nos botões `−`/`+`.
   * @default 1
   */
  step?: number;
  /**
   * Texto de label exibido acima do controle (apenas standalone — em `<Field>`
   * use `Field.Label`).
   */
  label?: string;
  /**
   * Tamanho do controle (afeta dimensão dos botões e do input central).
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * Desabilita o controle inteiro. Em `<Field>`, prefira passar `disabled` no
   * `Field.Root`.
   */
  disabled?: boolean;
  /**
   * Quando `true` (default), o valor central é um input editável; quando
   * `false`, é apenas display somente leitura — uso típico em UIs onde a
   * edição livre não faz sentido (carrinho de compras, paginação).
   * @default true
   */
  showInput?: boolean;
}
