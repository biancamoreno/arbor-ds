import { useMemo } from 'react';
import { ArborTransform, createVariant, htmlConverter, TextIterator, useTheme } from '../../../../ecosystem';
import { type TextProps } from '../interfaces';

export function Text({
  variant = 'caption',
  isTruncated,
  numberOfLines,
  as = 'p',
  children,
  onLinkPress,
  ...props
}: TextProps<string>) {
  const {
    components: { text },
  } = useTheme();
  const styles = useMemo(() => createVariant(variant, {}, text), [variant, text]);
  const htmlElements = useMemo(() => {
    if (typeof children === 'string' && htmlConverter.isValidHtml(children)) {
      return htmlConverter(children, { onLinkPress });
    }
    return [];
  }, [children, onLinkPress]) as TextProps<string>[];

  const truncatedProps = useMemo(() => {
    return {
      display: '-webkit-box',
      overflow: 'hidden',
      maxHeight: `calc(${styles.lineHeight} * ${numberOfLines})`,
      style: {
        boxOrient: 'vertical',
        WebkitLineClamp: numberOfLines,
        WebkitBoxOrient: 'vertical',
        textOverflow: 'ellipsis',
      },
    };
  }, [numberOfLines, styles.lineHeight]);

  return (
    <ArborTransform
      as={as}
      {...styles}
      {...(numberOfLines ? truncatedProps : {})}
      {...props}
    >
      {htmlElements.length > 0 ? <TextIterator variant={variant} elements={htmlElements} /> : children}
    </ArborTransform>
  );
}
