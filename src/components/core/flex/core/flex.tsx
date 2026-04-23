import { memo } from 'react';
import { ArborTransform, type ArborTransformProps } from '../../../../ecosystem';

function FlexComponent<T extends object>(props: ArborTransformProps<T>) {
  const { flexDir, flexDirection = 'row' } = props;

  return <ArborTransform {...props} display="flex" flexDirection={flexDir !== undefined ? flexDir : flexDirection} />;
}

FlexComponent.displayName = 'Flex';
export const Flex = memo(FlexComponent) as typeof FlexComponent;
