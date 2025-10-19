import React, { forwardRef, useRef } from 'react';
import { Flex } from '../../flex';
import { TapState, type TapStateRef } from '../../../../ecosystem';
import { type ClickableProps } from '../interfaces';

export const Clickable: React.ForwardRefExoticComponent<ClickableProps & React.RefAttributes<unknown>> = forwardRef(
  (
    { as = 'button' , tapState, onClick, ...props }: ClickableProps,
    ref,
  ) => {
    const buttonRef = useRef(null);
    const tapStateRef = useRef<TapStateRef>(null);

    function setRef(node: any) {
      if (!node) return;
      buttonRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }

    return (
      <Flex
        as={as}
        innerRef={setRef}
        data-testid={props.testID}
        display={'flex'}
        cursor={'pointer'}
        border={'none'}
        onClick={onClick}
        {...props}
      >
        {tapState && <TapState ref={tapStateRef} {...tapState} />}
        {props.children}
      </Flex>
    );
  },
);
