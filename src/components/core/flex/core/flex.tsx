import { forwardRef, memo, type Ref } from 'react';
import { ArborTransform } from '../../../../ecosystem';
import { type FlexProps } from '../interfaces';

const FlexComponent = forwardRef<HTMLElement, FlexProps>(function Flex(props, ref) {
  const { flexDir, flexDirection = 'row' } = props;
  const legacyRef = props.innerRef as Ref<HTMLElement> | undefined;
  const resolvedDirection = (flexDir !== undefined ? flexDir : flexDirection) as FlexProps['flexDirection'];
  return (
    <ArborTransform
      {...props}
      innerRef={ref ?? legacyRef}
      display="flex"
      flexDirection={resolvedDirection}
    />
  );
});

FlexComponent.displayName = 'Flex';
/**
 * @platform shared
 *
 * `Box` com `display: flex` aplicado por default e atalho `flexDir` para
 * `flexDirection`. Use sempre que precisar compor itens em linha ou coluna —
 * preferível a `<Box display="flex">` por intenção mais clara e por aceitar
 * todos os atalhos de flex.
 *
 * @see {@link FlexProps}
 */
export const Flex = memo(FlexComponent);
