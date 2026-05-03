# RFC-0036 — Card: slot recipe + behavior split + paridade native

**Status**: **Draft (2026-05-03)**
**Autores**: arbor-ds-architect
**Data**: 2026-05-03
**Origem**: review R9 (achados CD-Bug-1/2/3, CD-Mod-1/2, CD-Hard-1/2, CD-Plat-1, CD-A11y-1).

---

## Motivação

Card hoje carrega quatro problemas estruturais:

1. **`Card.Media` com bug de composição** (CD-Bug-1): `margin: '-16px -16px 16px -16px'` hardcoded assume `padding="medium"`. Quebra silenciosamente para `small`/`large`.
2. **`variant="clickable"` sem semântica de botão** (CD-Bug-2): `<div>` com `cursor: pointer`. JSDoc orienta consumidor a passar `aria-label`, API não força nada — a11y opcional.
3. **Hover/active CSS no provider global, não-themable** (CD-Bug-3):
   ```css
   /* provider.tsx:30-34 */
   .arbor-card-hoverable:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important; }
   .arbor-card-clickable:active { transform: scale(0.99); }
   ```
   rgba literal, `!important`, fora da pipeline `shadows`/`motion`. Inútil em native.
4. **Variants confundem identidade com comportamento** (CD-Mod-1): `variant: 'outlined' | 'elevated' | 'flat' | 'hoverable' | 'clickable'`. Produto que quer "elevated + hoverable" não consegue expressar.

E os meta-problemas:

5. Sem `card.native.tsx` (CD-Plat-1).
6. `padding: 'none' | 'small' | 'medium' | 'large'` (sem `xsmall`/`xlarge` — SP-1 incompleto).
7. Sem slot recipe (`defineSlotRecipe('card', …)`); todo styling vive no componente.

---

## Proposta

### 1. Split: identidade × comportamento

```ts
interface CardRootProps {
  children: ReactNode;
  /** Identidade visual. */
  variant?: 'outlined' | 'elevated' | 'flat';
  /** Comportamento interativo. Mutuamente cruzável com qualquer variant. */
  interactive?: 'hover' | 'press' | true | false;
  /** SP-1 completo. */
  padding?: 'none' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
  style?: CSSProperties;
}
```

Comportamento:
- `interactive` ausente / `false` → Card decorativo (`<Box>`).
- `interactive='hover'` → Card decorativo com hover (sem clickability). Útil para "destacar ao passar".
- `interactive='press'` ou `true` → Card vira `<Clickable>`, exige `onClick` + `aria-label` no nível de tipo (discriminated union).

Discriminated union no nível de tipo:

```ts
type CardRootProps = CardBaseProps & (
  | { interactive?: false | undefined | 'hover' }
  | { interactive: 'press' | true; onClick: (e: ClickEvent) => void; ariaLabel: string }
);
```

Combinações válidas: `outlined+hover`, `elevated+press`, `flat`, etc.

### 2. Slot recipe

```ts
// foundations/theme/recipes/card.ts
defineSlotRecipe({
  className: 'card',
  slots: ['root', 'header', 'body', 'footer', 'media'],
  base: {
    root: {
      flexDirection: 'column',
      borderRadius: 'medium',
      backgroundColor: 'surface.default',
      overflow: 'hidden',
    },
    body: { flex: 1 },
    header: {
      paddingBottom: 'small',
      borderBottomWidth: 1,
      borderBottomColor: 'border.subtle',
      marginBottom: 'small',
    },
    footer: {
      paddingTop: 'small',
      borderTopWidth: 1,
      borderTopColor: 'border.subtle',
      marginTop: 'small',
    },
  },
  variants: {
    variant: {
      outlined: { root: { borderWidth: 1, borderColor: 'border.subtle' } },
      elevated: { root: { boxShadow: 'medium' } },
      flat:     { root: {} },
    },
    interactive: {
      hover: { root: { transition: '…', _hover: { transform: 'translateY(-2px)', boxShadow: 'large' } } },
      press: { root: { cursor: 'pointer', transition: '…', _hover: { transform: 'translateY(-2px)', boxShadow: 'large' }, _active: { transform: 'scale(0.99)' } } },
    },
    padding: {
      none: { body: { padding: 0 } },
      xsmall: { body: { padding: 'xsmall' } },
      small: { body: { padding: 'small' } },
      medium: { body: { padding: 'medium' } },
      large: { body: { padding: 'large' } },
      xlarge: { body: { padding: 'xlarge' } },
    },
  },
  defaultVariants: { variant: 'outlined', padding: 'medium' },
});
```

