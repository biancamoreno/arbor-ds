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

/**
 * @platform shared
 *
 * Monta `children` fora da hierarquia DOM atual (default: `document.body`)
 * via `ReactDOM.createPortal`. Usado pelos overlays do DS (Dialog, Drawer,
 * Popover, Menu, Tooltip, Toaster, Select.Content) para escapar de
 * `overflow: hidden`/`z-index` de containers pai. Em web a prop `mode` é
 * no-op (`createPortal` é o mesmo nos dois modos); em native muda o
 * `pointerEvents` do host. Use `container` para forçar montagem em outro
 * elemento (ex.: shadow root, iframe content document).
 *
 * @see {@link PortalMode}
 */
export function Portal({ children, container }: PortalProps): React.ReactElement | null {
  const target = container ?? (typeof document !== 'undefined' ? document.body : null);
  if (!target) return null;
  return ReactDOM.createPortal(children, target) as React.ReactElement;
}
