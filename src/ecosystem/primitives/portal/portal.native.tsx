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

/**
 * @platform native
 *
 * Equivalente do `Portal` web em React Native: monta `children` dentro de um
 * `<Modal transparent>` em tela cheia. RN não tem `createPortal` real, então
 * `<Modal>` é o único caminho para escapar da hierarquia da árvore atual e
 * sobrepor a tela. `mode` controla o `pointerEvents` do `<View>` interno —
 * `'modal'` (default) bloqueia toques na UI subjacente (Dialog/Drawer/Menu);
 * `'overlay'` deixa toques passarem em áreas transparentes (Toast/Tooltip/
 * Popover).
 *
 * @see {@link PortalMode}
 */
export function Portal({ children, mode = 'modal' }: PortalProps): React.ReactElement {
  return (
    <Modal transparent visible animationType="none" statusBarTranslucent onRequestClose={() => {}}>
      <View style={{ flex: 1 }} pointerEvents={mode === 'overlay' ? 'box-none' : 'auto'}>
        {children}
      </View>
    </Modal>
  );
}
