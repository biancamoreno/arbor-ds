import { createBreakpoints } from '../breakpoints';
import {
  borderRadius,
  borderWidth,
  fontSize,
  fontWeight,
  iconSize,
  letterSpacing,
  lineHeight,
  spacing,
  opacity,
  zIndex,
  fontFamily,
  shadows,
  motion,
  controlSize,
  dialogSize,
} from '../tokens';
import { transition } from './transition';
import type { ThemeComponents, SlotRecipeConfig } from './types';

const defineSlotRecipe = <T extends SlotRecipeConfig>(config: T): T => config;

const focusRing = {
  outline: '2px solid',
  outlineColor: 'focus.ring',
  outlineOffset: '2px',
} as const;

const components: ThemeComponents = {
  text: {
    base: {},
    variants: {
      variant: {
        body: {
          fontFamily: 'sans',
          letterSpacing: 'normal',
          fontSize: 'small',
          textDecorationLine: 'none',
          lineHeight: 'xsmall',
          textTransform: 'none',
        },
        bodyHighlight: {
          fontFamily: 'sans',
          letterSpacing: 'normal',
          fontSize: 'small',
          textDecorationLine: 'none',
          lineHeight: 'xsmall',
          textTransform: 'none',
        },
        caption: {
          fontFamily: 'sans',
          letterSpacing: 'normal',
          fontSize: 'sm',
          textDecorationLine: 'none',
          lineHeight: 'xsmall',
          textTransform: 'none',
        },
        captionHighlight: {
          fontFamily: 'sans',
          letterSpacing: 'normal',
          fontSize: 'sm',
          textDecorationLine: 'none',
          lineHeight: 'xsmall',
          textTransform: 'none',
        },
        display1: {
          fontFamily: 'sans',
          letterSpacing: 'tightest',
          fontSize: 'lg',
          textDecorationLine: 'none',
          lineHeight: 'medium',
          textTransform: 'none',
        },
        display2: {
          fontFamily: 'sans',
          letterSpacing: 'tight',
          fontSize: 'md',
          textDecorationLine: 'none',
          lineHeight: 'small',
          textTransform: 'none',
        },
        display3: {
          fontFamily: 'sans',
          letterSpacing: 'normal',
          fontSize: 'small',
          textDecorationLine: 'none',
          lineHeight: 'xsmall',
          textTransform: 'none',
        },
        display4: {
          fontFamily: 'sans',
          letterSpacing: 'normal',
          fontSize: 'sm',
          textDecorationLine: 'none',
          lineHeight: 'xsmall',
          textTransform: 'none',
        },
        subtitle: {
          fontFamily: 'sans',
          letterSpacing: 'tight',
          fontSize: 'md',
          textDecorationLine: 'none',
          lineHeight: 'small',
          textTransform: 'none',
        },
        tag: {
          fontFamily: 'sans',
          letterSpacing: 'tight',
          fontSize: 'xsmall',
          textDecorationLine: 'none',
          textTransform: 'uppercase',
        },
        title1: {
          fontFamily: 'sans',
          letterSpacing: 'tightest',
          fontSize: 'lg',
          textDecorationLine: 'none',
          lineHeight: 'medium',
          textTransform: 'none',
        },
        title2: {
          fontFamily: 'sans',
          letterSpacing: 'tight',
          fontSize: 'md',
          textDecorationLine: 'none',
          lineHeight: 'small',
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
      borderRadius: 'small',
      fontWeight: 'medium',
      cursor: 'pointer',
    },
    variants: {
      variant: {
        primary: { backgroundColor: 'semantic.brand.base', color: 'text.inverse' },
        secondary: {
          backgroundColor: 'transparent',
          borderWidth: 'hairline',
          borderColor: 'semantic.brand.base',
        },
        ghost: { backgroundColor: 'transparent' },
      },
      size: {
        small: {
          height: 'control.small',
          paddingLeft: 'small',
          paddingRight: 'small',
          fontSize: 'sm',
        },
        medium: {
          height: 'control.medium',
          paddingLeft: 'medium',
          paddingRight: 'medium',
          fontSize: 'small',
        },
        large: {
          height: 'control.large',
          paddingLeft: 'large',
          paddingRight: 'large',
          fontSize: 'md',
        },
      },
    },
    defaultVariants: { variant: 'primary', size: 'medium' },
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
        small: { control: { minHeight: '44px' } },
        medium: { control: { minHeight: '44px' } },
        large: { control: { minHeight: '48px' } },
      },
    },
    defaultVariants: { size: 'medium' },
  }),

  input: defineSlotRecipe({
    slots: ['frame', 'control'] as const,
    base: {
      frame: {
        width: '100%',
        borderRadius: 'small',
        borderWidth: 'hairline',
        borderStyle: 'solid',
        transition: transition(['border-color', 'box-shadow'], 'fast'),
      },
      control: {
        color: 'text.primary',
      },
    },
    variants: {
      size: {
        small: {
          frame: { minHeight: '44px', paddingInline: '12px', paddingBlock: '6px' },
          control: { fontSize: 'xsmall' },
        },
        medium: {
          frame: { minHeight: '44px', paddingInline: '16px', paddingBlock: '8px' },
          control: { fontSize: 'small' },
        },
        large: {
          frame: { minHeight: '48px', paddingInline: '18px', paddingBlock: '10px' },
          control: { fontSize: 'medium' },
        },
      },
      variant: {
        default: { frame: { backgroundColor: 'surface.default', borderColor: 'border.default' } },
        filled: { frame: { backgroundColor: 'background.subtle', borderColor: 'border.default' } },
      },
      state: {
        idle: {},
        error: { frame: { borderColor: 'feedback.critical.base' } },
        disabled: { frame: { opacity: 0.6 } },
      },
    },
    defaultVariants: { size: 'medium', variant: 'default', state: 'idle' },
  }),

  checkbox: defineSlotRecipe({
    slots: ['root', 'indicator', 'label', 'description'] as const,
    base: {
      root: { display: 'flex', alignItems: 'flex-start', gap: 'micro' },
      indicator: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        borderRadius: 'nano',
        borderWidth: 'thin',
        borderColor: 'border.strong',
        backgroundColor: 'surface.default',
        _focusVisible: focusRing,
      },
      label: { fontSize: 'small', fontWeight: 'medium', color: 'text.primary' },
      description: { fontSize: 'xsmall', color: 'text.secondary' },
    },
    variants: {
      size: {
        small: { indicator: { width: '16px', height: '16px' }, label: { fontSize: 'xsmall' } },
        medium: { indicator: { width: '18px', height: '18px' }, label: { fontSize: 'small' } },
        large: { indicator: { width: '20px', height: '20px' }, label: { fontSize: 'medium' } },
      },
      state: {
        idle: {},
        checked: {
          indicator: { borderColor: 'interactive.default', backgroundColor: 'interactive.default' },
        },
        invalid: { indicator: { borderColor: 'feedback.critical.base' } },
        disabled: { root: { opacity: 0.6 } },
      },
    },
    defaultVariants: { size: 'medium', state: 'idle' },
  }),

  radio: defineSlotRecipe({
    slots: ['root', 'control', 'indicator', 'label', 'description'] as const,
    base: {
      root: {
        display: 'flex',
        width: '100%',
        borderRadius: 'medium',
        _focusVisibleWithin: focusRing,
      },
      control: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        width: '100%',
        gap: 'small',
        borderRadius: 'medium',
        borderWidth: 'hairline',
        borderColor: 'border.default',
        backgroundColor: 'surface.default',
        transition: transition(['border-color', 'background-color'], 'fast'),
      },
      indicator: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '20px',
        height: '20px',
        borderRadius: 'full',
        borderWidth: 'hairline',
        borderColor: 'border.strong',
        backgroundColor: 'surface.default',
        flexShrink: 0,
      },
      label: { fontSize: 'small', fontWeight: 'medium', color: 'text.primary', flex: 1 },
      description: { fontSize: 'xsmall', color: 'text.secondary' },
    },
    variants: {
      size: {
        small: { control: { padding: 'tiny' }, label: { fontSize: 'xsmall' } },
        medium: { control: { padding: 'small' }, label: { fontSize: 'small' } },
        large: { control: { padding: 'medium' }, label: { fontSize: 'medium' } },
      },
      state: {
        idle: {},
        checked: {
          control: { borderColor: 'brand.base', backgroundColor: 'brand.subtle' },
          indicator: { borderColor: 'brand.base' },
        },
        invalid: { control: { borderColor: 'feedback.critical.base' } },
        disabled: { root: { opacity: 0.6 } },
      },
    },
    defaultVariants: { size: 'medium', state: 'idle' },
  }),

  switch: defineSlotRecipe({
    slots: ['root', 'track', 'thumb'] as const,
    base: {
      root: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'tiny',
        userSelect: 'none',
        borderRadius: 'full',
        _focusVisibleWithin: focusRing,
      },
      track: {
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: 'full',
        backgroundColor: 'border.strong',
        transition: transition('background-color', 'normal'),
      },
      thumb: {
        borderRadius: 'full',
        backgroundColor: 'surface.default',
        flexShrink: 0,
        transition: transition('transform', 'normal'),
      },
    },
    variants: {
      size: {
        small: {
          track: { width: '36px', height: '20px', paddingLeft: '2px', paddingRight: '2px' },
          thumb: { width: '16px', height: '16px' },
        },
        medium: {
          track: { width: '44px', height: '24px', paddingLeft: '2px', paddingRight: '2px' },
          thumb: { width: '20px', height: '20px' },
        },
        large: {
          track: { width: '52px', height: '28px', paddingLeft: '2px', paddingRight: '2px' },
          thumb: { width: '24px', height: '24px' },
        },
      },
      state: {
        idle: {},
        checked: { track: { backgroundColor: 'interactive.default' } },
        invalid: { track: { backgroundColor: 'feedback.critical.base' } },
        disabled: { root: { opacity: 0.6 } },
      },
    },
    defaultVariants: { size: 'medium', state: 'idle' },
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
        borderColor: 'border.default',
        backgroundColor: 'surface.default',
        color: 'text.primary',
        _focusVisible: focusRing,
      },
      value: { flex: 1 },
      icon: { display: 'inline-flex', alignItems: 'center' },
      content: {
        borderRadius: 'nano',
        borderWidth: 'hairline',
        borderColor: 'border.default',
        backgroundColor: 'surface.default',
        overflow: 'hidden',
      },
      item: {
        display: 'flex',
        alignItems: 'center',
        color: 'text.primary',
        paddingLeft: 'small',
        paddingRight: 'small',
      },
      itemText: { fontSize: 'small' },
    },
    variants: {
      size: {
        small: {
          trigger: { minHeight: '44px', paddingLeft: 'tiny', paddingRight: 'tiny', fontSize: 'xsmall' },
          item: { minHeight: '44px' },
          value: { fontSize: 'xsmall' },
        },
        medium: {
          trigger: { minHeight: '44px', paddingLeft: 'small', paddingRight: 'small', fontSize: 'small' },
          item: { minHeight: '44px' },
          value: { fontSize: 'small' },
        },
        large: {
          trigger: { minHeight: '48px', paddingLeft: 'small', paddingRight: 'small', fontSize: 'medium' },
          item: { minHeight: '44px' },
          value: { fontSize: 'medium' },
        },
      },
      state: {
        idle: {},
        open: { trigger: { borderColor: 'border.interactive' } },
        invalid: { trigger: { borderColor: 'feedback.critical.base' } },
        disabled: { trigger: { opacity: 0.6 } },
      },
    },
    defaultVariants: { size: 'medium', state: 'idle' },
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
        boxShadow: 'xl',
      },
      title: { fontWeight: 'medium' },
      description: {},
    },
    variants: {
      size: {
        small: { content: { maxWidth: 'dialog.small', padding: 'medium' } },
        medium: { content: { maxWidth: 'dialog.medium', padding: 'large' } },
        large: { content: { maxWidth: 'dialog.large', padding: 'large' } },
      },
    },
    defaultVariants: { size: 'medium' },
  }),

  drawer: defineSlotRecipe({
    slots: ['overlay', 'content', 'title'] as const,
    base: {
      overlay: { position: 'fixed', inset: '0' },
      content: { position: 'fixed', display: 'flex', flexDirection: 'column', boxShadow: 'xl' },
      title: { fontWeight: 'medium' },
    },
    variants: {
      size: {
        small: { content: { padding: 'small' } },
        medium: { content: { padding: 'medium' } },
        large: { content: { padding: 'large' } },
      },
    },
    defaultVariants: { size: 'medium' },
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
      borderRadius: 'full',
      fontWeight: 'medium',
    },
    variants: {
      size: {
        small: { padding: '2px 6px', fontSize: 'xsmall' },
        medium: { padding: '3px 8px', fontSize: 'xsmall' },
      },
    },
    defaultVariants: { size: 'medium' },
  },

  card: {
    base: {
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 'medium',
      overflow: 'hidden',
    },
    variants: {
      variant: {
        outlined: { borderWidth: 'hairline' },
        elevated: { boxShadow: 'md' },
        flat: {},
      },
      padding: {
        none: { padding: 'none' },
        small: { padding: 'tiny' },
        medium: { padding: 'medium' },
        large: { padding: 'large' },
      },
    },
    defaultVariants: { variant: 'outlined', padding: 'medium' },
  },

  chip: {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 'full',
      fontWeight: 'medium',
      borderWidth: 'hairline',
    },
    variants: {
      size: {
        small: { padding: '3px 8px', fontSize: 'xsmall' },
        medium: { padding: '5px 12px', fontSize: 'sm' },
      },
    },
    defaultVariants: { size: 'medium' },
  },

  avatar: defineSlotRecipe({
    slots: ['root', 'image', 'fallback'] as const,
    base: {
      root: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 },
      image: { width: '100%', height: '100%', objectFit: 'cover' },
      fallback: { display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'medium' },
    },
    variants: {
      size: {
        xsmall: { root: { width: '24px', height: '24px' }, fallback: { fontSize: 'xsmall' } },
        small: { root: { width: '32px', height: '32px' }, fallback: { fontSize: 'xsmall' } },
        medium: { root: { width: '40px', height: '40px' }, fallback: { fontSize: 'sm' } },
        large: { root: { width: '48px', height: '48px' }, fallback: { fontSize: 'small' } },
        xlarge: { root: { width: '64px', height: '64px' }, fallback: { fontSize: 'md' } },
      },
    },
    defaultVariants: { size: 'medium' },
  }),

  alert: defineSlotRecipe({
    slots: ['root', 'icon', 'title', 'description', 'close'] as const,
    base: {
      root: { display: 'flex', alignItems: 'flex-start', borderLeftWidth: 'thick', borderLeftStyle: 'solid' },
      icon: { display: 'inline-flex', flexShrink: 0 },
      title: { fontWeight: 'medium', fontSize: 'small' },
      description: { fontSize: 'sm' },
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
      trigger: { width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontWeight: 'medium' },
      content: {},
    },
    variants: {},
    defaultVariants: {},
  }),

  toast: defineSlotRecipe({
    slots: ['root', 'title', 'description', 'close'] as const,
    base: {
      root: { display: 'flex', alignItems: 'flex-start', borderLeftWidth: 'thick', borderLeftStyle: 'solid', borderRadius: 'small' },
      title: { fontWeight: 'medium', fontSize: 'small' },
      description: { fontSize: 'sm' },
      close: { marginLeft: 'auto', display: 'inline-flex' },
    },
    variants: {},
    defaultVariants: {},
  }),
};

export const baseTheme = {
  borderWidths: borderWidth,
  radii: borderRadius,
  sizes: { ...spacing, control: controlSize, dialog: dialogSize },
  space: spacing,
  opacity,
  letterSpacings: letterSpacing,
  lineHeights: lineHeight,
  fontWeights: fontWeight,
  fontSizes: fontSize,
  fonts: fontFamily,
  zIndices: zIndex,
  iconSizes: iconSize,
  shadows,
  motion,
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
