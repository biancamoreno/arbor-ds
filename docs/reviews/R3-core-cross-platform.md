# R3 — Consolidação: Core Cross-Platform Primitives

**Fase:** R3 · **Data:** 2026-04-23 · **Status:** concluído

Componentes revisados: [`Text`](./text.md) · [`Clickable`](./clickable.md) · [`Icon`](./icon.md) · [`Image`](./image.md)

---

## Scores por componente

| Componente | Visual | Comportamental | Funcional | Código | Governança | Classificação |
|---|---|---|---|---|---|---|
| Text | 3/8 | 4/8 | 5/8 | 4/9 | 4/5 | ❌ requer fixes |
| Clickable | 3/8 | 4/8 | 6/8 | 4/9 | 4/5 | ❌ requer fixes |
| Icon | 5/8 | 8/8 | 6/8 | 7/9 | 4/5 | ⚠️ fixes menores |
| Image | 3/8 | 4/8 | 3/8 | 4/9 | 4/5 | ❌ requer fixes |

---

## Achados transversais (cross-cutting)

### CR3-1 — Ausência quase universal de `displayName`

`Text`, `Icon` e `Image` não definem `displayName`. `Clickable` define `forwardRef` mas também omite `displayName`. Em árvores de componentes compostos (ex: `Button > Clickable > Flex`), o React DevTools mostrará nomes genéricos (`ForwardRef`, `Component`) em vez dos nomes reais.

**Impacto:** debug lento, onboarding difícil, inconsistência com `Box`, `Flex` e outros primitives de R2.
**Ação:** fix imediato em todos os 4 componentes.

---

### CR3-2 — Testes ausentes em 3 de 4 componentes

`Clickable`, `Text` e `Image` têm zero testes. `Icon` tem 10 testes (o único da fase com cobertura). Para primitivos que são base de todo o DS, essa é a dívida técnica mais urgente.

| Componente | Testes | Comentário |
|---|---|---|
| Text | 0 | Sem cobertura de variantes, truncamento, HTML parsing |
| Clickable | 0 | Sem cobertura de click, ref, TapState |
| Icon | 10 | Boa cobertura de a11y, render, props |
| Image | 0 | Sem cobertura de dual render, resizeMode, onError |

**Ação:** issues separadas por componente.

---

### CR3-3 — Stories violam padrão do CLAUDE.md (herdado de R2-CR2-2)

Stories de `Text`, `Icon` e `Image` usam `<div style={{...}}>` e `<span style={{...}}>` diretamente. Isso foi identificado em R2 como `CR2-2` e persiste em R3. O problema não é apenas estético — stories são a documentação viva do DS e ensinam padrões aos consumidores.

**Ação:** fix imediato em todas as stories afetadas; substituir por `<Box>`, `<Flex>`, `<Text>` com props declarativas.

---

### CR3-4 — Invariantes vazáveis por ordem de spread invertida

`Clickable` sofre do mesmo problema documentado em R2-CR2-1: invariantes (`cursor`, `border`, `display`) definidos **antes** do spread de props, permitindo que consumidores os sobrescrevam.

**Ação:** fix imediato — inverter ordem para invariantes após `{...props}`.

---

### CR3-5 — Ausência de `forwardRef` em `Text` e `Image`

`Clickable` tem `forwardRef` (correto). `Text` e `Image` não têm. Sem ref externo, é impossível:
- Rolar até um campo de texto com erro programaticamente
- Medir dimensões de uma imagem após render
- Integrar com libs de animação que precisam de ref ao DOM

`Icon` não precisa de `forwardRef` (primitivo SVG puro, sem caso de uso de ref direto).

**Ação:** issue para `Text` e `Image`.

---

## RFCs abertas pela fase R3

| RFC | Título | Componente | Impacto |
|---|---|---|---|
| RFC-R3-A | `isTruncated` como prop consolidada com `numberOfLines` | Text | breaking se removida |
| RFC-R3-B | Tipagem de retorno de `useRecipe` com genérico | Text + outros | sistêmico |
| RFC-R3-C | `tapState` como prop vs. slot composto em Clickable | Clickable | breaking |
| RFC-R3-D | Tamanhos semânticos (`IconSize`) para `Icon.size` | Icon | breaking nos consumidores |
| RFC-R3-E | Discriminated union `decorative` + `aria-label` em Icon | Icon | breaking |
| RFC-R3-F | Modo de renderização explícito em Image (`mode: 'img' \| 'background'`) | Image | breaking |
| RFC-R3-G | Estados de loading e error com UI padrão em Image | Image | aditivo |

---

## Issues abertas pela fase R3

(Ordenadas por urgência)

1. Testes para `Text` — variantes, truncamento, HTML parsing, a11y
2. Testes para `Clickable` — click, ref, TapState, keyboard
3. Testes para `Image` — dual render, resizeMode, onError/onLoad
4. Stories para variantes tipográficas do `Text` (20+ variantes sem Storybook)
5. Stories para `Clickable` — default, TapState, polimórfico, disabled
6. Fix `lineHeight` hardcoded (`'20px'`) na recipe de `Text`
7. `role?: React.AriaRole` em `TextProps` (em vez de `string`)
8. Testes RN para `icon.native.tsx`
9. Stories faltantes em `Image` (`center`, `stretch`, `onError`)
10. `onError`/`onLoad` com assinaturas corretas por plataforma (web vs. RN)

---

## Definition of Done — R3

- [x] Todos os 4 componentes têm `docs/reviews/<nome>.md` preenchido (5 eixos)
- [ ] Todos os achados `❌` viraram PR merged ou RFC aberto
- [ ] Todos os achados `⚠️` têm issue aberta e rotulada (`review:R3`)
- [ ] `pnpm test` verde
- [ ] Storybook build verde

---

## Padrões emergentes — candidatos a CONTRIBUTING

1. **`displayName` é obrigatório em todo componente público** — incluindo os sem `forwardRef`.
2. **Invariantes de componente vêm depois do spread de props** — padrão confirmado em R2-CR2-1, reincidente em R3-CR3-4.
3. **Stories usam apenas componentes do DS** — `Box`, `Flex`, `Text`, `Clickable`; sem `<div>`, `<span>`, `<button>` crus; sem `style={{...}}` onde há prop declarativa.
4. **Componentes `platform-split` têm warning de dev para limitações de plataforma** — ex: `Icon.native` avisa sobre `currentColor`; `Text.native` deveria avisar sobre HTML string.
