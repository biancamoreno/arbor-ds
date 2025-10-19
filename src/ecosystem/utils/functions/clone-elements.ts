import { type ReactNode, cloneElement, isValidElement, Children } from 'react';

export function cloneElements<T>(
  children: ReactNode,
  props: T,
  callback: (element: ReactNode) => ReactNode,
): ReactNode {
  return Children.map(children, child => {
    if (!isValidElement(child)) {
      return child;
    }

    if (child.props?.children) {
      child = cloneElement(child, {
        ...props,
        ...child.props,
        children: cloneElements(child.props.children, props, callback),
      });
    }

    return callback(child);
  });
}
