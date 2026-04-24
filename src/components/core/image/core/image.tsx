import { forwardRef } from 'react';
import { Box } from '../../box';
import { type ImageProps } from '../interfaces';

export const Image = forwardRef<HTMLElement, ImageProps>(function Image(
  { children, resizeMode = 'cover', source, style, testID, alt, width, height, ...props },
  ref,
) {
  if (children) {
    return (
      <Box
        ref={ref}
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
      ref={ref}
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
});

Image.displayName = 'Image';
