type BreakpointKeys = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export type ResponsiveArray<T> = Array<T | null>;

export type ResponsiveObject<T> = { [Property in BreakpointKeys]?: T };

// eslint-disable-next-line @typescript-eslint/ban-types
export type ResponsiveValue<T> = T | ResponsiveArray<T> | ResponsiveObject<T> | ({} & string);

type KeyObject = string | number;

// Tipo para evitar loop infinito de tokenização
type Prev = [never, 0, 1, 2, 3, 4, 5];

export type Token<ThemeKey, ThemeKeyExclude extends KeyObject = never, D extends number = 5> = [D] extends [never]
  ? never
  : {
      [K in Exclude<keyof ThemeKey, ThemeKeyExclude>]: ThemeKey[K] extends Record<KeyObject, unknown>
        ? `${K & KeyObject}.${Token<ThemeKey[K], ThemeKeyExclude, Prev[D]>}`
        : K & KeyObject;
    }[Exclude<keyof ThemeKey, ThemeKeyExclude>];

export type Length = string | 0 | number;
