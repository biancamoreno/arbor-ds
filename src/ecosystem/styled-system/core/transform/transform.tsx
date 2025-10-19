import { createStyledComponent } from '../styled';
import { getDefaultTag } from '../tags';
import { type ArborTransformProps } from './props';

const defaultTag = getDefaultTag() as string;

const StyledComponent = createStyledComponent(defaultTag);

export function ArborTransform<T>({ as, innerRef, ...props }: ArborTransformProps<T>) {

  return <StyledComponent {...props} ref={innerRef} as={as} />;
}

