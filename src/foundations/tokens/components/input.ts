export const input = {
  borderRadius: 'small',
  borderWidth: 'hairline',
  height: {
    small: 'touchTarget.minimum',
    medium: 'touchTarget.minimum',
    large: 'touchTarget.dense',
  },
  padding: {
    small: { inline: 'small', block: 'micro' },
    medium: { inline: 'medium', block: 'small' },
    large: { inline: 'medium', block: 'small' },
  },
  fontSize: {
    small: 'xsmall',
    medium: 'small',
    large: 'medium',
  },
  colors: {
    background: {
      default: 'surface.default',
      filled: 'background.subtle',
    },
    border: {
      default: 'border.default',
      error: 'feedback.critical.solid',
    },
    text: 'text.primary',
    placeholder: 'text.tertiary',
    clearButton: 'text.tertiary',
  },
  opacity: {
    disabled: 'disabled',
  },
};
