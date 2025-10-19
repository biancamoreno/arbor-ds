import {
  background,
  borders,
  color,
  compose,
  flexbox,
  grid,
  layout,
  position,
  shadow,
  size,
  space,
  typography,
} from 'styled-system';
import {
  systemBackground,
  customFlexbox,
  customTypography,
  interactivity,
  transition,
  customGrid,
  customGridItem,
  customSpace,
} from './props';
import { systemBlockedProps } from './system.blocked';

export const systemProps = compose(
  background,
  borders,
  color,
  flexbox,
  grid,
  layout,
  position,
  shadow,
  size,
  space,
  typography,
  transition,
  interactivity,
  customFlexbox,
  customTypography,
  systemBackground,
  customGrid,
  customGridItem,
  customSpace,
);

export function systemBlockForwardProp(prop: string) {
  if (systemBlockedProps.includes(prop)) {
    return false;
  }

  if (systemProps.propNames) {
    return !systemProps.propNames.includes(prop);
  }

  return true;
}
