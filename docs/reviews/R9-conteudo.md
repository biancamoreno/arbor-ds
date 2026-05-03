# R9 — Conteúdo (consolidado)

**Data:** 2026-05-03 · **Revisor:** arbor-ds-arch · **Status:** reviews concluídas + RFCs/TDs derivadas (Draft). **Sweep ainda não aplicado.** Suite atual **974/974 verde**.

Componentes auditados: `Avatar` · `Card` · `Accordion` · `Tabs` · `Carousel` (sondagem — componente inexistente).

> Reviews individuais não foram desdobradas em arquivos separados desta vez (precedente 8.D); esta consolidação carrega os achados-chave + plano de sweep, e cada RFC linkada abaixo aprofunda o componente correspondente.

---

## 1. Achados convergentes (TOP por impacto)

### 🔴 Carousel inexistente — bloqueio de produto

`src/components/carousel/` está vazio desde Out/2025; sem export em `src/components/index.ts`. Cenários de produto declarados (e-commerce vitrine, landing pages, listas) cobram um Carousel canônico — hoje cada consumidor monta na unha. Ver **RFC-0034** + **TD-035**.

### 🔴 `<Box as="img">` em `AvatarImage` — paridade native quebrada

`AvatarImage` extends `ImgHTMLAttributes<HTMLImageElement>` e renderiza via `<Box as="img">` (`avatar.tsx:50`). Componente é tagueado `@platform shared`, mas não há `avatar.native.tsx` — e não pode haver enquanto `<img>` for o render. Bloqueia paridade real, não só leak de tipo. Ver **RFC-0035**.

### 🔴 Card hover/clickable CSS no provider global, com rgba + `!important`

```css
/* src/ecosystem/styled-system/core/provider/provider.tsx:30-34 */
.arbor-card-hoverable:hover, .arbor-card-clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
}
.arbor-card-clickable:active { transform: scale(0.99); }
```

rgba literal, `!important`, transform hardcoded. Não-themable, fora da pipeline `shadows`/`motion`, ignora `transition()` da RFC-0027. Inútil em native. Ver **RFC-0036** + **TD-038**.

### 🔴 `Card.Media` com margin negativa hardcoded — bug de composição

```ts
style={{ margin: '-16px -16px 16px -16px' }}
```

Assume silenciosamente que `CardRoot.padding === 'medium'` (16px). Se o consumidor passar `padding="small"` (12px) ou `large` (24px), o media "explode" para fora da borda. Bug real, reprodutível. Ver **RFC-0036**.

### 🔴 `variant="clickable"` no Card sem semântica de botão

Renderiza como `<div>` com `cursor: pointer`. JSDoc orienta o consumidor a passar `onClick + aria-label`, mas a API não força nada — sem `role="button"`, sem `tabIndex`, sem keyboard handler. **A11y opcional ≠ a11y.** Resolução: split `variant: 'outlined'|'elevated'|'flat'` × novo `interactive?: 'hover'|'press'|true`, e `interactive='press'` compõe com `Clickable`. Ver **RFC-0036**.

### 🔴 `style={{}}` para CSS coberto pelo engine — sweep R9-P1

| Componente | Hits aproximados |
|---|---:|
| Tabs (web + native) | ~14 |
| Card (web) | ~5 |
| Avatar / AvatarGroup | ~3 |
| Accordion (web + native) | ~6 |

Pattern já estabelecido pelos sweeps R7/R8. **Pré-requisito de qualquer redesign de variant** — reduz superfície a refatorar. Ver **TD-036**.

### 🔴 `AccordionRootProps.value: string | string[]` independente de `type`

Mesmo anti-pattern que **RFC-0033 (Chip-Selectable)** já normou via discriminated union. `onValueChange` recebe união e força narrowing no consumidor. Ver **RFC-0037**.

### 🟡 Tabs `variant: 'pill'` declarado mas não implementado — dead surface

```ts
// TabsListProps
variant?: 'underline' | 'pill';
```

Só `underline` existe. `pill` é ghost no contrato público. Soma-se a `src/components/tabs/slots/` vazio. Ver **TD-039** + **RFC-0038**.

### 🟡 Tag `@platform native-ready` (não-canônico) em interfaces

Ocorre em `AccordionProps.ts` e `TabsProps.ts`. Canônicos: `shared|web|native`. Sweep mecânico. Ver **TD-037**.

### 🟡 SP-1 incompleto em compounds R9

| Componente | Prop | Estado |
|---|---|---|
| Card | `padding` | `'none' \| 'small' \| 'medium' \| 'large'` (sem `xsmall`/`xlarge`) |
| Tabs | `size` | `'small' \| 'medium'` (sem `xsmall`/`large`/`xlarge`) |

RFC-0031 não cobriu Card/Tabs porque o vocabulário deles já parecia "novo" (não-`sm/md`), mas está incompleto vs. `xsmall→xlarge`. Resolvido pelas RFCs de cada componente.

### 🟡 Sem slot recipe em compounds R9 com variantes

Avatar / Card / Tabs / Accordion são compounds com sizes/variantes mas todos hardcodam estilo no componente. Tag/Chip já passaram por isso na RFC-0034 (TD-034 entregue). Mesma transformação cabe aqui. Tratado dentro de cada RFC (0035/0036/0037/0038).