Tudo themable. Produto consumidor pode redefinir `boxShadow` do hover, transform, padding por size.

### 3. CSS global do provider sai

`.arbor-card-hoverable` e `.arbor-card-clickable` deletados do `GLOBAL_CSS` em `provider.tsx`. `injectStyle(GLOBAL_STYLE_ID, …)` perde 4 linhas.

### 4. `Card.Media` bleed via context, não margin negativa

Pattern já estabelecido em outros DSes:

```tsx
function CardMedia({ children, ...props }: CardSectionProps) {
  const { paddingValue } = useCardContext(); // resolve padding atual em px
  return (
    <Box
      overflow="hidden"
      marginX={`-${paddingValue}px` as any}
      marginTop={`-${paddingValue}px` as any}
      marginBottom={paddingValue ? 'medium' : 0}
      {...props}
    >
      {children}
    </Box>
  );
}
```

Alternativa mais limpa: introduzir prop `bleed?: 'horizontal' | 'top' | 'all'` no `Box`/`Flex` que o engine resolve consultando o padding do ancestral via context. Trabalho fora do escopo desta RFC — fica como **TD followup** se a rota A (margin via context) provar-se confusa.

Decisão default: **rota A** (context com `paddingValue` derivado do recipe). Funciona, é local, não exige mudança no engine.

### 5. `.native.tsx`

Espelho do web; consome o mesmo recipe via `useSlotRecipe('card')`. Hover não existe em RN — `interactive='hover'` é no-op em native (decisão consciente, documentada). `interactive='press'` usa `Clickable.native` com `accessibilityRole='button'`.

### 6. Interfaces sem `HTMLAttributes`

`CardRootProps`, `CardSectionProps` deixam de extender `HTMLAttributes<HTMLDivElement>`.

---

## Plano de execução

**PR único** (escopo concentrado, breaking interno):
1. Slot recipe `card` em `base-theme`.
2. Reescrever `card.tsx` consumindo `useSlotRecipe('card')` + Clickable quando `interactive='press'|true`.
3. `card.native.tsx`.
4. Deletar `arbor-card-hoverable`/`arbor-card-clickable` de `provider.tsx`.
5. Discriminated union `CardRootProps`.
6. `Card.Media` via context.
7. SP-1 completo em `padding`.
8. Migrar consumidores (playground/stories).
9. Testes paritários web + native.
10. CONTRIBUTING §Card.

---

## Riscos / Trade-offs

| Risco | Mitigação |
|---|---|
| Discriminated union exige `onClick` + `ariaLabel` quando `interactive='press'` — pode quebrar consumidores | Pre-v1, sem consumidores externos; precedente TD-012 |
| Produto que dependia do CSS global do provider | Migrar consumidores antes de remover do provider |
| Bleed via context complica testes de Card.Media | Cobrir todas combinações padding × media nas stories |
| Perda do variant `'hoverable'` literal | Mapeamento direto: `variant='hoverable'` → `interactive='hover'`. Codemod opcional. |

---

## Critérios de aceite

- [ ] Slot recipe `card` declarado e themable.
- [ ] CSS global de Card removido de `provider.tsx`.
- [ ] `Card.Media` funciona corretamente em todos os paddings (`none`/`xsmall`/`small`/`medium`/`large`/`xlarge`).
- [ ] `interactive='press'` exige `onClick` + `ariaLabel` no nível de tipo.
- [ ] `card.native.tsx` paritário; `interactive='hover'` é no-op documentado.
- [ ] `style={{}}` zerado.
- [ ] Bateria verde (web + native).
- [ ] Stories cobrindo: 3 variants × 4 interactive states × 6 paddings + 4 media positions.

---

## Dependências

- Fecha **TD-038** (Card global CSS).
- Fecha parcialmente **TD-028** (escopo Card).
- Independente das outras RFCs R9.
