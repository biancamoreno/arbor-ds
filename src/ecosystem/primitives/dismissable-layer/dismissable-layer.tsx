import React, { useEffect, useRef } from 'react';

type DismissableLayerProps = {
  children: React.ReactNode;
  onDismiss?: () => void;
  disableOutsideClick?: boolean;
  disableEscapeKey?: boolean;
};

export function DismissableLayer({
  children,
  onDismiss,
  disableOutsideClick = false,
  disableEscapeKey = false,
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
      if (layer && !layer.contains(event.target as Node)) {
        onDismissRef.current?.();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [disableOutsideClick]);

  return <div ref={layerRef}>{children}</div>;
}
