import { createContext } from 'react';
import type { Theme } from '../tokens';

export const ArborContext = createContext<Theme>({} as Theme);
