import { forwardRef, useMemo } from 'react';
import { ArborTransform, htmlConverter, TextIterator, useRecipe } from '../../../../ecosystem';
import { type TextProps } from '../interfaces';

export const Text = forwardRef<HTMLElement, TextProps<string>>(function Text({
  variant = 'caption',
  isTruncated: _isTruncated,
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
