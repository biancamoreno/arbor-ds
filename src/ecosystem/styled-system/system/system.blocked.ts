export const systemBlockedPropsByPlatform: Record<'web' | 'native', readonly string[]> = {
  web: ['accessibilityElementsHidden', 'importantForAccessibility'],
  native: ['inert'],
};

export const systemBlockedProps = systemBlockedPropsByPlatform.web;
