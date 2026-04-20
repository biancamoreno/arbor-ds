import React, { Children, isValidElement, useState } from 'react';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { AvatarContext } from '../context/avatar-context';
import type {
  AvatarRootProps,
  AvatarImageProps,
  AvatarFallbackProps,
  AvatarGroupProps,
} from '../interfaces';

const SIZE_PX: Record<NonNullable<AvatarRootProps['size']>, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

function AvatarRoot({ size = 'md', shape = 'circle', children, style, ...props }: AvatarRootProps) {
  const theme = useTheme();
  const [imageStatus, setImageStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const px = SIZE_PX[size];

  return (
    <AvatarContext.Provider value={{ imageStatus, setImageStatus }}>
      <span
        {...props}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${px}px`,
          height: `${px}px`,
          borderRadius: shape === 'circle' ? theme.radii.full : theme.radii.small,
          backgroundColor: theme.colors.background.subtle,
          overflow: 'hidden',
          flexShrink: 0,
          userSelect: 'none',
          ...style,
        }}
      >
        {children}
      </span>
    </AvatarContext.Provider>
  );
}

function AvatarImage({ src, alt, style, ...props }: AvatarImageProps) {
  const { setImageStatus } = React.useContext(AvatarContext);

  return (
    <img
      src={src}
      alt={alt}
      onLoad={() => setImageStatus('loaded')}
      onError={() => setImageStatus('error')}
      {...props}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        ...style,
      }}
    />
  );
}

function AvatarFallback({ children, delayMs = 0, style, ...props }: AvatarFallbackProps) {
  const { imageStatus } = React.useContext(AvatarContext);
  const theme = useTheme();

  const [show, setShow] = React.useState(delayMs === 0);

  React.useEffect(() => {
    if (delayMs === 0) return;
    const t = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  if (!show || imageStatus === 'loaded') return null;

  return (
    <span
      aria-hidden="true"
      {...props}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        fontSize: theme.fontSizes.sm,
        fontWeight: theme.fontWeights.medium,
        color: theme.colors.text.secondary,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

function AvatarGroup({ children, max, size = 'md', style, ...props }: AvatarGroupProps) {
  const theme = useTheme();
  const childArray = Children.toArray(children).filter(isValidElement);
  const visible = max !== undefined ? childArray.slice(0, max) : childArray;
  const overflow = max !== undefined ? childArray.length - max : 0;
  const px = SIZE_PX[size];
  const overlap = Math.floor(px * 0.3);

  return (
    <span
      {...props}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        ...style,
      }}
    >
      {visible.map((child, i) => (
        <span
          key={i}
          style={{
            marginLeft: i === 0 ? 0 : `-${overlap}px`,
            zIndex: visible.length - i,
            position: 'relative',
            borderRadius: theme.radii.full,
            boxShadow: `0 0 0 2px ${theme.colors.surface.default}`,
          }}
        >
          {React.cloneElement(child as React.ReactElement<AvatarRootProps>, { size })}
        </span>
      ))}
      {overflow > 0 && (
        <span
          style={{
            marginLeft: `-${overlap}px`,
            zIndex: 0,
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${px}px`,
            height: `${px}px`,
            borderRadius: theme.radii.full,
            backgroundColor: theme.colors.background.interactive,
            boxShadow: `0 0 0 2px ${theme.colors.surface.default}`,
            fontSize: theme.fontSizes.xsmall,
            fontWeight: theme.fontWeights.medium,
            color: theme.colors.text.secondary,
          }}
        >
          +{overflow}
        </span>
      )}
    </span>
  );
}

export const Avatar = Object.assign(AvatarRoot, {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
});

export { AvatarGroup };
