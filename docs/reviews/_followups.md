# Follow-ups consolidados — R1, R2, R3

> Índice acionável de tudo que ficou em aberto após cada fase de review. Atualizar ao mover itens para "concluído", abrir issue/PR ou rejeitar.

**Última atualização:** 2026-04-24

> Para débito técnico mapeado (decisões de adiar com plano de resolução), ver [`docs/TECH_DEBT.md`](../TECH_DEBT.md).

---

## Visão geral

| Fase | Fixes pendentes | Issues abertas | RFCs abertas | RFCs implementadas | DoD cumprida? |
|---|---:|---:|---:|---:|---|
| R1 | 0 | 6 | 7 | 0 | parcial — issues C3/C4 não viraram código |
| R2 | 0 | 6 | 3 | 2 (RFC-0001, 0002) | parcial — testes verdes 541/541, faltam stories/testes ausentes |
| R3 | 0 | 8 | 6 | 1 (RFC-0008) | parcial — testes verdes 541/541, Storybook build não verificado |

**Total:** 12 RFCs (`RFC-0001` a `RFC-0012`) — 3 implementadas (0001, 0002, 0008), 9 em Draft · 20 issues · 0 fixes imediatos pendentes.

---

## Fixes imediatos — concluídos em 2026-04-24

Trabalho que cabia em PR único, sem RFC nem breaking change. Todos os 8 itens originais aplicados ou já estavam aplicados em commits anteriores.

### R1

- [x] Remover `tag?: RecipeConfig` de `ThemeComponents` em `src/foundations/theme/types.ts:31` — aplicado em 2026-04-24.

### R3

- [x] **`Image` — bug de `width`/`height` duplicados** — já estava aplicado (passados como props declarativas; `style` só carrega `objectFit`).
- [x] **`Image` — `style?: object` → `CSSProperties`** em `ImageProps.ts:13` — já aplicado.
- [x] **`Text.role?: string` → `React.AriaRole`** em `TextProps.ts:39` — já aplicado.
- [x] **`Text` story `Scale`** — já usa `<Flex flexDirection="column" gap="8px">`.
- [x] **`Image` story `WithOverlay`** — já usa `<Box position="absolute" ...>`.
- [x] **`Icon` `icon-showcase.tsx`** — `<Clickable>` e `<Box as="input">` já em uso; `style={{...}}` com props declarativas equivalentes (padding, border, borderRadius, fontSize, width, gap, lineHeight) promovidas em 2026-04-24; mantidos como escape hatch apenas `outline`, `gridTemplateColumns`, `wordBreak`.
- [x] **`Icon` stories `SizeVariants` e `StrokeVariants`** — já usam `<Flex>` e `<Text>` sem div/span crus.
- [x] **`Clickable` — `RefAttributes<HTMLElement>`** em `clickable.tsx:6` — já aplicado.

**Resultado:** `pnpm test` → 530/530 verdes.

---

## Issues abertas (mudança localizada, sem breaking)

Cada item deve virar issue com label `review:R1` / `R2` / `R3` quando o backlog for criado no GitHub.

### R1 — Foundations

- [ ] **C3** Shadows tematizadas (light vs. dark) — hoje `rgba(0,0,0,...)` quebra em dark theme.
- [ ] **C4** `usePrefersReducedMotion.native.ts` — implementar com `AccessibilityInfo.isReduceMotionEnabled()` + listener.
- [ ] **H1** Avaliar `xlarge` (32) entre `huge` (28) e `giant` (40) na escala de spacing.
- [ ] **H2** Aliasear `borderRadius` 20/28/36/44 ou removê-los do primitive.
- [ ] **H6** Padronizar wrapper de recipe em 100% dos slots de `base-theme.ts` (`defineRecipe` / `defineSlotRecipe` em todos).
- [ ] **H7** Idem ao fix imediato — quando `tag` for removido do tipo, validar consumidores.

### R2 — Core layout primitives

