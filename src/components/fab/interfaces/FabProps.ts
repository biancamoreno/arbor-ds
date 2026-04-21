import type { IconName } from '../../core/icon/interfaces/IconName';

export interface FloatingActionButtonProps {
  icon: IconName;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'surface';
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'none';
  offset?: { bottom?: number; right?: number; left?: number };
  disabled?: boolean;
  onPress: () => void;
  'aria-label'?: string;
  animateOnMount?: boolean;
}
