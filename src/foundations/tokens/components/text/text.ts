import { fontFamily, fontSize as primFontSize, letterSpacing } from '../../primitives';

const fontSize = {
  xsmall: primFontSize[10],
  sm: primFontSize[14],
  small: primFontSize[16],
  md: primFontSize[18],
  lg: primFontSize[24],
} as const;

type TextStyleProps = {
  fontFamily?: string;
  letterSpacing?: string;
  fontWeight?: number | string;
  fontSize?: number;
  textDecorationLine?: string;
  lineHeight?: string;
  textTransform?: string;
};

export const text: Record<string, TextStyleProps> = {
  body: {
    fontFamily: fontFamily.figtree,
    letterSpacing: letterSpacing.normal,
    fontSize: fontSize.small,
    textDecorationLine: 'none',
    lineHeight: '20px',
    textTransform: 'none',
  },
  bodyHighlight: {
    fontFamily: fontFamily.figtree,
    letterSpacing: letterSpacing.normal,
    fontSize: fontSize.small,
    textDecorationLine: 'none',
    lineHeight: '20px',
    textTransform: 'none',
  },
  caption: {
    fontFamily: fontFamily.figtree,
    letterSpacing: letterSpacing.normal,
    fontSize: fontSize.sm,
    textDecorationLine: 'none',
    lineHeight: '20px',
    textTransform: 'none',
  },
  captionHighlight: {
    fontFamily: fontFamily.figtree,
    letterSpacing: letterSpacing.normal,
    fontSize: fontSize.sm,
    textDecorationLine: 'none',
    lineHeight: '20px',
    textTransform: 'none',
  },
  display1: {
    fontFamily: fontFamily.figtree,
    letterSpacing: letterSpacing.tightest,
    fontSize: fontSize.lg,
    textDecorationLine: 'none',
    lineHeight: '28px',
    textTransform: 'none',
  },
  display2: {
    fontFamily: fontFamily.figtree,
    letterSpacing: letterSpacing.tight,
    fontSize: fontSize.md,
    textDecorationLine: 'none',
    lineHeight: '24px',
    textTransform: 'none',
  },
  display3: {
    fontFamily: fontFamily.figtree,
    letterSpacing: letterSpacing.normal,
    fontSize: fontSize.small,
    textDecorationLine: 'none',
    lineHeight: '20px',
    textTransform: 'none',
  },
  display4: {
    fontFamily: fontFamily.figtree,
    letterSpacing: letterSpacing.normal,
    fontSize: fontSize.sm,
    textDecorationLine: 'none',
    lineHeight: '20px',
    textTransform: 'none',
  },
  subtitle: {
    fontFamily: fontFamily.figtree,
    letterSpacing: letterSpacing.tight,
    fontSize: fontSize.md,
    textDecorationLine: 'none',
    lineHeight: '24px',
    textTransform: 'none',
  },
  tag: {
    fontFamily: fontFamily.figtree,
    letterSpacing: letterSpacing.tight,
    fontSize: fontSize.xsmall,
    textDecorationLine: 'none',
    textTransform: 'uppercase',
  },
  title1: {
    fontFamily: fontFamily.figtree,
    letterSpacing: letterSpacing.tightest,
    fontSize: fontSize.lg,
    textDecorationLine: 'none',
    lineHeight: '28px',
    textTransform: 'none',
  },
  title2: {
    fontFamily: fontFamily.figtree,
    letterSpacing: letterSpacing.tight,
    fontSize: fontSize.md,
    textDecorationLine: 'none',
    lineHeight: '24px',
    textTransform: 'none',
  },
};

export type TextStyle = typeof text;
