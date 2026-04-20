import { createContext, useContext } from 'react';
import type { ChipRootProps } from '../interfaces';

export interface ChipContextValue {
  variant: NonNullable<ChipRootProps['variant']>;
  tone: NonNullable<ChipRootProps['tone']>;
  selected: boolean;
  disabled: boolean;
}

export const ChipContext = createContext<ChipContextValue>({
  variant: 'subtle',
  tone: 'neutral',
  selected: false,
  disabled: false,
});

export const useChipContext = () => useContext(ChipContext);
