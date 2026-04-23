import { ArborTransform } from '../../../../ecosystem';
import { type SpacerProps } from '../interfaces';

export function Spacer(props: SpacerProps) {
  return <ArborTransform {...props} flex={1} justifySelf="stretch" alignSelf="stretch" />;
}

Spacer.displayName = 'Spacer';
