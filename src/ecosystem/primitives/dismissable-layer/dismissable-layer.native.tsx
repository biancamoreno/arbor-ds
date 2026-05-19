import React, { useEffect, useRef } from 'react';
import { BackHandler, View } from 'react-native';

type NativeBackEvent = { defaultPrevented: boolean; preventDefault: () => void };

type DismissableLayerProps = {
  /** Conteúdo do layer (tipicamente o painel do overlay). */
  children: React.ReactNode;
  /** Disparado pelo botão de back do Android (se `disableEscapeKey` é `false`). */
  onDismiss?: () => void;
  /**
   * Handler rico para o botão de back do Android, com acesso a um evento
   * sintético (`preventDefault()` impede o dismiss). Paridade conceitual com
   * `onEscapeKeyDown` da web.
   */
  onEscapeKeyDown?: (event: NativeBackEvent) => void;
  /**
   * Aceito pela tipagem cross-platform mas sem efeito em native — RN não tem
   * conceito de "click fora" (toques fora do layer são naturalmente
   * absorvidos pelo `<Modal>` do `Portal`).
   */
  disableOutsideClick?: boolean;
  /**
   * No-op em native (sem equivalente de pointer outside fora do Modal).
   * Aceito por paridade de assinatura.
   */
  onInteractOutside?: (event: unknown) => void;
  /**
   * Desabilita o dismiss pelo botão de back do Android.
   * @default false
   */
  disableEscapeKey?: boolean;
};

/**
 * @platform native
 *
 * Equivalente do `DismissableLayer` web em React Native — escuta o botão de
 * back físico do Android via `BackHandler` e dispara `onDismiss`. iOS não
 * tem botão de back nativo (gesto/voltar fica por conta do consumidor).
 * Toques fora do conteúdo já são tratados pelo `<Modal>` do `Portal`,
 * tornando `disableOutsideClick` no-op aqui.
 *
 * `onEscapeKeyDown` é chamado com um evento sintético; `preventDefault()`
 * impede o dismiss (paridade conceitual com a web).
 */
export function DismissableLayer({
  children,
  onDismiss,
  onEscapeKeyDown,
  disableEscapeKey = false,
}: DismissableLayerProps): React.ReactElement {
  const onDismissRef = useRef(onDismiss);
  const onEscapeKeyDownRef = useRef(onEscapeKeyDown);
  onDismissRef.current = onDismiss;
  onEscapeKeyDownRef.current = onEscapeKeyDown;

  useEffect(() => {
    if (disableEscapeKey) return;

    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      const event: NativeBackEvent = {
        defaultPrevented: false,
        preventDefault() {
          this.defaultPrevented = true;
        },
      };
      onEscapeKeyDownRef.current?.(event);
      if (event.defaultPrevented) return true;
      onDismissRef.current?.();
      return true;
    });

    return () => sub.remove();
  }, [disableEscapeKey]);

  return <View>{children}</View>;
}
