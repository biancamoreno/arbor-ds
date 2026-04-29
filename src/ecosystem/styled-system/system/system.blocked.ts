export const systemBlockedPropsByPlatform: Record<'web' | 'native', readonly string[]> = {
  web: ['accessibilityElementsHidden', 'importantForAccessibility'],
  native: [],
};

export const systemBlockedProps = systemBlockedPropsByPlatform.web;
