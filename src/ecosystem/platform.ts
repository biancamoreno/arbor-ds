import { Platform } from 'react-native';

export type PlatformSelectOptions<T> = {
  web: T;
  native: T;
  default?: T;
};

export function platformSelect<T>(options: PlatformSelectOptions<T>): T {
  if (Platform.OS === 'web') return options.web;
  return options.native ?? options.default ?? options.web;
}

export const isWeb = Platform.OS === 'web';
export const isNative = Platform.OS !== 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
