import { createElement, forwardRef, type ElementType, type ReactNode, type Ref } from 'react';
import { systemBlockForwardProp, systemPseudoProps } from '../../system';
import { createStyle } from '../transform/new-transform/create-style';
import { useTheme } from '../../adapters';
import { type Theme } from '../../tokens';
import { type ArborAs, type ArborStyle, type ArborTransformProps } from '../transform';

const injectedStyles = new Set<string>();
const tokenCache = new WeakMap<object, Map<string, string>>();
const allCacheMaps = new Set<Map<string, string>>();
let styleCounter = 0;

function getThemeCache(theme: object): Map<string, string> {
  if (!tokenCache.has(theme)) tokenCache.set(theme, new Map<string, string>());
  const map = tokenCache.get(theme)!;
  allCacheMaps.add(map);
  return map;
}

/** Resets CSS injection and className caches between tests. Not for production use. */
export function __resetStyleEngine__(): void {
  injectedStyles.clear();
  allCacheMaps.forEach(m => m.clear());
  styleCounter = 0;
}

const unitlessProps = new Set([
  'opacity',
  'zIndex',
  'fontWeight',
  'flex',
  'flexGrow',
  'flexShrink',
  'order',
]);

const pseudoPropPrefix = '_';
const responsiveKeys = new Set(['base', 'sm', 'md', 'lg', 'xl', '2xl']);
const breakpointNames = ['sm', 'md', 'lg', 'xl', '2xl'] as const;

type BreakpointName = (typeof breakpointNames)[number];
type EmptyProps = Record<never, never>;
type StyledComponentProps = ArborTransformProps<EmptyProps, unknown> &
  Record<string, unknown> & {
    className?: string;
  };
type PlatformAs = Extract<ArborAs, { web?: unknown; native?: unknown }>;

function toKebabCase(value: string) {
  return value.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
}

function stringifyStyle(style: Record<string, unknown>) {
  return Object.entries(style)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      const cssKey = toKebabCase(key);
      if (typeof value === 'number' && !unitlessProps.has(key)) {
        return `${cssKey}:${value}px;`;
      }
      return `${cssKey}:${value};`;
    })
    .join('');
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return String(value);
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) => a.localeCompare(b));
  return `{${entries.map(([key, val]) => `${key}:${stableStringify(val)}`).join(',')}}`;
}

function getStyleSheet() {
  if (typeof document === 'undefined') return null;
  const existing = document.getElementById('arbor-style-engine') as HTMLStyleElement | null;
  if (existing) return existing;
  const style = document.createElement('style');
  style.id = 'arbor-style-engine';
  document.head.appendChild(style);
  return style;
}

function createClassName(
  theme: object,
  baseStyle: Record<string, unknown>,
  pseudoStyles: Record<string, Record<string, unknown>>,
  responsiveStyles: Record<string, Record<string, unknown>>,
  responsivePseudoStyles: Record<string, Record<string, Record<string, unknown>>>,
) {
  const cache = getThemeCache(theme);
  const key = stableStringify({ baseStyle, pseudoStyles, responsiveStyles, responsivePseudoStyles });
  const cached = cache.get(key);
  if (cached) return cached;

  const className = `arbor-${styleCounter++}`;
  cache.set(key, className);

  const sheet = getStyleSheet();
  if (!sheet) return className;

  const baseCss = stringifyStyle(baseStyle);
  const rules: string[] = baseCss ? [`.${className}{${baseCss}}`] : [];

  Object.entries(pseudoStyles).forEach(([selector, style]) => {
    const css = stringifyStyle(style);
    if (css) {
      const resolvedSelector = selector.replace(/&/g, `.${className}`);
      rules.push(`${resolvedSelector}{${css}}`);
    }
  });

  const mediaQueries = new Set([
    ...Object.keys(responsiveStyles),
    ...Object.keys(responsivePseudoStyles),
  ]);

  mediaQueries.forEach(media => {
    const mediaRules: string[] = [];
    const responsiveBase = responsiveStyles[media];
    if (responsiveBase) {
      const css = stringifyStyle(responsiveBase);
      if (css) {
        mediaRules.push(`.${className}{${css}}`);
      }
    }

    const responsivePseudo = responsivePseudoStyles[media] ?? {};
    Object.entries(responsivePseudo).forEach(([selector, style]) => {
      const css = stringifyStyle(style);
      if (css) {
        const resolvedSelector = selector.replace(/&/g, `.${className}`);
        mediaRules.push(`${resolvedSelector}{${css}}`);
      }
    });

    if (mediaRules.length > 0) {
      rules.push(`${media}{${mediaRules.join('')}}`);
    }
  });

  const cssText = rules.join('\n');
  if (cssText && !injectedStyles.has(cssText)) {
    injectedStyles.add(cssText);
    sheet.appendChild(document.createTextNode(cssText));
  }

  return className;
}

function isPlatformAs(value: ArborAs): value is PlatformAs {
  return typeof value === 'object' && value !== null && ('web' in value || 'native' in value);
}

