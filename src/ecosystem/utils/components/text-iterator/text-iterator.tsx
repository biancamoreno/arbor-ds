import React from 'react';
import { type TextProps, Text } from '../../../../components';

export type TextIteratorProps<T> = {
  variant?: T;
  elements: TextProps<string>[];
};

export function TextIterator<T>({ elements = [], ...props }: TextIteratorProps<T>) {
  return (
    <>
      {elements.map((element, index) => {
        const rendered = (Text as unknown as Function)({
          ...element,
          as: 'span',
          variant: props.variant as string,
        } as TextProps<string>);

        const el = rendered && typeof rendered === 'object' && 'p' in rendered ? (rendered as any).p : rendered;

        if (React.isValidElement(el)) {
          return React.cloneElement(el, { key: index });
        }

        return <span key={index}>{String(el ?? '')}</span>;
      })}
    </>
  );
}
