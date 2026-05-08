/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ArborTheme } from '../../../../foundations';

const SCALE_LOOKUP: readonly string[] = [
  'colors',
  'radii',
  'shadows',
  'space',
  'sizes',
  'borderWidths',
  'fontSizes',
  'fontWeights',
  'lineHeights',
  'letterSpacings',
  'iconSizes',
  'zIndices',
  'opacity',
  'fonts',
];

function resolveAtPath(root: any, path: string): unknown {
  if (path === '') return undefined;
  return path.split('.').reduce<any>((obj, key) => {
    if (obj && typeof obj === 'object' && key in obj) return obj[key];
    return undefined;
  }, root);
}

function camelToKebab(input: string): string {
  return input.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function pathToVarSegment(parts: ReadonlyArray<string>): string {
  return parts.map(camelToKebab).join('-');
}

function isLeafValue(value: unknown): value is string | number {
  return typeof value === 'string' || typeof value === 'number';
}

function tryResolveAlias(theme: ArborTheme, value: string): string | number | undefined {
  if (value.startsWith('$')) {
    const componentResolved = resolveAtPath(theme as any, `components.${value.slice(1)}`);
    if (typeof componentResolved === 'string') {
      const next = tryResolveAlias(theme, componentResolved);
      return next ?? undefined;
    }
    if (typeof componentResolved === 'number') return componentResolved;
    return undefined;
  }

  if (/^(#|rgb|hsl|var\(|transparent$|currentColor$)/i.test(value)) return value;

  for (const scale of SCALE_LOOKUP) {
    const result = resolveAtPath(theme as any, `${scale}.${value}`);
    if (isLeafValue(result)) return result;
  }
  const motionResult = resolveAtPath((theme as any).motion, value);
  if (isLeafValue(motionResult)) return motionResult;

  return undefined;
}

function walkNode(
  node: unknown,
  prefix: ReadonlyArray<string>,
  theme: ArborTheme,
  out: Record<string, string>,
  resolveStrings: boolean,
): void {
  if (node == null) return;

  if (isLeafValue(node)) {
    let value: string | number = node;
    if (typeof node === 'string' && resolveStrings) {
      const resolved = tryResolveAlias(theme, node);
      if (resolved !== undefined) value = resolved;
    }
    const varName = `--arbor-${pathToVarSegment(prefix)}`;
    out[varName] = String(value);
    return;
  }

  if (typeof node !== 'object' || Array.isArray(node)) return;

  for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
    if (child === undefined) continue;
    walkNode(child, [...prefix, key], theme, out, resolveStrings);
  }
}

export function walkTokenTree(theme: ArborTheme): Record<string, string> {
  const out: Record<string, string> = {};
  const t = theme as any;

  if (t.colors) walkNode(t.colors, ['color'], theme, out, false);
  if (t.space) walkNode(t.space, ['space'], theme, out, false);
  if (t.sizes) walkNode(t.sizes, ['sizes'], theme, out, false);
  if (t.radii) walkNode(t.radii, ['radii'], theme, out, false);
  if (t.shadows) walkNode(t.shadows, ['shadows'], theme, out, false);
  if (t.motion) walkNode(t.motion, ['motion'], theme, out, false);
  if (t.borderWidths) walkNode(t.borderWidths, ['border-width'], theme, out, false);
  if (t.fontSizes) walkNode(t.fontSizes, ['font-size'], theme, out, false);
  if (t.fontWeights) walkNode(t.fontWeights, ['font-weight'], theme, out, false);
  if (t.lineHeights) walkNode(t.lineHeights, ['line-height'], theme, out, false);
  if (t.iconSizes) walkNode(t.iconSizes, ['icon-size'], theme, out, false);
  if (t.opacity) walkNode(t.opacity, ['opacity'], theme, out, false);

  if (t.components) {
    for (const [name, tokens] of Object.entries(t.components as Record<string, unknown>)) {
      if (tokens && typeof tokens === 'object') {
        walkNode(tokens, [name], theme, out, true);
      }
    }
  }

  return out;
}

export function tokenTreeToCssText(vars: Record<string, string>): string {
  let css = '';
  for (const [key, value] of Object.entries(vars)) {
    css += `${key}:${value};`;
  }
  return css;
}
