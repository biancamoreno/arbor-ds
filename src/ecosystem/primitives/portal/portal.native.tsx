import React from 'react';
import { Modal, View } from 'react-native';

type PortalProps = {
  children: React.ReactNode;
};

export function Portal({ children }: PortalProps): React.ReactElement {
  return (
    <Modal transparent visible animationType="none" statusBarTranslucent>
      <View style={{ flex: 1 }}>{children}</View>
    </Modal>
  );
}
