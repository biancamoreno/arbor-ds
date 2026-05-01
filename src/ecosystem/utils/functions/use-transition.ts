import { useTheme } from '../../styled-system/adapters';
import type { MotionDuration, MotionEasing } from '../../../foundations/tokens/semantics/motion';

export function useTransition() {
  const theme = useTheme();
  return (
    props: string | string[],
    duration: MotionDuration = 'normal',
    easing: MotionEasing = 'standard',
  ): string => {
    const d = theme.motion.duration[duration];
    const e = theme.motion.easing[easing];
    const list = Array.isArray(props) ? props : [props];
    return list.map((p) => `${p} ${d} ${e}`).join(', ');
  };
}
