# RFC-0038 — Tabs: API canônica + slot recipe

**Status**: **Draft (2026-05-03)**
**Autores**: arbor-ds-arch
**Data**: 2026-05-03
**Origem**: review R9 (achados TB-Style-1/2/3/4, TB-Mod-1/2/3/4, TB-A11y-1/2/3, TB-Plat-1/2/3).

---

## Motivação

Tabs concentra **o pior de R9 em violações de style→props**. Web (`tabs.tsx`):

```tsx
<Clickable
  …
  style={{
    padding: size === 'small' ? '8px 12px' : '10px 16px',
    border: 'none',
    borderBottom: `2px solid ${isActive ? theme.colors.brand.base : 'transparent'}`,
    borderRadius: 0,
    backgroundColor: 'transparent',
    color: isActive ? theme.colors.text.primary : theme.colors.text.secondary,
    fontSize: size === 'small' ? theme.fontSizes.xsmall : theme.fontSizes.small,
    fontWeight: isActive ? theme.fontWeights.medium : theme.fontWeights.regular,
    whiteSpace: 'nowrap',
    transition: transition(['color', 'border-color'], 'fast'),
  }}
>
```

Praticamente toda regra de estilo passa por `style={{}}` ou `useTheme()` — engine + recipes ignorados.

Soma:

1. **`variant: 'pill'` declarado, não implementado** (TB-Mod-1) — dead surface.
2. **`size: 'small' | 'medium'`** — SP-1 incompleto (TB-Mod-2).
3. **`src/components/tabs/slots/` vazio** (TB-Mod-3).
4. **`Tabs.Content` com `outline: 'none'` em `tabIndex=0`** (TB-A11y-2) — remove foco visível sem substituto. WCAG 2.4.7 quebrado.
5. **`Home`/`End` prometido em JSDoc, ausente** (TB-A11y-1).
6. **`@platform native-ready` em interfaces** (TB-Plat-1).
7. **`HTMLAttributes`/`ButtonHTMLAttributes`** em superfície shared (TB-Plat-2).
8. **Native ignora `variant` por completo** (TB-Plat-3) — promete 2 variants (web), entrega 0 (native).

---

## Proposta

### 1. Slot recipe + variants honestas

```ts
// foundations/theme/recipes/tabs.ts
defineSlotRecipe({
  className: 'tabs',
  slots: ['root', 'list', 'trigger', 'content'],
  base: {
    list: {
      flexShrink: 0,
      gap: 'xsmall', // alinhado SP-1
    },
    trigger: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'xsmall',
      whiteSpace: 'nowrap',
      backgroundColor: 'transparent',
      transition: '…',
      _disabled: { opacity: 0.5, cursor: 'not-allowed' },
      _focusVisible: { /* TD-014 pattern */ },
    },
    content: {
      color: 'text.primary',
      paddingY: 'medium',
    },
  },
  variants: {
    variant: {
      underline: {
        list: { borderBottomWidth: 1, borderBottomColor: 'border.subtle' },
        trigger: {
          borderBottomWidth: 2,
          borderBottomColor: 'transparent',
          borderRadius: 0,
          color: 'text.secondary',
          _selected: {
            borderBottomColor: 'brand.base',
            color: 'text.primary',
            fontWeight: 'medium',
          },
        },
      },
      pill: {
        list: { gap: 'xsmall' },
        trigger: {
          borderRadius: 'full',
          paddingX: 'medium',
          color: 'text.secondary',
          _selected: {
            backgroundColor: 'brand.base',
            color: 'text.inverse',
          },
        },
      },
    },
    size: {
      xsmall: { trigger: { paddingX: 'small',  paddingY: 'xsmall', fontSize: 'xsmall' } },
      small:  { trigger: { paddingX: 'small',  paddingY: 'xsmall', fontSize: 'xsmall' } },
      medium: { trigger: { paddingX: 'medium', paddingY: 'small',  fontSize: 'small' } },
      large:  { trigger: { paddingX: 'medium', paddingY: 'small',  fontSize: 'medium' } },
      xlarge: { trigger: { paddingX: 'large',  paddingY: 'medium', fontSize: 'medium' } },
    },
    orientation: {
      horizontal: { root: { flexDirection: 'column' }, list: { flexDirection: 'row' } },
      vertical:   { root: { flexDirection: 'row' },    list: { flexDirection: 'column', borderRightWidth: 1, borderBottomWidth: 0 } },
    },
  },
  defaultVariants: { variant: 'underline', size: 'medium', orientation: 'horizontal' },
});
```

