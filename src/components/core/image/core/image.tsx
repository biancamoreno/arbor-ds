import { Box } from '../../box';
import { type ImageProps } from '../interfaces';

export function Image({
  children,
  resizeMode = 'cover',
  source,
  style,
  testID,
  alt,
  width,
  height,
  ...props
}: ImageProps) {
  if (children) {
    return (
      <Box
        width={'100%'}
        height={'auto'}
        position={'relative'}
        backgroundImage={`url(${source})`}
        backgroundSize={resizeMode === 'stretch' ? '100% 100%' : resizeMode}
        backgroundRepeat={'no-repeat'}
        backgroundPosition={resizeMode === 'center' ? 'center' : 'initial'}
        style={style}
        data-testid={testID}
        {...props}
      >
        {children}
      </Box>
    );
  }

  return (
    <Box
      as={'img'}
      src={source}
      width={width}
      height={height}
      style={{ objectFit: resizeMode !== 'stretch' ? resizeMode : undefined, ...style }}
      data-testid={testID}
      alt={alt}
      {...props}
    />
  );
}

Image.displayName = 'Image';
