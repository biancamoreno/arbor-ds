export const checkbox = {
  gap: 'micro',
  borderRadius: 'nano',
  borderWidth: 'thin',
  size: {
    small: '16px',
    medium: '18px',
    large: '20px',
  },
  minTouch: 'touchTarget.minimum',
  mark: {
    size: {
      small: 'xsmall',
      medium: 'small',
      large: 'small',
    },
  },
  fontSize: {
    label: {
      small: 'xsmall',
      medium: 'small',
      large: 'medium',
    },
    description: 'xsmall',
  },
  fontWeight: {
    label: 'medium',
  },
  colors: {
    indicator: {
      border: {
        default: 'border.strong',
        checked: 'interactive.default',
        invalid: 'feedback.critical.solid',
      },
      background: {
        outline: 'surface.default',
        filled: 'background.subtle',
        checked: 'interactive.default',
      },
      mark: 'text.inverse',
    },
    label: 'text.primary',
    description: 'text.secondary',
  },
  opacity: {
    disabled: 'disabled',
  },
};
