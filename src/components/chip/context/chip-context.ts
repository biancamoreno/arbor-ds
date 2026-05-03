import { createContext, useContext } from 'react';
import type { ChipBaseProps } from './chip-context-types';

export interface ChipContextValue {
  variant: NonNullable<ChipBaseProps['variant']>;
  tone: NonNullable<ChipBaseProps['tone']>;
  selected: boolean;
  disabled: boolean;
  /**
   * Quando `true`, `Chip.Root` foi montado em modo selectable
   * (Clickable + aria-pressed). `Chip.Remove` lê esta flag para evitar
   * nested-button (HTML inválido) — em modo selectable, Remove vira
   * `<span role="button">` com listener Space/Enter próprio.
   *
   * @see RFC-0033
   */
  selectable: boolean;
}

export const ChipContext = createContext<ChipContextValue>({
  variant: 'subtle',
  tone: 'neutral',
  selected: false,
  disabled: false,
  selectable: false,
});

export const useChipContext = () => useContext(ChipContext);
