import { type ReactElement, type ReactNode, Children, cloneElement, isValidElement } from 'react';

type CloneableElementProps = {
  children?: ReactNode;
} & Record<string, unknown>;

export function cloneElements<T extends object>(
  children: ReactNode,
  props: T,
  callback: (element: ReactElement<CloneableElementProps>) => ReactNode,
): ReactNode {
  return Children.map(children, child => {
    if (!isValidElement<CloneableElementProps>(child)) {
      return child;
    }

    let nextChild = child as ReactElement<CloneableElementProps>;

    if (nextChild.props.children) {
      nextChild = cloneElement(nextChild, {
        ...props,
        ...nextChild.props,
        children: cloneElements(nextChild.props.children, props, callback),
      });
    }

    return callback(nextChild);
  });
}
