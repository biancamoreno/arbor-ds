import { memo } from 'react';
import { ArborTransform, type ArborTransformProps } from '../../../../ecosystem';

function FlexComponent<T>(props: ArborTransformProps<T>) {
  const { flexDir, flexDirection = 'row' } = props;

  return <ArborTransform display="flex" {...props} flexDirection={flexDir !== undefined ? flexDir : flexDirection} />;
}

export const Flex = memo(FlexComponent) as typeof FlexComponent;
