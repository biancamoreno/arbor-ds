import React, { Children, isValidElement, useState } from 'react';
import { Box, Flex, Image, Text } from '../../core';
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
      <Flex className={className} style={style} {...slots.root} display="flex">
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

  const fallbackStyles = (slots.fallback ?? {}) as Record<string, unknown>;
  const textColor = fallbackStyles.color as string | undefined;
  const textFontSize = fallbackStyles.fontSize as string | undefined;
  const textFontWeight = fallbackStyles.fontWeight as string | undefined;

  return (
    <Flex className={className} style={style} {...slots.fallback} display="flex">
      <Text color={textColor} fontSize={textFontSize} fontWeight={textFontWeight}>
        {children}
      </Text>
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

  const overflowStyles = (slots.overflow ?? {}) as Record<string, unknown>;
  const overflowTextColor = overflowStyles.color as string | undefined;
  const overflowFontSize = overflowStyles.fontSize as string | undefined;
  const overflowFontWeight = overflowStyles.fontWeight as string | undefined;

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
          {...slots.overflow}
          position="relative"
          display="flex"
          borderWidth={2}
          borderStyle="solid"
          borderColor="surface.default"
          marginLeft={negativeOverlap as unknown as number}
          zIndex={0}
        >
          <Text color={overflowTextColor} fontSize={overflowFontSize} fontWeight={overflowFontWeight}>
            +{overflow}
          </Text>
        </Flex>
      )}
    </Flex>
  );
}

/**
 * @platform native
 *
 * Avatar em React Native — paridade com web pós-RFC-0035 + PCV-13.
 *
 * - `Avatar.Image` consome `<Image>` do DS (já cross-platform via
 *   RFC-0011/0012).
 * - `Avatar.Fallback` extrai `color`/`fontSize`/`fontWeight` da slot recipe
 *   e aplica em um `<Text>` interno (RN não cascateia text props de View).
 * - `AvatarGroup` substitui `boxShadow: 'avatarRing'` (CSS-only) por
 *   `borderWidth: 2` + `borderColor: 'surface.default'` — efeito visual
 *   equivalente, suportado pelo runtime native.
 * - Tamanhos/shape/cores via slot recipe `avatar` (PCV-13).
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
