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
  components: {
    [componentName: string]: {
      sizes: string;
      variants: string;
    };
  };
}
