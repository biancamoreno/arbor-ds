import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { getToneColor } from '../internal/colors';
import type { ProgressCircleProps } from '../interfaces';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * @platform native
 *
 * `ProgressCircle` em React Native renderizado via `react-native-svg`.
 * Indeterminado: rotaciona o container `Animated.View` com `useNativeDriver`.
 * Determinístico: aplica `strokeDashoffset` no `<Circle>`, com rotação
 * estática `-90deg` no container para alinhar o início do arco no topo. Em
 * ambiente de teste a animação é desligada.
 *
 * @see {@link ProgressCircleProps}
 */
export function ProgressCircle({
  progress,
  indeterminate = false,
  size = 48,
  strokeWidth = 4,
  tone = 'brand',
  label,
  style,
  testID,
}: ProgressCircleProps) {
  const theme = useTheme();
  const clamped = Math.min(100, Math.max(0, progress));

  const r = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = indeterminate
    ? circumference * 0.75
    : circumference * (1 - clamped / 100);

  const traceColor = getToneColor(tone, theme);

  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') return;
    if (!indeterminate) return;
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [indeterminate, rotation]);

  const transform = indeterminate
    ? [
        {
          rotate: rotation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
          }),
        },
      ]
    : [{ rotate: '-90deg' }];

  return (
    <Animated.View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={
        indeterminate ? undefined : { min: 0, max: 100, now: clamped }
      }
      accessibilityState={{ busy: indeterminate || undefined }}
      testID={testID}
      style={[{ width: size, height: size, transform }, style as object]}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={theme.colors.background.subtle}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={traceColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={offset}
          fill="none"
        />
      </Svg>
    </Animated.View>
  );
}

ProgressCircle.displayName = 'ProgressCircle';
