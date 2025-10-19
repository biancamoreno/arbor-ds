import { ArborTransform } from '../../../../ecosystem';
import { type SpacerProps } from '../interfaces';

export function Spacer(props: SpacerProps) {
  return <ArborTransform flex={1} justifySelf="stretch" alignSelf="stretch" {...(props as Record<string, unknown>)} />;
}
