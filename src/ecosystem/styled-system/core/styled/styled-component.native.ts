import { createElement, forwardRef, type ElementType, type ReactNode, type Ref } from 'react';
import { Pressable, View } from 'react-native';
import { systemBlockForwardProp } from '../../system';
import { useBreakpoint } from '../../system/hooks';
import { createStyle } from '../transform/new-transform/create-style';
import { useTheme } from '../../adapters';
import { type Theme } from '../../tokens';
import { nativeTags } from '../tags/native-tags';
import { type ArborAs, type ArborStyle, type ArborTransformProps } from '../transform/props';

const pseudoPropPrefix = '_';
const responsiveKeys = new Set(['base', 'sm', 'md', 'lg', 'xl', '2xl']);
const interactivePseudoProps = new Set(['_hover', '_active', '_focus', '_pressed']);

type EmptyProps = Record<never, never>;
type StyledComponentProps = ArborTransformProps<EmptyProps, unknown> & Record<string, unknown>;
type PlatformAs = Extract<ArborAs, { web?: unknown; native?: unknown }>;

function isPlatformAs(value: ArborAs): value is PlatformAs {
  return typeof value === 'object' && value !== null && ('web' in value || 'native' in value);
}

function resolveTag(as: ArborAs | undefined, fallback: string): ElementType | string {
  if (!as) return fallback;
  if (isPlatformAs(as)) {
    return (as.native ?? fallback) as ElementType | string;
  }
  return as as ElementType | string;
}

function isResponsiveObject(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return Object.keys(value).some(key => responsiveKeys.has(key));
}

function getResponsiveValue(value: Record<string, unknown>, currentBreakpoint: string): unknown {
  const order = ['base', 'sm', 'md', 'lg', 'xl', '2xl'];
  const currentIndex = order.indexOf(currentBreakpoint);
  let resolved: unknown;
  for (let i = currentIndex; i >= 0; i--) {
    const key = order[i];
    if (value[key] !== undefined && value[key] !== null) {
      resolved = value[key];
      break;
    }
  }
  return resolved ?? value.base ?? Object.values(value)[0];
}

function resolveStyleObjectNative(
  rawProps: Record<string, unknown>,
  theme: Theme,
  currentBreakpoint: string,
): Record<string, unknown> {
  const base: Record<string, unknown> = {};

  const applyResolved = (resolved: Record<string, unknown>) => {
    if (!resolved || Object.keys(resolved).length === 0) return;
    Object.assign(base, resolved);
  };

  Object.entries(rawProps).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[arbor-ds] Responsive array syntax for "${key}" is deprecated. Use named object instead: { base, sm, md, lg, xl }.`,
        );
      }
      const index = Math.min(
        ['base', 'sm', 'md', 'lg', 'xl', '2xl'].indexOf(currentBreakpoint) + 1,
        value.length - 1,
      );
      const item = value[Math.max(0, index)];
      if (item !== undefined && item !== null) {
        applyResolved(createStyle({ [key]: item }, theme));
      }
      return;
    }

    if (isResponsiveObject(value)) {
      const resolvedVal = getResponsiveValue(value as Record<string, unknown>, currentBreakpoint);
      if (resolvedVal !== undefined && resolvedVal !== null) {
        applyResolved(createStyle({ [key]: resolvedVal }, theme));
      }
      return;
    }

    applyResolved(createStyle({ [key]: value }, theme));
  });

  return base;
}

const webOnlyProps = new Set(['cursor', 'border']);

function filterNativeStyle(style: Record<string, unknown>): Record<string, unknown> {
  const filtered: Record<string, unknown> = {};
  Object.entries(style).forEach(([key, value]) => {
    if (!webOnlyProps.has(key) && value !== undefined && value !== null) {
      filtered[key] = value;
    }
  });
  return filtered;
}

function hasInteractivePseudoProps(pseudoProps: Record<string, unknown>): boolean {
  return Object.keys(pseudoProps).some(key => interactivePseudoProps.has(key));
}

function toStyleObject(style: ArborStyle | undefined) {
  if (!style || Array.isArray(style)) {
    return {};
  }

  return style as Record<string, unknown>;
}

export function createStyledComponent(tag: string) {
  const Component = forwardRef<unknown, StyledComponentProps>((rawProps, ref) => {
    const theme = useTheme() as Theme;
    const currentBreakpoint = useBreakpoint();
    const props = rawProps as StyledComponentProps;
    const { as, innerRef, style, children, ...rest } = props;

    const elementTagName = resolveTag(as, tag);
    const nativeComponent = typeof elementTagName === 'string' ? nativeTags[elementTagName] ?? View : elementTagName;
    const pressableComponent: ElementType = Pressable;

    const pseudoProps: Record<string, unknown> = {};
    const elementProps: Record<string, unknown> = {};

    Object.entries(rest).forEach(([key, value]) => {
      if (key.startsWith(pseudoPropPrefix)) {
        pseudoProps[key] = value;
        return;
      }
      if (systemBlockForwardProp(key)) {
        const nativeKey = key === 'data-testid' ? 'testID' : key;
        elementProps[nativeKey] = value;
      }
    });

    const resolvedBase = resolveStyleObjectNative(rest, theme, currentBreakpoint);
    const mergedBaseStyle = filterNativeStyle({
      ...resolvedBase,
      ...toStyleObject(style),
    });

    const styleProp = Object.keys(mergedBaseStyle).length > 0 ? mergedBaseStyle : undefined;
    const resolvedRef = (innerRef ?? ref) as Ref<unknown>;

    const activeStyles = hasInteractivePseudoProps(pseudoProps)
      ? filterNativeStyle(
          resolveStyleObjectNative(
            (pseudoProps._active ?? pseudoProps._pressed ?? pseudoProps._hover ?? {}) as Record<
              string,
              unknown
            >,
            theme,
            currentBreakpoint,
          ),
        )
      : null;

    if (activeStyles && Object.keys(activeStyles).length > 0) {
      return createElement(
        pressableComponent,
        {
          ...elementProps,
          ref: resolvedRef,
          style: ({ pressed }: { pressed: boolean }) =>
            [styleProp, pressed ? activeStyles : null].filter(Boolean),
        },
        children as ReactNode,
      );
    }

    return createElement(
      nativeComponent,
      {
        ...elementProps,
        style: styleProp,
        ref: resolvedRef,
      },
      children as ReactNode,
    );
  });

  return Component;
}

export default createStyledComponent;
