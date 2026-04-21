import type { CSSProperties } from 'react';
import type { IconName } from './IconName';

export interface IconProps {
  name: IconName;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  style?: CSSProperties;
  'aria-label'?: string;
  decorative?: boolean;
}
