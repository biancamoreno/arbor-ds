import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';

type CardBaseProps = {
  children: ReactNode;
  /** Identidade visual. */
  variant?: 'outlined' | 'elevated' | 'flat';
  /** Padding interno aplicado a header/body/footer (SP-1 completo). */
  padding?: 'none' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
  style?: CSSProperties;
};

type CardDecorative = { interactive?: false };

type CardInteractive = {
  /** Quando `true`, Card vira `<button>` (web) ou `<Pressable>` (native). */
  interactive: true;
  onClick: MouseEventHandler<HTMLElement>;
  /** Rótulo acessível. Obrigatório para Card interativo. */
  'aria-label': string;
  /** Alias native — preferido sobre `aria-label` em RN. */
  accessibilityLabel?: string;
};

/**
 * @platform shared
 *
 * Discriminated union: `interactive: true` exige `onClick` + `aria-label`
 * no nível de tipo. Ausente ou `false` = Card decorativo (sem interação).
 */
export type CardRootProps = CardBaseProps & (CardDecorative | CardInteractive);

/**
 * @platform shared
 */
export type CardSectionProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};
