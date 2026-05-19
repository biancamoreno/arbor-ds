export const drawer = {
  // Default sóbrio: painel encostado no viewport, cantos retos. Override via
  // `components.drawer.borderRadius` quando o produto pedir cantos arredondados
  // (lifted/floating drawer).
  borderRadius: 'none',
  borderWidth: 'hairline',
  shadow: 'xl',
  gap: 'small',
  header: {
    gap: 'nano',
  },
  body: {
    gap: 'small',
  },
  footer: {
    gap: 'small',
    paddingTop: 'small',
  },
  colors: {
    background: 'surface.raised',
    border: 'border.subtle',
    overlay: 'background.overlay',
    title: 'text.primary',
    description: 'text.secondary',
  },
  size: {
    small: {
      width: 'drawer.width.small',
      height: 'drawer.height.small',
      padding: 'medium',
    },
    medium: {
      width: 'drawer.width.medium',
      height: 'drawer.height.medium',
      padding: 'large',
    },
    large: {
      width: 'drawer.width.large',
      height: 'drawer.height.large',
      padding: 'large',
    },
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
