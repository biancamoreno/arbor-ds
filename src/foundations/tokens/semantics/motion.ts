import { motionTokens } from '../primitives/motion';

export const motion = {
  duration: { ...motionTokens.duration },
  easing: { ...motionTokens.easing },
};

export type Motion = typeof motion;
export type MotionDuration = keyof Motion['duration'];
export type MotionEasing = keyof Motion['easing'];
