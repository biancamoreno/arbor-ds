export const button = {
  borderRadius: 'small',
  borderWidth: 'hairline',
  fontWeight: 'semibold',
  gap: 'micro',
  height: {
    small: 'control.small',
    medium: 'control.medium',
    large: 'control.large',
  },
  padding: {
    small: { inline: 'small', block: 'nano' },
    medium: { inline: 'medium', block: 'micro' },
    large: { inline: 'large', block: 'tiny' },
  },
  fontSize: {
    small: 'small',
    medium: 'small',
    large: 'medium',
  },
  colors: {
    primary: {
      bg: 'interactive.default',
      border: 'interactive.default',
      text: 'text.inverse',
    },
    secondary: {
      bg: 'brand.bgElement',
      border: 'brand.bgElementActive',
      text: 'text.primary',
    },
    ghost: {
      bg: 'transparent',
      border: 'border.default',
      text: 'text.primary',
    },
    danger: {
      bg: 'feedback.critical.solid',
      border: 'feedback.critical.solid',
      text: 'text.inverse',
    },
  },
};
