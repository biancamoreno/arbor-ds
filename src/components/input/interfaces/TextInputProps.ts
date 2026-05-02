import type { InputHTMLAttributes, ReactNode } from 'react';
import type { FieldBaseProps } from './shared';

/**
 * @platform shared
 *
 * Props do `TextInput`. Estende os atributos nativos de `<input>` (web) e
 * mapeia para `<TextInput>` RN em native. Field-aware: quando aninhado em
 * `<Field>`, herda `disabled`/`required`/`invalid` do `FieldContext` e cabeia
 * aria/accessibility automaticamente.
 */
export interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, FieldBaseProps {
  /**
   * Nó renderizado à esquerda do controle (normalmente `<Icon>`). Não capta
   * eventos de clique no input em si.
   */
  leftIcon?: ReactNode;
  /**
   * Nó renderizado à direita do controle (normalmente `<Icon>` ou indicador).
   */
  rightIcon?: ReactNode;
  /**
   * Quando `true` e há `value`, renderiza um botão `X` à direita que limpa o
   * conteúdo (dispara `onChange` com value vazio + `onValueChange('')`).
   */
  clearable?: boolean;
  /**
   * Variante de `onChange` que recebe a `string` já desencapsulada do evento.
   * Disparado em conjunto com `onChange` — use um ou outro conforme
   * preferência (controlled vs. derivação).
   */
  onValueChange?: (value: string) => void;
  /**
   * Identificador de teste — espelhado em `data-testid` (web) e `testID` (RN).
   */
  testID?: string;
}
