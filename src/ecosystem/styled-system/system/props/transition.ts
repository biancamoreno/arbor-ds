import type * as CSS from 'csstype';
import { system } from 'styled-system';
import { type ResponsiveValue } from '../types';

export const transition = system({
  transition: true,
  transitionDelay: true,
  animation: true,
  transitionDuration: true,
  transitionProperty: true,
});

export interface TransitionProps {
  /**
   * The CSS `transition` property
   */
  transition?: ResponsiveValue<CSS.Property.Transition>;
  /**
   * The CSS `transition-property` property
   */
  transitionProperty?: ResponsiveValue<CSS.Property.TransitionProperty>;
  /**
   * The CSS `transition-duration` property
   */
  transitionDuration?: ResponsiveValue<string>;
  /**
   * The CSS `transition-delay` property
   */
  transitionDelay?: ResponsiveValue<CSS.Property.TransitionDelay>;
  /**
   * The CSS `animation` property
   */
  animation?: ResponsiveValue<CSS.Property.Animation>;
}
