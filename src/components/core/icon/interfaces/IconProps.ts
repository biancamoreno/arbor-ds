import type { CSSProperties } from 'react';
import type { IconSizeToken } from '../../../../foundations';
import type { IconName } from '../internal';

/**
 * Tamanho do ícone. Aceita token semântico (`'xsmall'`–`'hero'`) ou número bruto (escape hatch).
 *
 * Tokens recomendados (RFC-0009):
 * - `xsmall` (12px): inline em texto pequeno.
 * - `small`  (16px): buttons sm, chips, tags.
 * - `medium` (20px) — default: buttons md, inputs, alerts.
 * - `large`  (24px): buttons lg, headers de section.
 * - `xlarge` (32px): hero icons.
 * - `hero`   (48px): empty states, onboarding.
 *
 * Usar `number` apenas quando nenhum token cabe (avatar custom, ajuste de pixel-fit).
 */
export type IconSize = IconSizeToken | number;

type IconBaseProps = {
  name: IconName;
  size?: IconSize;
  color?: string;
  strokeWidth?: number;
  style?: CSSProperties;
};

/**
 * Ícone decorativo (default). Não anunciado por screen readers.
 * `aria-label` é proibido — use `decorative={false}` se o ícone for semântico.
 */
type IconDecorativeProps = IconBaseProps & {
  decorative: true;
  'aria-label'?: never;
};

/**
 * Ícone semântico (carrega significado para screen readers).
 * `aria-label` é obrigatório.
 */
type IconSemanticProps = IconBaseProps & {
  decorative: false;
  'aria-label': string;
};

/**
 * Default (decorative omitido) — equivale a decorative=true.
 */
type IconDefaultProps = IconBaseProps & {
  decorative?: undefined;
  'aria-label'?: never;
};

/**
 * @platform shared
 * Discriminated union (RFC-0010): TypeScript força `aria-label` quando `decorative={false}`.
 *
 * ```tsx
 * <Icon name="Check" />                                        // ✅ decorativo (default)
 * <Icon name="Check" decorative />                             // ✅ explicitamente decorativo
 * <Icon name="Check" decorative={false} aria-label="Sucesso" />// ✅ semântico
 * <Icon name="Check" decorative={false} />                     // ❌ erro de tipo
 * ```
 */
export type IconProps = IconDecorativeProps | IconSemanticProps | IconDefaultProps;
export type { IconName };
