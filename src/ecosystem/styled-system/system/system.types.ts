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

export interface StyleProps
  extends BackgroundProps,
    ColorProps,
    FlexboxProps,
    GridProps,
    GridItemProps,
    SpaceProps,
    TypographyProps,
    BorderProps,
    PositionProps,
    LayoutProps,
    EffectProps,
    TransitionProps,
    InteractivityProps {
  _hover?: StyleProps;
  _active?: StyleProps;
  _focus?: StyleProps;
  _focusWithin?: StyleProps;
  _focusVisible?: StyleProps;
  _focusVisibleWithin?: StyleProps;
  _disabled?: StyleProps;
  _readOnly?: StyleProps;
  _before?: StyleProps;
  _after?: StyleProps;
  _empty?: StyleProps;
  _autofill?: StyleProps;
  _even?: StyleProps;
  _odd?: StyleProps;
  _first?: StyleProps;
  _last?: StyleProps;
  _notFirst?: StyleProps;
  _notLast?: StyleProps;
  _visited?: StyleProps;
  _placeholder?: StyleProps;
}
