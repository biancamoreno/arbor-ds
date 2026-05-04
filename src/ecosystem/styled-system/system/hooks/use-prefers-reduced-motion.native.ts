import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * @platform native
 *
 * Espelha a API do hook web (`usePrefersReducedMotion`) lendo o estado
 * de "reduzir movimento" do sistema via `AccessibilityInfo` e ouvindo
 * mudanças em runtime através de `reduceMotionChanged`.
 *
 * Componentes native consumidores devem ramificar comportamento quando
 * `true`: pausar `Animated.loop`, suprimir transições, snap em vez de
 * tween. WCAG 2.3.3 (Animation from Interactions).
 *
 * @returns `true` se o usuário ativou "Reduzir movimento" no sistema.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (mounted) setReduced(value);
    });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (value: boolean) => {
        if (mounted) setReduced(value);
      },
    );

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reduced;
}
