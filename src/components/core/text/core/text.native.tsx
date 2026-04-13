import { useMemo } from 'react';
import { ArborTransform, createVariant, useTheme } from '../../../../ecosystem';
import { type TextProps } from '../interfaces';

export function Text({
  variant = 'caption',
  numberOfLines,
  as = 'p',
  children,
  ...props
}: TextProps<string>) {
  const {
    components: { text },
  } = useTheme();
  const styles = useMemo(() => createVariant(variant, {}, text), [variant, text]);

  return (
    <ArborTransform
      as={as}
      {...styles}
      numberOfLines={numberOfLines}
      {...props}
    >
      {children}
    </ArborTransform>
  );
}
