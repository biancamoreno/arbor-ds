import type * as CSS from 'csstype';

/** Tokens disponíveis para a escala do tema. */
const tokens = [
  'colors',
  'borders',
  'borderWidths',
  'borderStyles',
  'fonts',
  'fontSizes',
  'fontWeights',
  'letterSpacings',
  'lineHeights',
  'radii',
  'space',
  'shadows',
  'sizes',
  'zIndices',
  'transition',
  'blur',
] as const;

/** Tipo para as escalas do tema. */
export type ThemeScale = typeof tokens[number];

/** Propriedades CSS disponíveis. */
export type CSSProp = keyof CSS.Properties;

/** Função de transformação para custom props. */
export type Transform = (value: string) => string;

/** Configuração das custom props. */
export type CustomPropsConfig = {
  [key: string]: {
    /** Propriedade CSS associada à custom prop. */
    property: CSSProp;

    /** Escala do tema associada à custom prop. */
    scale?: ThemeScale;

    /** Função de transformação opcional para a custom prop. */
    transform?: Transform;
  };
};

/** Tipos das custom props baseados na configuração fornecida. */
export type CustomProps<Config extends CustomPropsConfig> = {
  [key in keyof Config]?: string | object;
};
