import type { CSSProperties } from 'react';
import type { IconSizeToken } from '../../../../foundations';
import type { IconName } from './IconName';

/**
 * Tamanho do ícone. Aceita token semântico (`'xs'`–`'hero'`) ou número bruto (escape hatch).
 *
 * Tokens recomendados (RFC-0009):
 * - `xs` (12px): inline em texto pequeno.
 * - `sm` (16px): buttons sm, chips, tags.
 * - `md` (20px) — default: buttons md, inputs, alerts.
 * - `lg` (24px): buttons lg, headers de section.
 * - `xl` (32px): hero icons.
 * - `hero` (48px): empty states, onboarding.
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
 * <Icon name="check" />                                        // ✅ decorativo (default)
 * <Icon name="check" decorative />                             // ✅ explicitamente decorativo
 * <Icon name="check" decorative={false} aria-label="Sucesso" />// ✅ semântico
 * <Icon name="check" decorative={false} />                     // ❌ erro de tipo
 * ```
 */
export type IconProps = IconDecorativeProps | IconSemanticProps | IconDefaultProps;
