import React, { useEffect, useRef, useState } from 'react';

type PresenceState = 'mounted' | 'unmountSuspended' | 'unmounted';

type PresenceProps = {
  present: boolean;
  children: React.ReactElement<{ ref?: React.Ref<Element> }>;
};

export function Presence({ present, children }: PresenceProps): React.ReactElement | null {
  const [state, setState] = useState<PresenceState>(present ? 'mounted' : 'unmounted');
  const nodeRef = useRef<Element | null>(null);
  const prevPresentRef = useRef(present);

  useEffect(() => {
    const prevPresent = prevPresentRef.current;
    prevPresentRef.current = present;

    if (prevPresent === present) return;

    if (present) {
      setState('mounted');
      return;
    }

    const node = nodeRef.current;
    if (!node) {
      setState('unmounted');
      return;
    }

    const { animationName, animationDuration } = window.getComputedStyle(node);
    const hasAnimation =
      !!animationName &&
      animationName !== 'none' &&
      !!animationDuration &&
      animationDuration !== '0s';

    if (!hasAnimation) {
      setState('unmounted');
      return;
    }

    setState('unmountSuspended');
    const handleEnd = () => setState('unmounted');
    node.addEventListener('animationend', handleEnd, { once: true });
    return () => node.removeEventListener('animationend', handleEnd);
  }, [present]);

  if (state === 'unmounted') return null;

  return React.cloneElement(children, {
    ref: (node: Element | null) => {
      nodeRef.current = node;
      const childRef = children.props.ref;
      if (typeof childRef === 'function') {
        childRef(node);
      } else if (childRef && 'current' in childRef) {
        (childRef as React.MutableRefObject<Element | null>).current = node;
      }
    },
  });
}