- [ ] **Testes** ausentes em Flex, Grid (web + native), Container, Center, Square, Circle, Spacer (7 componentes).
- [ ] **Stories** ausentes em Container, Center, Square, Circle, Spacer (5 componentes).
- [ ] **Container** — regressão específica de `maxWidth: string`.
- [ ] **Box / Flex** — remover `onClick` da tipagem (anti-pattern: usar `Clickable`).
- [ ] **Container** — promover `fluid`/`maxWidth` para discriminated union.
- [ ] **Container** — extrair `resolveMaxWidth` para `utils/` com testes isolados.
- [ ] **Container** — avaliar permitir `...rest` (aumentar Pick).

### R3 — Core cross-platform primitives

- [ ] **Text** — testes (variantes, truncamento, HTML parsing, a11y).
- [ ] **Text** — stories por variante tipográfica nomeada (`bigNumber`, `body`, `display1–4`, `title1–2`, etc.).
- [ ] **Text** — story para HTML parsing com `onLinkPress`.
- [ ] **Text** — story para truncamento com `numberOfLines={2}`.
- [ ] **Text** — fixar `lineHeight` hardcoded (`'20px'`) na recipe para usar token.
- [ ] **Text** — investigar `onPress` na interface (implementar ou remover).
- [ ] **Clickable** — testes (renderização, click, ref, TapState, keyboard).
- [ ] **Clickable** — stories (default, com TapState, polimórfico, disabled, em composição).
- [ ] **Clickable** — warning de dev para `as !== 'button'` sem `role` (proteção a11y).
- [ ] **Clickable** — documentar `TapState` no JSDoc com exemplo.
- [ ] **Icon** — testes para `icon.native.tsx` (normalização de `currentColor`, size string, `accessibilityElementsHidden/Label`).
- [ ] **Image** — testes web (render `<img>`, render background, `resizeMode`, `alt`, `onError`/`onLoad`) e native (normalização, dimensões percentuais).
- [ ] **Image** — stories para `center` resizeMode, `stretch` resizeMode, `onError` com fallback, `onLoad` com indicador.
- [ ] **Image** — adicionar `forwardRef`.
- [ ] **Image** — documentar comportamento dual no JSDoc (até RFC-0011 ser aceito).

---

## RFCs abertas

Todas em **Status: Draft**. Localizadas em `docs/rfcs/`.

### Sistêmicas (R1)

| ID | Título | Origem | Bloqueia |
|---|---|---|---|
| (futura) | Convenção única de nomeação de fontSize | R1-C2 | renomeação ampla, breaking |
| (futura) | Shadows semantic layer tematizada | R1-C3 | Card/Modal/Drawer ganharem elevation correta |
| (futura) | Cor `focus.ring` + `focus.outline` como semantic token | R1 gap | a11y de foco em todo o DS |
| (futura) | Motion semantic layer (`fade`, `collapse`, `slideIn`) | R1 gap | consistência de microinterações |
| (futura) | Typography aggregate tokens (`body.default`, `display.large`) | R1 gap | reduzir duplicação em recipes |
| (futura) | Normalização de `alphaColor` | R1-H3 | tokenização de overlays |
| (futura) | Poda de ramps de cor não consumidas | R1-H4 | bundle size + clareza |

> RFCs de R1 ainda **não foram redigidas** — entrar como trabalho de R13 ou abrir conforme demanda real surgir.

### R2

| ID | Título | Origem | Bloqueia | Status |
|---|---|---|---|---|
| [RFC-0001](../rfcs/RFC-0001-ref-canonico-em-primitives.md) | `ref` canônico em primitives | R2-A · H-R2-1 | RFC-0002, RFC-0008 | **Implemented (2026-04-24)** |
| [RFC-0002](../rfcs/RFC-0002-genericos-em-primitives.md) | Genéricos `<T>` em primitives | R2-B · H-R2-4 | — | **Implemented (2026-04-24)** |
| [RFC-0003](../rfcs/RFC-0003-consolidacao-aliases-de-props.md) | Consolidação de aliases de props | R2-C · H-R2-5 + R1-H8 | breaking transversal | Draft |
| [RFC-0004](../rfcs/RFC-0004-grid-cross-platform.md) | `Grid` cross-platform | R2-D · M-R2-6 | parcialmente RFC-0003 | Draft |
| [RFC-0005](../rfcs/RFC-0005-empty-vs-empty-state.md) | Destino do componente `Empty` | R2-E · M-R2-5 | nada (componente sem consumidor) | Draft |

