import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { usePrefersReducedMotion } from '../../../ecosystem/styled-system/system/hooks';
import { Flex } from '../../core';
import { Icon } from '../../core';
import type { SpinnerProps } from '../interfaces';

/**
 * @platform native
 *
 * `Spinner` em React Native: rotação contínua via `Animated.loop`
 * interpolando 0..1 → 0deg..360deg (sem keyframes CSS — paridade visual com
 * o web). `accessibilityRole='progressbar'` + `accessibilityLabel` para
 * leitores de tela.
 *
 * Reduced-motion (TD-041): quando `AccessibilityInfo.isReduceMotionEnabled()`
 * retorna `true`, a rotação é suprimida (snap em 0deg). O anúncio para
 * leitores de tela permanece. Em ambiente de teste a animação é resolvida
 * instantaneamente.
 *
 * @see {@link SpinnerProps}
 */
export function Spinner({ size = 'medium', color, label = 'Carregando', style, ...props }: SpinnerProps) {
  const theme = useTheme();
  const px = theme.sizes.spinner[size];
  const strokeColor = color ?? theme.colors.brand.solid;
  const reducedMotion = usePrefersReducedMotion();
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') return;
    if (reducedMotion) {
      rotation.setValue(0);
      return;
    }
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 800,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [rotation, reducedMotion]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Flex
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      alignItems="center"
      justifyContent="center"
      style={{ width: px, height: px, ...style }}
      {...props}
    >
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <Icon name="LoaderCircle" size={px} color={strokeColor} />
      </Animated.View>
    </Flex>
  );
}

Spinner.displayName = 'Spinner';
