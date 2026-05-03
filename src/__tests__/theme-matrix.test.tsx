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

const violetBrand = createBrandPalette({
  primary: '#7C3AED',
  secondary: '#5B21B6',
  accent: '#A855F7',
  subtle: '#EDE9FE',
  soft: '#C4B5FD',
  strong: '#5B21B6',
  hover: '#5B21B6',
  active: '#4C1D95',
});

const productB = createTheme(themeLight as unknown as ArborTheme, {
  mode: 'product-b-light',
  colors: {
    brand: violetBrand,
    interactive: {
      default: violetBrand.primary,
      hover: violetBrand.hover,
      active: violetBrand.active,
    },
    border: { interactive: violetBrand.primary },
    icon: { interactive: violetBrand.primary },
    focus: { ring: violetBrand.primary },
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

describe('multi-product theming matrix', () => {
  it('Button primary uses product B brand color as background', () => {
    render(<Button data-testid="btn">Click</Button>, { wrapper: Wrapper });
    const btn = screen.getByTestId('btn');
    expect(btn.style.backgroundColor).toBe(VIOLET);
  });

  it('Button primary uses product B brand color as border', () => {
    render(<Button data-testid="btn">Click</Button>, { wrapper: Wrapper });
    const btn = screen.getByTestId('btn');
    expect(btn.style.borderColor.toLowerCase()).toBe('#7c3aed');
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
    render(<Card data-testid="card">content</Card>, { wrapper: Wrapper });
    const card = screen.getByTestId('card');
    expect(card).toBeTruthy();
  });

  it('Badge renders within product B without crashing', () => {
    render(<Badge data-testid="badge">3</Badge>, { wrapper: Wrapper });
    expect(screen.getByTestId('badge')).toBeTruthy();
  });

  it('Avatar renders within product B without crashing', () => {
    render(<Avatar data-testid="avatar">X</Avatar>, { wrapper: Wrapper });
    expect(screen.getByTestId('avatar')).toBeTruthy();
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
    expect(themeLight.colors.brand.primary).not.toBe(VIOLET);
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
    expect(productB.colors.focus.ring).toBe(violetBrand.primary);
  });
});
