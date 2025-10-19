import { fontFamily } from '../../semantics';

type TextStyleProps = {
  fontFamily?: string;
  letterSpacing?: number;
  fontWeight?: number | string;
  fontSize?: number;
  textDecorationLine?: string;
  lineHeight?: string;
  textTransform?: string;
};

export const text: Record<string, TextStyleProps> = {
  body: {
    fontFamily: fontFamily.figtree,
    letterSpacing: 0,
    fontSize: 16,
    textDecorationLine: 'none',
    lineHeight: '20px',
    textTransform: 'none',
  },
  bodyHighlight: {
    fontFamily: fontFamily.figtree,
    letterSpacing: 0,
    fontSize: 16,
    textDecorationLine: 'none',
    lineHeight: '20px',
    textTransform: 'none',
  },
  caption: {
    fontFamily: fontFamily.figtree,
    letterSpacing: 0,
    fontSize: 14,
    textDecorationLine: 'none',
    lineHeight: '20px',
    textTransform: 'none',
  },
  captionHighlight: {
    fontFamily: fontFamily.figtree,
    letterSpacing: 0,
    fontSize: 14,
    textDecorationLine: 'none',
    lineHeight: '20px',
    textTransform: 'none',
  },
  display1: {
    fontFamily: fontFamily.figtree,
    letterSpacing: -0.65,
    fontSize: 24,
    textDecorationLine: 'none',
    lineHeight: '28px',
    textTransform: 'none',
  },
  display2: {
    fontFamily: fontFamily.figtree,
    letterSpacing: -0.45,
    fontSize: 18,
    textDecorationLine: 'none',
    lineHeight: '24px',
    textTransform: 'none',
  },
  display3: {
    fontFamily: fontFamily.figtree,
    letterSpacing: 0,
    fontSize: 16,
    textDecorationLine: 'none',
    lineHeight: '20px',
    textTransform: 'none',
  },
  display4: {
    fontFamily: fontFamily.figtree,
    letterSpacing: 0,
    fontSize: 14,
    textDecorationLine: 'none',
    lineHeight: '20px',
    textTransform: 'none',
  },
  subtitle: {
    fontFamily: fontFamily.figtree,
    letterSpacing: -0.45,
    fontSize: 18,
    textDecorationLine: 'none',
    lineHeight: '24px',
    textTransform: 'none',
  },
  tag: {
    fontFamily: fontFamily.figtree,
    letterSpacing: -0.05,
    fontSize: 10,
    textDecorationLine: 'none',
    textTransform: 'uppercase',
  },
  title1: {
    fontFamily: fontFamily.figtree,
    letterSpacing: -0.65,
    fontSize: 24,
    textDecorationLine: 'none',
    lineHeight: '28px',
    textTransform: 'none',
  },
  title2: {
    fontFamily: fontFamily.figtree,
    letterSpacing: -0.45,
    fontSize: 18,
    textDecorationLine: 'none',
    lineHeight: '24px',
    textTransform: 'none',
  },
};

export type TextStyle = typeof text;
