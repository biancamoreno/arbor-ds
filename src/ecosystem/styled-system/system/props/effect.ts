import type * as CSS from 'csstype';
import { type ResponsiveValue } from '../types';

export interface EffectProps {
  /**
   * The `box-shadow` property
   */
  boxShadow?: ResponsiveValue<CSS.Property.BoxShadow | number>;
  /**
   * The `box-shadow` property
   */
  shadow?: ResponsiveValue<CSS.Property.BoxShadow | number>;
  /**
   * The `mix-blend-mode` property
   */
  mixBlendMode?: ResponsiveValue<CSS.Property.MixBlendMode>;
  /**
   * The `blend-mode` property
   */
  blendMode?: ResponsiveValue<CSS.Property.MixBlendMode>;
  /**
   * The CSS `background-blend-mode` property
   */
  backgroundBlendMode?: ResponsiveValue<CSS.Property.BackgroundBlendMode>;
  /**
   * The CSS `background-blend-mode` property
   */
  bgBlendMode?: ResponsiveValue<CSS.Property.BackgroundBlendMode>;
  /**
   * The CSS `opacity` property
   */
  opacity?: ResponsiveValue<CSS.Property.Opacity>;
}
