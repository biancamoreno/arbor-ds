import React, { useEffect, useRef } from 'react';

type DismissableLayerProps = {
  /** Conteúdo do layer (tipicamente o painel do overlay). */
  children: React.ReactNode;
  /**
   * Disparado em `Escape` (se `disableEscapeKey` é `false`) ou em `pointerdown`
   * fora do layer e fora do `excludeRef` (se `disableOutsideClick` é `false`).
   */
  onDismiss?: () => void;
  /**
   * Desabilita o dismiss por click fora.
   * @default false
   */
  disableOutsideClick?: boolean;
  /**
   * Desabilita o dismiss por tecla Escape.
   * @default false
   */
  disableEscapeKey?: boolean;
  /**
   * Quando definido, cliques dentro do elemento referenciado não disparam
   * `onDismiss`. Use quando o controle que abre o overlay (trigger) vive fora
   * do layer e "abrir/fechar pelo trigger" deve ser tratado pelo próprio
   * trigger, sem o `pointerdown` no trigger fechar o layer e o `click`
   * reabrir em seguida.
   */
  excludeRef?: React.RefObject<HTMLElement | null>;
};

/**
 * @platform web
 *
 * Layer que captura interações de dispensa (Escape no document e
 * `pointerdown` fora do layer) e dispara `onDismiss`. Wrapper interno usado
 * por Dialog/Drawer/Popover/Menu/Tooltip/Select.Content para padronizar o
 * comportamento de fechamento. Em native há equivalente
 * `dismissable-layer.native.tsx` que escuta o botão de back do Android.
 */
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
