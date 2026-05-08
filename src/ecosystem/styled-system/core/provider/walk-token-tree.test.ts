import { themeLight } from '../../../../foundations';
import { walkTokenTree, tokenTreeToCssText } from './walk-token-tree';

describe('walkTokenTree (RFC-0040 PR2)', () => {
  const vars = walkTokenTree(themeLight);

  it('emits color vars including the full 12-step brand scale', () => {
    expect(vars['--arbor-color-brand-1']).toBeDefined();
    expect(vars['--arbor-color-brand-9']).toBe(themeLight.colors.brand.solid);
    expect(vars['--arbor-color-brand-12']).toBeDefined();
  });

  it('exposes focus.ring as --arbor-color-focus-ring', () => {
    expect(vars['--arbor-color-focus-ring']).toBe(themeLight.colors.focus.ring);
  });

  it('emits surface.default as --arbor-color-surface-default', () => {
    expect(vars['--arbor-color-surface-default']).toBe(themeLight.colors.surface.default);
  });

  it('kebab-cases camelCase paths', () => {
    expect(vars['--arbor-color-brand-bg-element']).toBe(themeLight.colors.brand.bgElement);
  });

  it('emits component-token leaves as resolved values', () => {
    expect(vars['--arbor-input-border-radius']).toBe(String(themeLight.radii.small));
    expect(vars['--arbor-button-colors-primary-bg']).toBe(themeLight.colors.interactive.default);
  });

  it('emits radii, spacing, motion vars under their own prefixes', () => {
    expect(vars['--arbor-radii-small']).toBeDefined();
    expect(vars['--arbor-space-medium']).toBeDefined();
    expect(vars['--arbor-motion-duration-fast']).toBeDefined();
    expect(vars['--arbor-motion-easing-standard']).toBeDefined();
  });

  it('passes through literal colors (transparent, hex) without resolving', () => {
    expect(vars['--arbor-button-colors-ghost-bg']).toBe('transparent');
  });
});

describe('tokenTreeToCssText', () => {
  it('serializes vars as a single declaration block body', () => {
    const css = tokenTreeToCssText({ '--a': '1', '--b': '2px' });
    expect(css).toBe('--a:1;--b:2px;');
  });
});