### R3

| ID | Título | Origem | Bloqueia | Status |
|---|---|---|---|---|
| [RFC-0006](../rfcs/RFC-0006-istruncated-vs-numberoflines-em-text.md) | Consolidar `isTruncated` e `numberOfLines` | R3-A · `text.md` | nada (cleanup local) | Draft |
| [RFC-0007](../rfcs/RFC-0007-tipagem-generica-de-userecipe.md) | Tipagem genérica do retorno de `useRecipe` | R3-B · `text.md` | múltiplos componentes que casteiam recipes | Draft |
| [RFC-0008](../rfcs/RFC-0008-tapstate-prop-vs-slot-em-clickable.md) | `tapState`: prop vs. slot em `Clickable` | R3-C · `clickable.md` | ~~R4~~ (destravada) | **Implemented c/ recorte (2026-04-24)** |
| [RFC-0009](../rfcs/RFC-0009-tamanhos-semanticos-em-icon.md) | Tamanhos semânticos para `Icon.size` | R3-D · `icon.md` | implementar com RFC-0010 | Draft |
| [RFC-0010](../rfcs/RFC-0010-discriminated-union-decorative-em-icon.md) | Discriminated union `decorative` + `aria-label` | R3-E · `icon.md` | implementar com RFC-0009 | Draft |
| [RFC-0011](../rfcs/RFC-0011-modo-de-renderizacao-explicito-em-image.md) | Modo de renderização explícito em `Image` | R3-F · `image.md` | implementar com RFC-0012 | Draft |
| [RFC-0012](../rfcs/RFC-0012-loading-e-error-states-em-image.md) | Estados de loading/error em `Image` | R3-G · `image.md` | implementar com RFC-0011 | Draft |

---

## Decisões de arquitetura — 2026-04-24

**RFC-0001 — Implementada.** `forwardRef` canônico nos 11 primitives layout (Box, Flex, Grid web/native, Container, Center, Square, Circle, Spacer) + Image (web/native). Empty exceção (renderiza null). `Clickable` simplificado — `setRef` manual e `tapStateRef` removidos. `innerRef` legado mantido com fallback (`ref ?? innerRef`) para coexistência transparente.

**RFC-0002 — Implementada (junto com 0001).** Genérico `<T extends object>` removido de Box, Flex, Grid, Center, Square, Circle. Casts `as typeof Component` removidos. Interfaces de props viraram tipos concretos.

**RFC-0008 — Implementada com recorte.** Três ajustes aplicados:

1. ✅ Renomear `TapState` → `PressFeedback`, destino `src/components/core/press-feedback/`.
2. ✅ Adiado `useClickableContext` — RFC futura quando surgir consumidor real de `pressed` controlado.
3. ✅ Dead code removido: `tapStateRef`/`setRef` em Clickable, `pressed` + `useImperativeHandle` em TapState. TapState antigo deletado.

**Bonus:** Dev warning a11y em `Clickable` (`as !== 'button'/'a'` sem `role`) ativo em modo dev.

**Resultado:** R4 (Button, ButtonGroup, FAB) está pronta para iniciar. 541/541 testes verdes.

## Gate para iniciar R4 — ✅ CUMPRIDO (2026-04-24)

