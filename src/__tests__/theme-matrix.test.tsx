import { render, screen } from '@testing-library/react';
import { ArborProvider } from '../ecosystem/styled-system';
import { Button } from '../components/button';
import { Switch } from '../components/switch';
import { Card } from '../components/card';
import { Badge } from '../components/badge';
import { Avatar } from '../components/avatar';
import { Chip } from '../components/chip';
import { Spinner } from '../components/spinner';
import { themeLight } from '../foundations/theme/themeLight';
import { createTheme } from '../foundations/theme/create-theme';
import { createBrandPalette } from '../foundations/theme/create-brand-palette';
import type { ArborTheme } from '../foundations/theme/Theme';

const violet = createBrandPalette('#7C3AED');
const violetBrand = violet.light;

const productB = createTheme(themeLight as unknown as ArborTheme, {
  mode: 'product-b-light',
  colors: {
    brand: violetBrand,
    interactive: {
      default: violetBrand.solid,
      hover: violetBrand.solidHover,
      active: violetBrand.textContrast,
    },
    border: { interactive: violetBrand.solid },
    icon: { interactive: violetBrand.solid },
    focus: { ring: violetBrand.solid },
  },
  motion: {
    duration: { fast: '50ms', normal: '120ms' },
  },
  radii: { small: 8, medium: 12 },
});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={productB}>{children}</ArborProvider>;
}

const VIOLET = 'rgb(124, 58, 237)';

function getEmittedCss(): string {
  return Array.from(document.head.querySelectorAll('style')).map(n => n.textContent ?? '').join('\n');
}

