import { useEffect, useRef } from 'react';

interface UseAutoplayOptions {
  /** Liga/desliga o autoplay em definitivo. Quando `false`, o tick nunca dispara. */
  enabled: boolean;
  /** Intervalo em ms entre ticks. */
  interval: number;
  /**
   * `true` pausa temporariamente sem desligar. Cobre o OR de
   * `prefersReducedMotion`, hover, focus-within, interação manual,
   * `pageHidden`, e o toggle do `Carousel.PlayPause`.
   */
  paused: boolean;
  /** Callback disparado a cada tick. Tipicamente `() => goTo(activeIndex + 1)`. */
  onTick: () => void;
}

/**
 * Hook minimal de autoplay cross-platform. Encapsula a chamada de
 * `setInterval`/`clearInterval` com semântica "sempre que `paused`
 * muda, o timer é re-criado". Mantém `onTick` em ref para evitar
 * re-criação do interval a cada render do consumer.
 */
export function useAutoplay({ enabled, interval, paused, onTick }: UseAutoplayOptions): void {
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  useEffect(() => {
    if (!enabled || paused) return;
    if (interval <= 0) return;

    const id = setInterval(() => {
      onTickRef.current();
    }, interval);

    return () => clearInterval(id);
  }, [enabled, interval, paused]);
}
