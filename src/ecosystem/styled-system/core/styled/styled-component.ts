import { styled } from '../../adapters';
import { systemBlockForwardProp, systemProps, systemPseudoProps } from '../../system';

export function createStyledComponent(tag: string) {
  return styled[tag].withConfig({
    shouldForwardProp: systemBlockForwardProp,
  })(systemProps, systemPseudoProps);
}

export default createStyledComponent;
