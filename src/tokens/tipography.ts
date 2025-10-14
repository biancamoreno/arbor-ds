export const typography = {
  fontFamily: {
    default: "'Inter', sans-serif",
    mono: "'Roboto Mono', monospace",
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.1,
    normal: 1.4,
    relaxed: 1.6,
  },
  letterSpacing: {
    tight: -0.25,
    normal: 0,
    wide: 0.25,
  },
} as const

export type TypographyTokens = typeof typography
