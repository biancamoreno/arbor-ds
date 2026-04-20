/* eslint-disable @typescript-eslint/no-explicit-any */
import { AVAILABLE_STYLE_PROPERTIES } from './available-style-properties';
import { styleMap } from './style-map';
import { type ArborTransformProps } from '../props';
import { type Theme } from '../../../tokens';

function getStyleProps<T extends object>(props: Partial<ArborTransformProps<T>>) {
  if (!props || props == null) return {};

  const result = Object.keys(props).reduce((acc, key) => {
    const value = props[key as keyof ArborTransformProps<T>];
    if (AVAILABLE_STYLE_PROPERTIES.has(key) && value !== undefined && value !== null) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);

  return result;
}

function proccessProps(props: Record<string, any>, theme: Theme): Record<string, unknown> {
  if (!props) return {};
  const result = Object.keys(props).reduce((acc, key) => {
    const value = styleMap.get(key)?.(props[key], theme, key) ?? { [key]: props[key] };
    return Object.assign(acc, value);
  }, {} as Record<string, unknown>);

  return result;
}

export function createStyle<T extends object>(
  props: Partial<ArborTransformProps<T>>,
  theme: Theme,
): Record<string, unknown> {
  const sanitizedProps = getStyleProps(props);
  const style = proccessProps(sanitizedProps, theme);
  return style;
}
