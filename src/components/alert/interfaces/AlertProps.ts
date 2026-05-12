import type { CSSProperties, ReactNode } from 'react';
import type { FeedbackTone } from '../../../foundations';

/**
 * @platform shared
 * Mensagem de feedback inline.
 */
export interface AlertRootProps {
  children?: ReactNode;
  /**
   * Subset canônico de `FeedbackTone`. `neutral` cobre nota informativa
   * sem urgência; `brand` cobre anúncio do produto; demais tons mantêm
   * a semântica padrão.
   *
   * @default 'info'
   */
  tone?: FeedbackTone;
  className?: string;
  style?: CSSProperties;
}

/**
 * Props do `Alert` (top-level) — atalho declarativo para o caso comum (90%):
 * renderiza `Icon` (tone-default) + `Title` + `Description` + `Close` (se
 * `onClose` definido) automaticamente.
 *
 * Para layouts não-triviais (ícone custom, ação na descrição, multi-líneas
 * com botões), use o compound: `<Alert.Root>` + `<Alert.Icon />` +
 * `<Alert.Title />` + `<Alert.Description />` + `<Alert.Close />`.
 */
export interface AlertProps extends Omit<AlertRootProps, 'children'> {
  /** Título do alerta. Renderizado em destaque com peso medium. */
  title?: ReactNode;
  /** Descrição/corpo do alerta. */
  description?: ReactNode;
  /** Ícone custom (substitui o ícone tone-default). `ReactNode` (use `<Icon name="..." />`). */
  icon?: ReactNode;
  /** Handler de fechamento — quando definido, renderiza o botão `X` à direita. */
  onClose?: () => void;
  /** Texto a11y do botão de fechamento. @default 'Fechar' */
  closeLabel?: string;
  /**
   * Filhos para o modo compound — só consumido quando todas as props planas
   * (`title`, `description`, `icon`, `onClose`) são undefined.
   */
  children?: ReactNode;
}

export interface AlertIconProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface AlertTitleProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface AlertDescriptionProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface AlertCloseProps {
  /** @default "Fechar" */
  label?: string;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}
