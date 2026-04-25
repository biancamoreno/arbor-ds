import { Children, isValidElement } from 'react';
import { Flex } from '../../core';
import type { ButtonGroupProps } from '../interfaces/ButtonGroupProps';
import { ButtonGroupContext, ButtonGroupItemContext } from './button-group-context';

export function ButtonGroup({
  children,
  orientation = 'horizontal',
  attached = false,
  spacing = '8px',
  isDisabled = false,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: ButtonGroupProps) {
  if (process.env.NODE_ENV !== 'production' && !ariaLabel && !ariaLabelledBy) {
    console.warn('[ButtonGroup] aria-label or aria-labelledby is required for accessibility.');
  }

  const validChildren = Children.toArray(children).filter(isValidElement);
  const totalItems = validChildren.length;

  return (
    <ButtonGroupContext.Provider value={{ attached, orientation, isDisabled }}>
      <Flex
        role="group"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        flexDirection={orientation === 'vertical' ? 'column' : 'row'}
        alignItems={orientation === 'vertical' ? 'stretch' : 'center'}
        gap={attached ? undefined : spacing}
      >
        {validChildren.map((child, index) => (
          <ButtonGroupItemContext.Provider key={index} value={{ index, totalItems }}>
            {child}
          </ButtonGroupItemContext.Provider>
        ))}
      </Flex>
    </ButtonGroupContext.Provider>
  );
}

ButtonGroup.displayName = 'ButtonGroup';
