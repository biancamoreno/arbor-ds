import { useTheme } from '../../../adapters';
import { type ArborTheme } from '../../../../../foundations';

export function useToken<T extends string>(scale: string, token: T | T[]) {
  const theme = useTheme();

  if (token == null) return null;

  if (Array.isArray(token)) {
    return token.map((token) => {
      const path = `${scale}.${token}`;

      return resolveTokenValue(theme, path);
    });
  }

  const path = `${scale}.${token}`;
  return resolveTokenValue(theme, path);
}

const resolveTokenValue = <T extends string>(theme: ArborTheme, tokenValue: T) => {
  const keys = tokenValue.split('.');

  return keys.reduce((obj: any, key: string) => {
    if (obj && typeof obj === 'object' && key in obj) {
      return obj[key];
    } else {
      return undefined;
    }
  }, theme);
};
