/* eslint-disable @typescript-eslint/no-explicit-any */
export function getTokenValue<T extends object>(key: string, tokens: T): number | undefined {
  return key.split('.').reduce<any>((acc, part) => (acc ? acc[part] : undefined), tokens) as number | undefined;
}
