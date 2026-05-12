import React, { Children, isValidElement, useState } from 'react';
import { Box, Flex, Image } from '../../core';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { AvatarContext, useAvatarContext } from '../context/avatar-context';
import type {
  AvatarProps,
  AvatarRootProps,
  AvatarImageProps,
  AvatarFallbackProps,
  AvatarGroupProps,
} from '../interfaces';

type AvatarSlots = 'root' | 'image' | 'fallback' | 'overflow';

function AvatarRoot({ size = 'medium', shape = 'circle', children, className, style }: AvatarRootProps) {
  const [imageStatus, setImageStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const slots = useSlotRecipe<AvatarSlots>('avatar', { size, shape });

  return (
    <AvatarContext.Provider value={{ imageStatus, setImageStatus }}>
      <Flex as="span" className={className} style={style} {...slots.root}>
        {children}
      </Flex>
    </AvatarContext.Provider>
  );
}

function AvatarImage({ src, alt, onLoad, onError, style }: AvatarImageProps) {
  const { setImageStatus } = useAvatarContext();
  const slots = useSlotRecipe<AvatarSlots>('avatar');
  const imageStyle = (slots.image ?? {}) as Record<string, unknown>;

  return (
    <Image
      mode="img"
      source={src}
      alt={alt}
      width={imageStyle.width as string | number | undefined}
      height={imageStyle.height as string | number | undefined}
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
  const slots = useSlotRecipe<AvatarSlots>('avatar');

  React.useEffect(() => {
    if (delayMs === 0) return;
    const t = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  if (!show || imageStatus === 'loaded') return null;

  return (
    <Flex as="span" aria-hidden="true" className={className} style={style} {...slots.fallback}>
      {children}
    </Flex>
  );
}

function AvatarGroup({ children, max, size = 'medium', className, style }: AvatarGroupProps) {
  const theme = useTheme();
  const slots = useSlotRecipe<AvatarSlots>('avatar', { size, shape: 'circle' });
  const childArray = Children.toArray(children).filter(isValidElement);
  const visible = max !== undefined ? childArray.slice(0, max) : childArray;
  const overflow = max !== undefined ? childArray.length - max : 0;
  const negativeOverlap = `-${theme.sizes.avatarOverlap[size]}`;

  return (
    <Flex
      as="span"
      display="inline-flex"
      alignItems="center"
      className={className}
      style={style}
    >
      {visible.map((child, i) => (
        <Box
          as="span"
          key={i}
          position="relative"
          borderRadius="full"
          marginLeft={i === 0 ? 0 : (negativeOverlap as unknown as number)}
          zIndex={visible.length - i}
          boxShadow="avatarRing"
        >
          {React.cloneElement(child as React.ReactElement<AvatarRootProps>, { size })}
        </Box>
      ))}
      {overflow > 0 && (
        <Flex
          as="span"
          {...slots.overflow}
          position="relative"
          marginLeft={negativeOverlap as unknown as number}
          zIndex={0}
          boxShadow="avatarRing"
        >
          +{overflow}
        </Flex>
      )}
    </Flex>
  );
}

AvatarRoot.displayName = 'Avatar.Root';
AvatarImage.displayName = 'Avatar.Image';
AvatarFallback.displayName = 'Avatar.Fallback';

/**
 * @platform shared
 *
 * Avatar cross-platform. API plana (recomendada para 95% dos casos):
 *
 * @example
 * <Avatar src={user.photo} alt={user.name} fallback={getInitials(user.name)} />
 *
 * Para anatomia custom (delay no fallback, layout não-trivial, ring custom),
 * use o compound:
 *
 * @example
 * <Avatar.Root size="medium">
 *   <Avatar.Image src={user.photo} alt={user.name} />
 *   <Avatar.Fallback delayMs={300}>{getInitials(user.name)}</Avatar.Fallback>
 * </Avatar.Root>
 *
 * Anatomia (tamanhos, shape, background placeholder, fallback color, overflow
 * color) resolvida pela slot recipe `avatar`; override via
 * `createTheme({ recipes: { avatar: ... }, components: { avatar: ... } })`.
 *
 * @see {@link AvatarProps} para API plana
 * @see {@link AvatarRootProps} para API compound
 */
function AvatarFlat({ src, alt, fallback, fallbackDelayMs, children, ...rootProps }: AvatarProps) {
  const usesFlatApi = src !== undefined || alt !== undefined || fallback !== undefined;
  if (!usesFlatApi) {
    return <AvatarRoot {...rootProps}>{children}</AvatarRoot>;
  }
  return (
    <AvatarRoot {...rootProps}>
      {src !== undefined && <AvatarImage src={src} alt={alt ?? ''} />}
      {fallback !== undefined && (
        <AvatarFallback delayMs={fallbackDelayMs}>{fallback}</AvatarFallback>
      )}
    </AvatarRoot>
  );
}

AvatarFlat.displayName = 'Avatar';

export const Avatar = Object.assign(AvatarFlat, {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
});

/**
 * @platform shared
 *
 * Empilha múltiplos `Avatar` lado a lado com sobreposição negativa
 * (`theme.sizes.avatarOverlap.{size}`). Quando o número de filhos excede
 * `max`, exibe um avatar contador com `+N` cuja anatomia é resolvida pelo
 * slot `overflow` da recipe `avatar` (cores temáticas via tokens). Anel
 * via `shadows.avatarRing` (web) — produto pode redefinir cor/espessura
 * via `createTheme`.
 *
 * @see {@link AvatarGroupProps}
 */
export { AvatarGroup };
