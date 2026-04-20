import type * as CSS from 'csstype';

export type ThemeScale =
  | 'colors'
  | 'borders'
  | 'borderWidths'
  | 'borderStyles'
  | 'fonts'
  | 'fontSizes'
  | 'fontWeights'
  | 'letterSpacings'
  | 'lineHeights'
  | 'radii'
  | 'space'
  | 'shadows'
  | 'sizes'
  | 'zIndices'
  | 'transition'
  | 'blur';

export type CSSProp = keyof CSS.Properties;
export type Transform = (value: string | number) => string;

export type CustomPropsConfig = {
  [key: string]: {
    property: CSSProp;
    scale?: ThemeScale;
    transform?: Transform;
  };
};

export type CustomProps<Config extends CustomPropsConfig> = {
  [key in keyof Config]?: string | number | object;
};
