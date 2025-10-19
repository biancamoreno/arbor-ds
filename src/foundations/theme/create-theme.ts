import type { BaseTheme } from './base-theme';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export function createTheme<T = BaseTheme>(baseTheme: T, customTheme: DeepPartial<T>): T {
  const createdTheme = { ...baseTheme };

  for (const key in customTheme) {
    if (customTheme[key] !== undefined) {
      if (typeof customTheme[key] === 'object' && !Array.isArray(customTheme[key]) && customTheme[key] !== null) {
        createdTheme[key] = createTheme(createdTheme[key], customTheme[key] as never);
      } else {
        createdTheme[key as keyof T] = customTheme[key] as T[keyof T];
      }
    }
  }

  return createdTheme;
}
