import { createElement, forwardRef } from 'react';
import { systemBlockForwardProp, systemPseudoProps } from '../../system';
import { createStyle } from '../transform/new-transform/create-style';
import { useTheme } from '../../adapters';
import { type Theme } from '../../tokens';

const injectedStyles = new Set<string>();
const cachedClasses = new Map<string, string>();
let styleCounter = 0;

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
  baseStyle: Record<string, unknown>,
  pseudoStyles: Record<string, Record<string, unknown>>,
  responsiveStyles: Record<string, Record<string, unknown>>,
  responsivePseudoStyles: Record<string, Record<string, Record<string, unknown>>>,
) {
  const key = stableStringify({ baseStyle, pseudoStyles, responsiveStyles, responsivePseudoStyles });
  const cached = cachedClasses.get(key);
  if (cached) return cached;

  const className = `arbor-${styleCounter++}`;
  cachedClasses.set(key, className);

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

function resolveTag(as: unknown, fallback: string) {
  if (!as) return fallback;
  if (typeof as === 'string') return as;
  if (typeof as === 'object' && as !== null && 'web' in (as as Record<string, unknown>)) {
    return ((as as Record<string, unknown>).web as string) || fallback;
  }
  return fallback;
}

type StyleBuckets = {
  base: Record<string, unknown>;
  responsive: Record<string, Record<string, unknown>>;
};

function isResponsiveObject(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return Object.keys(value).some(key => responsiveKeys.has(key));
}

function getMediaQuery(theme: Theme, breakpoint: string) {
  return `@media screen and (min-width: ${breakpoint})`;
}

function resolveStyleObject(rawProps: Record<string, unknown>, theme: Theme): StyleBuckets {
  const base: Record<string, unknown> = {};
  const responsive: Record<string, Record<string, unknown>> = {};
  const breakpoints = (theme?.breakpoints ?? []) as Array<string> & Record<string, string>;

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
      value.forEach((item, index) => {
        if (item === undefined || item === null) return;
        const resolved = createStyle({ [key]: item }, theme);
        if (index === 0) {
          applyResolved(resolved);
          return;
        }

        const breakpoint = breakpoints[index - 1];
        if (breakpoint) {
          applyResolved(resolved, getMediaQuery(theme, breakpoint));
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

        const breakpoint = breakpoints[bpKey] ?? bpKey;
        if (breakpoint) {
          applyResolved(resolved, getMediaQuery(theme, breakpoint));
        }
      });
      return;
    }

    applyResolved(createStyle({ [key]: value }, theme));
  });

  return { base, responsive };
}

export function createStyledComponent(tag: string) {
  const Component = forwardRef<HTMLElement, Record<string, unknown>>((props, ref) => {
    const theme = useTheme() as Theme;
    const { as, innerRef, className, style, ...rest } = props as Record<string, unknown>;
    const elementTag = resolveTag(as, tag);

    const pseudoProps: Record<string, unknown> = {};
    const elementProps: Record<string, unknown> = {};

    Object.entries(rest).forEach(([key, value]) => {
      if (key.startsWith(pseudoPropPrefix)) {
        pseudoProps[key] = value;
        return;
      }

      if (systemBlockForwardProp(key)) {
        elementProps[key] = value;
      }
    });

    const resolvedBase = resolveStyleObject(rest, theme);
    const mergedBaseStyle = { ...resolvedBase.base, ...(style as Record<string, unknown> | undefined) };

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
      mergedBaseStyle,
      pseudoStyles as Record<string, Record<string, unknown>>,
      resolvedBase.responsive,
      responsivePseudoStyles,
    );

    const combinedClassName = [className, generatedClassName].filter(Boolean).join(' ');

    return createElement(
      elementTag,
      {
        ...elementProps,
        className: combinedClassName || undefined,
        ref: (innerRef as typeof ref) ?? ref,
      },
      props.children,
    );
  });

  return Component;
}

export default createStyledComponent;