---

## 2. Patterns sistêmicos R9

| # | Pattern | Onde | Endereçado por |
|---|---|---|---|
| **R9-P1** | `style={{}}` para CSS coberto pelo engine | Tabs, Card, Avatar, Accordion (~30 hits) | TD-036 |
| **R9-P2** | `@platform native-ready` (não-canônico) | Accordion, Tabs interfaces | TD-037 |
| **R9-P3** | `HTMLAttributes`/`ButtonHTMLAttributes`/`ImgHTMLAttributes` em `@platform shared` | todos os 4 | TD-028 (escopo amplia) |
| **R9-P4** | Hover/active CSS hardcoded no provider global | Card | TD-038 |
| **R9-P5** | Discriminated union ausente em `type/mode` | Accordion `value` | RFC-0037 |
| **R9-P6** | Variants ghost / dead surface | Tabs `pill`, `tabs/slots/` | TD-039 |
| **R9-P7** | SP-1 incompleto | Card.padding, Tabs.size | RFC-0036 + RFC-0038 |
| **R9-P8** | Sem slot recipe em compound multivariante | todos os 4 | RFC-0035..0038 |
| **R9-P9** | Image cross-platform via `<Box as="img">` | Avatar | RFC-0035 |
| **R9-P10** | JSDoc promete a11y não implementada (Home/End) | Accordion, Tabs | RFC-0037, RFC-0038 |
| **R9-P11** | `useTheme().colors.X` lendo cor crua em vez de prop `color` | Tabs (web+native), Accordion native, Avatar group | TD-036 (estendido) |
| **R9-P12** | Margin negativa / overlap hardcoded | AvatarGroup overlap, CardMedia bleed | TD-036 + RFC-0036 |

---

## 3. RFCs derivadas (Draft)

| # | Tema | Bloqueio principal |
|---|---|---|
| [RFC-0034](../rfcs/RFC-0034-carousel.md) | Carousel canônico | Cenários e-commerce/landing sem componente |
| [RFC-0035](../rfcs/RFC-0035-avatar-cross-platform.md) | Avatar cross-platform | `AvatarImage` DOM-only, `sizes.avatar.*` themable |
| [RFC-0036](../rfcs/RFC-0036-card-slot-recipe.md) | Card slot recipe + behavior split + .native | CD-Bug-1/2/3, identidade vs comportamento, hover themable |
| [RFC-0037](../rfcs/RFC-0037-accordion-api-canonica.md) | Accordion API canônica | discriminated union por `type`, slot recipe, Home/End |
| [RFC-0038](../rfcs/RFC-0038-tabs-api-canonica.md) | Tabs API canônica + slot recipe | `pill` implementado/removido, SP-1, Home/End, foco visível |

## 4. TDs novas

| ID | Título | Severidade |
|---|---|---|
| TD-035 | Carousel inexistente — pendente RFC-0034 | Média |
| TD-036 | Sweep `style→props` em R9 (~30 hits) | Média (DX + theming) |
| TD-037 | Tag `@platform native-ready` → `shared` em interfaces | Baixa (cleanup) |
| TD-038 | Card hover/clickable CSS sai do provider para recipe + tokens | Média (theming) |
| TD-039 | Limpeza de dead surface: Tabs `pill`, `tabs/slots/` vazio | Baixa (cleanup) |

---

## 5. Plano de execução recomendado

Mesma estratégia de R7/R8: TDs mecânicas primeiro para estabilizar a superfície antes das RFCs grandes.

1. **9.A (TDs mecânicas)** — TD-037 + TD-039. Janela única, ~1h.
2. **9.B (sweep style→props)** — TD-036. Antes de qualquer redesign de variant. Possível split em 2 sub-PRs (Tabs primeiro por ser o pior).
3. **TD-038 (Card global CSS → recipe + tokens)** — quick win independente; pode rodar em paralelo com 9.B se Card sweep ficar para a RFC-0036.
4. **RFC-0034 sondagem (Carousel)** — escrita do spec em paralelo às TDs mecânicas; não bloqueia nada.
5. **RFC-0036 (Card)** — maior payoff (recipe + .native + bleed + SP-1 + behavior split + remoção do CSS global).
6. **RFC-0037 (Accordion)** — discriminated union + slot recipe + Home/End.
7. **RFC-0038 (Tabs)** — slot recipe + SP-1 + variant pill + Home/End.
8. **RFC-0035 (Avatar)** — última: depende do Image do DS (já existe via RFC-0011/0012).
9. **RFC-0034 implementação Carousel** — só depois de R9 fechado, sobre base estável.

### Critérios de aceite do gate R9

- [x] 5 reviews registradas (este consolidado).
- [x] 5 RFCs Draft em `docs/rfcs/`.
- [x] TD-035..TD-039 abertas em `docs/TECH_DEBT.md`.
- [ ] 0 hits novos de `style={{...}}` para CSS coberto pelo engine em components R9 (após TD-036).
- [ ] 0 ocorrências de `@platform native-ready` no repo (após TD-037).
- [ ] Bateria continua verde após cada sub-onda.
