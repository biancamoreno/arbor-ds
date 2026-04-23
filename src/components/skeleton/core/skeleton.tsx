import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Box, Flex } from '../../core';
import type { SkeletonProps } from '../interfaces';

const KEYFRAMES_ID = 'arbor-skeleton-keyframes';

function injectKeyframes() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(KEYFRAMES_ID)) return;
  const style = document.createElement('style');
  style.id = KEYFRAMES_ID;
  style.textContent = `
    @keyframes arbor-shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `;
  document.head.appendChild(style);
}

function SkeletonLine({ width, height, borderRadius, style, ...props }: Omit<SkeletonProps, 'lines'>) {
  const theme = useTheme();
  injectKeyframes();

  const bg = theme.colors.background.subtle;
  const highlight = theme.colors.background.interactive;

  return (
    <Box
      as="span"
      {...props}
      display="block"
      style={{
        width: typeof width === 'number' ? `${width}px` : (width ?? '100%'),
        height: typeof height === 'number' ? `${height}px` : (height ?? '16px'),
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : (borderRadius ?? theme.radii.nano),
        backgroundImage: `linear-gradient(90deg, ${bg} 25%, ${highlight} 50%, ${bg} 75%)`,
        backgroundSize: '200% 100%',
        animation: 'arbor-shimmer 1.4s ease-in-out infinite',
        ...style,
      }}
    />
  );
}

export function Skeleton({ lines, width, height, borderRadius, style, ...props }: SkeletonProps) {
  if (lines && lines > 1) {
    return (
      <Flex
        as="span"
        role="status"
        aria-label="Carregando"
        flexDirection="column"
        gap="tiny"
        style={style}
        {...props}
      >
        {Array.from({ length: lines }, (_, i) => (
          <SkeletonLine
            key={i}
            aria-hidden="true"
            width={i === lines - 1 ? '60%' : width}
            height={height}
            borderRadius={borderRadius}
          />
        ))}
      </Flex>
    );
  }

  return (
    <SkeletonLine
      role="status"
      aria-label="Carregando"
      width={width}
      height={height}
      borderRadius={borderRadius}
      style={style}
      {...props}
    />
  );
}
