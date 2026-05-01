import { createBrandPalette } from '../src/foundations/theme/create-brand-palette';
import { createTheme } from '../src/foundations/theme/create-theme';
import { themeLight } from '../src/foundations/theme/themeLight';
import type { ArborTheme } from '../src/foundations/theme/Theme';

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

export const themeProductB: ArborTheme = createTheme(themeLight as unknown as ArborTheme, {
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
