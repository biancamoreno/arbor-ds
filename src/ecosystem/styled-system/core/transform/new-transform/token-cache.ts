const themeTokenCache = new WeakMap<object, Map<string, unknown>>();

export function getFromTokenCache(theme: object, key: string): unknown {
  return themeTokenCache.get(theme)?.get(key);
}

export function setInTokenCache(theme: object, key: string, value: unknown): void {
  if (!themeTokenCache.has(theme)) themeTokenCache.set(theme, new Map());
  themeTokenCache.get(theme)!.set(key, value);
}
