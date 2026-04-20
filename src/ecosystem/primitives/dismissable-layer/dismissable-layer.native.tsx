import React, { useEffect } from 'react';
import { BackHandler, View } from 'react-native';

type DismissableLayerProps = {
  children: React.ReactNode;
  onDismiss?: () => void;
  disableOutsideClick?: boolean;
  disableEscapeKey?: boolean;
};

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
