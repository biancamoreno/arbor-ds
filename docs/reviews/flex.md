# Review — `Flex`

**Fase:** R2 · **Camada:** `core` · **Status:** `concluído`
**Revisor:** arquiteto · **Data:** 2026-04-22 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:** `src/components/core/flex/core/flex.tsx`, `src/components/core/flex/interfaces/FlexProps.ts`
- **Story:** `src/components/core/flex/core/flex.stories.tsx`
- **Testes:** **ausentes**.
- **Implementação nativa:** não necessária — delegação ao `ArborTransform`.
- **Classificação cross-platform:** `universal`.
- **Dependências internas:** `ArborTransform`.
- **Consumidores conhecidos:** 30+ componentes do DS (Accordion, Alert, Avatar, Badge, Breadcrumb, ButtonGroup, Card, Checkbox, Chip, Clickable, Dialog, Drawer, Field, Input, Menu, NavBar, Pagination, TabBar, Tabs, Toast, Tooltip, ...).

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook batem | N/A | Flex não tem variantes. |
| 1.2 | Tokens usados são semânticos (sem valores crus) | ❌ | Stories (`Row`, `Column`, `Centered`, `SpaceBetween`) escrevem `style={{ gap: 8, padding: 16, height: 120, background: '#f5f5f5' }}` — ignora o sistema de props. Pior: stories em `<Flex>` passam `flexDirection` via `style`, enquanto a própria prop `flexDirection` existe na engine. |
| 1.3 | Estados visuais | N/A | — |
| 1.4 | Escala de tamanhos/densidades | N/A | — |
| 1.5 | Contraste | N/A | — |
| 1.6 | Microinterações usam `transition()` | N/A | — |
| 1.7 | `usePrefersReducedMotion` | N/A | — |
| 1.8 | Ícones usam `<Icon>` do DS | N/A | — |

**Observações livres:** a Story interna cria um `Item` usando `<div style={{ padding: '8px 16px', background: '#4a90e2', color: '#fff', borderRadius: 4 }}>` — tag HTML crua em arquivo do DS (mesmo que de demo). Reforça o padrão que o CLAUDE.md proíbe.

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1–2.8 | — | N/A | Flex é puramente estrutural. |

**Observações livres:** a prop `onClick` herdada via `FlexProps` carrega o mesmo anti-pattern que Box (incentiva `<Flex as="button">` em lugar de `Clickable`).

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API pública mínima; sem props redundantes | ⚠️ | Flex aceita `flexDir` **e** `flexDirection`, com regra de precedência: `flexDir !== undefined ? flexDir : flexDirection`. **Dois nomes para a mesma prop**. |
| 3.2 | Nomes seguem convenção do DS | ⚠️ | `flexDir` (abreviação estilo chakra) e `flexDirection` coexistem. DS precisa escolher uma. |
| 3.3 | Defaults "least surprise" | ⚠️ | `flexDirection = 'row'` é convenção web mas diverge de React Native (onde default é `column`). Flex do Arbor força `row` em ambas as plataformas — decisão legítima, mas **não documentada**. |
| 3.4 | Combinações inválidas bloqueadas via DU/tipo | N/A | — |
| 3.5 | Polimorfismo via `as` | ✅ | Passthrough. |
| 3.6 | `forwardRef` presente; `displayName` definido | ❌ | Mesma ausência de Box. |
| 3.7 | Compound components | N/A | — |
| 3.8 | Tipos públicos exportados | ✅ | `FlexProps`. |

**Surface area atual:**

```ts
export type FlexProps = ArborTransformProps & {
  onClick?: MouseEventHandler<HTMLElement>;
};
```

(note: `FlexComponent` é genérico `<T extends object>` em runtime, mas `FlexProps` exportado **não** é genérico — inconsistência entre o tipo público e a assinatura interna.)

**Observações livres:**

