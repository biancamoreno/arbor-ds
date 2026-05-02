import { useEffect, useRef } from 'react';
import { Animated, Easing, type ViewStyle } from 'react-native';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Flex } from '../../core';
import type { SkeletonProps } from '../interfaces';

/**
 * @platform native-ready
 *
 * Pulse via `Animated` em opacity (0.4 ↔ 1.0). Sem gradient shimmer (paridade visual
 * aceitável no MVP — gradient cross-platform exigiria `expo-linear-gradient`).
 */
function SkeletonLine({
  width,
  height,
  borderRadius,
  style,
  pulse,
}: Omit<SkeletonProps, 'lines' | 'label'> & { pulse: Animated.Value }) {
  const theme = useTheme();

  const lineStyle: ViewStyle = {
    width: (typeof width === 'number' ? width : (width ?? '100%')) as ViewStyle['width'],
    height: (typeof height === 'number' ? height : (height ?? 16)) as ViewStyle['height'],
    borderRadius: borderRadius ?? theme.radii.nano,
    backgroundColor: theme.colors.background.subtle,
  };

  return (
    <Animated.View style={[lineStyle, { opacity: pulse }, style as ViewStyle]} />
  );
}

/**
 * @platform native
 *
 * `Skeleton` em React Native: pulsação `opacity` via `Animated.loop` em vez
 * do shimmer linear do web (RN não tem `background-image: linear-gradient`).
 * `accessibilityRole='progressbar'` + `accessibilityLabel`; passe
 * `label=false` para `accessibilityElementsHidden`.
 *
 * @see {@link SkeletonProps}
 */
export function Skeleton({
  lines,
  width,
  height,
  borderRadius,
  label = 'Carregando',
  style,
  ...props
}: SkeletonProps) {
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') return;
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.4,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  const a11yProps =
    label === false
      ? { accessibilityElementsHidden: true, importantForAccessibility: 'no-hide-descendants' as const }
      : { accessibilityRole: 'progressbar' as const, accessibilityLabel: label };

  if (lines && lines > 1) {
    return (
      <Flex
        flexDirection="column"
        gap="tiny"
        style={style}
        {...a11yProps}
        {...props}
      >
        {Array.from({ length: lines }, (_, i) => (
          <SkeletonLine
            key={i}
            width={i === lines - 1 ? '60%' : width}
            height={height}
            borderRadius={borderRadius}
            pulse={pulse}
          />
        ))}
      </Flex>
    );
  }

  return (
    <Flex style={style} {...a11yProps} {...props}>
      <SkeletonLine
        width={width}
        height={height}
        borderRadius={borderRadius}
        pulse={pulse}
      />
    </Flex>
  );
}

Skeleton.displayName = 'Skeleton';
