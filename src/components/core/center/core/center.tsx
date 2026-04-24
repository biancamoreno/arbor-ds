import { forwardRef, type Ref } from 'react';
import { ArborTransform } from '../../../../ecosystem';
import { type CenterProps } from '../interfaces';

export const Center = forwardRef<HTMLElement, CenterProps>(function Center(props, ref) {
  const legacyRef = props.innerRef as Ref<HTMLElement> | undefined;
  return (
    <ArborTransform
      {...props}
      innerRef={ref ?? legacyRef}
      alignItems="center"
      justifyContent="center"
      display="flex"
    />
  );
});

Center.displayName = 'Center';
