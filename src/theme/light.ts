import * as tokens from '../tokens'

export const lightTheme = {
  name: 'light',
  colors: {
    ...tokens.colors,
  },
  spacing: tokens.spacing,
  typography: tokens.typography,
  radii: tokens.radii,
//   opacity: tokens.opacity,
} as const
