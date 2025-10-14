import { lightTheme } from './light'
import { darkTheme } from './dark'

export type ThemeId = 'light' | 'dark'
export type ArborTheme = typeof lightTheme | typeof darkTheme
