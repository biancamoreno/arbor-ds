import React, { Children, isValidElement, useState } from 'react';
import { Box, Flex, Image, Text } from '../../core';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { AvatarContext, useAvatarContext } from '../context/avatar-context';
import type {
  AvatarRootProps,
  AvatarImageProps,
  AvatarFallbackProps,
  AvatarGroupProps,
  AvatarSize,
} from '../interfaces';

const sizeToken = (size: AvatarSize) => `avatar.${size}` as const;

function AvatarRoot({ size = 'medium', shape = 'circle', children, className, style }: AvatarRootProps) {
  const [imageStatus, setImageStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');

  return (
    <AvatarContext.Provider value={{ imageStatus, setImageStatus }}>
      <Flex
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius={shape === 'circle' ? 'full' : 'small'}
        backgroundColor="background.subtle"
        overflow="hidden"
        flexShrink={0}
        width={sizeToken(size)}
        height={sizeToken(size)}
        className={className}
        style={style}
      >
        {children}
      </Flex>
    </AvatarContext.Provider>
  );
}

function AvatarImage({ src, alt, onLoad, onError, style }: AvatarImageProps) {
  const { setImageStatus } = useAvatarContext();

  return (
    <Image
      mode="img"
      source={src}
      alt={alt}
      width="100%"
      height="100%"
      resizeMode="cover"
      fallback="none"
      errorFallback="none"
      onLoad={(e) => { setImageStatus('loaded'); onLoad?.(e); }}
      onError={(e) => { setImageStatus('error'); onError?.(e); }}
      style={style}
    />
  );
}

function AvatarFallback({ children, delayMs = 0, className, style }: AvatarFallbackProps) {
  const { imageStatus } = useAvatarContext();
  const [show, setShow] = React.useState(delayMs === 0);

  React.useEffect(() => {
    if (delayMs === 0) return;
    const t = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  if (!show || imageStatus === 'loaded') return null;

  return (
    <Flex
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100%"
      fontSize="small"
      fontWeight="medium"
      color="text.secondary"
      className={className}
      style={style}
    >
      {children}
    </Flex>
  );
}

function AvatarGroup({ children, max, size = 'medium', className, style }: AvatarGroupProps) {
  const theme = useTheme();
  const childArray = Children.toArray(children).filter(isValidElement);
  const visible = max !== undefined ? childArray.slice(0, max) : childArray;
  const overflow = max !== undefined ? childArray.length - max : 0;
  const overlapValue = theme.sizes.avatarOverlap[size];
  const negativeOverlap = `-${overlapValue}`;

  return (
    <Flex display="flex" flexDirection="row" alignItems="center" className={className} style={style}>
      {visible.map((child, i) => (
        <Box
          key={i}
          position="relative"
          borderRadius="full"
          borderWidth={2}
          borderStyle="solid"
          borderColor="surface.default"
          marginLeft={i === 0 ? 0 : (negativeOverlap as unknown as number)}
          zIndex={visible.length - i}
        >
          {React.cloneElement(child as React.ReactElement<AvatarRootProps>, { size })}
        </Box>
      ))}
      {overflow > 0 && (
        <Flex
          position="relative"
          display="flex"
          alignItems="center"
          justifyContent="center"
          width={sizeToken(size)}
          height={sizeToken(size)}
          borderRadius="full"
          borderWidth={2}
          borderStyle="solid"
          borderColor="surface.default"
          backgroundColor="background.interactive"
          fontSize="xsmall"
          fontWeight="medium"
          color="text.secondary"
          marginLeft={negativeOverlap as unknown as number}
          zIndex={0}
        >
          <Text fontSize="xsmall" fontWeight="medium" color="text.secondary">+{overflow}</Text>
        </Flex>
      )}
    </Flex>
  );
}

/**
 * @platform native
 *
 * Avatar em React Native — paridade com web pós-RFC-0035.
 *
 * - `Avatar.Image` consome `<Image>` do DS (já cross-platform via
 *   RFC-0011/0012). Sem fork de implementação.
 * - `AvatarGroup` substitui `boxShadow: 'avatarRing'` (CSS-only) por
 *   `borderWidth: 2` + `borderColor: 'surface.default'` — efeito visual
 *   equivalente, suportado pelo runtime native.
 * - Tamanhos via `theme.sizes.avatar.{size}` e overlap via
 *   `theme.sizes.avatarOverlap.{size}`.
 *
 * @see {@link AvatarRootProps}
 * @see RFC-0035
 */
export const Avatar = Object.assign(AvatarRoot, {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
});

/**
 * @platform native
 * @see {@link AvatarGroupProps}
 */
export { AvatarGroup };