`pill` deixa de ser ghost. Native consome o mesmo recipe — paridade.

### 2. SP-1 completo

`size: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge'`. Sem aliases legados (precedente TD-012). `'sm'`/`'md'` removidos do tipo público.

### 3. Interfaces sem HTMLAttributes

```ts
interface TabsRootProps {
  children: ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  style?: CSSProperties;
}

interface TabsListProps {
  children: ReactNode;
  variant?: 'underline' | 'pill';
  size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
  fullWidth?: boolean;
  className?: string;
  style?: CSSProperties;
}

interface TabsTriggerProps {
  children: ReactNode;
  value: string;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

interface TabsContentProps {
  children: ReactNode;
  value: string;
  className?: string;
  style?: CSSProperties;
}
```

`size` mudou de `TabsTriggerProps` → `TabsListProps` (decisão de identidade do grupo, não do trigger individual). Consistente com `variant`.

### 4. Home/End + foco visível em Content

```ts
const handleKeyDown = (e) => {
  const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
  const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
  if (e.key === nextKey)  { e.preventDefault(); focusNext(value); }
  if (e.key === prevKey)  { e.preventDefault(); focusPrev(value); }
  if (e.key === 'Home')   { e.preventDefault(); focusFirst(); }
  if (e.key === 'End')    { e.preventDefault(); focusLast(); }
};
```

E `Tabs.Content` perde `outline: 'none'`; ganha `_focusVisible` no recipe (pattern TD-014).

### 5. `tabs/slots/` deletado

Diretório vazio sem propósito (slots vivem agora no recipe theme). Removido.

### 6. Tag `@platform shared`

Interfaces deixam de carregar `@platform native-ready`.

### 7. Cleanup

- `style={{}}` zerado em `tabs.tsx` e `tabs.native.tsx`.
- `useTheme()` removido — recipe resolve cores/sizes.
- `cloneElement` em `fullWidth` continua, mas passa prop `flex` (não `style.flex`).

---

## Plano de execução

**PR único:**
1. Slot recipe `tabs` em `base-theme`.
2. Atualizar interfaces (sem `HTMLAttributes`, SP-1, `size` em `TabsListProps`, tag shared).
3. Reescrever `tabs.tsx` consumindo recipe + Home/End + foco visível em Content.
4. Reescrever `tabs.native.tsx` consumindo recipe (paridade variant `pill`).
5. Deletar `src/components/tabs/slots/` (vazio).
6. Atualizar context para `size` no nível List.
7. Migrar consumidores (playground/stories).
8. Testes paritários.
9. CONTRIBUTING §Tabs.

---

## Riscos / Trade-offs

| Risco | Mitigação |
|---|---|
| Mover `size` de Trigger → List quebra consumidores | Pre-v1; precedente TD-012; codemod opcional |
| `pill` em vertical é estranho | Default vertical = sem borda visual extrema; aceita identidade do produto |
| Native variant pill exige tokens consistentes | Recipe único → resolve por construção |
| Foco visível em `Tabs.Content` diverge do Tabs.Trigger | Documentado: painel é focável (tabIndex=0) por requisito ARIA, foco precisa ser visível |

---

## Critérios de aceite

- [ ] Slot recipe `tabs` declarado e themable.
- [ ] `pill` implementado em web + native.
- [ ] SP-1 completo em `size`.
- [ ] Interfaces sem `HTMLAttributes`/`ButtonHTMLAttributes`.
- [ ] Home/End teclado implementado (web).
- [ ] `Tabs.Content` com foco visível.
- [ ] `tabs/slots/` deletado.
- [ ] Tag `@platform shared` nas interfaces.
- [ ] `style={{}}` e `useTheme()` zerados em `tabs.tsx` e `tabs.native.tsx`.
- [ ] Bateria verde (web + native).
- [ ] Stories cobrindo: 2 variants × 5 sizes × 2 orientations + fullWidth on/off + disabled state.

---

## Dependências

- Fecha **TD-039** (ghost variant + `tabs/slots/`).
- Fecha parcialmente **TD-028** e **TD-036** (escopo Tabs).
- Independente das outras RFCs R9.
