import {
  makeColorScale,
  makeDarkColorScale,
  type ColorPrimitiveScale,
  type ColorScale,
} from '../tokens/semantics/color/scale';

/**
 * Gera as 12 famílias themable (light + dark) a partir de uma cor de marca.
 *
 * A cor de entrada é interpretada como `solid` (step 9) — o tom de fundo de
 * componentes sólidos (Button primary, FAB, switch ON). A função interpola com
 * branco/preto em sRGB para gerar os demais 11 steps com luminosidade decrescente.
 *
 * Ergonomia em produto:
 *
 * ```ts
 * const brand = createBrandPalette('#7C3AED');
 * createTheme(themeLight, { colors: { brand: brand.light } });
 * createTheme(themeDark,  { colors: { brand: brand.dark  } });
 * ```
 *
 * O override por step específico (quando a curva HSL/sRGB não satisfaz a
 * calibração desejada de um tom) deve ser feito pós-fato via
 * `extendTheme()` ou re-atribuição direta de chave em `createTheme()`.
 */
export type CreateBrandPaletteOptions = {
  /** Override pontual de um step específico no resultado light. */
  light?: Partial<ColorPrimitiveScale>;
  /** Override pontual de um step específico no resultado dark. */
  dark?: Partial<ColorPrimitiveScale>;
};

export type CreateBrandPaletteResult = {
  light: ColorScale;
  dark: ColorScale;
};

const WHITE = '#FFFFFF';
const BLACK = '#000000';

type StepKey = keyof ColorPrimitiveScale;

const STEP_TINTS: Array<{ step: StepKey; mix: 'white' | 'black' | 'self'; t: number }> = [
  { step: 10,  mix: 'white', t: 0.97 },
  { step: 20,  mix: 'white', t: 0.92 },
  { step: 30,  mix: 'white', t: 0.85 },
  { step: 40,  mix: 'white', t: 0.75 },
  { step: 50,  mix: 'white', t: 0.65 },
  { step: 60,  mix: 'white', t: 0.50 },
  { step: 70,  mix: 'white', t: 0.30 },
  { step: 80,  mix: 'white', t: 0.15 },
  { step: 90,  mix: 'self',  t: 0    },
  { step: 100, mix: 'black', t: 0.20 },
  { step: 110, mix: 'black', t: 0.55 },
  { step: 120, mix: 'black', t: 0.75 },
];

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace(/^#/, '');
  const full = cleaned.length === 3
    ? cleaned.split('').map((c) => c + c).join('')
    : cleaned;
  const num = Number.parseInt(full, 16);
  return {
    r: (num >> 16) & 0xff,
    g: (num >> 8) & 0xff,
    b: num & 0xff,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (v: number) => clamp(v).toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function lerp(from: string, to: string, t: number): string {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  return rgbToHex(
    a.r + (b.r - a.r) * t,
    a.g + (b.g - a.g) * t,
    a.b + (b.b - a.b) * t,
  );
}

export function generatePrimitiveScale(solid: string): ColorPrimitiveScale {
  const result = {} as ColorPrimitiveScale;
  STEP_TINTS.forEach(({ step, mix, t }) => {
    if (mix === 'self') {
      result[step] = solid.toUpperCase();
    } else if (mix === 'white') {
      result[step] = lerp(solid, WHITE, t);
    } else {
      result[step] = lerp(solid, BLACK, t);
    }
  });
  return result;
}

export function createBrandPalette(
  solid: string,
  options: CreateBrandPaletteOptions = {},
): CreateBrandPaletteResult {
  const lightPrimitive: ColorPrimitiveScale = {
    ...generatePrimitiveScale(solid),
    ...options.light,
  };
  const darkPrimitive: ColorPrimitiveScale = options.dark
    ? { ...generatePrimitiveScale(solid), ...options.dark }
    : generatePrimitiveScale(solid);

  return {
    light: makeColorScale(lightPrimitive),
    dark: makeDarkColorScale(darkPrimitive),
  };
}
