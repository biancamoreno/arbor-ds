import { forwardRef } from 'react';
import { ArborTransform, useRecipe } from '../../../../ecosystem';
import { type TextProps } from '../interfaces';

/**
 * @platform native
 *
 * Implementação React Native do `Text`: `numberOfLines` é forwardado direto
 * para o `<Text>` nativo (não há line-clamp via CSS). HTML inline não é
 * parseado em native — strings com tags são renderizadas como texto bruto.
 *
 * @see {@link TextProps}
 */
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
