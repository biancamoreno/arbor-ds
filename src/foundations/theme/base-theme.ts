import { createBreakpoints } from '../breakpoints';
import {
  borderRadius,
  borderWidth,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  spacing,
  opacity,
  zIndex,
  fontFamily,
} from '../tokens';
import { defineSlotRecipe } from '../../ecosystem/styled-system/recipes';
import type { ThemeComponents } from './types';

const components: ThemeComponents = {
  text: {
    base: {},
    variants: {
      variant: {
        body: {
          fontFamily: 'sans',
          letterSpacing: letterSpacing.normal,
          fontSize: fontSize.small,
          textDecorationLine: 'none',
          lineHeight: '20px',
          textTransform: 'none',
        },
        bodyHighlight: {
          fontFamily: 'sans',
          letterSpacing: letterSpacing.normal,
          fontSize: fontSize.small,
          textDecorationLine: 'none',
          lineHeight: '20px',
          textTransform: 'none',
        },
        caption: {
          fontFamily: 'sans',
          letterSpacing: letterSpacing.normal,
          fontSize: fontSize.sm,
          textDecorationLine: 'none',
          lineHeight: '20px',
          textTransform: 'none',
        },
        captionHighlight: {
          fontFamily: 'sans',
          letterSpacing: letterSpacing.normal,
          fontSize: fontSize.sm,
          textDecorationLine: 'none',
          lineHeight: '20px',
          textTransform: 'none',
        },
        display1: {
          fontFamily: 'sans',
          letterSpacing: letterSpacing.tightest,
          fontSize: fontSize.lg,
          textDecorationLine: 'none',
          lineHeight: '28px',
          textTransform: 'none',
        },
        display2: {
          fontFamily: 'sans',
          letterSpacing: letterSpacing.tight,
          fontSize: fontSize.md,
          textDecorationLine: 'none',
          lineHeight: '24px',
          textTransform: 'none',
        },
        display3: {
          fontFamily: 'sans',
          letterSpacing: letterSpacing.normal,
          fontSize: fontSize.small,
          textDecorationLine: 'none',
          lineHeight: '20px',
          textTransform: 'none',
        },
        display4: {
          fontFamily: 'sans',
          letterSpacing: letterSpacing.normal,
          fontSize: fontSize.sm,
          textDecorationLine: 'none',
          lineHeight: '20px',
          textTransform: 'none',
        },
        subtitle: {
          fontFamily: 'sans',
          letterSpacing: letterSpacing.tight,
          fontSize: fontSize.md,
          textDecorationLine: 'none',
          lineHeight: '24px',
          textTransform: 'none',
        },
        tag: {
          fontFamily: 'sans',
          letterSpacing: letterSpacing.tight,
          fontSize: fontSize.xsmall,
          textDecorationLine: 'none',
          textTransform: 'uppercase',
        },
        title1: {
          fontFamily: 'sans',
          letterSpacing: letterSpacing.tightest,
          fontSize: fontSize.lg,
          textDecorationLine: 'none',
          lineHeight: '28px',
          textTransform: 'none',
        },
        title2: {
          fontFamily: 'sans',
          letterSpacing: letterSpacing.tight,
          fontSize: fontSize.md,
          textDecorationLine: 'none',
          lineHeight: '24px',
          textTransform: 'none',
        },
      },
    },
    defaultVariants: { variant: 'caption' },
  },
  button: {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: borderRadius.small,
      fontWeight: fontWeight.medium,
      cursor: 'pointer',
    },
    variants: {
      variant: {
        primary: { backgroundColor: 'semantic.brand.base', color: 'white' },
        secondary: {
          backgroundColor: 'transparent',
          borderWidth: '1px',
          borderColor: 'semantic.brand.base',
        },
        ghost: { backgroundColor: 'transparent' },
      },
      size: {
        sm: {
          height: '32px',
          paddingLeft: spacing.small,
          paddingRight: spacing.small,
          fontSize: fontSize.sm,
        },
        md: {
          height: '40px',
          paddingLeft: spacing.medium,
          paddingRight: spacing.medium,
          fontSize: fontSize.small,
        },
        lg: {
          height: '48px',
          paddingLeft: spacing.large,
          paddingRight: spacing.large,
          fontSize: fontSize.md,
        },
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },

  field: defineSlotRecipe({
    slots: ['root', 'label', 'control', 'description', 'error'] as const,
    base: {
      root: { display: 'flex', flexDirection: 'column', gap: 'micro' },
      label: { fontSize: 'sm', fontWeight: 'medium' },
      description: { fontSize: 'xs' },
      error: { fontSize: 'xs' },
    },
    variants: {
      size: {
        sm: { control: { minHeight: '32px' } },
        md: { control: { minHeight: '40px' } },
        lg: { control: { minHeight: '48px' } },
      },
    },
    defaultVariants: { size: 'md' },
  }),

  input: {
    base: {
      display: 'flex',
      alignItems: 'center',
      borderRadius: 'nano',
      borderWidth: 'hairline',
      width: '100%',
    },
    variants: {
      size: {
        sm: { minHeight: '32px', paddingLeft: 'tiny', paddingRight: 'tiny', fontSize: 'xs' },
        md: { minHeight: '40px', paddingLeft: 'small', paddingRight: 'small', fontSize: 'sm' },
        lg: { minHeight: '48px', paddingLeft: 'small', paddingRight: 'small', fontSize: 'small' },
      },
      variant: {
        default: { borderColor: 'border.default', backgroundColor: 'surface.default' },
        filled: { borderColor: 'border.default', backgroundColor: 'background.subtle' },
      },
    },
    defaultVariants: { size: 'md', variant: 'default' },
  },

  checkbox: defineSlotRecipe({
    slots: ['root', 'indicator', 'label', 'description'] as const,
    base: {
      root: { display: 'flex', alignItems: 'flex-start', gap: 'tiny' },
      indicator: { width: '18px', height: '18px', borderRadius: 'nano', borderWidth: 'hairline' },
      label: { fontSize: 'sm', fontWeight: 'medium' },
      description: { fontSize: 'xs' },
    },
    variants: {
      size: {
        sm: { indicator: { width: '16px', height: '16px' }, label: { fontSize: 'xs' } },
        md: { indicator: { width: '18px', height: '18px' }, label: { fontSize: 'sm' } },
        lg: { indicator: { width: '20px', height: '20px' }, label: { fontSize: 'small' } },
      },
    },
    defaultVariants: { size: 'md' },
  }),

  radio: defineSlotRecipe({
    slots: ['root', 'control', 'indicator', 'label', 'description'] as const,
    base: {
      root: { display: 'flex', width: '100%', borderRadius: 'small', borderWidth: 'hairline' },
      control: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%' },
      indicator: { width: '20px', height: '20px', borderRadius: 'full', borderWidth: 'hairline', flexShrink: 0 },
      label: { fontSize: 'small', fontWeight: 'medium' },
      description: { fontSize: 'xs' },
    },
    variants: {
      size: {
        sm: { root: { padding: spacing.tiny } },
        md: { root: { padding: spacing.small } },
        lg: { root: { padding: spacing.medium } },
      },
    },
    defaultVariants: { size: 'md' },
  }),

  switch: defineSlotRecipe({
    slots: ['root', 'track', 'thumb'] as const,
    base: {
      root: { display: 'inline-flex', alignItems: 'center', gap: 'tiny', cursor: 'pointer' },
      track: { display: 'flex', alignItems: 'center', borderRadius: 'full', transition: 'background-color 0.2s ease' },
      thumb: { borderRadius: 'full', backgroundColor: 'surface.default', transition: 'transform 0.2s ease' },
    },
    variants: {
      size: {
        sm: {
          track: { width: '36px', height: '20px', paddingLeft: '2px', paddingRight: '2px' },
          thumb: { width: '16px', height: '16px' },
        },
        md: {
          track: { width: '44px', height: '24px', paddingLeft: '2px', paddingRight: '2px' },
          thumb: { width: '20px', height: '20px' },
        },
        lg: {
          track: { width: '52px', height: '28px', paddingLeft: '2px', paddingRight: '2px' },
          thumb: { width: '24px', height: '24px' },
        },
      },
    },
    defaultVariants: { size: 'md' },
  }),

  select: defineSlotRecipe({
    slots: ['root', 'trigger', 'value', 'icon', 'content', 'item', 'itemText'] as const,
    base: {
      root: { display: 'flex', flexDirection: 'column', gap: 'micro', width: '100%' },
      trigger: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        borderRadius: 'nano',
        borderWidth: 'hairline',
        cursor: 'pointer',
      },
      value: { flex: '1', fontSize: 'sm' },
      content: { borderRadius: 'nano', borderWidth: 'hairline', overflow: 'hidden' },
      item: { display: 'flex', alignItems: 'center', cursor: 'pointer', paddingLeft: 'small', paddingRight: 'small' },
      itemText: { fontSize: 'sm' },
    },
    variants: {
      size: {
        sm: {
          trigger: { minHeight: '32px', paddingLeft: 'tiny', paddingRight: 'tiny', fontSize: 'xs' },
          item: { minHeight: '32px' },
        },
        md: {
          trigger: { minHeight: '40px', paddingLeft: 'small', paddingRight: 'small', fontSize: 'sm' },
          item: { minHeight: '36px' },
        },
        lg: {
          trigger: { minHeight: '48px', paddingLeft: 'small', paddingRight: 'small', fontSize: 'small' },
          item: { minHeight: '40px' },
        },
      },
    },
    defaultVariants: { size: 'md' },
  }),

  dialog: defineSlotRecipe({
    slots: ['overlay', 'content', 'title', 'description'] as const,
    base: {
      overlay: { position: 'fixed', inset: '0' },
      content: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 'large',
        boxShadow: '0 20px 48px rgba(0,0,0,0.16)',
      },
      title: { fontWeight: 'medium' },
      description: {},
    },
    variants: {
      size: {
        sm: { content: { maxWidth: '420px', padding: 'medium' } },
        md: { content: { maxWidth: '560px', padding: 'large' } },
        lg: { content: { maxWidth: '720px', padding: 'large' } },
      },
    },
    defaultVariants: { size: 'md' },
  }),

  drawer: defineSlotRecipe({
    slots: ['overlay', 'content', 'title'] as const,
    base: {
      overlay: { position: 'fixed', inset: '0' },
      content: { position: 'fixed', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 48px rgba(0,0,0,0.16)' },
      title: { fontWeight: 'medium' },
    },
    variants: {
      size: {
        sm: { content: { padding: 'small' } },
        md: { content: { padding: 'medium' } },
        lg: { content: { padding: 'large' } },
      },
    },
    defaultVariants: { size: 'md' },
  }),

  tooltip: defineSlotRecipe({
    slots: ['content'] as const,
    base: {
      content: {
        position: 'absolute',
        borderRadius: 'small',
        padding: '8px 12px',
        fontSize: 'xsmall',
        lineHeight: '1.4',
        pointerEvents: 'none',
      },
    },
    variants: {},
    defaultVariants: {},
  }),

  badge: {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: borderRadius.full,
      fontWeight: fontWeight.medium,
    },
    variants: {
      size: {
        sm: { padding: '2px 6px', fontSize: fontSize.xsmall },
        md: { padding: '3px 8px', fontSize: fontSize.xsmall },
      },
    },
    defaultVariants: { size: 'md' },
  },

  card: {
    base: {
      display: 'flex',
      flexDirection: 'column',
      borderRadius: borderRadius.medium,
      overflow: 'hidden',
    },
    variants: {
      variant: {
        outlined: { borderWidth: '1px' },
        elevated: { boxShadow: '0 2px 8px rgba(0,0,0,0.10)' },
        flat: {},
      },
      padding: {
        none: { padding: '0' },
        sm: { padding: '12px' },
        md: { padding: spacing.medium },
        lg: { padding: spacing.large },
      },
    },
    defaultVariants: { variant: 'outlined', padding: 'md' },
  },

  chip: {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: borderRadius.full,
      fontWeight: fontWeight.medium,
      borderWidth: '1px',
    },
    variants: {
      size: {
        sm: { padding: '3px 8px', fontSize: fontSize.xsmall },
        md: { padding: '5px 12px', fontSize: fontSize.sm },
      },
    },
    defaultVariants: { size: 'md' },
  },

  avatar: defineSlotRecipe({
    slots: ['root', 'image', 'fallback'] as const,
    base: {
      root: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 },
      image: { width: '100%', height: '100%', objectFit: 'cover' },
      fallback: { display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: fontWeight.medium },
    },
    variants: {
      size: {
        xs: { root: { width: '24px', height: '24px' }, fallback: { fontSize: fontSize.xsmall } },
        sm: { root: { width: '32px', height: '32px' }, fallback: { fontSize: fontSize.xsmall } },
        md: { root: { width: '40px', height: '40px' }, fallback: { fontSize: fontSize.sm } },
        lg: { root: { width: '48px', height: '48px' }, fallback: { fontSize: fontSize.small } },
        xl: { root: { width: '64px', height: '64px' }, fallback: { fontSize: fontSize.md } },
      },
    },
    defaultVariants: { size: 'md' },
  }),

  alert: defineSlotRecipe({
    slots: ['root', 'icon', 'title', 'description', 'close'] as const,
    base: {
      root: { display: 'flex', alignItems: 'flex-start', borderLeftWidth: '4px', borderLeftStyle: 'solid' },
      icon: { display: 'inline-flex', flexShrink: 0 },
      title: { fontWeight: fontWeight.medium, fontSize: fontSize.small },
      description: { fontSize: fontSize.sm },
      close: { marginLeft: 'auto', flexShrink: 0, display: 'inline-flex' },
    },
    variants: {},
    defaultVariants: {},
  }),

  accordion: defineSlotRecipe({
    slots: ['root', 'item', 'trigger', 'content'] as const,
    base: {
      root: { display: 'flex', flexDirection: 'column', overflow: 'hidden' },
      item: {},
      trigger: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontWeight: fontWeight.medium },
      content: {},
    },
    variants: {},
    defaultVariants: {},
  }),

  toast: defineSlotRecipe({
    slots: ['root', 'title', 'description', 'close'] as const,
    base: {
      root: { display: 'flex', alignItems: 'flex-start', borderLeftWidth: '4px', borderLeftStyle: 'solid', borderRadius: borderRadius.small },
      title: { fontWeight: fontWeight.medium, fontSize: fontSize.small },
      description: { fontSize: fontSize.sm },
      close: { marginLeft: 'auto', display: 'inline-flex' },
    },
    variants: {},
    defaultVariants: {},
  }),
};

export const baseTheme = {
  borders: borderWidth,
  borderWidths: borderWidth,
  radii: borderRadius,
  sizes: spacing,
  space: spacing,
  opacity,
  lineHeights: lineHeight,
  fontWeights: fontWeight,
  fontSizes: fontSize,
  fonts: fontFamily,
  zIndices: zIndex,
  breakpoints: createBreakpoints({
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }),
  components,
};

export type BaseTheme = typeof baseTheme;
