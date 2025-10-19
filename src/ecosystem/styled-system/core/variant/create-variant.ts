/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Cria uma variante com base na propriedade `variant`.
 *
 * @typeparam J - O tipo das propriedades.
 * @typeparam T - O tipo da variante.
 *
 * @param variant - A variante ou o objeto de variantes.
 * @param props - As propriedades base.
 * @param variants - As variantes disponíveis.
 * @returns As propriedades combinadas da variante.
 */
export function createVariant<J, T extends string>(
  variant: T | Record<T, string>,
  props: J | null,
  variants: Partial<Record<T, J>>,
) {
  if (typeof variant === 'object') {
    const result: any = {};

    Object.keys(variant).forEach(key => {
      const variantKey = key as T;
      const variantValue = variant[variantKey] as keyof Record<T, J>;
      const variantProps = variants[variantValue] as never;

      if (variantProps) {
        Object.keys(variantProps).forEach(propKey => {
          const propValue = variantProps[propKey];

          result[propKey] = {
            ...(result[propKey] || {}),
            [variantKey]: propValue,
          };
        });
      }
    });

    return result;
  }

  return {
    ...variants[variant],
    ...(props || {}),
  };
}
