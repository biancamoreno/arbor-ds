import { createStyle } from './create-style';
import type { Theme } from '../../../tokens';

const mockTheme = {
  space: { small: 8, medium: 16, large: 24 },
  colors: { primary: '#000', neutral: { 100: '#f5f5f5', 600: '#666' } },
  fontSizes: { sm: 14, md: 16, lg: 20 },
  lineHeights: { sm: 20, md: 24, lg: 28 },
  fontWeights: { regular: '400', bold: '700' },
  radii: { small: 4, medium: 8, large: 12 },
  borderWidths: { 0: 0, 1: 1 },
} as unknown as Theme;

describe('createStyle', () => {
  it('returns empty object for empty props', () => {
    expect(createStyle({}, mockTheme)).toEqual({});
  });

  it('resolves padding token to number', () => {
    const result = createStyle({ padding: 'medium' }, mockTheme);
    expect(result.paddingTop).toBe(16);
    expect(result.paddingBottom).toBe(16);
    expect(result.paddingLeft).toBe(16);
    expect(result.paddingRight).toBe(16);
  });

  it('resolves backgroundColor from theme', () => {
    const result = createStyle({ backgroundColor: 'primary' }, mockTheme);
    expect(result.backgroundColor).toBe('#000');
  });

  it('resolves fontSize token', () => {
    const result = createStyle({ fontSize: 'md' }, mockTheme);
    expect(result.fontSize).toBe(16);
  });

  it('resolves borderRadius token', () => {
    const result = createStyle({ borderRadius: 'medium' }, mockTheme);
    expect(result.borderRadius).toBe(8);
  });

  it('passes through raw number values', () => {
    const result = createStyle({ width: 100 }, mockTheme);
    expect(result.width).toBe(100);
  });
});
