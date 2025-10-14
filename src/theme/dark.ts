import * as tokens from '../tokens'

export const darkTheme = {
  name: 'dark',
  colors: {
    ...tokens.colors,
    background: '#111111',
    text: '#FFFFFF',
    primary: '#3388FF',
  },
  spacing: tokens.spacing,
  typography: tokens.typography,
  radii: tokens.radii,
  // opacity: tokens.opacity,
} as const
