import { Image as RNImage, ImageStyle } from 'react-native';
import { type ImageProps } from '../interfaces';

function normalizeSource(source: string | { uri: string } | number) {
  if (typeof source === 'number') return source;
  if (typeof source === 'object' && source?.uri) return source;
  return { uri: String(source) };
}

export function Image({
  source,
  resizeMode = 'cover',
  style,
  testID,
  onError,
  onLoad,
  ...props
}: ImageProps) {
  return (
    <RNImage
      source={normalizeSource(source)}
      resizeMode={resizeMode}
      style={style as ImageStyle}
      testID={testID}
      onError={onError}
      onLoad={onLoad}
      {...props}
    />
  );
}
