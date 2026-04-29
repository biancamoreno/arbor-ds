import { AVAILABLE_STYLE_PROPERTIES } from '../core/transform/new-transform/available-style-properties';
import { pseudoPropNames } from './pseudo-props/pseudos';
import { systemBlockedPropsByPlatform } from './system.blocked';

const propNames = new Set<string>([...AVAILABLE_STYLE_PROPERTIES, ...pseudoPropNames]);

export const systemProps = Object.assign((props: Record<string, unknown>) => props, {
  propNames: Array.from(propNames),
});

export function systemBlockForwardProp(prop: string, platform: 'web' | 'native' = 'web') {
  if (systemBlockedPropsByPlatform[platform].includes(prop)) {
    return false;
  }

  return !propNames.has(prop);
}
