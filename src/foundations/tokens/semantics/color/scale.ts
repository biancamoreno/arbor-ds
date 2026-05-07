/**
 * Escala canônica de 12 papéis por família themable (RFC-0039).
 *
 * Cada step tem papel canônico (Radix-style):
 *   1  bg              — fundo de página/app
 *   2  bgSubtle        — fundo de seção sutil
 *   3  bgElement       — fundo de componente UI em repouso
 *   4  bgElementHover  — hover do componente UI
 *   5  bgElementActive — pressed/selected do componente UI
 *   6  borderSubtle    — separador, borda decorativa
 *   7  border          — borda canônica de UI (input border, focus ring color)
 *   8  borderHover     — borda hover de UI
 *   9  solid           — fundo sólido (Button primary bg, FAB, switch ON)
 *  10  solidHover      — hover do sólido
 *  11  text            — texto de baixo contraste sobre fundo neutro
 *  12  textContrast    — texto de alto contraste sobre fundo neutro
 *
 * Numérico e nominal resolvem para o mesmo valor — numérico é tooling-friendly,
 * nominal é ergonômico em código de aplicação.
 */
export type ColorScale = {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;

  bg: string;
  bgSubtle: string;
  bgElement: string;
  bgElementHover: string;
  bgElementActive: string;
  borderSubtle: string;
  border: string;
  borderHover: string;
  solid: string;
  solidHover: string;
  text: string;
  textContrast: string;
};

/** Família primitive com 12 steps numerados (10..120). */
export type ColorPrimitiveScale = {
  10: string;
  20: string;
  30: string;
  40: string;
  50: string;
  60: string;
  70: string;
  80: string;
  90: string;
  100: string;
  110: string;
  120: string;
};

/**
 * Constrói a `ColorScale` light a partir de uma família primitive de 12 steps.
 * Mapping direto: primitive `10..120` → semantic `1..12`.
 */
export function makeColorScale(p: ColorPrimitiveScale): ColorScale {
  return {
    1: p[10],
    2: p[20],
    3: p[30],
    4: p[40],
    5: p[50],
    6: p[60],
    7: p[70],
    8: p[80],
    9: p[90],
    10: p[100],
    11: p[110],
    12: p[120],

    bg: p[10],
    bgSubtle: p[20],
    bgElement: p[30],
    bgElementHover: p[40],
    bgElementActive: p[50],
    borderSubtle: p[60],
    border: p[70],
    borderHover: p[80],
    solid: p[90],
    solidHover: p[100],
    text: p[110],
    textContrast: p[120],
  };
}

/**
 * Constrói a `ColorScale` dark a partir de uma família primitive de 12 steps.
 * Convenção: o papel `solid` desce uma "intensidade" para preservar legibilidade
 * sobre fundo escuro. Steps 8 e 9 podem coincidir (`borderHover` = `solid` em dark)
 * — é a calibração canônica (Radix-style) e não bug.
 */
export function makeDarkColorScale(p: ColorPrimitiveScale): ColorScale {
  return {
    1: p[120],
    2: p[110],
    3: p[100],
    4: p[90],
    5: p[80],
    6: p[70],
    7: p[60],
    8: p[50],
    9: p[50],
    10: p[40],
    11: p[30],
    12: p[20],

    bg: p[120],
    bgSubtle: p[110],
    bgElement: p[100],
    bgElementHover: p[90],
    bgElementActive: p[80],
    borderSubtle: p[70],
    border: p[60],
    borderHover: p[50],
    solid: p[50],
    solidHover: p[40],
    text: p[30],
    textContrast: p[20],
  };
}
