import React, { useEffect, useRef } from 'react';

type DismissableLayerProps = {
  children: React.ReactNode;
  onDismiss?: () => void;
  disableOutsideClick?: boolean;
  disableEscapeKey?: boolean;
  /**
   * Quando definido, cliques dentro do elemento referenciado não disparam `onDismiss`.
   * Use quando o controle que abre o overlay (trigger) vive fora do layer e
   * "abrir/fechar pelo trigger" deve ser tratado pelo próprio trigger, sem
   * o `pointerdown` no trigger fechar o layer e o `click` reabrir em seguida.
   */
  excludeRef?: React.RefObject<HTMLElement | null>;
};

export function DismissableLayer({
  children,
  onDismiss,
  disableOutsideClick = false,
  disableEscapeKey = false,
  excludeRef,
}: DismissableLayerProps): React.ReactElement {
  const layerRef = useRef<HTMLDivElement>(null);
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    if (disableEscapeKey) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onDismissRef.current?.();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [disableEscapeKey]);

  useEffect(() => {
    if (disableOutsideClick) return;

    const handlePointerDown = (event: PointerEvent) => {
      const layer = layerRef.current;
      if (!layer || layer.contains(event.target as Node)) return;
      const exclude = excludeRef?.current;
      if (exclude && exclude.contains(event.target as Node)) return;
      onDismissRef.current?.();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [disableOutsideClick, excludeRef]);

  return <div ref={layerRef}>{children}</div>;
}
