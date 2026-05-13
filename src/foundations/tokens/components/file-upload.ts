export const fileUpload = {
  borderRadius: 'medium',
  gap: {
    root: 'micro',
    dropZone: 'micro',
    preview: 'small',
  },
  padding: {
    dropZone: 'large',
    preview: 'medium',
  },
  borderWidth: {
    dropZone: 'thick',
    preview: 'hairline',
  },
  thumbnail: {
    size: '80px',
    borderRadius: 'small',
  },
  opacity: {
    disabled: 0.5,
  },
  colors: {
    dropZone: {
      background: {
        idle: 'background.subtle',
        dragging: 'brand.bgElement',
        invalid: 'feedback.critical.bgElement',
      },
      border: {
        idle: 'border.default',
        dragging: 'brand.solid',
        invalid: 'feedback.critical.solid',
      },
      title: 'text.primary',
      hint: 'text.secondary',
      icon: 'text.secondary',
    },
    preview: {
      border: 'border.default',
      title: 'text.primary',
    },
  },
};
