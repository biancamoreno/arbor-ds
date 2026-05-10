import { forwardRef } from 'react';
import { ArborTransform, useRecipe } from '../../../../ecosystem';
import { type TextProps } from '../interfaces';
import { type TextVariant } from '../interfaces/TextVariant';

const AS_TO_VARIANT: Partial<Record<NonNullable<TextProps<string>['as']>, TextVariant>> = {
  h1: 'headingLarge',
  h2: 'headingMedium',
  h3: 'headingSmall',
  h4: 'subheading',
  h5: 'subheading',
  h6: 'overline',
  p: 'bodyMedium',
  label: 'label',
  legend: 'label',
};

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
  variant,
  numberOfLines,
  as = 'p',
  children,
  ...props
}: TextProps<string>, ref) {
  const resolvedVariant = variant ?? AS_TO_VARIANT[as] ?? 'bodyMedium';
  const styles = useRecipe('text', { variant: resolvedVariant });

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
