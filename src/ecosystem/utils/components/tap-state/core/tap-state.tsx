import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Box } from '../../../../../components';
import type { TapStateProps } from '../interfaces';
import { backgroundColorVariants } from './variants';

export const TapState = forwardRef(({ variant = 'default', ...props }: TapStateProps, ref) => {
  const [pressed, setPressed] = useState(props.pressed);

  useImperativeHandle(ref, () => ({
    setPressed,
  }));

  useEffect(() => {
    setPressed(props.pressed);
  }, [props.pressed]);

  return (
    <Box
      opacity={pressed ? '1' : '0'}
      position={'absolute'}
      left={0}
      top={0}
      bottom={0}
      right={0}
      borderRadius={props.borderRadius}
      borderBottomLeftRadius={props.borderBottomLeftRadius}
      borderBottomRightRadius={props.borderBottomRightRadius}
        data-testid={props.testID}
        zIndex={'level1'}
        _active={{
          opacity: 1,
          ...backgroundColorVariants(variant),
        }}
      {...backgroundColorVariants(variant)}
    ></Box>
  );
});
