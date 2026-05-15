export const tooltip = {
  borderRadius: 'small',
  padding: { inline: 'small', block: 'micro' },
  fontSize: 'xsmall',
  shadow: 'md',
  /**
   * Distância (px) entre o trigger e o tooltip — themable via
   * `createTheme({ components: { tooltip: { offset: 12 } } })`.
   */
  offset: 8,
  colors: {
    background: 'text.primary',
    text: 'text.inverse',
  },
};
