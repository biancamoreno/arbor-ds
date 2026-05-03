import React, { Children, isValidElement, useState } from 'react';
import { Box, Flex } from '../../core';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { AvatarContext } from '../context/avatar-context';
import type {
  AvatarRootProps,
  AvatarImageProps,
  AvatarFallbackProps,
  AvatarGroupProps,
} from '../interfaces';

const SIZE_PX: Record<NonNullable<AvatarRootProps['size']>, number> = {
  xsmall: 24,
  small: 32,
  medium: 40,
  large: 48,
  xlarge: 64,
};

function AvatarRoot({ size = 'medium', shape = 'circle', children, style, ...props }: AvatarRootProps) {
  const [imageStatus, setImageStatus] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const px = SIZE_PX[size];

  return (
    <AvatarContext.Provider value={{ imageStatus, setImageStatus }}>
      <Flex
        as="span"
        {...props}
        display="inline-flex"
        alignItems="center"
        justifyContent="center"
        borderRadius={shape === 'circle' ? 'full' : 'small'}
        backgroundColor="background.subtle"
        overflow="hidden"
        flexShrink={0}
        userSelect="none"
        style={{ width: px, height: px, ...style }}
      >
        {children}
      </Flex>
    </AvatarContext.Provider>
  );
}

function AvatarImage({ src, alt, style, ...props }: AvatarImageProps) {
  const { setImageStatus } = React.useContext(AvatarContext);

  return (
    <Box
      as="img"
      src={src}
      alt={alt}
      onLoad={() => setImageStatus('loaded')}
      onError={() => setImageStatus('error')}
      {...props}
      width="100%"
      height="100%"
      style={{ objectFit: 'cover', ...style }}
    />
  );
}

function AvatarFallback({ children, delayMs = 0, style, ...props }: AvatarFallbackProps) {
  const { imageStatus } = React.useContext(AvatarContext);

  const [show, setShow] = React.useState(delayMs === 0);

  React.useEffect(() => {
    if (delayMs === 0) return;
    const t = setTimeout(() => setShow(true), delayMs);
    return () => clearTimeout(t);
  }, [delayMs]);

  if (!show || imageStatus === 'loaded') return null;

  return (
    <Flex
      as="span"
      aria-hidden="true"
      {...props}
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100%"
      fontSize="sm"
      fontWeight="medium"
      color="text.secondary"
      style={style}
    >
      {children}
    </Flex>
  );
}

function AvatarGroup({ children, max, size = 'medium', style, ...props }: AvatarGroupProps) {
  const theme = useTheme();
  const childArray = Children.toArray(children).filter(isValidElement);
  const visible = max !== undefined ? childArray.slice(0, max) : childArray;
  const overflow = max !== undefined ? childArray.length - max : 0;
  const px = SIZE_PX[size];
  const overlap = Math.floor(px * 0.3);
  const ringColor = theme.colors.surface.default;

  return (
    <Flex
      as="span"
      {...props}
      display="inline-flex"
      alignItems="center"
      style={style}
    >
      {visible.map((child, i) => (
        <Box
          as="span"
          key={i}
          position="relative"
          borderRadius="full"
          style={{
            marginLeft: i === 0 ? 0 : `-${overlap}px`,
            zIndex: visible.length - i,
            boxShadow: `0 0 0 2px ${ringColor}`,
          }}
        >
          {React.cloneElement(child as React.ReactElement<AvatarRootProps>, { size })}
        </Box>
      ))}
      {overflow > 0 && (
        <Flex
          as="span"
          position="relative"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          width={px}
          height={px}
          borderRadius="full"
          backgroundColor="background.interactive"
          fontSize="xsmall"
          fontWeight="medium"
          color="text.secondary"
          style={{
            marginLeft: `-${overlap}px`,
            zIndex: 0,
            boxShadow: `0 0 0 2px ${ringColor}`,
          }}
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
 * Compound de avatar circular. `Avatar.Root` controla tamanho (`size`) e
 * shape; `Avatar.Image` carrega o `src` e ativa `Avatar.Fallback` (iniciais ou
 * conteúdo customizado) quando a imagem falha ou demora a carregar
 * (`delayMs`). Use `AvatarGroup` para empilhar avatares com `+N` quando
 * excede `max`.
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
 * Empilha múltiplos `Avatar` lado a lado com sobreposição negativa. Quando o
 * número de filhos excede `max`, exibe um avatar contador com `+N`.
 *
 * @see {@link AvatarGroupProps}
 */
export { AvatarGroup };
