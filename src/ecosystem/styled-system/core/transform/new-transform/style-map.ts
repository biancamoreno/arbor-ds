import {
  getBorderWidth,
  getColor,
  getCustomProp,
  getFlex,
  getFlexDir,
  getFontWeight,
  getLineHeight,
  getMultiNumberProp,
  getOpacity,
  getRadius,
  getRawNumber,
  getSize,
  getSpace,
  getTokenValueByScale,
  getWidth,
} from './token-handlers';

const styleMap = new Map();
styleMap.set('backgroundColor', getColor);
styleMap.set('background', getCustomProp('backgroundColor', 'colors'));
styleMap.set('borderBottomColor', getColor);
styleMap.set('borderEndColor', getColor);
styleMap.set('borderColor', getColor);
styleMap.set('borderEndColor', getColor);
styleMap.set('borderLeftColor', getColor);
styleMap.set('borderStartColor', getColor);
styleMap.set('borderTopColor', getColor);
styleMap.set('textDecorationColor', getColor);
styleMap.set('opacity', getOpacity);
styleMap.set('borderRadius', getRadius);
styleMap.set('borderBottomEndRadius', getRadius);
styleMap.set('borderBottomLeftRadius', getRadius);
styleMap.set('borderBottomRightRadius', getRadius);
styleMap.set('borderBottomStartRadius', getRadius);
styleMap.set('borderEndRadius', getRadius);
styleMap.set('borderStartStartRadius', getRadius);
styleMap.set('borderEndEndRadius', getRadius);
styleMap.set('borderEndStartRadius', getRadius);
styleMap.set('borderTopStartRadius', getRadius);
styleMap.set('borderTopLeftRadius', getRadius);
styleMap.set('borderTopRightRadius', getRadius);
styleMap.set('borderTopEndRadius', getRadius);
styleMap.set('width', getWidth);
styleMap.set('w', getCustomProp('width', 'sizes', getRawNumber));
styleMap.set('height', getSize);
styleMap.set('h', getCustomProp('height', 'sizes', getRawNumber));
styleMap.set('maxWidth', getSize);
styleMap.set('maxH', getCustomProp('maxHeight', 'sizes', getRawNumber));
styleMap.set('maxW', getCustomProp('maxWidth', 'sizes', getRawNumber));
styleMap.set('maxHeight', getSize);
styleMap.set('minWidth', getSize);
styleMap.set('minHeight', getSize);
styleMap.set('borderBottomWidth', getBorderWidth);
styleMap.set('borderEndWidth', getBorderWidth);
styleMap.set('borderLeftWidth', getBorderWidth);
styleMap.set('borderRightWidth', getBorderWidth);
styleMap.set('borderStartWidth', getBorderWidth);
styleMap.set('borderTopWidth', getBorderWidth);
styleMap.set('borderWidth', getBorderWidth);
styleMap.set('top', getSpace);
styleMap.set('bottom', getSpace);
styleMap.set('left', getSpace);
styleMap.set('right', getSpace);
styleMap.set('gap', getSpace);
styleMap.set('margin', getMultiNumberProp('space', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight'));
styleMap.set('m', getMultiNumberProp('space', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight'));
styleMap.set('marginBottom', getSpace);
styleMap.set('mb', getCustomProp('marginBottom', 'space', getRawNumber));
styleMap.set('marginEnd', getSpace);
styleMap.set('marginHorizontal', getSpace);
styleMap.set('marginRight', getSpace);
styleMap.set('mr', getCustomProp('marginRight', 'space', getRawNumber));
styleMap.set('mx', getMultiNumberProp('space', 'marginLeft', 'marginRight'));
styleMap.set('marginX', getMultiNumberProp('space', 'marginLeft', 'marginRight'));
styleMap.set('marginLeft', getSpace);
styleMap.set('ml', getCustomProp('marginLeft', 'space', getRawNumber));
styleMap.set('marginStart', getSpace);
styleMap.set('marginTop', getSpace);
styleMap.set('mt', getCustomProp('marginTop', 'space', getRawNumber));
styleMap.set('marginVertical', getMultiNumberProp('space', 'marginTop', 'marginBottom'));
styleMap.set('my', getMultiNumberProp('space', 'marginTop', 'marginBottom'));
styleMap.set('marginY', getMultiNumberProp('space', 'marginTop', 'marginBottom'));
styleMap.set('padding', getMultiNumberProp('space', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'));
styleMap.set('p', getMultiNumberProp('space', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight'));
styleMap.set('paddingBottom', getSpace);
styleMap.set('pb', getCustomProp('paddingBottom', 'space', getRawNumber));
styleMap.set('paddingEnd', getSpace);
styleMap.set('paddingHorizontal', getMultiNumberProp('space', 'paddingLeft', 'paddingRight'));
styleMap.set('px', getMultiNumberProp('space', 'paddingLeft', 'paddingRight'));
styleMap.set('paddingX', getMultiNumberProp('space', 'paddingLeft', 'paddingRight'));
styleMap.set('paddingLeft', getSpace);
styleMap.set('pl', getCustomProp('paddingLeft', 'space', getRawNumber));
styleMap.set('paddingRight', getSpace);
styleMap.set('pr', getCustomProp('paddingRight', 'space', getRawNumber));
styleMap.set('paddingStart', getSpace);
styleMap.set('paddingTop', getSpace);
styleMap.set('pt', getCustomProp('paddingTop', 'space', getRawNumber));
styleMap.set('paddingVertical', getMultiNumberProp('space', 'paddingTop', 'paddingBottom'));
styleMap.set('py', getMultiNumberProp('space', 'paddingTop', 'paddingBottom'));
styleMap.set('paddingY', getMultiNumberProp('space', 'paddingTop', 'paddingBottom'));
styleMap.set('rowGap', getSpace);
styleMap.set('zIndex', getTokenValueByScale('zIndices'));
styleMap.set('flexDir', getFlexDir);
styleMap.set('flex', getFlex);
styleMap.set('color', getColor);
styleMap.set('fontSize', getTokenValueByScale('fontSizes'));
styleMap.set('fontWeight', getFontWeight);
styleMap.set('letterSpacing', getTokenValueByScale('letterSpacings'));
styleMap.set('lineHeight', getLineHeight);
styleMap.set('fontFamily', getTokenValueByScale('fonts'));

export { styleMap };
