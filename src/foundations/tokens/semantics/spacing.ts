import { spacing as primitiveSpacing } from '../primitives';

/**
 * Spacing semantic.
 *
 * Convive com dois vocabulários hoje:
 * - Vocabulário herdado (`nano`/`micro`/`tiny`/`huge`/`giant`) — em uso amplo na base
 *   de código atual.
 * - Vocabulário SP-1 (`xsmall`/`small`/`medium`/`large`/`xlarge`) — alinhado ao naming
 *   de size dos componentes (RFC-0031). `xsmall`/`xlarge` adicionados em RFC-0042
 *   PCV-5 para fechar a lacuna nas stories PCV.
 *
 * `xsmall` é alias funcional de `micro` (8); `xlarge` ocupa o slot 32 (entre `huge=28`
 * e `giant=40`). RFC dedicada futura pode unificar.
 */
export const spacing = {
  none: primitiveSpacing[0],
  nano: primitiveSpacing[4],
  micro: primitiveSpacing[8],
  xsmall: primitiveSpacing[8],
  tiny: primitiveSpacing[12],
  small: primitiveSpacing[16],
  medium: primitiveSpacing[20],
  large: primitiveSpacing[24],
  huge: primitiveSpacing[28],
  xlarge: primitiveSpacing[32],
  giant: primitiveSpacing[40],
};
