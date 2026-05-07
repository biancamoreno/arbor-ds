import { createBrandPalette } from '../src/foundations/theme/create-brand-palette';
import { createTheme } from '../src/foundations/theme/create-theme';
import { themeLight } from '../src/foundations/theme/themeLight';
import type { ArborTheme } from '../src/foundations/theme/Theme';

const violet = createBrandPalette('#7C3AED');
const violetBrand = violet.light;

export const themeProductB: ArborTheme = createTheme(themeLight as unknown as ArborTheme, {
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
