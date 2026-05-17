export const popover = {
  borderRadius: 'medium',
  borderWidth: 'hairline',
  padding: { inline: 'medium', block: 'medium' },
  gap: 'small',
  shadow: 'lg',
  minWidth: '200px',
  maxWidth: '360px',
  /**
   * Distância (px) entre trigger e popover — themable via
   * `createTheme({ components: { popover: { offset: 12 } } })`.
   */
  offset: 8,
  colors: {
    background: 'surface.raised',
    border: 'border.subtle',
    text: 'text.primary',
  },
  close: {
    size: 'control.small',
    iconSize: 'small',
    borderRadius: 'small',
    minTouch: 'touchTarget.minimum',
    colors: {
      icon: 'text.secondary',
      iconHover: 'text.primary',
      backgroundHover: 'surface.subtle',
    },
  },
};
