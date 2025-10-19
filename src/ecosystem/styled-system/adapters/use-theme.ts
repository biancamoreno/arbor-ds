import { useTheme as SCUseTheme } from 'styled-components';
import { type ArborTheme } from '../../../foundations';

export const useTheme = SCUseTheme as unknown as () => ArborTheme;
