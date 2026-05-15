export const tabs = {
  list: {
    gap: 'micro',
    borderColor: 'border.subtle',
    borderWidth: 'hairline',
  },
  trigger: {
    gap: 'micro',
    color: {
      inactive: 'text.secondary',
      active: 'text.primary',
    },
    // 5 sizes, 5 paddings únicos — escala progressiva visível.
    padding: {
      xsmall: { inline: 'micro',  block: 'nano'  },
      small:  { inline: 'tiny',   block: 'micro' },
      medium: { inline: 'small',  block: 'tiny'  },
      large:  { inline: 'medium', block: 'small' },
      xlarge: { inline: 'large',  block: 'medium' },
    },
    // Padding INTERNO do container (slot `triggerContent`) — aplicado apenas
    // em `variant='pill'` para dar respiro entre texto e borda do pill.
    // Themable via `createTheme({ tokens: { tabs: { trigger: { pillContent: { padding: {...} } } } } })`.
    pillContent: {
      padding: {
        xsmall: { inline: 'micro',  block: 'nano'  },
        small:  { inline: 'tiny',   block: 'micro' },
        medium: { inline: 'small',  block: 'tiny'  },
        large:  { inline: 'medium', block: 'small' },
        xlarge: { inline: 'large',  block: 'medium' },
      },
    },
  },
  content: {
    padding: { block: 'medium' },
    color: 'text.primary',
  },
  indicator: {
    color: 'brand.solid',
    thickness: 'thin',
    borderRadius: {
      underline: 'none',
      pill: 'full',
    },
  },
  pill: {
    color: 'text.inverse',
  },
  opacity: {
    disabled: 0.5,
  },
};
