import { forwardRef, useMemo } from 'react';
import { ArborTransform, htmlConverter, TextIterator, useRecipe } from '../../../../ecosystem';
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
 * @platform shared
 *
 * Componente de texto tipográfico. Resolve a recipe `text` (variants
 * `displayHero/Large/Medium/Small`, `headingLarge/Medium/Small`,
 * `subheading`, `bodyLarge/Medium/Small`, `label`, `caption`, `overline`,
 * `code`). Quando `variant` não é passado, infere do `as` (h1→headingLarge,
 * p→bodyMedium, label→label, etc.); fallback geral é `bodyMedium`.
 *
 * Aplica truncamento opcional via `numberOfLines` (CSS `-webkit-line-clamp`
 * em web, `numberOfLines` nativo em RN). Aceita string com HTML inline
 * restrito (`<b>`, `<i>`, `<a>`, etc.) parseado pelo `htmlConverter`; use
 * `onLinkPress` para interceptar `<a>`.
 *
 * @see {@link TextProps}
 */
export const Text = forwardRef<HTMLElement, TextProps<string>>(function Text({
  variant,
  numberOfLines,
  as = 'p',
  children,
  onLinkPress,
  ...props
}: TextProps<string>, ref) {
  const resolvedVariant = variant ?? AS_TO_VARIANT[as] ?? 'bodyMedium';
  const styles = useRecipe('text', { variant: resolvedVariant });
  const lineHeight = (styles as Record<string, unknown>).lineHeight as string | undefined;

  const htmlElements = useMemo(() => {
    if (typeof children === 'string' && htmlConverter.isValidHtml(children)) {
      return htmlConverter(children, { onLinkPress });
    }
    return [];
  }, [children, onLinkPress]);

  const truncatedProps = useMemo(() => {
    return {
      display: '-webkit-box',
      overflow: 'hidden',
      maxHeight: `calc(${lineHeight} * ${numberOfLines})`,
      style: {
        boxOrient: 'vertical',
        WebkitLineClamp: numberOfLines,
        WebkitBoxOrient: 'vertical',
        textOverflow: 'ellipsis',
      },
    };
  }, [numberOfLines, lineHeight]);

  return (
    <ArborTransform
      as={as}
      {...styles}
      {...(numberOfLines ? truncatedProps : {})}
      {...props}
      innerRef={ref}
    >
      {htmlElements.length > 0 ? <TextIterator variant={resolvedVariant} elements={htmlElements} /> : children}
    </ArborTransform>
  );
});

Text.displayName = 'Text';
