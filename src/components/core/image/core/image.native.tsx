import { Image as RNImage, type ImageStyle, type StyleProp } from 'react-native';
import { type ImageProps } from '../interfaces';

function normalizeSource(source: string | { uri: string } | number) {
  if (typeof source === 'number') return source;
  if (typeof source === 'object' && source?.uri) return source;
  return { uri: String(source) };
}

function toNativeDimension(value: string | number | undefined) {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && /^\d+%$/.test(value.trim())) {
    return value as `${number}%`;
  }
  return undefined;
}

export function Image({
  source,
  resizeMode = 'cover',
  style,
  testID,
  onError,
  onLoad,
  width,
  height,
  alt,
  children,
  ...props
}: ImageProps) {
  void children;

  const nativeWidth = toNativeDimension(width);
  const nativeHeight = toNativeDimension(height);
  const imageStyle: StyleProp<ImageStyle> = [
    nativeWidth !== undefined || nativeHeight !== undefined
      ? { width: nativeWidth, height: nativeHeight }
      : null,
    style as StyleProp<ImageStyle>,
  ].filter(Boolean);

  return (
    <RNImage
      source={normalizeSource(source)}
      resizeMode={resizeMode}
      style={imageStyle}
      testID={testID}
      accessibilityLabel={alt}
      onError={onError}
      onLoad={onLoad}
      {...props}
    />
  );
}
