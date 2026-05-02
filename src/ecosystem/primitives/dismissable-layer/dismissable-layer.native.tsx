import React, { useEffect } from 'react';
import { BackHandler, View } from 'react-native';

type DismissableLayerProps = {
  /** Conteúdo do layer (tipicamente o painel do overlay). */
  children: React.ReactNode;
  /** Disparado pelo botão de back do Android (se `disableEscapeKey` é `false`). */
  onDismiss?: () => void;
  /**
   * Aceito pela tipagem cross-platform mas sem efeito em native — RN não tem
   * conceito de "click fora" (toques fora do layer são naturalmente
   * absorvidos pelo `<Modal>` do `Portal`).
   */
  disableOutsideClick?: boolean;
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
 */
export function DismissableLayer({
  children,
  onDismiss,
  disableEscapeKey = false,
}: DismissableLayerProps): React.ReactElement {
  useEffect(() => {
    if (disableEscapeKey) return;

    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onDismiss?.();
      return true;
    });

    return () => sub.remove();
  }, [disableEscapeKey, onDismiss]);

  return <View>{children}</View>;
}
