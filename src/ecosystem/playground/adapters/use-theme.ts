import { useContext } from 'react';
import { type ArborTheme } from '../../../foundations';
import { ArborContext } from './arbor-context';

export const useTheme = () => useContext(ArborContext) as ArborTheme;
