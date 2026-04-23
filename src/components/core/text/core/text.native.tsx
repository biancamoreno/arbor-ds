import { forwardRef } from 'react';
import { ArborTransform, useRecipe } from '../../../../ecosystem';
import { type TextProps } from '../interfaces';

export const Text = forwardRef<unknown, TextProps<string>>(function Text({
  variant = 'caption',
  numberOfLines,
  as = 'p',
  children,
  ...props
}: TextProps<string>, ref) {
  const styles = useRecipe('text', { variant });

  return (
    <ArborTransform
      as={as}
      {...styles}
      numberOfLines={numberOfLines}
      {...props}
      innerRef={ref}
    >
      {children}
    </ArborTransform>
  );
});

Text.displayName = 'Text';
