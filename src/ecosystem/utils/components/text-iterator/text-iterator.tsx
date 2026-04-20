import { ArborTransform } from '../../../styled-system/core/transform/transform';

type TextElementData = {
  as?: string;
  children?: string;
  [key: string]: unknown;
};

export type TextIteratorProps<T> = {
  variant?: T;
  elements: TextElementData[];
};

export function TextIterator<T>({ elements = [], variant }: TextIteratorProps<T>) {
  return (
    <>
      {elements.map((element, index) => (
        <ArborTransform
          key={index}
          as={element.as ?? 'span'}
          variant={variant as string}
          {...element}
        />
      ))}
    </>
  );
}
