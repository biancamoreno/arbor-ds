import { forwardRef, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useTheme } from '../../../../ecosystem';
import { Box } from '../../box';
import { Center } from '../../center';
import { Icon } from '../../icon';
import {
  type ImageErrorEvent,
  type ImageErrorFallback,
  type ImageFallback,
  type ImageLoadEvent,
  type ImageProps,
  type ImageResizeMode,
  type ImageSource,
} from '../interfaces';

type LoadStatus = 'loading' | 'loaded' | 'error';

const SHIMMER_KEYFRAMES_ID = 'arbor-shimmer-keyframes';

function injectShimmerKeyframes() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(SHIMMER_KEYFRAMES_ID)) return;
  const style = document.createElement('style');
  style.id = SHIMMER_KEYFRAMES_ID;
  style.textContent = '@keyframes arbor-shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}';
  document.head.appendChild(style);
}

function sourceToUrl(source: ImageSource): string {
  if (typeof source === 'string') return source;
  if (typeof source === 'number') return String(source);
  return source.uri;
}

function objectFitFor(resizeMode: ImageResizeMode): CSSProperties['objectFit'] {
  if (resizeMode === 'stretch') return 'fill';
  if (resizeMode === 'center') return 'none';
  return resizeMode;
}

function backgroundSizeFor(resizeMode: ImageResizeMode): string {
  if (resizeMode === 'stretch') return '100% 100%';
  if (resizeMode === 'center') return 'auto';
  return resizeMode;
}

function ShimmerPlaceholder() {
  const theme = useTheme();
  injectShimmerKeyframes();

  const bg = theme.colors.background.subtle;
  const highlight = theme.colors.background.interactive;

  return (
    <Box
      aria-hidden="true"
      width="100%"
      height="100%"
      style={{
        backgroundImage: `linear-gradient(90deg, ${bg} 25%, ${highlight} 50%, ${bg} 75%)`,
        backgroundSize: '200% 100%',
        animation: 'arbor-shimmer 1.4s ease-in-out infinite',
      }}
    />
  );
}

function ErrorPlaceholder() {
  return (
    <Center width="100%" height="100%" backgroundColor="background.subtle">
      <Icon name="ImageOff" size="lg" decorative={false} aria-label="Imagem indisponível" />
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

export const Image = forwardRef<HTMLElement, ImageProps>(function Image(props, ref) {
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

  const url = sourceToUrl(source);
  const [status, setStatus] = useState<LoadStatus>('loading');
  const onLoadRef = useRef(onLoad);
  const onErrorRef = useRef(onError);
  onLoadRef.current = onLoad;
  onErrorRef.current = onError;

  const isBackground = props.mode === 'background';

  useEffect(() => {
    if (!isBackground) return;
    if (typeof window === 'undefined') return;

    setStatus('loading');
    const preloader = new window.Image();
    let cancelled = false;
    preloader.onload = (event) => {
      if (cancelled) return;
      setStatus('loaded');
      onLoadRef.current?.(event as unknown as ImageLoadEvent);
    };
    preloader.onerror = (event) => {
      if (cancelled) return;
      setStatus('error');
      onErrorRef.current?.(event as unknown as ImageErrorEvent);
    };
    preloader.src = url;

    return () => {
      cancelled = true;
      preloader.onload = null;
      preloader.onerror = null;
    };
  }, [isBackground, url]);

  const handleImgLoad = (event: ImageLoadEvent) => {
    setStatus('loaded');
    onLoad?.(event);
  };

  const handleImgError = (event: ImageErrorEvent) => {
    setStatus('error');
    onError?.(event);
  };

  const overlayNode =
    status === 'loading'
      ? renderFallback(fallback)
      : status === 'error'
        ? renderErrorFallback(errorFallback)
        : null;

  if (isBackground) {
    const { children, alt } = props;
    const containerStyle: CSSProperties = {
      backgroundImage: status === 'loaded' ? `url(${url})` : undefined,
      backgroundSize: backgroundSizeFor(resizeMode),
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      ...style,
    };

    return (
      <Box
        ref={ref}
        position="relative"
        width={width ?? '100%'}
        height={height ?? 'auto'}
        style={containerStyle}
        data-testid={testID}
        aria-label={alt || undefined}
        aria-busy={status === 'loading' || undefined}
        role={alt ? 'img' : undefined}
      >
        {overlayNode ? (
          <Box position="absolute" inset={0} pointerEvents="none">
            {overlayNode}
          </Box>
        ) : null}
        {children}
      </Box>
    );
  }

  const { alt } = props;

  return (
    <Box
      ref={ref}
      position="relative"
      display="inline-block"
      width={width}
      height={height}
      data-testid={testID}
      aria-busy={status === 'loading' || undefined}
    >
      <Box
        as="img"
        src={url}
        alt={alt}
        display="block"
        width={width !== undefined ? '100%' : undefined}
        height={height !== undefined ? '100%' : undefined}
        onLoad={handleImgLoad}
        onError={handleImgError}
        style={{
          objectFit: objectFitFor(resizeMode),
          opacity: status === 'loaded' ? 1 : 0,
          ...style,
        }}
      />
      {overlayNode ? (
        <Box position="absolute" inset={0} pointerEvents="none">
          {overlayNode}
        </Box>
      ) : null}
    </Box>
  );
});

Image.displayName = 'Image';
