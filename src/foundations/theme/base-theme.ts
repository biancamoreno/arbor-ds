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
  avatarSize,
  avatarOverlap,
  spinnerSize,
  touchTarget,
  selectContentSize,
  componentTokens,
} from '../tokens';
import { transition } from './transition';
import type { ThemeRecipes, SlotRecipeConfig } from './types';

const defineSlotRecipe = <T extends SlotRecipeConfig>(config: T): T => config;

const focusRing = {
  outline: '2px solid',
  outlineColor: 'focus.ring',
  outlineOffset: '2px',
} as const;

const recipes: ThemeRecipes = {
  text: {
    base: {
      textDecorationLine: 'none',
      textTransform: 'none',
    },
    variants: {
      variant: {
        displayHero: {
          fontFamily: 'sans',
          fontSize: 'displayHero',
          fontWeight: 'semibold',
          lineHeight: 'displayHero',
          letterSpacing: 'tightest',
        },
        displayLarge: {
          fontFamily: 'sans',
          fontSize: 'displayLarge',
          fontWeight: 'semibold',
          lineHeight: 'displayLarge',
          letterSpacing: 'tightest',
        },
        displayMedium: {
          fontFamily: 'sans',
          fontSize: 'displayMedium',
          fontWeight: 'semibold',
          lineHeight: 'displayMedium',
          letterSpacing: 'tight',
        },
        displaySmall: {
          fontFamily: 'sans',
          fontSize: 'displaySmall',
          fontWeight: 'semibold',
          lineHeight: 'displaySmall',
          letterSpacing: 'tight',
        },
        headingLarge: {
          fontFamily: 'sans',
          fontSize: 'xlarge',
          fontWeight: 'semibold',
          lineHeight: 'xlarge',
          letterSpacing: 'tight',
        },
        headingMedium: {
          fontFamily: 'sans',
          fontSize: 'large',
          fontWeight: 'semibold',
          lineHeight: 'large',
          letterSpacing: 'tight',
        },
        headingSmall: {
          fontFamily: 'sans',
          fontSize: 'lg',
          fontWeight: 'semibold',
          lineHeight: 'medium',
          letterSpacing: 'tight',
        },
        subheading: {
          fontFamily: 'sans',
          fontSize: 'medium',
          fontWeight: 'semibold',
          lineHeight: 'medium',
          letterSpacing: 'normal',
        },
        bodyLarge: {
          fontFamily: 'sans',
          fontSize: 'md',
          fontWeight: 'regular',
          lineHeight: 'medium',
          letterSpacing: 'normal',
        },
        bodyMedium: {
          fontFamily: 'sans',
          fontSize: 'small',
          fontWeight: 'regular',
          lineHeight: 'small',
          letterSpacing: 'normal',
        },
        bodySmall: {
          fontFamily: 'sans',
          fontSize: 'sm',
          fontWeight: 'regular',
          lineHeight: 'xsmall',
          letterSpacing: 'normal',
        },
        label: {
          fontFamily: 'sans',
          fontSize: 'sm',
          fontWeight: 'medium',
          lineHeight: 'xsmall',
          letterSpacing: 'normal',
        },
        caption: {
          fontFamily: 'sans',
          fontSize: 'xs',
          fontWeight: 'regular',
          lineHeight: 'xsmall',
          letterSpacing: 'normal',
        },
        overline: {
          fontFamily: 'sans',
          fontSize: 'xsmall',
          fontWeight: 'semibold',
          lineHeight: 'xxsmall',
          letterSpacing: 'widest',
          textTransform: 'uppercase',
        },
        code: {
          fontFamily: 'mono',
          fontSize: 'sm',
          fontWeight: 'regular',
          lineHeight: 'xsmall',
          letterSpacing: 'normal',
        },
      },
    },
    defaultVariants: { variant: 'bodyMedium' },
  },
  button: {
    base: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '$button.gap',
      borderRadius: '$button.borderRadius',
      borderWidth: '$button.borderWidth',
      borderStyle: 'solid',
      fontWeight: '$button.fontWeight',
      transition: transition(['background-color', 'border-color', 'opacity', 'filter'], 'fast'),
      _hover: { opacity: 0.92 },
      _active: { opacity: 0.8 },
    },
    variants: {
      variant: {
        primary: {
          backgroundColor: '$button.colors.primary.bg',
          borderColor: '$button.colors.primary.border',
          color: '$button.colors.primary.text',
        },
        secondary: {
          backgroundColor: '$button.colors.secondary.bg',
          borderColor: '$button.colors.secondary.border',
          color: '$button.colors.secondary.text',
        },
        ghost: {
          backgroundColor: '$button.colors.ghost.bg',
          borderColor: '$button.colors.ghost.border',
          color: '$button.colors.ghost.text',
        },
        danger: {
          backgroundColor: '$button.colors.danger.bg',
          borderColor: '$button.colors.danger.border',
          color: '$button.colors.danger.text',
        },
      },
      size: {
        small: {
          height: '$button.height.small',
          paddingLeft: '$button.padding.small.inline',
          paddingRight: '$button.padding.small.inline',
          paddingTop: '$button.padding.small.block',
          paddingBottom: '$button.padding.small.block',
          fontSize: '$button.fontSize.small',
        },
        medium: {
          height: '$button.height.medium',
          paddingLeft: '$button.padding.medium.inline',
          paddingRight: '$button.padding.medium.inline',
          paddingTop: '$button.padding.medium.block',
          paddingBottom: '$button.padding.medium.block',
          fontSize: '$button.fontSize.medium',
        },
        large: {
          height: '$button.height.large',
          paddingLeft: '$button.padding.large.inline',
          paddingRight: '$button.padding.large.inline',
          paddingTop: '$button.padding.large.block',
          paddingBottom: '$button.padding.large.block',
          fontSize: '$button.fontSize.large',
        },
      },
    },
    defaultVariants: { variant: 'primary', size: 'medium' },
  },

  field: defineSlotRecipe({
    slots: ['root', 'label', 'requiredIndicator', 'control', 'description', 'error'] as const,
    base: {
      root: { display: 'flex', flexDirection: 'column', gap: '$field.gap' },
      label: {
        fontSize: '$field.label.fontSize',
        fontWeight: '$field.label.fontWeight',
        lineHeight: '$field.label.lineHeight',
        color: '$field.colors.label.default',
      },
      requiredIndicator: { color: '$field.colors.requiredIndicator' },
      description: {
        fontSize: '$field.description.fontSize',
        lineHeight: '$field.description.lineHeight',
        color: '$field.colors.description',
      },
      error: {
        fontSize: '$field.error.fontSize',
        lineHeight: '$field.error.lineHeight',
        color: '$field.colors.error',
      },
    },
    variants: {
      invalid: {
        true: { label: { color: '$field.colors.label.invalid' } },
        false: {},
      },
    },
    defaultVariants: { invalid: false },
  }),

  fileUpload: defineSlotRecipe({
    slots: [
      'root',
      'dropZone',
      'idleIcon',
      'idleTitle',
      'idleHint',
      'previewFrame',
      'previewThumbnail',
      'previewLabel',
    ] as const,
    base: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        gap: '$fileUpload.gap.root',
      },
      dropZone: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '$fileUpload.gap.dropZone',
        padding: '$fileUpload.padding.dropZone',
        borderRadius: '$fileUpload.borderRadius',
        borderWidth: '$fileUpload.borderWidth.dropZone',
        borderStyle: 'dashed',
        borderColor: '$fileUpload.colors.dropZone.border.idle',
        backgroundColor: '$fileUpload.colors.dropZone.background.idle',
        cursor: 'pointer',
        transition: transition(['border-color', 'background-color'], 'fast'),
        _focusVisible: focusRing,
      },
      idleIcon: { color: '$fileUpload.colors.dropZone.icon' },
      idleTitle: { color: '$fileUpload.colors.dropZone.title' },
      idleHint: { color: '$fileUpload.colors.dropZone.hint' },
      previewFrame: {
        display: 'flex',
        alignItems: 'center',
        gap: '$fileUpload.gap.preview',
        padding: '$fileUpload.padding.preview',
        borderRadius: '$fileUpload.borderRadius',
        borderWidth: '$fileUpload.borderWidth.preview',
        borderStyle: 'solid',
        borderColor: '$fileUpload.colors.preview.border',
      },
      previewThumbnail: {
        width: '$fileUpload.thumbnail.size',
        height: '$fileUpload.thumbnail.size',
        borderRadius: '$fileUpload.thumbnail.borderRadius',
        overflow: 'hidden',
        flexShrink: 0,
      },
      previewLabel: { color: '$fileUpload.colors.preview.title' },
    },
    variants: {
      state: {
        idle: {},
        dragging: {
          dropZone: {
            borderColor: '$fileUpload.colors.dropZone.border.dragging',
            backgroundColor: '$fileUpload.colors.dropZone.background.dragging',
          },
        },
        invalid: {
          dropZone: {
            borderColor: '$fileUpload.colors.dropZone.border.invalid',
            backgroundColor: '$fileUpload.colors.dropZone.background.invalid',
          },
        },
        disabled: {
          root: { opacity: '$fileUpload.opacity.disabled' },
          dropZone: { cursor: 'not-allowed' },
        },
      },
    },
    defaultVariants: { state: 'idle' },
  }),

  input: defineSlotRecipe({
    slots: ['frame', 'control', 'clearButton'] as const,
    base: {
      frame: {
        width: '100%',
        borderRadius: '$input.borderRadius',
        borderWidth: '$input.borderWidth',
        borderStyle: 'solid',
        transition: transition(['border-color', 'box-shadow'], 'fast'),
        _focusVisible: focusRing,
        _focusVisibleWithin: focusRing,
      },
      control: {
        color: '$input.colors.text',
        _placeholder: { color: '$input.colors.placeholder' },
      },
      clearButton: {
        color: '$input.colors.clearButton',
      },
    },
    variants: {
      size: {
        small: {
          frame: {
            minHeight: '$input.height.small',
            paddingInline: '$input.padding.small.inline',
            paddingBlock: '$input.padding.small.block',
          },
          control: { fontSize: '$input.fontSize.small' },
        },
        medium: {
          frame: {
            minHeight: '$input.height.medium',
            paddingInline: '$input.padding.medium.inline',
            paddingBlock: '$input.padding.medium.block',
          },
          control: { fontSize: '$input.fontSize.medium' },
        },
        large: {
          frame: {
            minHeight: '$input.height.large',
            paddingInline: '$input.padding.large.inline',
            paddingBlock: '$input.padding.large.block',
          },
          control: { fontSize: '$input.fontSize.large' },
        },
      },
      variant: {
        default: {
          frame: {
            backgroundColor: '$input.colors.background.default',
            borderColor: '$input.colors.border.default',
          },
        },
        filled: {
          frame: {
            backgroundColor: '$input.colors.background.filled',
            borderColor: '$input.colors.border.default',
          },
        },
      },
      state: {
        idle: {},
        error: { frame: { borderColor: '$input.colors.border.error' } },
        disabled: { frame: { opacity: '$input.opacity.disabled' } },
      },
    },
    defaultVariants: { size: 'medium', variant: 'default', state: 'idle' },
  }),

  checkbox: defineSlotRecipe({
    slots: ['root', 'indicator', 'label', 'description'] as const,
    base: {
      root: {
        display: 'inline-flex',
        alignItems: 'flex-start',
        gap: '$checkbox.gap',
        position: 'relative',
        borderRadius: '$checkbox.borderRadius',
        _focusVisibleWithin: focusRing,
        _before: {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: 0,
          transform: 'translateY(-50%)',
          width: '$checkbox.minTouch',
          height: '$checkbox.minTouch',
        },
      },
      indicator: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        borderRadius: '$checkbox.borderRadius',
        borderWidth: '$checkbox.borderWidth',
        borderStyle: 'solid',
        borderColor: '$checkbox.colors.indicator.border.default',
        backgroundColor: '$checkbox.colors.indicator.background.outline',
        color: '$checkbox.colors.indicator.mark',
        transition: transition(['background-color', 'border-color'], 'fast'),
      },
      label: {
        fontSize: '$checkbox.fontSize.label.medium',
        fontWeight: '$checkbox.fontWeight.label',
        color: '$checkbox.colors.label',
      },
      description: { fontSize: '$checkbox.fontSize.description', color: '$checkbox.colors.description' },
    },
    variants: {
      size: {
        small: {
          indicator: { width: '$checkbox.size.small', height: '$checkbox.size.small' },
          label: { fontSize: '$checkbox.fontSize.label.small' },
        },
        medium: {
          indicator: { width: '$checkbox.size.medium', height: '$checkbox.size.medium' },
          label: { fontSize: '$checkbox.fontSize.label.medium' },
        },
        large: {
          indicator: { width: '$checkbox.size.large', height: '$checkbox.size.large' },
          label: { fontSize: '$checkbox.fontSize.label.large' },
        },
      },
      variant: {
        outline: {},
        filled: {
          indicator: { backgroundColor: '$checkbox.colors.indicator.background.filled' },
        },
      },
      state: {
        idle: {},
        checked: {
          indicator: {
            borderColor: '$checkbox.colors.indicator.border.checked',
            backgroundColor: '$checkbox.colors.indicator.background.checked',
          },
        },
        invalid: { indicator: { borderColor: '$checkbox.colors.indicator.border.invalid' } },
        disabled: { root: { opacity: '$checkbox.opacity.disabled' } },
      },
    },
    defaultVariants: { size: 'medium', variant: 'outline', state: 'idle' },
  }),

  radio: defineSlotRecipe({
    slots: ['root', 'control', 'indicator', 'dot', 'label', 'description'] as const,
    base: {
      root: {
        display: 'inline-flex',
        position: 'relative',
        borderRadius: 'small',
        _focusVisibleWithin: focusRing,
        _before: {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: 0,
          transform: 'translateY(-50%)',
          width: '$radio.minTouch',
          height: '$radio.minTouch',
        },
      },
      control: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '$radio.gap',
      },
      indicator: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '$radio.indicator.size',
        height: '$radio.indicator.size',
        borderRadius: '$radio.indicator.borderRadius',
        borderWidth: '$radio.indicator.borderWidth',
        borderStyle: 'solid',
        borderColor: '$radio.colors.indicator.border.default',
        backgroundColor: '$radio.colors.indicator.background.outline',
        flexShrink: 0,
        transition: transition(['background-color', 'border-color'], 'fast'),
      },
      dot: {
        width: '$radio.indicator.dotSize',
        height: '$radio.indicator.dotSize',
        borderRadius: 'full',
        backgroundColor: 'transparent',
        transition: transition(['background-color'], 'fast'),
      },
      label: {
        fontSize: '$radio.fontSize.label.medium',
        fontWeight: '$radio.fontWeight.label',
        color: '$radio.colors.label',
      },
      description: { fontSize: '$radio.fontSize.description', color: '$radio.colors.description' },
    },
    variants: {
      size: {
        small: { label: { fontSize: '$radio.fontSize.label.small' } },
        medium: { label: { fontSize: '$radio.fontSize.label.medium' } },
        large: { label: { fontSize: '$radio.fontSize.label.large' } },
      },
      variant: {
        outline: {},
        filled: {
          indicator: { backgroundColor: '$radio.colors.indicator.background.filled' },
        },
      },
      state: {
        idle: {},
        checked: {
          indicator: {
            borderColor: '$radio.colors.indicator.border.checked',
            backgroundColor: '$radio.colors.indicator.background.checked',
          },
          dot: { backgroundColor: '$radio.colors.indicator.dot' },
        },
        invalid: { indicator: { borderColor: '$radio.colors.indicator.border.invalid' } },
        disabled: { root: { opacity: '$radio.opacity.disabled' } },
      },
    },
    defaultVariants: { size: 'medium', variant: 'outline', state: 'idle' },
  }),

  switch: defineSlotRecipe({
    slots: ['root', 'track', 'thumb'] as const,
    base: {
      root: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '$switch.gap',
        userSelect: 'none',
        borderRadius: '$switch.borderRadius',
        _focusVisibleWithin: focusRing,
      },
      track: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        borderRadius: '$switch.borderRadius',
        backgroundColor: '$switch.colors.track.default',
        transition: transition('background-color', 'normal'),
        _before: {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: '$switch.track.minTouch',
          minHeight: '$switch.track.minTouch',
        },
      },
      thumb: {
        borderRadius: '$switch.thumb.borderRadius',
        backgroundColor: '$switch.colors.thumb.default',
        flexShrink: 0,
        transition: transition('transform', 'normal'),
      },
    },
    variants: {
      size: {
        small: {
          track: {
            width: '$switch.track.size.small.width',
            height: '$switch.track.size.small.height',
            paddingLeft: '$switch.track.padding',
            paddingRight: '$switch.track.padding',
          },
          thumb: { width: '$switch.thumb.size.small', height: '$switch.thumb.size.small' },
        },
        medium: {
          track: {
            width: '$switch.track.size.medium.width',
            height: '$switch.track.size.medium.height',
            paddingLeft: '$switch.track.padding',
            paddingRight: '$switch.track.padding',
          },
          thumb: { width: '$switch.thumb.size.medium', height: '$switch.thumb.size.medium' },
        },
        large: {
          track: {
            width: '$switch.track.size.large.width',
            height: '$switch.track.size.large.height',
            paddingLeft: '$switch.track.padding',
            paddingRight: '$switch.track.padding',
          },
          thumb: { width: '$switch.thumb.size.large', height: '$switch.thumb.size.large' },
        },
      },
      state: {
        idle: {},
        checked: { track: { backgroundColor: '$switch.colors.track.checked' } },
        invalid: { track: { backgroundColor: '$switch.colors.track.invalid' } },
        disabled: { root: { opacity: '$switch.opacity.disabled' } },
      },
    },
    defaultVariants: { size: 'medium', state: 'idle' },
  }),

  select: defineSlotRecipe({
    slots: ['root', 'trigger', 'value', 'icon', 'content', 'item', 'itemLabel', 'itemDescription', 'itemAdornment', 'itemCheck', 'itemText', 'emptyMessage'] as const,
    base: {
      root: { display: 'flex', flexDirection: 'column', gap: '$select.gap', width: '100%' },
      trigger: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        borderRadius: '$select.borderRadius',
        borderWidth: '$select.borderWidth',
        borderColor: '$select.colors.trigger.border.default',
        backgroundColor: '$select.colors.trigger.background',
        color: '$select.colors.trigger.text',
        transition: transition(['border-color', 'box-shadow'], 'fast'),
        _focusVisible: focusRing,
      },
      value: { flex: 1 },
      icon: { display: 'inline-flex', alignItems: 'center' },
      content: {
        borderRadius: '$select.borderRadius',
        borderWidth: '$select.borderWidth',
        borderColor: '$select.colors.content.border',
        backgroundColor: '$select.colors.content.background',
        paddingTop: '$select.content.padding.block',
        paddingBottom: '$select.content.padding.block',
        overflow: 'hidden',
      },
      item: {
        display: 'flex',
        alignItems: 'center',
        gap: '$select.item.gap',
        color: '$select.colors.item.text',
        paddingLeft: '$select.item.padding.inline',
        paddingRight: '$select.item.padding.inline',
        paddingTop: '$select.item.padding.block',
        paddingBottom: '$select.item.padding.block',
        transition: transition(['background-color'], 'fast'),
      },
      itemLabel: { fontSize: '$select.item.fontSize', flex: 1 },
      itemDescription: { fontSize: 'xsmall', color: 'text.secondary' },
      itemAdornment: { display: 'inline-flex', alignItems: 'center', flexShrink: 0 },
      itemCheck: { display: 'inline-flex', alignItems: 'center', flexShrink: 0, color: '$select.colors.trigger.border.open' },
      itemText: { fontSize: '$select.item.fontSize' },
      emptyMessage: {
        color: '$select.emptyMessage.color',
        fontSize: '$select.emptyMessage.fontSize',
        paddingLeft: '$select.emptyMessage.padding.inline',
        paddingRight: '$select.emptyMessage.padding.inline',
        paddingTop: '$select.emptyMessage.padding.block',
        paddingBottom: '$select.emptyMessage.padding.block',
        textAlign: 'center',
      },
    },
    variants: {
      size: {
        small: {
          trigger: {
            minHeight: '$select.trigger.minHeight.small',
            paddingLeft: '$select.trigger.padding.small.inline',
            paddingRight: '$select.trigger.padding.small.inline',
            fontSize: '$select.trigger.fontSize.small',
          },
          item: { minHeight: '$select.item.minHeight' },
          value: { fontSize: '$select.value.fontSize.small' },
          content: { maxHeight: '$select.content.maxHeight.small' },
        },
        medium: {
          trigger: {
            minHeight: '$select.trigger.minHeight.medium',
            paddingLeft: '$select.trigger.padding.medium.inline',
            paddingRight: '$select.trigger.padding.medium.inline',
            fontSize: '$select.trigger.fontSize.medium',
          },
          item: { minHeight: '$select.item.minHeight' },
          value: { fontSize: '$select.value.fontSize.medium' },
          content: { maxHeight: '$select.content.maxHeight.medium' },
        },
        large: {
          trigger: {
            minHeight: '$select.trigger.minHeight.large',
            paddingLeft: '$select.trigger.padding.large.inline',
            paddingRight: '$select.trigger.padding.large.inline',
            fontSize: '$select.trigger.fontSize.large',
          },
          item: { minHeight: '$select.item.minHeight' },
          value: { fontSize: '$select.value.fontSize.large' },
          content: { maxHeight: '$select.content.maxHeight.large' },
        },
      },
      state: {
        idle: {},
        open: { trigger: { borderColor: '$select.colors.trigger.border.open' } },
        invalid: { trigger: { borderColor: '$select.colors.trigger.border.invalid' } },
        disabled: { trigger: { opacity: '$select.opacity.disabled' } },
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
        borderRadius: '$dialog.borderRadius',
        boxShadow: '$dialog.shadow',
      },
      title: { fontWeight: '$dialog.fontWeight.title' },
      description: {},
    },
    variants: {
      size: {
        small: { content: { maxWidth: '$dialog.size.small.maxWidth', padding: '$dialog.size.small.padding' } },
        medium: { content: { maxWidth: '$dialog.size.medium.maxWidth', padding: '$dialog.size.medium.padding' } },
        large: { content: { maxWidth: '$dialog.size.large.maxWidth', padding: '$dialog.size.large.padding' } },
      },
    },
    defaultVariants: { size: 'medium' },
  }),

  drawer: defineSlotRecipe({
    slots: ['overlay', 'content', 'title'] as const,
    base: {
      overlay: { position: 'fixed', inset: '0' },
      content: { position: 'fixed', display: 'flex', flexDirection: 'column', boxShadow: '$drawer.shadow' },
      title: { fontWeight: '$drawer.fontWeight.title' },
    },
    variants: {
      size: {
        small: { content: { padding: '$drawer.size.small.padding' } },
        medium: { content: { padding: '$drawer.size.medium.padding' } },
        large: { content: { padding: '$drawer.size.large.padding' } },
      },
    },
    defaultVariants: { size: 'medium' },
  }),

  tooltip: defineSlotRecipe({
    slots: ['content'] as const,
    base: {
      content: {
        position: 'absolute',
        borderRadius: '$tooltip.borderRadius',
        paddingInline: '$tooltip.padding.inline',
        paddingBlock: '$tooltip.padding.block',
        fontSize: '$tooltip.fontSize',
        lineHeight: 'xsmall',
        pointerEvents: 'none',
      },
    },
    variants: {},
    defaultVariants: {},
  }),

  badge: defineSlotRecipe({
    slots: ['root', 'label', 'icon'] as const,
    base: {
      root: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '$badge.gap',
        borderRadius: '$badge.borderRadius',
        borderWidth: '$badge.borderWidth',
        borderStyle: 'solid',
        fontFamily: 'sans',
        fontWeight: '$badge.fontWeight',
        lineHeight: 'xsmall',
      },
      label: {},
      icon: { display: 'inline-flex', alignItems: 'center', flexShrink: 0 },
    },
    variants: {
      size: {
        small: {
          root: {
            paddingLeft: '$badge.padding.small.inline',
            paddingRight: '$badge.padding.small.inline',
            paddingTop: '$badge.padding.small.block',
            paddingBottom: '$badge.padding.small.block',
            fontSize: '$badge.fontSize.small',
          },
        },
        medium: {
          root: {
            paddingLeft: '$badge.padding.medium.inline',
            paddingRight: '$badge.padding.medium.inline',
            paddingTop: '$badge.padding.medium.block',
            paddingBottom: '$badge.padding.medium.block',
            fontSize: '$badge.fontSize.medium',
          },
        },
      },
      tone: {
        neutral: {}, brand: {}, success: {}, warning: {}, critical: {}, info: {},
      },
      variant: {
        solid: {}, subtle: {},
      },
    },
    compoundVariants: [
      { conditions: { tone: 'neutral',  variant: 'solid'  }, style: { root: { backgroundColor: 'text.secondary',            borderColor: 'text.secondary',                color: 'text.inverse'              } } },
      { conditions: { tone: 'neutral',  variant: 'subtle' }, style: { root: { backgroundColor: 'background.subtle',         borderColor: 'border.subtle',                 color: 'text.secondary'            } } },
      { conditions: { tone: 'brand',    variant: 'solid'  }, style: { root: { backgroundColor: 'brand.solid',               borderColor: 'brand.solid',                   color: 'text.inverse'              } } },
      { conditions: { tone: 'brand',    variant: 'subtle' }, style: { root: { backgroundColor: 'brand.bgSubtle',            borderColor: 'brand.borderSubtle',            color: 'brand.text'                } } },
      { conditions: { tone: 'success',  variant: 'solid'  }, style: { root: { backgroundColor: 'feedback.success.solid',    borderColor: 'feedback.success.solid',        color: 'text.inverse'              } } },
      { conditions: { tone: 'success',  variant: 'subtle' }, style: { root: { backgroundColor: 'feedback.success.bgSubtle', borderColor: 'feedback.success.borderSubtle', color: 'feedback.success.text'     } } },
      { conditions: { tone: 'warning',  variant: 'solid'  }, style: { root: { backgroundColor: 'feedback.warning.solid',    borderColor: 'feedback.warning.solid',        color: 'text.inverse'              } } },
      { conditions: { tone: 'warning',  variant: 'subtle' }, style: { root: { backgroundColor: 'feedback.warning.bgSubtle', borderColor: 'feedback.warning.borderSubtle', color: 'feedback.warning.text'     } } },
      { conditions: { tone: 'critical', variant: 'solid'  }, style: { root: { backgroundColor: 'feedback.critical.solid',   borderColor: 'feedback.critical.solid',       color: 'text.inverse'              } } },
      { conditions: { tone: 'critical', variant: 'subtle' }, style: { root: { backgroundColor: 'feedback.critical.bgSubtle',borderColor: 'feedback.critical.borderSubtle',color: 'feedback.critical.text'    } } },
      { conditions: { tone: 'info',     variant: 'solid'  }, style: { root: { backgroundColor: 'feedback.info.solid',       borderColor: 'feedback.info.solid',           color: 'text.inverse'              } } },
      { conditions: { tone: 'info',     variant: 'subtle' }, style: { root: { backgroundColor: 'feedback.info.bgSubtle',    borderColor: 'feedback.info.borderSubtle',    color: 'feedback.info.text'        } } },
    ],
    defaultVariants: { tone: 'neutral', variant: 'solid', size: 'medium' },
  }),

  counter: defineSlotRecipe({
    slots: ['root', 'label', 'controls', 'button', 'input', 'display'] as const,
    base: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        gap: '$counter.gap',
      },
      label: {
        fontSize: '$counter.fontSize.label',
        fontWeight: '$counter.fontWeight.label',
        color: '$counter.colors.label',
      },
      controls: {
        display: 'flex',
        alignItems: 'center',
        gap: '$counter.controls.gap',
      },
      button: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '$counter.borderRadius',
        borderWidth: '$counter.borderWidth',
        borderStyle: 'solid',
        borderColor: '$counter.colors.button.border',
        backgroundColor: '$counter.colors.button.background.default',
        color: '$counter.colors.button.text.default',
        cursor: 'pointer',
        transition: transition(['background-color', 'color'], 'fast'),
        _focusVisible: focusRing,
        _disabled: {
          backgroundColor: '$counter.colors.button.background.disabled',
          color: '$counter.colors.button.text.disabled',
          cursor: 'not-allowed',
        },
        _before: {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: '$counter.minTouch',
          minHeight: '$counter.minTouch',
        },
      },
      input: {
        width: '$counter.input.width',
        borderRadius: '$counter.borderRadius',
        borderWidth: '$counter.borderWidth',
        borderStyle: 'solid',
        borderColor: '$counter.colors.input.border',
        backgroundColor: '$counter.colors.input.background',
        color: '$counter.colors.input.text',
        fontWeight: '$counter.fontWeight.value',
        textAlign: 'center',
        outline: 'none',
        transition: transition(['border-color', 'box-shadow'], 'fast'),
        _focusVisible: focusRing,
      },
      display: {
        width: '$counter.input.width',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '$counter.fontWeight.value',
        color: '$counter.colors.input.text',
      },
    },
    variants: {
      size: {
        small: {
          button:  { width: '$counter.button.size.small',  height: '$counter.button.size.small',  fontSize: '$counter.fontSize.small'  },
          input:   { height: '$counter.button.size.small', fontSize: '$counter.fontSize.small'  },
          display: { height: '$counter.button.size.small', fontSize: '$counter.fontSize.small'  },
        },
        medium: {
          button:  { width: '$counter.button.size.medium', height: '$counter.button.size.medium', fontSize: '$counter.fontSize.medium' },
          input:   { height: '$counter.button.size.medium', fontSize: '$counter.fontSize.medium' },
          display: { height: '$counter.button.size.medium', fontSize: '$counter.fontSize.medium' },
        },
        large: {
          button:  { width: '$counter.button.size.large',  height: '$counter.button.size.large',  fontSize: '$counter.fontSize.large'  },
          input:   { height: '$counter.button.size.large', fontSize: '$counter.fontSize.large'  },
          display: { height: '$counter.button.size.large', fontSize: '$counter.fontSize.large'  },
        },
      },
      state: {
        idle: {},
        disabled: { root: { opacity: '$counter.opacity.disabled', pointerEvents: 'none' } },
      },
    },
    defaultVariants: { size: 'medium', state: 'idle' },
  }),

  progressBar: defineSlotRecipe({
    slots: ['root', 'fill', 'indeterminate'] as const,
    base: {
      root: {
        position: 'relative',
        width: '100%',
        borderRadius: '$progressBar.borderRadius',
        backgroundColor: '$progressBar.track.background',
        overflow: 'hidden',
      },
      fill: {
        height: '100%',
        borderRadius: '$progressBar.borderRadius',
        transition: transition(['width'], 'slow', 'standard'),
      },
      indeterminate: {
        position: 'absolute',
        height: '100%',
        width: '$progressBar.indeterminate.width',
        borderRadius: '$progressBar.borderRadius',
      },
    },
    variants: {
      size: {
        small:  { root: { height: '$progressBar.height.small'  } },
        medium: { root: { height: '$progressBar.height.medium' } },
        large:  { root: { height: '$progressBar.height.large'  } },
      },
      tone: {
        brand:    { fill: { backgroundColor: 'brand.solid'             }, indeterminate: { backgroundColor: 'brand.solid'             } },
        success:  { fill: { backgroundColor: 'feedback.success.solid'  }, indeterminate: { backgroundColor: 'feedback.success.solid'  } },
        warning:  { fill: { backgroundColor: 'feedback.warning.solid'  }, indeterminate: { backgroundColor: 'feedback.warning.solid'  } },
        critical: { fill: { backgroundColor: 'feedback.critical.solid' }, indeterminate: { backgroundColor: 'feedback.critical.solid' } },
        info:     { fill: { backgroundColor: 'feedback.info.solid'     }, indeterminate: { backgroundColor: 'feedback.info.solid'     } },
      },
    },
    defaultVariants: { size: 'medium', tone: 'brand' },
  }),

  card: defineSlotRecipe({
    slots: ['root', 'header', 'body', 'footer', 'media'] as const,
    base: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '$card.borderRadius',
        backgroundColor: '$card.background',
        overflow: 'hidden',
      },
      header: {
        paddingBottom: 'small',
        borderStyle: 'solid',
        borderBottomWidth: '$card.borderWidth',
        borderBottomColor: '$card.border',
      },
      body: { flex: 1 },
      footer: {
        paddingTop: 'small',
        borderStyle: 'solid',
        borderTopWidth: '$card.borderWidth',
        borderTopColor: '$card.border',
      },
      media: { overflow: 'hidden' },
    },
    variants: {
      variant: {
        outlined: {
          root: { borderWidth: '$card.borderWidth', borderStyle: 'solid', borderColor: '$card.border' },
        },
        elevated: { root: { boxShadow: '$card.shadow.elevated' } },
        flat: {},
      },
      interactive: {
        false: {},
        true: {
          root: {
            cursor: 'pointer',
            transition: transition(['opacity'], 'fast'),
            _hover: { opacity: 0.92 },
            _active: { opacity: 0.8 },
            _focusVisible: focusRing,
          },
        },
      },
      padding: {
        none:   { header: { padding: '$card.padding.none' },   body: { padding: '$card.padding.none' },   footer: { padding: '$card.padding.none' } },
        xsmall: { header: { padding: '$card.padding.xsmall' }, body: { padding: '$card.padding.xsmall' }, footer: { padding: '$card.padding.xsmall' } },
        small:  { header: { padding: '$card.padding.small' },  body: { padding: '$card.padding.small' },  footer: { padding: '$card.padding.small' } },
        medium: { header: { padding: '$card.padding.medium' }, body: { padding: '$card.padding.medium' }, footer: { padding: '$card.padding.medium' } },
        large:  { header: { padding: '$card.padding.large' },  body: { padding: '$card.padding.large' },  footer: { padding: '$card.padding.large' } },
        xlarge: { header: { padding: '$card.padding.xlarge' }, body: { padding: '$card.padding.xlarge' }, footer: { padding: '$card.padding.xlarge' } },
      },
    },
    defaultVariants: { variant: 'outlined', padding: 'medium', interactive: 'false' },
  }),

  tag: defineSlotRecipe({
    slots: ['root', 'label', 'icon'] as const,
    base: {
      root: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '$tag.gap',
        paddingLeft: '$tag.padding.inline',
        paddingRight: '$tag.padding.inline',
        paddingTop: '$tag.padding.block',
        paddingBottom: '$tag.padding.block',
        borderRadius: '$tag.borderRadius',
        borderWidth: '$tag.borderWidth',
        borderStyle: 'solid',
        fontFamily: 'sans',
        fontWeight: '$tag.fontWeight',
        fontSize: '$tag.fontSize',
        lineHeight: 'xsmall',
      },
      label: {},
      icon: { display: 'inline-flex', alignItems: 'center', flexShrink: 0 },
    },
    variants: {
      tone: {
        neutral: {}, brand: {}, success: {}, warning: {}, critical: {}, info: {},
      },
      variant: {
        solid: {}, outline: {},
      },
    },
    compoundVariants: [
      { conditions: { tone: 'neutral',  variant: 'solid' },   style: { root: { backgroundColor: 'text.secondary',           borderColor: 'text.secondary',           color: 'text.inverse'             } } },
      { conditions: { tone: 'neutral',  variant: 'outline' }, style: { root: { backgroundColor: 'background.subtle',        borderColor: 'border.subtle',            color: 'text.secondary'           } } },
      { conditions: { tone: 'brand',    variant: 'solid' },   style: { root: { backgroundColor: 'brand.solid',              borderColor: 'brand.solid',              color: 'text.inverse'             } } },
      { conditions: { tone: 'brand',    variant: 'outline' }, style: { root: { backgroundColor: 'brand.bgSubtle',           borderColor: 'brand.borderSubtle',       color: 'brand.text'               } } },
      { conditions: { tone: 'success',  variant: 'solid' },   style: { root: { backgroundColor: 'feedback.success.solid',   borderColor: 'feedback.success.solid',   color: 'text.inverse'             } } },
      { conditions: { tone: 'success',  variant: 'outline' }, style: { root: { backgroundColor: 'feedback.success.bgSubtle',borderColor: 'feedback.success.borderSubtle', color: 'feedback.success.text'} } },
      { conditions: { tone: 'warning',  variant: 'solid' },   style: { root: { backgroundColor: 'feedback.warning.solid',   borderColor: 'feedback.warning.solid',   color: 'text.inverse'             } } },
      { conditions: { tone: 'warning',  variant: 'outline' }, style: { root: { backgroundColor: 'feedback.warning.bgSubtle',borderColor: 'feedback.warning.borderSubtle', color: 'feedback.warning.text'} } },
      { conditions: { tone: 'critical', variant: 'solid' },   style: { root: { backgroundColor: 'feedback.critical.solid',  borderColor: 'feedback.critical.solid',  color: 'text.inverse'             } } },
      { conditions: { tone: 'critical', variant: 'outline' }, style: { root: { backgroundColor: 'feedback.critical.bgSubtle',borderColor: 'feedback.critical.borderSubtle', color: 'feedback.critical.text'} } },
      { conditions: { tone: 'info',     variant: 'solid' },   style: { root: { backgroundColor: 'feedback.info.solid',      borderColor: 'feedback.info.solid',      color: 'text.inverse'             } } },
      { conditions: { tone: 'info',     variant: 'outline' }, style: { root: { backgroundColor: 'feedback.info.bgSubtle',   borderColor: 'feedback.info.borderSubtle',color: 'feedback.info.text'       } } },
    ],
    defaultVariants: { tone: 'neutral', variant: 'outline' },
  }),

  chip: defineSlotRecipe({
    slots: ['root', 'label', 'icon', 'remove'] as const,
    base: {
      root: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '$chip.gap',
        borderRadius: '$chip.borderRadius',
        borderWidth: '$chip.borderWidth',
        borderStyle: 'solid',
        fontWeight: '$chip.fontWeight',
        transition: transition(['background-color', 'border-color', 'color', 'opacity'], 'fast'),
      },
      label: { lineHeight: 'inherit' },
      icon: { display: 'inline-flex', alignItems: 'center', flexShrink: 0 },
      remove: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '$chip.remove.minSize',
        minHeight: '$chip.remove.minSize',
        width: '$chip.remove.size',
        height: '$chip.remove.size',
        flexShrink: 0,
        borderRadius: '$chip.remove.borderRadius',
        backgroundColor: 'transparent',
        marginLeft: '$chip.remove.marginLeft',
        padding: 0,
        borderWidth: 0,
        color: 'inherit',
        cursor: 'pointer',
        _focusVisible: focusRing,
        _hover: { backgroundColor: 'background.interactive' },
        transition: transition(['background-color', 'color'], 'fast'),
      },
    },
    variants: {
      size: {
        small: {
          root: {
            paddingLeft: '$chip.padding.small.inline',
            paddingRight: '$chip.padding.small.inline',
            paddingTop: '$chip.padding.small.block',
            paddingBottom: '$chip.padding.small.block',
            fontSize: '$chip.fontSize.small',
          },
        },
        medium: {
          root: {
            paddingLeft: '$chip.padding.medium.inline',
            paddingRight: '$chip.padding.medium.inline',
            paddingTop: '$chip.padding.medium.block',
            paddingBottom: '$chip.padding.medium.block',
            minHeight: '$chip.minHeight.medium',
            fontSize: '$chip.fontSize.medium',
          },
        },
      },
      selectable: {
        true: {
          root: {
            cursor: 'pointer',
            _focusVisible: focusRing,
            _hover: { opacity: 0.92 },
            _active: { opacity: 0.8 },
          },
        },
        false: {},
      },
      variant: {
        filled:   { root: { borderColor: 'transparent' } },
        outlined: { root: { backgroundColor: 'transparent', color: 'text.secondary', borderColor: 'border.default' } },
        subtle:   { root: { backgroundColor: 'transparent', color: 'text.secondary', borderColor: 'border.subtle' } },
      },
      tone: {
        neutral: {}, brand: {}, success: {}, warning: {}, critical: {}, info: {},
      },
      selected: {
        true: {}, false: {},
      },
      disabled: {
        true: {
          root: { cursor: 'not-allowed', opacity: '$chip.opacity.disabled' },
          remove: { cursor: 'not-allowed' },
        },
        false: {},
      },
    },
    compoundVariants: [
      // filled × tone (sempre, selected ou não)
      { conditions: { variant: 'filled', tone: 'neutral',  selected: 'true'  }, style: { root: { backgroundColor: 'text.secondary',          color: 'text.inverse'           } } },
      { conditions: { variant: 'filled', tone: 'neutral',  selected: 'false' }, style: { root: { backgroundColor: 'background.subtle',       color: 'text.primary'           } } },
      { conditions: { variant: 'filled', tone: 'brand',    selected: 'true'  }, style: { root: { backgroundColor: 'brand.solid',              color: 'text.inverse'           } } },
      { conditions: { variant: 'filled', tone: 'brand',    selected: 'false' }, style: { root: { backgroundColor: 'brand.bgElement',            color: 'brand.solidHover'           } } },
      { conditions: { variant: 'filled', tone: 'success',  selected: 'true'  }, style: { root: { backgroundColor: 'feedback.success.solid',   color: 'text.inverse'           } } },
      { conditions: { variant: 'filled', tone: 'success',  selected: 'false' }, style: { root: { backgroundColor: 'feedback.success.bgElement', color: 'feedback.success.solidHover' } } },
      { conditions: { variant: 'filled', tone: 'warning',  selected: 'true'  }, style: { root: { backgroundColor: 'feedback.warning.solid',   color: 'text.inverse'           } } },
      { conditions: { variant: 'filled', tone: 'warning',  selected: 'false' }, style: { root: { backgroundColor: 'feedback.warning.bgElement', color: 'feedback.warning.solidHover' } } },
      { conditions: { variant: 'filled', tone: 'critical', selected: 'true'  }, style: { root: { backgroundColor: 'feedback.critical.solid',  color: 'text.inverse'           } } },
      { conditions: { variant: 'filled', tone: 'critical', selected: 'false' }, style: { root: { backgroundColor: 'feedback.critical.bgElement',color: 'feedback.critical.solidHover' } } },
      { conditions: { variant: 'filled', tone: 'info',     selected: 'true'  }, style: { root: { backgroundColor: 'feedback.info.solid',      color: 'text.inverse'           } } },
      { conditions: { variant: 'filled', tone: 'info',     selected: 'false' }, style: { root: { backgroundColor: 'feedback.info.bgElement',    color: 'feedback.info.solidHover'   } } },
      // outlined × tone (apenas selected=true muda; selected=false já é coberto pela variant)
      { conditions: { variant: 'outlined', tone: 'neutral',  selected: 'true' }, style: { root: { color: 'text.secondary',          borderColor: 'text.secondary'          } } },
      { conditions: { variant: 'outlined', tone: 'brand',    selected: 'true' }, style: { root: { color: 'brand.solid',              borderColor: 'brand.solid'              } } },
      { conditions: { variant: 'outlined', tone: 'success',  selected: 'true' }, style: { root: { color: 'feedback.success.solid',   borderColor: 'feedback.success.solid'   } } },
      { conditions: { variant: 'outlined', tone: 'warning',  selected: 'true' }, style: { root: { color: 'feedback.warning.solid',   borderColor: 'feedback.warning.solid'   } } },
      { conditions: { variant: 'outlined', tone: 'critical', selected: 'true' }, style: { root: { color: 'feedback.critical.solid',  borderColor: 'feedback.critical.solid'  } } },
      { conditions: { variant: 'outlined', tone: 'info',     selected: 'true' }, style: { root: { color: 'feedback.info.solid',      borderColor: 'feedback.info.solid'      } } },
      // subtle × tone (apenas selected=true muda)
      { conditions: { variant: 'subtle', tone: 'neutral',  selected: 'true' }, style: { root: { backgroundColor: 'background.subtle',       color: 'text.primary'             } } },
      { conditions: { variant: 'subtle', tone: 'brand',    selected: 'true' }, style: { root: { backgroundColor: 'brand.bgElement',            color: 'brand.solidHover'             } } },
      { conditions: { variant: 'subtle', tone: 'success',  selected: 'true' }, style: { root: { backgroundColor: 'feedback.success.bgElement', color: 'feedback.success.solidHover'  } } },
      { conditions: { variant: 'subtle', tone: 'warning',  selected: 'true' }, style: { root: { backgroundColor: 'feedback.warning.bgElement', color: 'feedback.warning.solidHover'  } } },
      { conditions: { variant: 'subtle', tone: 'critical', selected: 'true' }, style: { root: { backgroundColor: 'feedback.critical.bgElement',color: 'feedback.critical.solidHover' } } },
      { conditions: { variant: 'subtle', tone: 'info',     selected: 'true' }, style: { root: { backgroundColor: 'feedback.info.bgElement',    color: 'feedback.info.solidHover'     } } },
    ],
    defaultVariants: { size: 'medium', selectable: 'false', variant: 'subtle', tone: 'neutral', selected: 'false', disabled: 'false' },
  }),

  avatar: defineSlotRecipe({
    slots: ['root', 'image', 'fallback', 'overflow'] as const,
    base: {
      root: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
        backgroundColor: '$avatar.background',
      },
      image: { width: '100%', height: '100%', objectFit: 'cover' },
      fallback: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        fontWeight: '$avatar.fontWeight.fallback',
        color: '$avatar.fallback.color',
        lineHeight: '1',
        textTransform: 'uppercase',
      },
      overflow: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
        backgroundColor: '$avatar.overflow.background',
        color: '$avatar.overflow.color',
        fontWeight: '$avatar.fontWeight.fallback',
        lineHeight: '1',
      },
    },
    variants: {
      size: {
        xsmall: {
          root:     { width: '$avatar.size.xsmall', height: '$avatar.size.xsmall' },
          overflow: { width: '$avatar.size.xsmall', height: '$avatar.size.xsmall', fontSize: '$avatar.fontSize.fallback.xsmall' },
          fallback: { fontSize: '$avatar.fontSize.fallback.xsmall' },
        },
        small: {
          root:     { width: '$avatar.size.small',  height: '$avatar.size.small'  },
          overflow: { width: '$avatar.size.small',  height: '$avatar.size.small',  fontSize: '$avatar.fontSize.fallback.small'  },
          fallback: { fontSize: '$avatar.fontSize.fallback.small'  },
        },
        medium: {
          root:     { width: '$avatar.size.medium', height: '$avatar.size.medium' },
          overflow: { width: '$avatar.size.medium', height: '$avatar.size.medium', fontSize: '$avatar.fontSize.fallback.medium' },
          fallback: { fontSize: '$avatar.fontSize.fallback.medium' },
        },
        large: {
          root:     { width: '$avatar.size.large',  height: '$avatar.size.large'  },
          overflow: { width: '$avatar.size.large',  height: '$avatar.size.large',  fontSize: '$avatar.fontSize.fallback.large'  },
          fallback: { fontSize: '$avatar.fontSize.fallback.large'  },
        },
        xlarge: {
          root:     { width: '$avatar.size.xlarge', height: '$avatar.size.xlarge' },
          overflow: { width: '$avatar.size.xlarge', height: '$avatar.size.xlarge', fontSize: '$avatar.fontSize.fallback.xlarge' },
          fallback: { fontSize: '$avatar.fontSize.fallback.xlarge' },
        },
      },
      shape: {
        circle: {
          root:     { borderRadius: '$avatar.borderRadius.circle' },
          overflow: { borderRadius: '$avatar.borderRadius.circle' },
        },
        square: {
          root:     { borderRadius: '$avatar.borderRadius.square' },
          overflow: { borderRadius: '$avatar.borderRadius.square' },
        },
      },
    },
    defaultVariants: { size: 'medium', shape: 'circle' },
  }),

  alert: defineSlotRecipe({
    slots: ['root', 'icon', 'title', 'description', 'close'] as const,
    base: {
      root: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '$alert.gap',
        paddingLeft: '$alert.padding.inline',
        paddingRight: '$alert.padding.inline',
        paddingTop: '$alert.padding.block',
        paddingBottom: '$alert.padding.block',
        borderRadius: '$alert.borderRadius',
        borderLeftWidth: '$alert.borderLeftWidth',
        borderLeftStyle: 'solid',
      },
      icon: { display: 'inline-flex', alignItems: 'center', flexShrink: 0 },
      title: {
        fontWeight: '$alert.fontWeight.title',
        fontSize: '$alert.fontSize.title',
        lineHeight: 'small',
        margin: 0,
      },
      description: {
        fontSize: '$alert.fontSize.description',
        lineHeight: 'small',
        margin: 0,
      },
      close: {
        position: 'relative',
        marginLeft: 'auto',
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '$alert.close.size',
        height: '$alert.close.size',
        padding: 0,
        borderWidth: 0,
        borderRadius: '$alert.close.borderRadius',
        backgroundColor: 'transparent',
        color: 'inherit',
        cursor: 'pointer',
        transition: transition(['background-color'], 'fast'),
        _focusVisible: focusRing,
        _before: {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: '$alert.close.minTouch',
          minHeight: '$alert.close.minTouch',
        },
      },
    },
    variants: {
      tone: {
        neutral:  {}, brand: {}, info: {}, success: {}, warning: {}, critical: {},
      },
    },
    compoundVariants: [
      { conditions: { tone: 'neutral'  }, style: { root: { backgroundColor: '$alert.colors.neutral.background',  borderLeftColor: '$alert.colors.neutral.borderColor'  }, icon: { color: '$alert.colors.neutral.icon'  }, title: { color: '$alert.colors.neutral.title'  }, description: { color: '$alert.colors.neutral.description'  }, close: { _hover: { backgroundColor: '$alert.colors.neutral.closeHover'  } } } },
      { conditions: { tone: 'brand'    }, style: { root: { backgroundColor: '$alert.colors.brand.background',    borderLeftColor: '$alert.colors.brand.borderColor'    }, icon: { color: '$alert.colors.brand.icon'    }, title: { color: '$alert.colors.brand.title'    }, description: { color: '$alert.colors.brand.description'    }, close: { _hover: { backgroundColor: '$alert.colors.brand.closeHover'    } } } },
      { conditions: { tone: 'info'     }, style: { root: { backgroundColor: '$alert.colors.info.background',     borderLeftColor: '$alert.colors.info.borderColor'     }, icon: { color: '$alert.colors.info.icon'     }, title: { color: '$alert.colors.info.title'     }, description: { color: '$alert.colors.info.description'     }, close: { _hover: { backgroundColor: '$alert.colors.info.closeHover'     } } } },
      { conditions: { tone: 'success'  }, style: { root: { backgroundColor: '$alert.colors.success.background',  borderLeftColor: '$alert.colors.success.borderColor'  }, icon: { color: '$alert.colors.success.icon'  }, title: { color: '$alert.colors.success.title'  }, description: { color: '$alert.colors.success.description'  }, close: { _hover: { backgroundColor: '$alert.colors.success.closeHover'  } } } },
      { conditions: { tone: 'warning'  }, style: { root: { backgroundColor: '$alert.colors.warning.background',  borderLeftColor: '$alert.colors.warning.borderColor'  }, icon: { color: '$alert.colors.warning.icon'  }, title: { color: '$alert.colors.warning.title'  }, description: { color: '$alert.colors.warning.description'  }, close: { _hover: { backgroundColor: '$alert.colors.warning.closeHover'  } } } },
      { conditions: { tone: 'critical' }, style: { root: { backgroundColor: '$alert.colors.critical.background', borderLeftColor: '$alert.colors.critical.borderColor' }, icon: { color: '$alert.colors.critical.icon' }, title: { color: '$alert.colors.critical.title' }, description: { color: '$alert.colors.critical.description' }, close: { _hover: { backgroundColor: '$alert.colors.critical.closeHover' } } } },
    ],
    defaultVariants: { tone: 'info' },
  }),

  accordion: defineSlotRecipe({
    slots: ['root', 'item', 'trigger', 'triggerIcon', 'content', 'contentInner'] as const,
    base: {
      root: {
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '$accordion.borderRadius',
        borderWidth: '$accordion.borderWidth',
        borderStyle: 'solid',
        borderColor: '$accordion.border',
        overflow: 'hidden',
      },
      item: {
        borderStyle: 'solid',
        borderBottomWidth: '$accordion.borderWidth',
        borderBottomColor: '$accordion.border',
        _last: { borderBottomWidth: 0 },
      },
      trigger: {
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: '$accordion.trigger.padding.inline',
        paddingRight: '$accordion.trigger.padding.inline',
        paddingTop: '$accordion.trigger.padding.block',
        paddingBottom: '$accordion.trigger.padding.block',
        backgroundColor: 'transparent',
        borderWidth: 0,
        textAlign: 'left',
        fontWeight: '$accordion.trigger.fontWeight',
        fontSize: '$accordion.trigger.fontSize',
        color: '$accordion.trigger.colors.text',
        cursor: 'pointer',
        _hover: { backgroundColor: '$accordion.trigger.colors.hover' },
        _focusVisible: focusRing,
        _disabled: { color: '$accordion.trigger.colors.disabled', cursor: 'not-allowed' },
      },
      triggerIcon: {
        flexShrink: 0,
      },
      content: {
        display: 'grid',
        overflow: 'hidden',
      },
      contentInner: {
        minHeight: 0,
        overflow: 'hidden',
        paddingLeft: '$accordion.content.padding.inline',
        paddingRight: '$accordion.content.padding.inline',
        paddingBottom: '$accordion.content.padding.bottom',
      },
    },
    variants: {
      state: {
        closed: { triggerIcon: { transform: 'rotate(0deg)' } },
        open:   { triggerIcon: { transform: 'rotate(180deg)' } },
      },
    },
    defaultVariants: { state: 'closed' },
  }),

  tabs: defineSlotRecipe({
    slots: ['root', 'list', 'trigger', 'content'] as const,
    base: {
      root: { display: 'flex' },
      list: {
        display: 'flex',
        flexShrink: 0,
        gap: '$tabs.list.gap',
        borderStyle: 'solid',
        borderColor: '$tabs.list.borderColor',
      },
      trigger: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'micro',
        backgroundColor: 'transparent',
        borderWidth: 0,
        cursor: 'pointer',
        color: '$tabs.trigger.color.inactive',
        fontWeight: '$tabs.trigger.fontWeight.inactive',
        _disabled: { opacity: 0.5, cursor: 'not-allowed' },
        _focusVisible: focusRing,
      },
      content: {
        color: '$tabs.content.color',
        paddingTop: '$tabs.content.padding.block',
        paddingBottom: '$tabs.content.padding.block',
        _focusVisible: focusRing,
      },
    },
    variants: {
      variant: {
        underline: {
          trigger: {
            borderRadius: 0,
            borderStyle: 'solid',
            borderBottomWidth: '$tabs.trigger.borderWidth',
            borderBottomColor: 'transparent',
          },
        },
        pill: {
          trigger: { borderRadius: 'full' },
        },
      },
      size: {
        xsmall: { trigger: { paddingLeft: '$tabs.trigger.padding.xsmall.inline', paddingRight: '$tabs.trigger.padding.xsmall.inline', paddingTop: '$tabs.trigger.padding.xsmall.block', paddingBottom: '$tabs.trigger.padding.xsmall.block', fontSize: '$tabs.trigger.fontSize.xsmall' } },
        small:  { trigger: { paddingLeft: '$tabs.trigger.padding.small.inline',  paddingRight: '$tabs.trigger.padding.small.inline',  paddingTop: '$tabs.trigger.padding.small.block',  paddingBottom: '$tabs.trigger.padding.small.block',  fontSize: '$tabs.trigger.fontSize.small'  } },
        medium: { trigger: { paddingLeft: '$tabs.trigger.padding.medium.inline', paddingRight: '$tabs.trigger.padding.medium.inline', paddingTop: '$tabs.trigger.padding.medium.block', paddingBottom: '$tabs.trigger.padding.medium.block', fontSize: '$tabs.trigger.fontSize.medium' } },
        large:  { trigger: { paddingLeft: '$tabs.trigger.padding.large.inline',  paddingRight: '$tabs.trigger.padding.large.inline',  paddingTop: '$tabs.trigger.padding.large.block',  paddingBottom: '$tabs.trigger.padding.large.block',  fontSize: '$tabs.trigger.fontSize.large'  } },
        xlarge: { trigger: { paddingLeft: '$tabs.trigger.padding.xlarge.inline', paddingRight: '$tabs.trigger.padding.xlarge.inline', paddingTop: '$tabs.trigger.padding.xlarge.block', paddingBottom: '$tabs.trigger.padding.xlarge.block', fontSize: '$tabs.trigger.fontSize.xlarge' } },
      },
      orientation: {
        horizontal: {
          root: { flexDirection: 'column' },
          list: { flexDirection: 'row', flexWrap: 'wrap', borderBottomWidth: '$tabs.list.borderWidth' },
        },
        vertical: {
          root: { flexDirection: 'row' },
          list: { flexDirection: 'column', borderRightWidth: '$tabs.list.borderWidth' },
        },
      },
      state: {
        inactive: {},
        active:   {},
      },
    },
    compoundVariants: [
      { conditions: { variant: 'underline', state: 'active' },
        style: { trigger: { borderBottomColor: '$tabs.underline.color', color: '$tabs.trigger.color.active', fontWeight: '$tabs.trigger.fontWeight.active' } } },
      { conditions: { variant: 'pill', state: 'active' },
        style: { trigger: { backgroundColor: '$tabs.pill.background', color: '$tabs.pill.color', fontWeight: '$tabs.trigger.fontWeight.active' } } },
    ],
    defaultVariants: { variant: 'underline', size: 'medium', orientation: 'horizontal', state: 'inactive' },
  }),

  carousel: defineSlotRecipe({
    slots: ['root', 'content', 'item', 'previous', 'next', 'indicators', 'indicator'] as const,
    base: {
      root: {
        position: 'relative',
        width: '100%',
      },
      content: {
        display: 'flex',
        width: '100%',
      },
      item: {
        flexShrink: 0,
        display: 'flex',
      },
      previous: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '$carousel.control.size',
        height: '$carousel.control.size',
        backgroundColor: '$carousel.control.background.default',
        color: '$carousel.control.color',
        borderRadius: '$carousel.control.borderRadius',
        borderWidth: '$carousel.control.borderWidth',
        borderStyle: 'solid',
        borderColor: '$carousel.control.border',
        cursor: 'pointer',
        transition: transition(['background-color', 'color', 'opacity'], 'fast'),
        _hover: { backgroundColor: '$carousel.control.background.hover' },
        _disabled: { opacity: 0.4, cursor: 'not-allowed' },
        _focusVisible: focusRing,
      },
      next: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '$carousel.control.size',
        height: '$carousel.control.size',
        backgroundColor: '$carousel.control.background.default',
        color: '$carousel.control.color',
        borderRadius: '$carousel.control.borderRadius',
        borderWidth: '$carousel.control.borderWidth',
        borderStyle: 'solid',
        borderColor: '$carousel.control.border',
        cursor: 'pointer',
        transition: transition(['background-color', 'color', 'opacity'], 'fast'),
        _hover: { backgroundColor: '$carousel.control.background.hover' },
        _disabled: { opacity: 0.4, cursor: 'not-allowed' },
        _focusVisible: focusRing,
      },
      indicators: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '$carousel.indicators.gap',
        paddingTop: '$carousel.indicators.paddingTop',
      },
      indicator: {
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '$carousel.indicator.size',
        height: '$carousel.indicator.size',
        padding: 0,
        backgroundColor: '$carousel.indicator.background.default',
        borderRadius: 'full',
        borderWidth: 0,
        cursor: 'pointer',
        transition: transition(['background-color', 'transform'], 'fast'),
        _hover: { backgroundColor: '$carousel.indicator.background.hover' },
        _focusVisible: focusRing,
        _before: {
          content: '""',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: '$carousel.indicator.minTouch',
          minHeight: '$carousel.indicator.minTouch',
        },
      },
    },
    variants: {
      orientation: {
        horizontal: {
          content: { flexDirection: 'row' },
          item: { flexDirection: 'column' },
        },
        vertical: {
          content: { flexDirection: 'column', height: '100%' },
          item: { flexDirection: 'column', width: '100%' },
        },
      },
      state: {
        inactive: {},
        active: {
          indicator: {
            backgroundColor: '$carousel.indicator.background.active',
            transform: 'scale(1.25)',
          },
        },
      },
    },
    defaultVariants: { state: 'inactive', orientation: 'horizontal' },
  }),

  toast: defineSlotRecipe({
    slots: ['root', 'title', 'description', 'close'] as const,
    base: {
      root: { display: 'flex', alignItems: 'flex-start', borderLeftWidth: '$toast.borderLeftWidth', borderLeftStyle: 'solid', borderRadius: '$toast.borderRadius' },
      title: { fontWeight: '$toast.fontWeight.title', fontSize: '$toast.fontSize.title' },
      description: { fontSize: '$toast.fontSize.description' },
      close: { marginLeft: 'auto', display: 'inline-flex' },
    },
    variants: {},
    defaultVariants: {},
  }),
};

export const baseTheme = {
  borderWidths: borderWidth,
  radii: borderRadius,
  sizes: {
    ...spacing,
    control: controlSize,
    dialog: dialogSize,
    avatar: avatarSize,
    avatarOverlap,
    spinner: spinnerSize,
    touchTarget,
    selectContent: selectContentSize,
  },
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
  components: componentTokens,
  recipes,
};

export type BaseTheme = typeof baseTheme;