- `{ flexDir, flexDirection = 'row' } = props` — desestrutura sem repassar. Depois espalha `{...props}` que já **contém** ambas as props cruas e depois sobrescreve `flexDirection`. Resultado semanticamente correto, mas frágil: se um futuro refactor mudar a ordem dos spreads, os valores viajam fantasmas.
- Prop `display="flex"` vem **antes** de `{...props}` — um consumidor que passe `display="grid"` **sobrescreve** a promessa semântica do Flex. Em um primitive chamado `Flex`, isso é bug latente.

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ⚠️ | Source OK; **stories usam `<div>` interno** (componente `Item`). |
| 4.2 | Sem `style={{...}}` onde há prop declarativa | ❌ | Stories usam `style` para `gap`, `padding`, `flexDirection`, `justifyContent`, etc. — tudo com prop declarativa disponível. |
| 4.3 | Estrutura de pasta aplicada | ✅ | `core/` + `interfaces/`. |
| 4.4 | Recipes | N/A | — |
| 4.5 | Sem `any`, cast injustificado, `console.*` | ⚠️ | Cast `as typeof FlexComponent` no memo, mesmo padrão do Box. |
| 4.6 | Testes cobrem estados, variantes, a11y, interações | ❌ | **Nenhum teste.** Para o segundo primitive mais consumido do DS é um gap grave. |
| 4.7 | Story cobre default, variantes, estados, playground, exemplo composto | ⚠️ | 4 stories, mas todas rodam de costas para o sistema de tokens. |
| 4.8 | `.native.tsx` ou platform-split justificado | ✅ | Delegado ao `ArborTransform`. |
| 4.9 | Imports respeitam camadas | ✅ | — |

**Métricas rápidas:**

- LOC: **10**
- Nº de testes: **0**
- Nº de stories: **4**
- Dependências externas de runtime: **0**

**Observações livres:**

- Por ser `Flex`, faz sentido que o componente **force** `display="flex"` e **impeça** `display` customizado — ou então o consumidor deveria usar Box. A ordem atual dos spreads vaza esse contrato.

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público em `src/components/index.ts` | ✅ | |
| 5.2 | Tipos públicos exportados | ✅ | |
| 5.3 | Changeset entry | N/A | |
| 5.4 | RFC para breaking change | N/A | |
| 5.5 | Guia de migração | N/A | |

---

## 6. Resumo executivo

**Score por eixo:** Visual `0/8` (N/A + 1 ❌) · Comportamental `—` · Funcional `3/8` · Código `3/9` · Governança `2/5`

**Top 3 achados (por impacto):**

1. **Prop duplicada `flexDir` × `flexDirection`** — cria duas APIs para a mesma semântica. Autocomplete confunde; revisões futuras terão que escolher uma. Recomendação: depreciar `flexDir` (manter por 1 ciclo com console.warn) e manter `flexDirection`.
2. **`display="flex"` é sobrescritível** pelo spread de props — contrato do componente é contornável. Ordem dos spreads precisa inverter: props do usuário primeiro, `display="flex"` por último.
3. **Zero testes** em um primitive consumido por 30+ componentes.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [x] ⚠️ Aprovado com fixes menores (listados abaixo)
- [ ] ❌ Requer mudanças antes da próxima release

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review)

- [ ] Inverter ordem dos spreads em `flex.tsx` — props do usuário primeiro, depois `display="flex"` e `flexDirection` resolvido, garantindo que não são sobrescritos.
- [ ] Reescrever `flex.stories.tsx` sem `style={{...}}` e sem `<div>` — usar `<Box>` como item demo.
- [ ] Adicionar testes básicos (renderização, default direction, gap token, `as`).

### Issue

- [ ] Documentar explicitamente no JSDoc que Flex força `display='flex'` e default é `flexDirection='row'` também em RN (por consistência cross-platform).
- [ ] Remover `onClick` de `FlexProps` (mesmo motivo do Box).
- [ ] Adicionar `displayName = 'Flex'`.

### RFC

- [ ] **RFC — Alias de props duplicadas (`flexDir`/`flexDirection`, `borders`/`borderWidths`, `space`/`spacing`).** Escolher canonical e depreciar aliases em onda coordenada. Foi apontado em R1 (H8).
- [ ] **RFC — `ref` forwarding canônico** (compartilhado com Box).

---

## 8. Notas de arquiteto

- A dupla `flexDir`/`flexDirection` é um **anel temporal**: veio de influência `chakra/styled-system` (que usa abreviações). No contexto do Arbor — que já optou por convenções longas noutros lugares (`paddingInline`, `backgroundColor`) — é incoerência. Consolidar.
- Flex é o **candidato natural** para ganhar uma prop semântica `direction: 'row' | 'column' | 'row-reverse' | 'column-reverse'` sem o prefixo `flex`, se o time quiser reduzir ruído. Avaliar num RFC próprio.
- A ordem dos spreads é um padrão que aparece de novo em Grid, Center, Square — precisa ser inspecionado de forma uniforme.
