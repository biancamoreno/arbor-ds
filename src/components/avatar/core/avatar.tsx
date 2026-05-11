import React, { Children, isValidElement, useState } from 'react';
import { Box, Flex, Image } from '../../core';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { AvatarContext, useAvatarContext } from '../context/avatar-context';
import type {
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

/**
 * @platform shared
 *
 * Compound de avatar (cross-platform). `Avatar.Root` controla `size` (SP-1
 * completo) e `shape` (`circle`/`square`). `Avatar.Image` consome
 * `<Image>` do DS (RFC-0011/0012) — paridade web/native automática.
 * `Avatar.Fallback` exibe iniciais ou conteúdo customizado em loading/erro
 * (`delayMs` evita flash).
 *
 * Anatomia e cor (tamanhos, shape, background placeholder, fallback color,
 * overflow color) resolvidas pela slot recipe `avatar` — override completo
 * via `createTheme({ recipes: { avatar: ... }, components: { avatar: ... } })`.
 *
 * @example
 * <Avatar size="medium">
 *   <Avatar.Image src={user.photo} alt={user.name} />
 *   <Avatar.Fallback>{getInitials(user.name)}</Avatar.Fallback>
 * </Avatar>
 *
 * @see {@link AvatarRootProps}
 */
export const Avatar = Object.assign(AvatarRoot, {
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
