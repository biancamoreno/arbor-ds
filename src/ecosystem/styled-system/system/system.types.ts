import {
  type BackgroundProps,
  type BorderProps,
  type ColorProps,
  type EffectProps,
  type FlexboxProps,
  type InteractivityProps,
  type LayoutProps,
  type PositionProps,
  type SpaceProps,
  type TransitionProps,
  type TypographyProps,
  type GridProps,
  type GridItemProps,
} from './props';

export type StyleProps = BackgroundProps &
  ColorProps &
  FlexboxProps &
  GridProps &
  GridItemProps &
  SpaceProps &
  TypographyProps &
  BorderProps &
  PositionProps &
  LayoutProps &
  EffectProps &
  TransitionProps &
  InteractivityProps;
