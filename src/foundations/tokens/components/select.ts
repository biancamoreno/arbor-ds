export const select = {
  gap: 'micro',
  borderRadius: 'nano',
  borderWidth: 'hairline',
  trigger: {
    minHeight: {
      small: 'touchTarget.minimum',
      medium: 'touchTarget.minimum',
      large: 'touchTarget.dense',
    },
    padding: {
      small: { inline: 'tiny' },
      medium: { inline: 'small' },
      large: { inline: 'small' },
    },
    fontSize: {
      small: 'xsmall',
      medium: 'small',
      large: 'medium',
    },
  },
  item: {
    minHeight: 'touchTarget.minimum',
    padding: { inline: 'small' },
    fontSize: 'small',
  },
  value: {
    fontSize: {
      small: 'xsmall',
      medium: 'small',
      large: 'medium',
    },
  },
  colors: {
    trigger: {
      border: {
        default: 'border.default',
        open: 'border.interactive',
        invalid: 'feedback.critical.solid',
      },
      background: 'surface.default',
      text: 'text.primary',
    },
    content: {
      border: 'border.default',
      background: 'surface.default',
    },
    item: {
      text: 'text.primary',
    },
  },
  opacity: {
    disabled: 'disabled',
  },
};
