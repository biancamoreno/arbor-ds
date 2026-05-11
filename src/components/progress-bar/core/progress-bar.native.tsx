import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, type LayoutChangeEvent, type ViewStyle } from 'react-native';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { usePrefersReducedMotion } from '../../../ecosystem/styled-system/system/hooks';
import { Box } from '../../core';
import type { ProgressBarProps } from '../interfaces';

type ProgressBarSlots = 'root' | 'fill' | 'indeterminate';

/**
 * @platform native
 *
 * `ProgressBar` em React Native — paridade com web. `indeterminate` mede a
 * largura da track via `onLayout` e anima `translateX` em pixels via
 * `Animated.loop` (RN não aceita outputRange em `%`). Duração configurável
 * via `theme.components.progressBar.indeterminate.duration`. Respeita
 * `usePrefersReducedMotion()`: quando true, congela a faixa no centro e
 * preserva `accessibilityState.busy` para leitores de tela.
 *
 * @see {@link ProgressBarProps}
 */
export function ProgressBar({
  progress,
  indeterminate = false,
  label,
  size = 'medium',
  tone = 'brand',
  className,
  style,
}: ProgressBarProps) {
  const theme = useTheme();
  const slots = useSlotRecipe<ProgressBarSlots>('progressBar', { size, tone });
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const reducedMotion = usePrefersReducedMotion();
  const translate = useRef(new Animated.Value(0)).current;
  const [trackWidth, setTrackWidth] = useState(0);

  const durationStr = theme.components.progressBar.indeterminate.duration;
  const durationMs = Number(String(durationStr).replace(/ms$/, '')) || 2100;

  const indeterminateStyles = (slots.indeterminate ?? {}) as Record<string, unknown>;
  const indeterminateWidthStr = (indeterminateStyles.width as string | undefined) ?? '35%';
  const fillFraction = parseFloat(indeterminateWidthStr) / 100 || 0.35;
  const fillPx = trackWidth * fillFraction;

  useEffect(() => {
    if (!indeterminate) return;
    if (process.env.NODE_ENV === 'test') return;
    if (trackWidth === 0) return;
    if (reducedMotion) {
      translate.setValue(0.5);
      return;
    }
    const animation = Animated.loop(
      Animated.timing(translate, {
        toValue: 1,
        duration: durationMs,
        easing: Easing.bezier(0.65, 0.815, 0.735, 0.395),
        useNativeDriver: true,
      }),
    );
    animation.start();
    return () => animation.stop();
  }, [indeterminate, reducedMotion, trackWidth, durationMs, translate]);

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    if (width !== trackWidth) setTrackWidth(width);
  };

  return (
    <Box
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={
        indeterminate
          ? undefined
          : { min: 0, max: 100, now: clampedProgress }
      }
      accessibilityState={indeterminate ? { busy: true } : undefined}
      className={className}
      style={style}
      onLayout={indeterminate ? handleLayout : undefined}
      {...slots.root}
    >
      {indeterminate ? (
        trackWidth > 0 && (
          <Animated.View
            style={[
              slots.indeterminate as ViewStyle,
              {
                width: fillPx,
                transform: [{
                  translateX: translate.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-fillPx, trackWidth],
                  }),
                }],
              },
            ]}
          />
        )
      ) : (
        <Box {...slots.fill} style={{ width: `${clampedProgress}%` }} />
      )}
    </Box>
  );
}

ProgressBar.displayName = 'ProgressBar';
