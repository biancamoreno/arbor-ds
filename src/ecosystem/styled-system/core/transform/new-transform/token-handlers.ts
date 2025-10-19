/* eslint-disable @typescript-eslint/no-explicit-any */
import { type Theme } from '../../../tokens/index';
import { tokenCache } from './token-cache';

export const getRawNumber = (value: string | number) => {
  if (typeof value === 'number') return value;

  if (value.endsWith('%')) return value;

  if (value === 'auto') return value;

  if (value.endsWith('px')) {
    const [val] = value.split('px');
    return Number(val);
  }

  return Number(value);
};

export const getTokenValue = <T extends string>(scale: string, theme: Theme, tokenValue: T) => {
  const path = `${scale}.${tokenValue}`;
  if (tokenCache.has(path)) {
    return tokenCache.get(path);
  }

  const keys = path.split('.');

  const result = keys.reduce((obj: any, key: string) => {
    if (obj && typeof obj === 'object' && key in obj) {
      return obj[key];
    } else {
      return undefined;
    }
  }, theme);

  if (result) {
    tokenCache.set(path, result);
  }

  return result;
};

export const getTokenValueByScale = (scale: string) => (value: string, theme: Theme, propKey: string) => {
  if (value === undefined || value === '') return {};
  return {
    [propKey]: getTokenValue(scale, theme, value) ?? value,
  };
};

export const getNumericTokenByScale = (scale: string) => (value: string, theme: Theme, propKey: string) => {
  if (value === undefined) return {};
  return {
    [propKey]: getTokenValue(scale, theme, value) ?? getRawNumber(value),
  };
};

export const getCustomProp =
  (propName: string, scale: string, handler?: (value: any) => any) => (value: string, theme: Theme) => ({
    [propName]: getTokenValue(scale, theme, value) ?? (handler ? handler(value) : value),
  });

export const getMultiNumberProp =
  (scale: string, ...keys: string[]) =>
  (token: string, theme: Theme) => {
    const result: Partial<Record<string, any>> = {};
    keys.forEach(key => {
      result[key] = getTokenValue(scale, theme, token) ?? getRawNumber(token);
    });
    return result;
  };

export const getOpacity = (token: string, theme: Theme, propKey: string) => ({
  [propKey]: getTokenValue('opacity', theme, token) ?? Number(token),
});

export const getFlex = (value: string) => {
  if (Number(value) === 1) {
    return { flexBasis: 0, flexGrow: 1, flexShrink: 1 };
  }

  return { flex: value };
};

export const getFlexDir = (value: string) => {
  return { flexDirection: value };
};

export const getFontWeight = (value: string, theme: Theme, propKey: string) => ({
  [propKey]: getTokenValue('fontWeights', theme, value) ?? `${value}`,
});

export const getLineHeight = (value: string, theme: Theme, propKey: string) => {
  if (!value) return undefined;

  const result = getTokenValue('lineHeights', theme, value) ?? value;
  const [lineHeight] = result.toString().split('px');

  return {
    [propKey]: Number(lineHeight),
  };
};

export const getWidth = (value: string, theme: Theme, propKey: string) => {
  const result = getTokenValue('sizes', theme, value) ?? getRawNumber(value);
  if (typeof result === 'string') return { [propKey]: result };
  if (result <= 0) return { [propKey]: `${result * 100}%` };
  return { [propKey]: result };
};

export const getColor = getTokenValueByScale('colors');

export const getBorderWidth = getNumericTokenByScale('borderWidths');

export const getSpace = getNumericTokenByScale('space');

export const getSize = getNumericTokenByScale('sizes');

export const getRadius = getNumericTokenByScale('radii');
