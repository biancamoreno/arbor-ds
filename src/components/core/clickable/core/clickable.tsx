import { forwardRef, useEffect, type Ref } from 'react';
import { Flex } from '../../flex';
import { type ClickableProps } from '../interfaces';

const NATIVELY_INTERACTIVE = new Set(['button', 'a']);

export const Clickable = forwardRef<HTMLElement, ClickableProps>(function Clickable(
  { as = 'button', onClick, ...props },
  ref,
) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    const tag = typeof as === 'string' ? as : undefined;
    if (tag && !NATIVELY_INTERACTIVE.has(tag) && !props.role) {
      console.warn(
        `[Clickable] as="${tag}" sem prop \`role\` definida. Adicione role="button" (ou semântico) para garantir acessibilidade.`,
      );
    }
  }, [as, props.role]);

  const legacyRef = props.innerRef as Ref<HTMLElement> | undefined;

  return (
    <Flex
      as={as}
      ref={ref ?? legacyRef}
      data-testid={props.testID}
      onClick={onClick}
      {...props}
      display={'flex'}
      cursor={'pointer'}
      border={'none'}
    >
      {props.children}
    </Flex>
  );
});

Clickable.displayName = 'Clickable';
