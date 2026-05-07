import { render, screen } from '@testing-library/react';
import { ArborProvider } from '../ecosystem/styled-system';
import { TextInput } from '../components/input';
import { themeLight } from '../foundations/theme/themeLight';
import { createTheme } from '../foundations/theme/create-theme';
import type { ArborTheme } from '../foundations/theme/Theme';

function getStyleSheets(): string {
  return Array.from(document.head.querySelectorAll('style'))
    .map(node => node.textContent ?? '')
    .join('\n');
}

describe('component-tokens cascade end-to-end (RFC-0040)', () => {
  afterEach(() => {
    document.head.querySelectorAll('style').forEach(node => {
      node.textContent = '';
    });
  });

  it('overriding input.borderRadius emits the new radius in the rendered CSS', () => {
    const overridden = createTheme(themeLight as unknown as ArborTheme, {
      components: { input: { borderRadius: 'huge' } },
    });

    render(
      <ArborProvider theme={overridden}>
        <TextInput data-testid="i" />
      </ArborProvider>,
    );
    const css = getStyleSheets();
    const expectedRadius = String(overridden.radii.huge);
    expect(css).toMatch(new RegExp(`border-radius:\\s*${expectedRadius}`));
    expect(screen.getByTestId('i')).toBeTruthy();
  });

  it('overriding input.colors.background.default emits the new background in the CSS', () => {
    const overridden = createTheme(themeLight as unknown as ArborTheme, {
      components: { input: { colors: { background: { default: 'background.subtle' } } } },
    });

    render(
      <ArborProvider theme={overridden}>
        <TextInput data-testid="i" />
      </ArborProvider>,
    );
    const css = getStyleSheets();
    const subtle = overridden.colors.background.subtle;
    expect(css.toLowerCase()).toContain(subtle.toLowerCase());
  });

  it('overriding component token does not mutate baseTheme', () => {
    const before = themeLight.components.input.borderRadius;
    createTheme(themeLight as unknown as ArborTheme, {
      components: { input: { borderRadius: 'huge' } },
    });
    expect(themeLight.components.input.borderRadius).toBe(before);
  });
});
