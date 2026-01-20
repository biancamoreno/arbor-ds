import { createContext } from 'react';
import type { Theme } from '../../styled-system/tokens';

export const ArborContext = createContext<Theme>({} as Theme);
