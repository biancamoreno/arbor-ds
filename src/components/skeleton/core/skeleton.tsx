import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Box, Flex } from '../../core';
import type { SkeletonProps } from '../interfaces';

type LineProps = Omit<SkeletonProps, 'lines' | 'label'> & {
  'aria-hidden'?: boolean | 'true' | 'false';
  role?: string;
  'aria-label'?: string;
};

function SkeletonLine({ width, height, borderRadius, style, ...rest }: LineProps) {
  const theme = useTheme();
  const bg = theme.colors.background.subtle;
  const highlight = theme.colors.background.interactive;

  return (
    <Box
      as="span"
      display="block"
      style={{
        width: typeof width === 'number' ? `${width}px` : (width ?? '100%'),
        height: typeof height === 'number' ? `${height}px` : (height ?? '16px'),
        borderRadius:
          typeof borderRadius === 'number'
            ? `${borderRadius}px`
            : (borderRadius ?? `${theme.radii.nano}px`),
        backgroundImage: `linear-gradient(90deg, ${bg} 25%, ${highlight} 50%, ${bg} 75%)`,
        backgroundSize: '200% 100%',
        animation: 'arbor-shimmer 1.4s ease-in-out infinite',
        ...style,
      }}
      {...rest}
    />
  );
}

export function Skeleton({
  lines,
  width,
  height,
  borderRadius,
  label = 'Carregando',
  style,
  ...props
}: SkeletonProps) {
  const a11yProps =
    label === false
      ? { 'aria-hidden': true as const }
      : { role: 'status', 'aria-label': label };

  if (lines && lines > 1) {
    return (
      <Flex
        as="span"
        flexDirection="column"
        gap="tiny"
        style={style}
        {...a11yProps}
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
      width={width}
      height={height}
      borderRadius={borderRadius}
      style={style}
      {...a11yProps}
      {...props}
    />
  );
}

Skeleton.displayName = 'Skeleton';
