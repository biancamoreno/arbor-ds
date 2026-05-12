export const switchToken = {
  gap: 'tiny',
  borderRadius: 'full',
  track: {
    size: {
      small: { width: '36px', height: '20px' },
      medium: { width: '44px', height: '24px' },
      large: { width: '52px', height: '28px' },
    },
    padding: 'nano',
    minTouch: 'touchTarget.minimum',
  },
  thumb: {
    borderRadius: 'full',
    size: {
      small: '16px',
      medium: '20px',
      large: '24px',
    },
  },
  colors: {
    track: {
      default: 'border.strong',
      checked: 'brand.solid',
      invalid: 'feedback.critical.solid',
    },
    thumb: {
      default: 'surface.default',
    },
  },
  opacity: {
    disabled: 'disabled',
  },
};
