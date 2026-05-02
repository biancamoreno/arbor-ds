import { forwardRef, useMemo } from 'react';
import { ArborTransform, htmlConverter, TextIterator, useRecipe } from '../../../../ecosystem';
import { type TextProps } from '../interfaces';

/**
 * @platform shared
 *
 * Componente de texto tipográfico. Resolve a recipe `text` (variantes como
 * `display`, `heading*`, `body*`, `caption`) e aplica truncamento opcional via
 * `numberOfLines` (CSS `-webkit-line-clamp` em web, `numberOfLines` nativo em
 * RN). Aceita string com HTML inline restrito (`<b>`, `<i>`, `<a>`, etc.) que
 * é parseado pelo `htmlConverter`; use `onLinkPress` para interceptar `<a>`.
 *
 * @see {@link TextProps}
 */
export const Text = forwardRef<HTMLElement, TextProps<string>>(function Text({
  variant = 'caption',
  numberOfLines,
  as = 'p',
  children,
  onLinkPress,
  ...props
}: TextProps<string>, ref) {
  const styles = useRecipe('text', { variant });
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
      {htmlElements.length > 0 ? <TextIterator variant={variant} elements={htmlElements} /> : children}
    </ArborTransform>
  );
});

Text.displayName = 'Text';
