import { AVAILABLE_STYLE_PROPERTIES } from '../core/transform/new-transform/available-style-properties';
import { pseudoPropNames } from './pseudo-props/pseudos';
import { systemBlockedProps } from './system.blocked';

const propNames = new Set<string>([...AVAILABLE_STYLE_PROPERTIES, ...pseudoPropNames]);

export const systemProps = Object.assign((props: Record<string, unknown>) => props, {
  propNames: Array.from(propNames),
});

export function systemBlockForwardProp(prop: string) {
  if (systemBlockedProps.includes(prop)) {
    return false;
  }

  return !propNames.has(prop);
}
