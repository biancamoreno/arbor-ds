import type * as CSS from 'csstype';
import { type ResponsiveValue } from '../types';

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
