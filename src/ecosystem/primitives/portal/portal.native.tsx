import React from 'react';
import { Modal, View } from 'react-native';

export type PortalMode = 'modal' | 'overlay';

type PortalProps = {
  children: React.ReactNode;
  /**
   * - `'modal'` (default): inner View tem `pointerEvents="auto"` — bloqueia toques na UI subjacente.
   *   Comportamento de Dialog/Drawer/Menu.
   * - `'overlay'`: inner View tem `pointerEvents="box-none"` — toques passam para a UI subjacente
   *   em áreas transparentes; filhos opacos seguem capturando. Comportamento de Toast/Tooltip/Popover.
   */
  mode?: PortalMode;
};

export function Portal({ children, mode = 'modal' }: PortalProps): React.ReactElement {
  return (
    <Modal transparent visible animationType="none" statusBarTranslucent onRequestClose={() => {}}>
      <View style={{ flex: 1 }} pointerEvents={mode === 'overlay' ? 'box-none' : 'auto'}>
        {children}
      </View>
    </Modal>
  );
}
