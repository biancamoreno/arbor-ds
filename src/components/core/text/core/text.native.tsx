import { ArborTransform, useRecipe } from '../../../../ecosystem';
import { type TextProps } from '../interfaces';

export function Text({
  variant = 'caption',
  numberOfLines,
  as = 'p',
  children,
  ...props
}: TextProps<string>) {
  const styles = useRecipe('text', { variant });

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