- [x] RFC-0008 implementada: `PressFeedback` criado em `src/components/core/press-feedback/`, exportado de `src/components/core/index.ts`. Sem consumidores externos de `tapState` (verificado por grep) — TapState antigo removido de `src/ecosystem/utils/components/`.
- [x] RFC-0001 aplicada em `Clickable` (e em todos os 11 primitives layout + Image cross-platform). `setRef` manual removido; ref canônico via `Flex`.
- [x] `Clickable.test.tsx` criado (11 testes: render, click, disabled, ref canônico, innerRef compat, polimórfico, keyboard, composição com PressFeedback, dev warning a11y x3).
- [x] Dev warning de `as !== 'button'/'a'` sem `role` em `Clickable` ativo em modo dev.
- [x] **Bonus**: RFC-0002 (genéricos) implementada no mesmo sweep — evitou refactor duplo nos primitives.
- [x] `pnpm test` → 541/541 verdes.

**R4 (Button, ButtonGroup, FAB) está pronta para começar.**

Outras RFCs podem rodar em paralelo a R4–R12.

---

## Convenções a registrar em CONTRIBUTING.md

Padrões emergentes nas reviews que **ainda não estão documentados** em CONTRIBUTING.md (verificado em 2026-04-24):

1. **Invariantes por último.** Em primitives com contrato semântico, invariantes do componente vão **depois** do spread de `{...props}`. Padrão consolidado em R2-CR2-1 e reincidente em R3-CR3-4.
2. **Omit das props que o componente controla.** Quando uma prop é invariante (ex: `Center.alignItems`), `Omit<ArborTransformProps, 'alignItems'>` complementa a blindagem em compile-time.
3. **`displayName` obrigatório** em todo componente público — incluindo os sem `forwardRef`. (R2-CR2-1 / R3-CR3-1)
4. **`.native.tsx` só quando há divergência real.** Primitives que delegam ao `ArborTransform` não precisam — ele já resolve por plataforma.
5. **Stories usam apenas componentes do DS.** Sem `<div>`, `<span>`, `<button>` crus; sem `style={{...}}` onde há prop declarativa. (R2-CR2-2 / R3-CR3-3)
6. **Componentes `platform-split` têm warning de dev** para limitações de plataforma (`Icon.native` para `currentColor`; `Text.native` deveria ter para HTML string). (R3 padrão emergente #4)

---

## Sequência de execução recomendada

**Antes de marcar R3 como verdadeiramente "concluída":**

1. Aplicar os ~8 fixes imediatos pendentes (esforço estimado: ~1-2 dias).
2. ~~Decidir RFC-0008~~ ✅ decidida em 2026-04-24 — Accepted com recorte.
3. Adicionar as 6 convenções acima ao CONTRIBUTING.md (esforço: 1 hora).

**Antes de iniciar R4 (ordem de implementação):** ✅ TUDO CONCLUÍDO em 2026-04-24

4. ~~Implementar **RFC-0001** nos 9 primitives.~~ ✅ Aplicada nos 11 primitives layout + Image (web/native).
5. ~~Implementar **RFC-0008** com recorte.~~ ✅ `PressFeedback` criado, dead code limpo, consumidores zero externos confirmado, TapState antigo removido.
6. ~~Escrever **`Clickable.test.tsx`**.~~ ✅ 11 testes (render, click, disabled, ref canônico, innerRef compat, polimórfico, keyboard, PressFeedback, warnings a11y).
7. ~~Adicionar **dev warning** a11y em `Clickable`.~~ ✅ Ativo em modo dev.
8. **RFC-0002** implementada junto com 0001 (mesmo sweep — evitou refactor duplo).
9. Opcionalmente, fechar testes ausentes de R2/R3 (10 componentes sem teste). Aceitar dívida explicitamente em entrada de memória se for adiado.

**Em paralelo (não bloqueante):**

10. **RFC-0005** (Empty) — decisão barata, fechar rápido.
11. **RFC-0006** (Text truncate), **0009+0010** (Icon, co-dependentes), **0011+0012** (Image, co-dependentes), **0007** (useRecipe) — backlog planejado por dependência técnica.
12. **RFC-0003** (aliases) e **RFC-0004** (Grid) — agrupar com outros breaking changes acumulados em major única.
13. Issues de `style={{}}` em stories podem ser fechadas em PR único cobrindo todos os arquivos afetados.
