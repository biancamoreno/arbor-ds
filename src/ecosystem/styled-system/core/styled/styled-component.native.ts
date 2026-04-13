import { createElement, forwardRef } from 'react';
import { View, Pressable } from 'react-native';
import { systemBlockForwardProp } from '../../system';
import { useBreakpoint } from '../../system/hooks';
import { createStyle } from '../transform/new-transform/create-style';
import { useTheme } from '../../adapters';
import { type Theme } from '../../tokens';
import { nativeTags } from '../tags/native-tags';

const pseudoPropPrefix = '_';
const responsiveKeys = new Set(['base', 'sm', 'md', 'lg', 'xl', '2xl']);

const interactivePseudoProps = new Set(['_hover', '_active', '_focus', '_pressed']);

function resolveTag(as: unknown, fallback: string) {
  if (!as) return fallback;
  if (typeof as === 'string') return as;
  if (typeof as === 'object' && as !== null && 'native' in (as as Record<string, unknown>)) {
    return ((as as Record<string, unknown>).native as string) || fallback;
  }
  return fallback;
}

function isResponsiveObject(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return Object.keys(value).some((key) => responsiveKeys.has(key));
}

function getResponsiveValue(
  value: Record<string, unknown>,
  currentBreakpoint: string,
): unknown {
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
  return Object.keys(pseudoProps).some((key) => interactivePseudoProps.has(key));
}

export function createStyledComponent(tag: string) {
  const Component = forwardRef<unknown, Record<string, unknown>>((props, ref) => {
    const theme = useTheme() as Theme;
    const currentBreakpoint = useBreakpoint();
    const { as, innerRef, style, ...rest } = props as Record<string, unknown>;

    const elementTagName = resolveTag(as, tag);
    const NativeComponent = nativeTags[elementTagName] ?? View;

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
      ...(style as Record<string, unknown> | undefined),
    });

    const styleProp =
      Object.keys(mergedBaseStyle).length > 0 ? mergedBaseStyle : undefined;

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
        Pressable,
        {
          ...elementProps,
          ref: (innerRef as typeof ref) ?? ref,
          style: ({ pressed }: { pressed: boolean }) =>
            [styleProp, pressed ? activeStyles : null].filter(Boolean),
        },
        props.children,
      );
    }

    return createElement(
      NativeComponent,
      {
        ...elementProps,
        style: styleProp,
        ref: (innerRef as typeof ref) ?? ref,
      },
      props.children,
    );
  });

  return Component;
}

export default createStyledComponent;
