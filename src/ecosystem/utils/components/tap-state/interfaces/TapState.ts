import type { Token } from '../../../..';
import type { ArborTheme } from '../../../../../foundations';

type TapStateVariant = 'default' | 'highlight';

export type TapStateProps = {
  testID?: string;
  variant: TapStateVariant;
  pressed?: boolean;
  borderRadius?: Token<ArborTheme['radii']>;
  borderBottomLeftRadius?: Token<ArborTheme['radii']>;
  borderBottomRightRadius?: Token<ArborTheme['radii']>;
};

export type TapStateRef = {
  setPressed: (pressed: boolean) => void;
};
