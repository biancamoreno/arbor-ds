import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Flex } from '../../core';
import { Icon } from '../../core';
import { SIZE_MAP } from '../internal/sizes';
import type { SpinnerProps } from '../interfaces';

/**
 * @platform native
 *
 * `Spinner` em React Native: rotação contínua via `Animated.loop`
 * interpolando 0..1 → 0deg..360deg (sem keyframes CSS — paridade visual com
 * o web). `accessibilityRole='progressbar'` + `accessibilityLabel` para
 * leitores de tela. Em ambiente de teste a animação é resolvida
 * instantaneamente.
 *
 * @see {@link SpinnerProps}
 */
export function Spinner({ size = 'md', color, label = 'Carregando', style, ...props }: SpinnerProps) {
  const theme = useTheme();
  const px = SIZE_MAP[size];
  const strokeColor = color ?? theme.colors.brand.base;
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') return;
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
  }, [rotation]);

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
