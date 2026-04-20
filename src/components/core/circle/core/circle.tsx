import { Square } from '../../square';
import { type CircleProps } from '../interfaces';

export function Circle<T extends object>(props: CircleProps<T>) {
  return <Square borderRadius="full" {...props} />;
}
