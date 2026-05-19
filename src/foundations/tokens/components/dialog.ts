export const dialog = {
  borderRadius: 'large',
  borderWidth: 'hairline',
  shadow: 'xl',
  gap: 'small',
  colors: {
    background: 'surface.raised',
    border: 'border.subtle',
    overlay: 'background.overlay',
    title: 'text.primary',
    description: 'text.secondary',
  },
  size: {
    small: { maxWidth: 'dialog.small', padding: 'medium' },
    medium: { maxWidth: 'dialog.medium', padding: 'large' },
    large: { maxWidth: 'dialog.large', padding: 'large' },
  },
  title: {
    typography: {
      fontSize: 'large',
      fontWeight: 'semibold',
      lineHeight: 'medium',
      letterSpacing: 'tight',
    },
  },
  description: {
    typography: {
      fontSize: 'small',
      fontWeight: 'regular',
      lineHeight: 'small',
      letterSpacing: 'normal',
    },
  },
  close: {
    size: 'control.small',
    iconSize: 'small',
    borderRadius: 'small',
    minTouch: 'touchTarget.minimum',
    offset: 'small',
    colors: {
      icon: 'text.secondary',
      iconHover: 'text.primary',
      backgroundHover: 'background.subtle',
    },
  },
};
