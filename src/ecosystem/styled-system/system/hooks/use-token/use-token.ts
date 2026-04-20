import { useTheme } from '../../../adapters';
import { type ArborTheme } from '../../../../../foundations';

const resolveCache = new WeakMap<object, Map<string, unknown>>();

function resolveTokenValue(theme: ArborTheme, path: string): unknown {
  let themeCache = resolveCache.get(theme);
  if (!themeCache) {
    themeCache = new Map();
    resolveCache.set(theme, themeCache);
  }
  if (themeCache.has(path)) {
    return themeCache.get(path);
  }
  const value = path.split('.').reduce((obj: unknown, key: string) => {
    if (obj && typeof obj === 'object' && key in obj) {
      return (obj as Record<string, unknown>)[key];
    }
    return undefined;
  }, theme as unknown);
  themeCache.set(path, value);
  return value;
}

export function useToken<T extends string>(scale: string, token: T | T[] | null | undefined) {
  const theme = useTheme() as ArborTheme;

  if (token == null) return null;

  if (Array.isArray(token)) {
    return token.map(t => resolveTokenValue(theme, `${scale}.${t}`));
  }

  return resolveTokenValue(theme, `${scale}.${token}`);
}
