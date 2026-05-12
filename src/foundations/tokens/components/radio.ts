export const radio = {
  gap: 'small',
  minTouch: 'touchTarget.minimum',
  indicator: {
    size: '20px',
    borderRadius: 'full',
    borderWidth: 'hairline',
    dotSize: '10px',
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
        checked: 'brand.solid',
        invalid: 'feedback.critical.solid',
      },
      background: {
        outline: 'surface.default',
        filled: 'background.subtle',
        checked: 'surface.default',
      },
      dot: 'brand.solid',
    },
    label: 'text.primary',
    description: 'text.secondary',
  },
  opacity: {
    disabled: 'disabled',
  },
};
