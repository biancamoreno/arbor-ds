import { Box } from '../..';
import { type ImageProps } from '../interfaces';

export function Image({
  children,
  resizeMode = 'cover',
  source,
  style,
  testID,
  alt,
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
      as={'img' }
      src={source}
      style={{
        objectFit: resizeMode === 'stretch' ? undefined : resizeMode,
        width: props.width,
        height: props.height,
        ...style,
      }}
      data-testid={testID}
      alt={alt}
      {...props}
    />
  );
}
