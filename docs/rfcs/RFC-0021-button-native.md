# RFC-0021 — Button (+ IconButton) cross-platform

**Status**: Accepted — 2026-04-25
**Autores**: @bia
**Data**: 2026-04-25

**Origem**: Onda 6 da RFC-0018 (paridade native completa). Última família restante após Tag/Accordion (onda 5).

---

## Motivação

`Button` e `IconButton` são os componentes mais consumidos do DS, mas seguem em `@platform web-only`:

- `button.tsx` usa `<Clickable as="button">`, `aria-busy`, `cursor`, animação CSS keyframe (`arbor-spin`) no loader.
- `IconButton` compõe `Button`, então herda a restrição.
- `ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>` — interface DOM-acoplada.

Resultado: app mobile (playground Expo, fase 17) **não tem botão do DS** — usa Pressable cru ou TouchableOpacity. Toda a discussão de variantes/tamanhos/loading/disabled foi reinventada inline.

A onda 1 já entregou `Clickable.native` (Pressable + Box wrapper). A onda 7.1 entregou `Spinner.native` (Animated.loop). A infra para Button.native existe — falta compor.

## Decisão

**Caminho B (do Architect Plan):** componentes `.native.tsx` que reusam `Clickable.native` + `Spinner` (cross), com **swap simultâneo** do loader do Button web (Icon + keyframe inline → Spinner) para alinhar as duas plataformas no mesmo primitivo.

### Não-escopo desta RFC
- Refatorar `ButtonProps` para tirar `extends ButtonHTMLAttributes` — segue o **mesmo padrão da Tag (onda 5):** mantém o extends, `.native.tsx` faz `{...(props as object)}` para silenciar tipos DOM-only. Mudança maior fica para uma RFC dedicada de tipagem cross-platform.
- Resolver TD-006 (acoplamento Button↔ButtonGroup via context). Continua aberto; será tratado em RFC própria.
- `IconButton` não vira componente próprio — segue como wrapper fino de `Button`.

## API

`ButtonProps` permanece **único e intacto**:

```ts
export interface ButtonVariant {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariant {
  children: ReactNode;
}
```

Comportamento por plataforma:

| Prop | Web | Native |
|---|---|---|
| `variant` / `size` | aplica `variantStyles` + `buttonSizeMap` | idem (mesmas tabelas) |
| `loading` | renderiza `<Spinner>` à esquerda + `aria-busy` | renderiza `<Spinner>` à esquerda + `accessibilityState.busy` |
| `disabled` | `pointerEvents: none`, `opacity: 0.45`, `cursor: not-allowed` | `Pressable disabled`, `accessibilityState.disabled`, `opacity: 0.45` |
| `onClick` | `onClick` direto no Clickable | mapeado para `onPress` pelo `Clickable.native` (já existente) |
| `type="button|submit|reset"` | aplicado | **no-op** (sem semântica em RN) — propriedade aceita silenciosamente |
| `aria-*` | aplicado | ignorado pelo `Clickable.native`, `accessibilityRole="button"` por default |

## Loader: swap web `Icon + keyframe` → `<Spinner>`

`button.tsx` atual:
```tsx
{loading && (
  <Icon name="LoaderCircle" size={loaderSizeMap[size]}
    style={{ animation: 'arbor-spin 0.8s linear infinite', flexShrink: 0 }} />
)}
```

Vira:
```tsx
{loading && <Spinner size="sm" color={variantStyles[variant].color} />}
```

Ganhos:
- Web e native usam o **mesmo componente** para spinner.
- `<Spinner>` já tem `accessibilityRole="progressbar"` em RN e `role="status"` em web — a11y herdada.
- Some o keyframe inline `arbor-spin` (já existe global no playground; se não fosse, precisaria ser injetado).

Trade-off: o loader do botão fica com o tamanho fixo `"sm"` em vez da escala 14/16/18. Aceitável — consistência > 2 px de diferença em `lg`. Caso surja regressão visual, RFC futura adiciona `size="xs"` no Spinner.

## ButtonGroup attached em native

Web usa `marginInlineStart: -1` para sobrepor borda. RN ignora `marginInlineStart` (aceita `marginStart`), mas a sobreposição produz **borda dupla** porque RN não tem `border-collapse`.

Solução para native:
- Item central / último: `borderLeftWidth: 0` (horizontal) / `borderTopWidth: 0` (vertical) **em vez** de margin negativa.
- Radii colapsados como na web.

Fica visualmente equivalente, sem hack de overlap.

## Estrutura

```
src/components/button/core/
  button.tsx             # web — swap loader, lógica idêntica
  button.native.tsx      # NOVO
  icon-button.tsx        # web — sem mudança
  icon-button.native.tsx # NOVO — wrapper sobre Button.native
  button.test.tsx
  button.native.test.tsx # NOVO
  icon-button.test.tsx   # se existir; senão criar
  icon-button.native.test.tsx # NOVO
src/native.ts            # adiciona exports Button, IconButton, ButtonGroup, ButtonGroupProps
```

## Riscos e mitigação

| Risco | Mitigação |
|---|---|
| `transition` CSS não roda em native | Aceitar drift de microinteração. Engine de motion cross-platform é escopo separado (TD futuro). |
| `cursor: pointer` em RN é warning | Já filtrado pelo `Clickable.native` (não passa para `Pressable`). |
| `aria-busy` em RN gera warning | `.native.tsx` não passa `aria-*`; usa `accessibilityState.busy`. |
| ButtonGroup com Button `.native` numa árvore que não tem `Pressable.role="group"` | Mantemos `role="group"` no Flex web; em RN, ButtonGroup vira `<Box accessibilityRole="none">`. Já é o comportamento do Box atual. |
| Storybook pode quebrar com swap do loader | Smoke test manual após `pnpm test`. |

## Plano de execução

1. Trocar loader do `button.tsx` web para `Spinner` (preserva snapshot semântico — só DOM interno muda).
2. Mudar `@platform web-only` → `@platform native-ready` em `Button.ts` (interface).
3. Criar `button.native.tsx`.
4. Criar `icon-button.native.tsx`.
5. Adicionar `Button`, `IconButton`, `ButtonGroup`, `ButtonGroupProps` ao `src/native.ts`.
6. Criar `button.native.test.tsx` (paridade com a suíte web — render, disabled, loading, onClick, variantes, ButtonGroup attached).
7. Criar `icon-button.native.test.tsx`.
8. `pnpm test` + `node scripts/check-platform-contract.js --strict`.
9. Atualizar TD-017 (3 → 1, sobra apenas Table).

## Critérios de aceite

- [ ] `button.native.tsx` + `icon-button.native.tsx` existem e renderizam.
- [ ] `Spinner` substitui o `Icon LoaderCircle` em ambas as plataformas no estado `loading`.
- [ ] Suíte web continua verde (sem regressão funcional).
- [ ] `.native.test.tsx` com 6+ casos passando.
- [ ] `check-platform-contract --strict` continua verde.
- [ ] `web-only` global cai 3 → 1.
- [ ] RadioCard removido (RFC-0019 fechada como Removed) — pré-condição já cumprida.
