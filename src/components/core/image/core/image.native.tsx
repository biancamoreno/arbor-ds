import { forwardRef, useCallback, useState, type ReactNode } from 'react';
import {
  Image as RNImage,
  ImageBackground as RNImageBackground,
  type ImageErrorEventData,
  type ImageLoadEventData,
  type ImageStyle,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Box } from '../../box';
import { Center } from '../../center';
import { Icon } from '../../icon';
import {
  type ImageErrorEvent,
  type ImageErrorFallback,
  type ImageFallback,
  type ImageLoadEvent,
  type ImageProps,
  type ImageSource,
} from '../interfaces';

type LoadStatus = 'loading' | 'loaded' | 'error';

function normalizeSource(source: ImageSource) {
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

function ShimmerPlaceholder() {
  return <Box flex={1} backgroundColor="background.subtle" />;
}

function ErrorPlaceholder() {
  return (
    <Center flex={1} backgroundColor="background.subtle">
      <Icon name="ImageOff" size="large" decorative={false} aria-label="Imagem indisponível" />
    </Center>
  );
}

function renderFallback(fallback: ImageFallback): ReactNode {
  if (fallback === 'none') return null;
  if (fallback === 'skeleton' || fallback === undefined) return <ShimmerPlaceholder />;
  return fallback;
}

function renderErrorFallback(errorFallback: ImageErrorFallback): ReactNode {
  if (errorFallback === 'none') return null;
  if (errorFallback === 'icon' || errorFallback === undefined) return <ErrorPlaceholder />;
  return errorFallback;
}

/**
 * @platform native
 *
 * Implementação React Native do `Image`: usa `<RNImage>` (modo `img`) ou
 * `<RNImageBackground>` (modo `background`). `width`/`height` aceitam apenas
 * número ou percentual (`'50%'`); outros valores CSS são ignorados pela
 * tipagem nativa. Os fallbacks de `loading`/`error` ficam em camada absoluta
 * sobre o `<RNImage>` quando aplicáveis.
 *
 * @see {@link ImageProps}
 */
export const Image = forwardRef<unknown, ImageProps>(function Image(props, ref) {
  const {
    source,
    width,
    height,
    resizeMode = 'cover',
    style,
    testID,
    onLoad,
    onError,
    fallback = 'skeleton',
    errorFallback = 'icon',
  } = props;

  const [status, setStatus] = useState<LoadStatus>('loading');

  const handleLoad = useCallback(
    (event: NativeSyntheticEvent<ImageLoadEventData>) => {
      setStatus('loaded');
      onLoad?.(event as unknown as ImageLoadEvent);
    },
    [onLoad],
  );

  const handleError = useCallback(
    (event: NativeSyntheticEvent<ImageErrorEventData>) => {
      setStatus('error');
      onError?.(event as unknown as ImageErrorEvent);
    },
    [onError],
  );

  const nativeWidth = toNativeDimension(width);
  const nativeHeight = toNativeDimension(height);
  const sizeStyle =
    nativeWidth !== undefined || nativeHeight !== undefined
      ? { width: nativeWidth, height: nativeHeight }
      : null;

  const overlayNode =
    status === 'loading'
      ? renderFallback(fallback)
      : status === 'error'
        ? renderErrorFallback(errorFallback)
        : null;

  if (props.mode === 'background') {
    const { children, alt } = props;
    const containerStyle: StyleProp<ViewStyle> = [
      sizeStyle,
      style as StyleProp<ViewStyle>,
    ].filter(Boolean) as StyleProp<ViewStyle>;

    return (
      <RNImageBackground
        ref={ref as never}
        source={normalizeSource(source)}
        resizeMode={resizeMode}
        style={containerStyle}
        testID={testID}
        accessibilityLabel={alt}
        accessibilityRole={alt ? 'image' : undefined}
        onLoad={handleLoad}
        onError={handleError}
      >
        {overlayNode ? (
          <Box position="absolute" inset={0} pointerEvents="none">
            {overlayNode}
          </Box>
        ) : null}
        {children}
      </RNImageBackground>
    );
  }

  const { alt } = props;
  const imageStyle: StyleProp<ImageStyle> = [
    sizeStyle,
    style as StyleProp<ImageStyle>,
  ].filter(Boolean) as StyleProp<ImageStyle>;

  if (overlayNode) {
    return (
      <Box position="relative" width={width} height={height}>
        <RNImage
          ref={ref as never}
          source={normalizeSource(source)}
          resizeMode={resizeMode}
          style={imageStyle}
          testID={testID}
          accessibilityLabel={alt}
          onLoad={handleLoad}
          onError={handleError}
        />
        <Box position="absolute" inset={0} pointerEvents="none">
          {overlayNode}
        </Box>
      </Box>
    );
  }

  return (
    <RNImage
      ref={ref as never}
      source={normalizeSource(source)}
      resizeMode={resizeMode}
      style={imageStyle}
      testID={testID}
      accessibilityLabel={alt}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
});

Image.displayName = 'Image';
