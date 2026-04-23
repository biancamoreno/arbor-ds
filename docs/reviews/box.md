# Review — `Box`

**Fase:** R2 · **Camada:** `core` · **Status:** `concluído`
**Revisor:** arquiteto · **Data:** 2026-04-22 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:** `src/components/core/box/core/box.tsx`, `src/components/core/box/interfaces/BoxProps.ts`
- **Story:** `src/components/core/box/core/box.stories.tsx`
- **Testes:** `src/components/core/box/core/box.test.tsx`
- **Implementação nativa:** não necessária — `ArborTransform` já resolve por plataforma via `styled` adapter.
- **Classificação cross-platform:** `universal` (web + native por delegação ao `ArborTransform`).
- **Dependências internas:** `ArborTransform`.
- **Consumidores conhecidos:** 30+ componentes do DS (Accordion, Avatar, Badge, Breadcrumb, Card, Checkbox, Chip, Field, Input, Menu, NavBar, Pagination, etc.). **É o primitive mais importante do sistema.**

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook batem | ⚠️ | Box não tem variantes (é por design), mas a story usa `style={{ padding: 16, background: '#f0f0f0', ... }}` com **valores crus** — contradiz a própria diretriz do DS. |
| 1.2 | Tokens usados são semânticos (sem valores crus) em cor, spacing, radius, tipografia, elevation, motion | ❌ | Stories inteiras ignoram o sistema de tokens (`padding: 16` em vez de `padding="tiny"`, `background: '#f0f0f0'` em vez de `backgroundColor`). Má vitrine para o primitive mais usado. |
| 1.3 | Estados visuais (default/hover/focus/disabled etc.) | N/A | Box é puramente estrutural; estados não se aplicam. |
| 1.4 | Escala de tamanhos/densidades | N/A | Box é agnóstico. |
| 1.5 | Contraste ≥ WCAG AA em `themeLight` e `themeDark` | N/A | — |
| 1.6 | Microinterações usam `transition()` | N/A | — |
| 1.7 | `usePrefersReducedMotion` | N/A | — |
| 1.8 | Ícones usam `<Icon>` do DS | N/A | — |

**Observações livres:** Box é um *passthrough* puro para `ArborTransform`. O trabalho visual é delegado. A única superfície visível pertence às stories — que precisam de reescrita para servir de referência.

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1 | Teclado | N/A | Box é estrutural por padrão. |
| 2.2 | Focus management | N/A | — |
| 2.3 | `role` correto + `aria-*` | ⚠️ | Consumo via `as="button"` ou `as="a"` expõe Box como interativo sem `role`/`tabIndex` injetados — responsabilidade do consumidor, mas **documentação atual não alerta** que use `Clickable` nesses casos. |
| 2.4 | Anúncios dinâmicos | N/A | — |
| 2.5 | Touch target ≥ 44×44 | N/A | — |
| 2.6 | Controlado × não-controlado | N/A | — |
| 2.7 | Evento cancelável | N/A | — |
| 2.8 | RTL | ⚠️ | Como passthrough, Box não força `paddingInline`/`marginInline` em detrimento de `paddingLeft`/`paddingRight`, mas o sistema suporta. Sem doc orientando consumo RTL-first. |

**Observações livres:** A prop `onClick` declarada em `BoxProps` (com doc dizendo "ignorada em native — use onPress") é um **contra-padrão**: Box não deveria receber handlers interativos diretamente. Promove anti-pattern de `<Box as="button">` sem estado/teclado de botão.

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API pública mínima; sem props redundantes | ⚠️ | Herda tudo de `ArborTransformProps` + adiciona `onClick` (problemático — ver 2.x). |
| 3.2 | Nomes seguem convenção do DS | ✅ | Alinhado com a engine. |
| 3.3 | Defaults "least surprise" | ✅ | Sem defaults. |
| 3.4 | Combinações inválidas bloqueadas via DU/tipo | N/A | Box é intencionalmente irrestrito. |
| 3.5 | Polimorfismo via `as` suportado | ✅ | Delegado ao `ArborTransform`. |
| 3.6 | `forwardRef` presente; `displayName` definido | ❌ | Não há `forwardRef`. `innerRef` existe em `ArborTransformProps`, mas é um nome não convencional para um primitive de referência. `displayName` ausente. |
| 3.7 | Compound components | N/A | — |
| 3.8 | Tipos públicos exportados | ✅ | `BoxProps` exportado. |

**Surface area atual:**

```ts
export type BoxProps<T extends object> = ArborTransformProps<T> & {
  onClick?: MouseEventHandler<HTMLElement>;
};
```

**Observações livres:**

