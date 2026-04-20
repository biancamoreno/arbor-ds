import React from 'react';
import ReactDOM from 'react-dom';

type PortalProps = {
  children: React.ReactNode;
  container?: Element;
};

export function Portal({ children, container }: PortalProps): React.ReactElement | null {
  const target = container ?? (typeof document !== 'undefined' ? document.body : null);
  if (!target) return null;
  return ReactDOM.createPortal(children, target) as React.ReactElement;
}
