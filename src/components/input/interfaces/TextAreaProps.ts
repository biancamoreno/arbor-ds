import type { TextareaHTMLAttributes } from 'react';
import type { FieldBaseProps } from './shared';

/**
 * @platform shared
 *
 * Props do `TextArea`. Estende os atributos nativos de `<textarea>` (web) e
 * mapeia para `<TextInput multiline>` RN em native. Field-aware: quando
 * aninhado em `<Field>`, herda `disabled`/`required`/`invalid` do
 * `FieldContext`. Use `rows` (do tipo nativo) para definir a altura inicial.
 */
export interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>,
    FieldBaseProps {
  /**
   * Quando `true` e há `maxLength` definido, exibe contador `<atual> / <máx>`
   * abaixo do controle. A cor muda para crítica quando o uso passa de 90%.
   * Sem efeito se `maxLength` não estiver definido.
   * @default false
   */
  showCharCount?: boolean;
  /**
   * Variante de `onChange` que recebe a `string` já desencapsulada do evento.
   * Disparado em conjunto com `onChange`.
   */
  onValueChange?: (value: string) => void;
  /**
   * Identificador de teste — espelhado em `data-testid` (web) e `testID` (RN).
   */
  testID?: string;
}
