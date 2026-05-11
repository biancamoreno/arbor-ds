import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { usePrefersReducedMotion } from '../../../ecosystem/styled-system/system/hooks';
import { getFeedbackToneColor } from '../../../foundations';
import type { ProgressCircleProps } from '../interfaces';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

/**
 * @platform native
 *
 * `ProgressCircle` em React Native renderizado via `react-native-svg`.
 * Indeterminado: rotaciona o container `Animated.View` com `useNativeDriver`
 * (duração via `theme.components.progressCircle.indeterminate.duration`).
 * Determinístico: aplica `strokeDashoffset` no `<Circle>`, com rotação
 * estática `-90deg` no container para alinhar o início do arco no topo.
 *
 * Reduced-motion (TD-041): quando `usePrefersReducedMotion()` retorna
 * `true`, congela o arco em offset estável (sem rotação) preservando
 * `accessibilityState.busy` para leitores de tela. Em ambiente de teste
 * a animação também é desligada.
 *
 * @see {@link ProgressCircleProps}
 */
export function ProgressCircle({
  progress,
  indeterminate = false,
  size = 'medium',
  strokeWidth,
  tone = 'brand',
  label,
  style,
  testID,
}: ProgressCircleProps) {
  const theme = useTheme();
  const tokens = theme.components.progressCircle;
  const diameter = tokens.size[size];
  const stroke = strokeWidth ?? tokens.strokeWidth[size];
  const clamped = Math.min(100, Math.max(0, progress));
  const reducedMotion = usePrefersReducedMotion();

  const r = (diameter - stroke * 2) / 2;
  const circumference = 2 * Math.PI * r;
  const offset = indeterminate
    ? circumference * tokens.indeterminate.offsetRatio
    : circumference * (1 - clamped / 100);

  const traceColor = getFeedbackToneColor(theme, tone, 'base');
  const trackColor = theme.colors.background.subtle;
  const durationMs = Number(String(tokens.indeterminate.duration).replace(/ms$/, '')) || 1200;

  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') return;
    if (!indeterminate) return;
    if (reducedMotion) {
      rotation.setValue(0);
      return;
    }
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: durationMs,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [indeterminate, reducedMotion, durationMs, rotation]);

  const transform = indeterminate && !reducedMotion
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
      style={[{ width: diameter, height: diameter, transform }, style as object]}
    >
      <Svg width={diameter} height={diameter} viewBox={`0 0 ${diameter} ${diameter}`}>
        <Circle
          cx={diameter / 2}
          cy={diameter / 2}
          r={r}
          stroke={trackColor}
          strokeWidth={stroke}
          fill="none"
        />
        <AnimatedCircle
          cx={diameter / 2}
          cy={diameter / 2}
          r={r}
          stroke={traceColor}
          strokeWidth={stroke}
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
