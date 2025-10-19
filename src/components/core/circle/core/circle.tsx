import { Square } from '../../square';
import { type CircleProps } from '../interfaces';

export function Circle<T>(props: CircleProps<T>) {
  return <Square borderRadius="full" {...props} />;
}
