export interface ThemeTypings {
  borders: string;
  breakpoints: string;
  colors: string;
  fonts: string;
  fontSizes: string;
  fontWeights: string;
  lineHeights: string;
  radii: string;
  sizes: string;
  space: string;
  recipes: {
    [recipeName: string]: {
      sizes: string;
      variants: string;
    };
  };
}
