import React, { useEffect, useRef } from 'react';

type DismissableLayerProps = {
  /** Conteúdo do layer (tipicamente o painel do overlay). */
  children: React.ReactNode;
  /**
   * Disparado em `Escape` (se `disableEscapeKey` é `false`) ou em `pointerdown`
   * fora do layer e fora do `excludeRef` (se `disableOutsideClick` é `false`).
   * Em ambos os casos, se `onEscapeKeyDown`/`onInteractOutside` forem
   * passados e chamarem `event.preventDefault()`, `onDismiss` NÃO é chamado.
   */
  onDismiss?: () => void;
  /**
   * Handler rico para a tecla Escape, com acesso ao evento. Permite ao
   * consumidor interceptar (`event.preventDefault()`) o dismiss — útil para
   * guarda de form com alterações não salvas.
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  /**
   * Handler rico para interação fora do layer (pointerdown fora), com acesso
   * ao evento. Permite ao consumidor interceptar (`event.preventDefault()`)
   * o dismiss.
   */
  onInteractOutside?: (event: PointerEvent) => void;
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
 *
 * `onEscapeKeyDown` e `onInteractOutside` permitem interceptação rica: o
 * consumidor recebe o evento nativo e pode chamar `event.preventDefault()`
 * para impedir o dismiss (ex.: guarda de alterações não salvas).
 */
export function DismissableLayer({
  children,
  onDismiss,
  onEscapeKeyDown,
  onInteractOutside,
  disableOutsideClick = false,
  disableEscapeKey = false,
  excludeRef,
}: DismissableLayerProps): React.ReactElement {
  const layerRef = useRef<HTMLDivElement>(null);
  const onDismissRef = useRef(onDismiss);
  const onEscapeKeyDownRef = useRef(onEscapeKeyDown);
  const onInteractOutsideRef = useRef(onInteractOutside);
  onDismissRef.current = onDismiss;
  onEscapeKeyDownRef.current = onEscapeKeyDown;
  onInteractOutsideRef.current = onInteractOutside;

  useEffect(() => {
    if (disableEscapeKey) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      onEscapeKeyDownRef.current?.(event);
      if (event.defaultPrevented) return;
      onDismissRef.current?.();
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
      onInteractOutsideRef.current?.(event);
      if (event.defaultPrevented) return;
      onDismissRef.current?.();
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [disableOutsideClick, excludeRef]);

  return <div ref={layerRef}>{children}</div>;
}
