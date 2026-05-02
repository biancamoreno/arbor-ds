import type { CSSProperties, ReactNode } from 'react';

/**
 * @platform shared
 *
 * Props da raiz do compound `Field`. `Field.Root` estabelece um `FieldContext`
 * com IDs auto-gerados (`labelId`/`descriptionId`/`errorId`) que os slots
 * compound consomem para cabear `aria-labelledby`/`aria-describedby`/
 * `aria-errormessage` corretamente. Os states `disabled`/`required`/`invalid`
 * cascateiam para qualquer descendente Field-aware.
 */
export type FieldRootProps = {
  /**
   * ID base do campo. Quando informado, é usado como prefixo dos IDs de
   * label/description/error e como `htmlFor` da label.
   * @default `useId()`
   */
  id?: string;
  /**
   * Desabilita o campo inteiro: cascateia para todos os descendentes
   * Field-aware via `FieldContext`.
   * @default false
   */
  disabled?: boolean;
  /**
   * Marca o campo como obrigatório: descendentes Field-aware aplicam
   * `aria-required` no controle interno.
   * @default false
   */
  required?: boolean;
  /**
   * Marca o campo como inválido: descendentes Field-aware aplicam
   * `aria-invalid` e `aria-errormessage` (quando `Field.Error` está montado).
   * @default false
   */
  invalid?: boolean;
  /** Escape hatch para overrides finos no container do `Field.Root`. */
  style?: CSSProperties;
  /** Slots filhos do compound (`Field.Label`, `Field.Control`, etc.). */
  children: ReactNode;
};

/**
 * @platform shared
 *
 * Props de `Field.Label`. Renderiza como `<label htmlFor={fieldId}>` em web e
 * usa `nativeID`/`accessibilityLabelledBy` em native. Recebe ID auto-gerado
 * pelo `FieldContext`.
 */
export type FieldLabelProps = {
  /** Conteúdo da label (texto ou nó com formatação inline). */
  children: ReactNode;
};

/**
 * @platform shared
 *
 * Props de `Field.Control`. Wrapper semântico do controle de entrada
 * (TextInput, TextArea, Counter, Checkbox, Radio, Switch, Select, FileUpload).
 * O controle real é o `children`; `Field.Control` apenas garante a aresta
 * visual do recipe `field`.
 */
export type FieldControlProps = {
  /** Componente de controle Field-aware (ex.: `<TextInput />`, `<Select />`). */
  children: ReactNode;
};

/**
 * @platform shared
 *
 * Props de `Field.Description`. Renderiza texto auxiliar abaixo do controle e
 * registra-se no `FieldContext` para que o controle aplique
 * `aria-describedby={descriptionId}`. Some automaticamente do
 * `aria-describedby` quando não montado.
 */
export type FieldDescriptionProps = {
  /** Texto descritivo curto (instruções, formato esperado, dica). */
  children: ReactNode;
};

/**
 * @platform shared
 *
 * Props de `Field.Error`. Renderiza mensagem de erro abaixo do controle e
 * registra-se no `FieldContext` para que o controle aplique
 * `aria-errormessage={errorId}` quando o campo é `invalid`. Geralmente
 * renderizada condicionalmente: `{error && <Field.Error>{error}</Field.Error>}`.
 */
export type FieldErrorProps = {
  /** Texto da mensagem de erro. */
  children: ReactNode;
};
