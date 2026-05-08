import { render } from '@testing-library/react';
import { ArborProvider } from './provider';
import { themeLight, themeDark } from '../../../../foundations';

const VARS_STYLE_ID = 'arbor-theme-vars';

function readVars(): string {
  return document.getElementById(VARS_STYLE_ID)?.textContent ?? '';
}

describe('ArborProvider — CSS vars emission (RFC-0040 PR2)', () => {
  it('emits the brand scale, focus ring and component tokens into <head>', () => {
    render(
      <ArborProvider theme={themeLight}>
        <div data-testid="x" />
      </ArborProvider>,
    );
    const css = readVars();
    expect(css).toContain('--arbor-color-brand-9:');
    expect(css).toContain('--arbor-color-surface-default:');
    expect(css).toContain('--arbor-color-focus-ring:');
    expect(css).toContain('--arbor-input-border-radius:');
    expect(css).toContain('--arbor-button-colors-primary-bg:');
  });

  it('updates emitted vars when theme prop changes', () => {
    const { rerender } = render(
      <ArborProvider theme={themeLight}>
        <div data-testid="x" />
      </ArborProvider>,
    );
    const lightCss = readVars();
    expect(lightCss).toContain(themeLight.colors.surface.default);

    rerender(
      <ArborProvider theme={themeDark}>
        <div data-testid="x" />
      </ArborProvider>,
    );
    const darkCss = readVars();
    expect(darkCss).toContain(themeDark.colors.surface.default);
    expect(darkCss).not.toBe(lightCss);
  });

  it('emits vars under :root selector so they cascade globally', () => {
    render(
      <ArborProvider theme={themeLight}>
        <div />
      </ArborProvider>,
    );
    const css = readVars();
    expect(css.startsWith(':root{')).toBe(true);
    expect(css.endsWith('}')).toBe(true);
  });
});