- `BoxProps<T>` com genérico `T extends object` é um *escape* para estender props (raramente usado pelos consumidores internos — todos chamam `<Box ...>` sem type arg). Custo de DX alto, benefício marginal.
- O `onClick` adicional é **redundante** com `ArborTransformProps` (se a engine já aceita eventos DOM via spread). Remover.
- `memo(BoxComponent) as typeof BoxComponent` preserva a assinatura genérica, mas **quebra `displayName`** — devtools mostra `Memo(BoxComponent)`.

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras; usa `Box/Flex/Text/Clickable` com `as` | ✅ | Box é o primitive-base; delega a `ArborTransform`. |
| 4.2 | Sem `style={{...}}` onde há prop declarativa equivalente | ❌ | Stories violam massivamente (`padding: 16`, `background: '#f0f0f0'`, `borderRadius: 4`, `marginBottom: 8`). |
| 4.3 | Estrutura de pasta aplicada | ✅ | `core/` + `interfaces/` presentes. Sem `styles/` (não aplicável). |
| 4.4 | Estilo via `defineRecipe`/`defineSlotRecipe` | N/A | Box não tem variantes. |
| 4.5 | Sem `any`, sem cast não justificado, sem `console.*` | ⚠️ | `as typeof BoxComponent` no memo é um cast conhecido para preservar generics — aceitável mas merece comentário único explicando o porquê. |
| 4.6 | Testes cobrem estados, variantes, a11y, interações | ⚠️ | Testes existem, mas muito rasos: `renders children` + `forwards testID`. **Faltam:** polimorfismo (`as="section"` renderiza tag certa), spread de props de estilo (`padding` resolvendo token), `innerRef`, testes na web (apenas RN testing library). |
| 4.7 | Story cobre default, variantes, estados, playground, exemplo composto | ⚠️ | Tem Default, AsSection, Nested. **Faltam:** exemplo usando props declarativas do DS (`padding="medium"`, `backgroundColor="semantic.surface.subtle"`), caso `innerRef`, caso responsivo. |
| 4.8 | `.native.tsx` presente (se universal) ou platform-split justificado | ✅ | Não necessário — delegado ao `ArborTransform`. Comentário `@platform shared` presente no `BoxProps`. |
| 4.9 | Imports respeitam camadas (`foundations → ecosystem → components`) | ✅ | Import via `'../../../../ecosystem'`. |

**Métricas rápidas:**

- LOC do componente: **9**
- Nº de testes: **2**
- Nº de stories: **3**
- Dependências externas de runtime: **0**

**Observações livres:**

- Teste usa `@testing-library/react-native` mas Box é renderizado para web no Storybook com tags HTML cruas no style. **Inconsistência de ambiente de teste:** deveria existir cobertura tanto no renderer web quanto native.
- `memo` em um componente quase-puro (só um JSX) é **questionável** — a engine abaixo já faz seu próprio controle. Benefício mensurado? Se não, remover simplifica o tipo e mata o cast.

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público em `src/components/index.ts` | ✅ | `src/components/core/index.ts` re-exporta `./box`. |
| 5.2 | Tipos públicos exportados | ✅ | `BoxProps` disponível. |
| 5.3 | Changeset entry | N/A | Sem mudança proposta nesta review. |
| 5.4 | RFC para breaking change | N/A | — |
| 5.5 | Guia de migração | N/A | — |

**Observações livres:** Box é o primitive de referência do DS. Sua API e DX definem o teto do sistema — merece nível de cuidado superior ao atual.

---

## 6. Resumo executivo

**Score por eixo:** Visual `2/8` (N/A majoritário) · Comportamental `0/8` (N/A majoritário, 2 ⚠️) · Funcional `5/8` · Código `3/9` · Governança `2/5`

**Top 3 achados (por impacto):**

1. **`onClick` em `BoxProps` é anti-pattern** — redireciona consumidor para usar Box como interativo em vez de `Clickable`. Deveria ser removido; consumidor que precisa de evento de ponteiro em um elemento estrutural passa via spread de eventos DOM ou, melhor, troca para `Clickable`.
2. **Stories e testes violam as próprias regras do DS** — `style={{ padding: 16, background: '#f0f0f0' }}` em *stories do primitive-base* é contraditório e cria referência ruim. Reescrever usando `padding="tiny"`, `backgroundColor="..."`, etc.
3. **Falta `forwardRef` formal** — `innerRef` no `ArborTransformProps` resolve, mas o contrato canônico de React em componentes de library é `forwardRef`. Alinhar com a norma reduz atrito para consumidores externos.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [x] ⚠️ Aprovado com fixes menores (listados abaixo)
- [ ] ❌ Requer mudanças antes da próxima release

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review)

- [ ] Reescrever `box.stories.tsx` sem `style={{...}}` — usar props declarativas (`padding`, `backgroundColor`, `borderRadius`).
- [ ] Remover `onClick` de `BoxProps` (passar via spread, se necessário, é responsabilidade do consumidor; o uso interativo canônico é `Clickable`).

### Issue (mudança localizada, sem breaking change)

- [ ] Adicionar `displayName = 'Box'` e testes de polimorfismo (`as="section"`, `as="a"`).
- [ ] Cobertura de teste para web (além de react-native-testing-library) — configuração pode ficar em R13 se exigir jest env split.
- [ ] Adicionar story de uso responsivo: `padding={{ base: 'tiny', md: 'medium' }}`.

### RFC (sistêmico ou breaking change)

- [ ] **RFC — `ref` forwarding canônico.** Migrar de `innerRef` (ArborTransform) para `forwardRef<HTMLElement | View, ...>` em todos os primitives. Afeta Box/Flex/Grid/Container/Center/Square/Circle/Spacer. Breaking, mas com codemod viável (`innerRef` → `ref`).
- [ ] **RFC — Genéricos em primitives.** Decidir se `BoxProps<T>` (e paralelos em Center/Square/Circle) paga o custo de DX. Se os consumidores internos nunca usam o type arg, simplificar para `BoxProps` elimina a necessidade de `memo(...) as typeof BoxComponent` e alivia a tipagem.

---

## 8. Notas de arquiteto

- Box é o **teste de acidez do sistema de props**: se consumidores não escrevem Box com tokens declarativos, é sinal de que o autocomplete / a documentação falham. A situação das stories hoje sugere o segundo — precisa de material de referência explícito.
- A decisão de manter `<Box as="ul">`, `<Box as="li">`, etc. como substitutos de tags HTML cruas (CLAUDE.md) é clara, mas **não há teste automático bloqueando o anti-pattern**. Um ESLint rule custom (`no-raw-html-in-components`) pagaria dívida recorrente detectada em R1 e aqui.
- `onClick` em Box é sintoma de *drift* histórico — quando `Clickable` não existia, Box supria o papel. Hoje é legado. Remover alinha a API com o estado atual do DS.
