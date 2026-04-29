import React from 'react';
import ReactDOM from 'react-dom';

export type PortalMode = 'modal' | 'overlay';

type PortalProps = {
  children: React.ReactNode;
  container?: Element;
  /**
   * Controla o comportamento do host de portal em plataformas com semântica de overlay
   * (atualmente apenas native). Em web é no-op — `createPortal` é o mesmo nos dois modos.
   *
   * - `'modal'` (default): host bloqueia interação com a UI subjacente. Use em Dialog, Drawer, Menu.
   * - `'overlay'`: host deixa toques passarem para a UI subjacente em áreas transparentes.
   *   Use em Toast, Tooltip, Popover.
   */
  mode?: PortalMode;
};

export function Portal({ children, container }: PortalProps): React.ReactElement | null {
  const target = container ?? (typeof document !== 'undefined' ? document.body : null);
  if (!target) return null;
  return ReactDOM.createPortal(children, target) as React.ReactElement;
}