describe('multi-product theming matrix', () => {
  it('Button primary uses product B brand color as background', () => {
    render(<Button data-testid="btn">Click</Button>, { wrapper: Wrapper });
    const css = getEmittedCss().toLowerCase();
    expect(css).toMatch(/background-color:\s*(rgb\(124,\s*58,\s*237\)|#7c3aed)/);
  });

  it('Button primary uses product B brand color as border', () => {
    render(<Button data-testid="btn">Click</Button>, { wrapper: Wrapper });
    const css = getEmittedCss().toLowerCase();
    expect(css).toMatch(/border-color:\s*(rgb\(124,\s*58,\s*237\)|#7c3aed)/);
  });

  it('Switch renders within product B without crashing', () => {
    render(<Switch checked onCheckedChange={() => {}} aria-label="t" />, { wrapper: Wrapper });
    expect(screen.getByRole('switch')).toBeTruthy();
  });

  it('Spinner renders within product B without crashing', () => {
    render(<Spinner size="medium" label="loading" />, { wrapper: Wrapper });
    expect(screen.getByLabelText('loading')).toBeTruthy();
  });

  it('Card outlined renders within product B without crashing', () => {
    render(<Card><Card.Body>content</Card.Body></Card>, { wrapper: Wrapper });
    expect(screen.getByText('content')).toBeTruthy();
  });

  it('Badge renders within product B without crashing', () => {
    render(<Badge data-testid="badge">3</Badge>, { wrapper: Wrapper });
    expect(screen.getByTestId('badge')).toBeTruthy();
  });

  it('Avatar renders within product B without crashing', () => {
    render(<Avatar><Avatar.Fallback>X</Avatar.Fallback></Avatar>, { wrapper: Wrapper });
    expect(screen.getByText('X')).toBeTruthy();
  });

  it('Chip renders within product B without crashing', () => {
    render(<Chip><Chip.Label>chip-label</Chip.Label></Chip>, { wrapper: Wrapper });
    expect(screen.getByText('chip-label')).toBeTruthy();
  });

  it('motion override propagates to theme.motion.duration', () => {
    expect(productB.motion.duration.fast).toBe('50ms');
    expect(productB.motion.duration.normal).toBe('120ms');
  });

  it('radii override propagates to theme.radii', () => {
    expect(productB.radii.small).toBe(8);
    expect(productB.radii.medium).toBe(12);
  });

  it('themeLight remains unchanged (createTheme is non-mutating)', () => {
    expect(themeLight.colors.brand.solid).not.toBe(VIOLET);
    expect(themeLight.motion.duration.fast).not.toBe('50ms');
  });

  it('density tokens are exposed in theme.sizes.control', () => {
    expect(productB.sizes.control.small).toBe('32px');
    expect(productB.sizes.control.medium).toBe('40px');
    expect(productB.sizes.control.large).toBe('48px');
  });

  it('density tokens are exposed in theme.sizes.dialog', () => {
    expect(productB.sizes.dialog.small).toBe('420px');
    expect(productB.sizes.dialog.medium).toBe('560px');
    expect(productB.sizes.dialog.large).toBe('720px');
  });

  it('shadow.color is exposed in theme.colors', () => {
    expect(productB.colors.shadow.color).toBeTruthy();
  });

  it('focus.ring is independently overridable from interactive.default', () => {
    const productC = createTheme(themeLight as unknown as ArborTheme, {
      colors: {
        interactive: { default: '#ff0000' },
        focus: { ring: '#00ff00' },
      },
    });
    expect(productC.colors.interactive.default).toBe('#ff0000');
    expect(productC.colors.focus.ring).toBe('#00ff00');
  });

  it('focus.ring propagates to product B theme', () => {
    expect(productB.colors.focus.ring).toBe(violetBrand.solid);
  });

  it('createBrandPalette generates 12-step ColorScale (numeric + nominal)', () => {
    expect(violetBrand[9]).toBe(violetBrand.solid);
    expect(violetBrand[1]).toBe(violetBrand.bg);
    expect(violetBrand[12]).toBe(violetBrand.textContrast);
    expect(violet.dark[9]).toBeTruthy();
  });

  describe('component-tokens override (RFC-0040)', () => {
    it('input.borderRadius override propagates to recipe', () => {
      const t = createTheme(themeLight as unknown as ArborTheme, {
        components: { input: { borderRadius: 'large' } },
      });
      expect(t.components.input.borderRadius).toBe('large');
    });

    it('button.colors.primary.bg override propagates to recipe', () => {
      const t = createTheme(themeLight as unknown as ArborTheme, {
        components: { button: { colors: { primary: { bg: 'feedback.success.solid' } } } },
      });
      expect(t.components.button.colors.primary.bg).toBe('feedback.success.solid');
    });

    it('card.padding.medium override propagates to recipe', () => {
      const t = createTheme(themeLight as unknown as ArborTheme, {
        components: { card: { padding: { medium: 'huge' } } },
      });
      expect(t.components.card.padding.medium).toBe('huge');
    });

    it('field.control.minHeight override propagates to recipe', () => {
      const t = createTheme(themeLight as unknown as ArborTheme, {
        components: { field: { control: { minHeight: { medium: 'control.large' } } } },
      });
      expect(t.components.field.control.minHeight.medium).toBe('control.large');
    });

    it('tabs.trigger.fontWeight.active override propagates to recipe', () => {
      const t = createTheme(themeLight as unknown as ArborTheme, {
        components: { tabs: { trigger: { fontWeight: { active: 'bold' } } } },
      });
      expect(t.components.tabs.trigger.fontWeight.active).toBe('bold');
    });

    it('dialog.borderRadius override propagates to recipe', () => {
      const t = createTheme(themeLight as unknown as ArborTheme, {
        components: { dialog: { borderRadius: 'small' } },
      });
      expect(t.components.dialog.borderRadius).toBe('small');
    });

    it('baseTheme.components.input is not mutated by override', () => {
      const before = themeLight.components.input.borderRadius;
      createTheme(themeLight as unknown as ArborTheme, {
        components: { input: { borderRadius: 'huge' } },
      });
      expect(themeLight.components.input.borderRadius).toBe(before);
    });
  });
});
