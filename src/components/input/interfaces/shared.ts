/**
 * Tamanho dos campos da família Input (`TextInput`, `TextArea`, `Counter`).
 * Mapeia para densidade de padding e fontSize na recipe `input`.
 */
export type FieldSize = 'small' | 'medium' | 'large';

/**
 * Aparência base dos campos da família Input.
 * - `default` — borda visível, fundo `surface.default`.
 * - `filled` — sem borda, fundo `background.subtle` (visual mais leve para
 *   contextos com muitos campos enfileirados).
 */
export type FieldVariant = 'default' | 'filled';

/**
 * Props compartilhadas pelos componentes da família Input quando usados
 * standalone (sem `<Field>` ao redor). Quando aninhados em `Field`, `disabled`
 * é herdado do `FieldContext` e `label`/`error`/`helperText` ficam tipicamente
 * vazios — a label/erro/dica ficam nos slots `Field.Label`/`Field.Error`/
 * `Field.Description`.
 */
export interface FieldBaseProps {
  /**
   * Texto da label do campo (apenas standalone — em `<Field>` use
   * `Field.Label`).
   */
  label?: string;
  /**
   * Mensagem de erro do campo (apenas standalone — em `<Field>` use
   * `Field.Error`). Quando presente, ativa o estado visual de erro.
   */
  error?: string;
  /**
   * Tamanho do controle.
   * @default 'medium'
   */
  size?: FieldSize;
  /**
   * Aparência base.
   * @default 'default'
   */
  variant?: FieldVariant;
  /**
   * Texto auxiliar abaixo do campo (apenas standalone — em `<Field>` use
   * `Field.Description`).
   */
  helperText?: string;
  /**
   * Desabilita o controle. Em `<Field>`, prefira passar `disabled` no
   * `Field.Root`.
   */
  disabled?: boolean;
}
