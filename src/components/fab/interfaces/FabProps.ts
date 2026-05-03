import type { IconName } from '../../core/icon';

/**
 * @platform shared
 * Web posiciona via `position: fixed`; `fab.native.tsx` usa `position: absolute`
 * dentro do safe-area + `Clickable.native` para o press feedback.
 */
export interface FloatingActionButtonProps {
  icon: IconName;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'surface';
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center' | 'none';
  offset?: { bottom?: number; right?: number; left?: number };
  disabled?: boolean;
  onPress: () => void;
  'aria-label'?: string;
  animateOnMount?: boolean;
}
