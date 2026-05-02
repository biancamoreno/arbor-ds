import { motionTokens } from '../tokens/primitives/motion';

type Duration = keyof typeof motionTokens.duration;
type Easing = keyof typeof motionTokens.easing;

export function transition(
  props: string | string[],
  duration: Duration = 'normal',
  easing: Easing = 'standard',
): string {
  const d = motionTokens.duration[duration];
  const e = motionTokens.easing[easing];
  const list = Array.isArray(props) ? props : [props];
  return list.map((p) => `${p} ${d} ${e}`).join(', ');
}