function resolveTag(as: ArborAs | undefined, fallback: string): ElementType | string {
  if (!as) return fallback;
  if (isPlatformAs(as)) {
    return (as.web ?? fallback) as ElementType | string;
  }
  return as as ElementType | string;
}

type StyleBuckets = {
  base: Record<string, unknown>;
  responsive: Record<string, Record<string, unknown>>;
};

function isResponsiveObject(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return Object.keys(value).some(key => responsiveKeys.has(key));
}

function getMediaQuery(breakpoint: string) {
  return `@media screen and (min-width: ${breakpoint})`;
}

function resolveStyleObject(rawProps: Record<string, unknown>, theme: Theme): StyleBuckets {
  const base: Record<string, unknown> = {};
  const responsive: Record<string, Record<string, unknown>> = {};
  const breakpoints = theme.breakpoints;

  const applyResolved = (resolved: Record<string, unknown>, media?: string) => {
    if (!resolved || Object.keys(resolved).length === 0) return;
    if (media) {
      responsive[media] = { ...(responsive[media] || {}), ...resolved };
    } else {
      Object.assign(base, resolved);
    }
  };

  Object.entries(rawProps).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[arbor-ds] Responsive array syntax for "${key}" is deprecated. Use named object instead: { base, sm, md, lg, xl }.`,
        );
      }
      value.forEach((item, index) => {
        if (item === undefined || item === null) return;
        const resolved = createStyle({ [key]: item }, theme);
        if (index === 0) {
          applyResolved(resolved);
          return;
        }

        const breakpoint = breakpoints[index - 1];
        if (breakpoint) {
          applyResolved(resolved, getMediaQuery(breakpoint));
        }
      });
      return;
    }

    if (isResponsiveObject(value)) {
      Object.entries(value as Record<string, unknown>).forEach(([bpKey, bpValue]) => {
        if (bpValue === undefined || bpValue === null) return;
        const resolved = createStyle({ [key]: bpValue }, theme);
        if (bpKey === 'base') {
          applyResolved(resolved);
          return;
        }

        const breakpoint = breakpointNames.includes(bpKey as BreakpointName)
          ? breakpoints[bpKey as BreakpointName]
          : bpKey;
        if (breakpoint) {
          applyResolved(resolved, getMediaQuery(breakpoint));
        }
      });
      return;
    }

    applyResolved(createStyle({ [key]: value }, theme));
  });

  return { base, responsive };
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
    const props = rawProps as StyledComponentProps;
    const { as, innerRef, className, style, children, ...rest } = props;
    const elementTag = resolveTag(as, tag);

    const pseudoProps: Record<string, unknown> = {};
    const elementProps: Record<string, unknown> = {};

    Object.entries(rest).forEach(([key, value]) => {
      if (key.startsWith(pseudoPropPrefix)) {
        pseudoProps[key] = value;
        return;
      }

      if (systemBlockForwardProp(key)) {
        if (key === 'testID') {
          elementProps.testID = value;
          elementProps['data-testid'] = value;
          return;
        }

        elementProps[key] = value;
      }
    });

    const resolvedBase = resolveStyleObject(rest, theme);
    const mergedBaseStyle = { ...resolvedBase.base, ...toStyleObject(style) };

    const pseudoResolved = Object.entries(pseudoProps).reduce((acc, [key, value]) => {
      if (typeof value === 'object' && value !== null) {
        acc[key] = resolveStyleObject(value as Record<string, unknown>, theme);
      }
      return acc;
    }, {} as Record<string, StyleBuckets>);

    const pseudoBaseStyles = Object.entries(pseudoResolved).reduce((acc, [key, bucket]) => {
      acc[key] = bucket.base;
      return acc;
    }, {} as Record<string, Record<string, unknown>>);

    const pseudoStyles = systemPseudoProps(pseudoBaseStyles);

    const pseudoResponsiveByMedia = Object.entries(pseudoResolved).reduce((acc, [key, bucket]) => {
      Object.entries(bucket.responsive).forEach(([media, styleBucket]) => {
        if (!acc[media]) {
          acc[media] = {};
        }
        acc[media][key] = styleBucket;
      });
      return acc;
    }, {} as Record<string, Record<string, Record<string, unknown>>>);

    const responsivePseudoStyles = Object.entries(pseudoResponsiveByMedia).reduce((acc, [media, pseudoEntries]) => {
      acc[media] = systemPseudoProps(pseudoEntries) as Record<string, Record<string, unknown>>;
      return acc;
    }, {} as Record<string, Record<string, Record<string, unknown>>>);

    const generatedClassName = createClassName(
      theme,
      mergedBaseStyle,
      pseudoStyles as Record<string, Record<string, unknown>>,
      resolvedBase.responsive,
      responsivePseudoStyles,
    );

    const combinedClassName = [className, generatedClassName].filter(Boolean).join(' ');
    const resolvedRef = (innerRef ?? ref) as Ref<unknown>;

    const webProps = {
      ...elementProps,
      className: combinedClassName || undefined,
      ref: resolvedRef,
    };

    return createElement(elementTag, webProps, children as ReactNode);
  });

  return Component;
}

export default createStyledComponent;
