import { createStyledComponent } from '../styled';
import { getDefaultTag } from '../tags';
import { type ArborTransformProps } from './props';

const defaultTag = getDefaultTag() as string;
const StyledComponent = createStyledComponent(defaultTag);

export function ArborTransform<T extends object, U = unknown>({ as, innerRef, ...props }: ArborTransformProps<T, U>) {
  return <StyledComponent {...props} ref={innerRef} as={as} />;
}
