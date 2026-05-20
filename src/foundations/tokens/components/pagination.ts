/**
 * Tokens do componente Pagination.
 *
 * Todos os valores são aliases por string para outros tokens (semantic ou
 * primitive escala) — recipe consome via `$pagination.…` e override via
 * `createTheme({ tokens: { pagination: { … } } })` propaga para web e native.
 *
 * Eixos themables:
 * - `gap` entre itens da List.
 * - `button.borderRadius`/`borderWidth`/`fontWeight` — anatomia base do controle.
 * - `button.size.{xsmall…xlarge}` — `{ minSize, paddingInline, fontSize }` por tamanho.
 * - `button.colors.{idle|current|disabled}.{bg,border,text}` — 3 estados x 3 papéis.
 * - `button.colors.idle.bgHover` — hover discreto (só bg muda; alinhado ao direcional sutil).
 * - `ellipsis.{color,fontSize}` — separator não-interativo.
 *
 * Tamanho do ícone interno (Previous/Next/First/Last/Ellipsis) é decidido pelo
 * componente a partir do `size` (mapping `xsmall→xsmall`, `small/medium→small`,
 * `large/xlarge→medium`). Para customizar globalmente, override `iconSizes.small`/
 * `iconSizes.medium` no tema.
 */
export const pagination = {
  gap: 'micro',
  button: {
    borderRadius: 'small',
    borderWidth: 'hairline',
    fontWeight: 'medium',
    size: {
      xsmall: { minSize: 'control.small',  paddingInline: 'tiny',  fontSize: 'xsmall' },
      small:  { minSize: 'control.small',  paddingInline: 'small', fontSize: 'small'  },
      medium: { minSize: 'control.medium', paddingInline: 'small', fontSize: 'small'  },
      large:  { minSize: 'control.large',  paddingInline: 'medium',fontSize: 'medium' },
      xlarge: { minSize: 'control.large',  paddingInline: 'medium',fontSize: 'medium' },
    },
    colors: {
      idle: {
        bg: 'transparent',
        bgHover: 'background.subtle',
        border: 'border.default',
        text: 'text.primary',
      },
      current: {
        bg: 'brand.solid',
        border: 'brand.solid',
        text: 'text.inverse',
      },
      disabled: {
        bg: 'transparent',
        border: 'border.subtle',
        text: 'text.disabled',
      },
    },
  },
  ellipsis: {
    color: 'text.tertiary',
    fontSize: 'small',
  },
};
