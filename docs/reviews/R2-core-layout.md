# R2 — Consolidação: Core Layout Primitives

**Fase:** R2 · **Escopo:** `src/components/core/{box,flex,grid,container,center,square,circle,spacer,empty}` · **Data:** 2026-04-22
**Status:** concluído · **Revisor:** arquiteto

---

## 0. Escopo auditado

9 componentes, todos em `src/components/core/`:

| Componente | LOC | Stories | Testes | Props interface | `.native.tsx` |
|---|---:|---:|---:|---|---|
| **Box** | 9 | 3 | 2 | ✅ `BoxProps<T>` | delegado |
| **Flex** | 10 | 4 | **0** | ✅ `FlexProps` | delegado |
| **Grid** | 26 + 5 | 2 | **0** | **❌ ausente** | ✅ |
| **Container** | 33 | **0** | **0** | ✅ `ContainerProps` | delegado |
| **Center** | 13 | **0** | **0** | ✅ `CenterProps<T>` | delegado |
| **Square** | 23 | **0** | **0** | ✅ `SquareProps<T>` | delegado |
| **Circle** | 6 | **0** | **0** | ✅ `CircleProps<T>` | N/A (compõe Square) |
| **Spacer** | 6 | **0** | **0** | ⚠️ `SpacerProps` existe mas **fora do barrel** | delegado |
| **Empty** | 2 | **0** | **0** | N/A | N/A (retorna null) |

**Total:** ~133 LOC, 9 stories, 2 testes, 9 componentes.

---

## 1. Achados sistêmicos (cross-component)

Os achados abaixo aparecem em **3+ componentes** da fase. São tratados como padrões-problema e merecem fix coordenado em vez de 9 PRs paralelos.

### 🔴 Críticos

#### CR2-1. Contratos semânticos contornáveis por ordem de spread

Em Flex, Grid, Square, Circle, Spacer o mesmo anti-pattern: defaults semânticos são definidos **antes** do spread das props do consumidor, permitindo que um `...rest` inocente neutralize a identidade do componente.

Exemplos:
- `Flex` declara `display="flex"` e é sobrescritível por `display="grid"` do consumidor.
- `Circle` declara `borderRadius="full"` antes do spread — consumidor pode passar `borderRadius` e desfazer o círculo.
- `Spacer` declara `flex={1}` antes do spread — consumidor pode passar `flex={0}` e quebrar o Spacer.
- `Square` declara `alignItems/justifyContent: center` antes do spread (quando `centerContent=true`) — sobrescritível.

**Padrão correto** (já aplicado em `Center`): espalhar o `...props` primeiro, aplicar as **invariantes** do componente depois. O `Omit<ArborTransformProps, 'propsControladas'>` complementa a blindagem na tipagem.

**Ação:** normalizar em fix imediato. Convenção oficial a registrar no CONTRIBUTING: *"defaults primeiro, props do usuário no meio, invariantes por último."*

#### CR2-2. Stories do DS ignoram o próprio sistema de props

Em `box.stories.tsx`, `flex.stories.tsx` e `grid.stories.tsx`, stories escrevem `style={{ padding: 16, background: '#f0f0f0', gap: 8, borderRadius: 4 }}` e usam `<div>` cru para items de demonstração. Isso:
- Viola CLAUDE.md (proibição explícita de tags HTML cruas e de `style` onde há prop declarativa).
- Dá **péssima referência** para consumidores: a primeira impressão de como usar Box é via `style={{...}}`.
- Torna a biblioteca menos auditável por lint (se algum dia for introduzido).

**Ação:** reescrever as 3 stories substituindo `<div>` por `<Box>`, `style={{...}}` por props declarativas, e valores crus por tokens semânticos. Incluir pelo menos 1 story usando tokens responsivos (`padding={{ base: 'tiny', md: 'medium' }}`) para servir de referência canônica.

#### CR2-3. Container tem bug de resolução de `maxWidth` + token inválido

- `paddingInline="md"` — `"md"` não está no semantic layer de spacing (R1 §1.2 lista `none/nano/micro/tiny/small/medium/...`). Container roda hoje sem padding horizontal confiável.
- `breakpoints?.[Number(props.maxWidth)]` — `Number("md") === NaN`. Todo o path de `maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl'` tipado retorna `undefined`. Feature anunciada não funciona.

**Ação:** fix imediato em `container.tsx` + teste de regressão. Não depende de outro achado.

### 🟡 Altos

#### H-R2-1. Falta universal de `forwardRef` e `displayName`

9 de 9 primitives não têm `forwardRef` canônico nem `displayName`. Consumidores externos que precisem de `ref` dependem da prop ad-hoc `innerRef` (do `ArborTransform`), que não é a convenção React/lib. Devtools mostra `Memo(BoxComponent)` em vez de `Box`.

**Ação:** **RFC** transversal (anexar ao RFC já existente de primitives). Escopo: Box, Flex, Grid, Container, Center, Square, Circle, Spacer. Migração codemod-viável (`innerRef` → `ref`). Breaking.

#### H-R2-2. Ausência sistemática de testes

7 de 9 primitives sem teste (Grid, Container, Center, Square, Circle, Spacer, Empty, Flex). Apenas Box tem 2 testes rasos. Primitives consumidos internamente por 30+ componentes **não têm rede de segurança**.

**Ação:** criar testes mínimos por componente junto com o fix imediato de cada um. Cobertura alvo: renderização, contrato de props-invariantes, `as`, `testID`/`ref`, casos de composição específicos (Circle compõe Square, Spacer dentro de Flex).

#### H-R2-3. Ausência sistemática de stories (6 de 9)

Container, Center, Square, Circle, Spacer, Empty não têm story. Um consumidor abrindo o Storybook não enxerga 2/3 da fase R2.

**Ação:** criar stories mínimas cobrindo o default + 1 caso composto por primitive.

#### H-R2-4. Genéricos `<T extends object>` em primitives

Box, Center, Square, Circle usam `Props<T extends object>`. Consumidores internos nunca passam o type arg — puro custo de DX (autocomplete com extra "click", cast `as typeof Component` obrigatório no `memo`). Valor semântico não demonstrado.

**Ação:** **RFC** — avaliar remover generics dos primitives. Se ficarem, documentar casos de uso concretos.

#### H-R2-5. Props duplicadas: `flexDir` × `flexDirection`

Flex aceita ambas. Mesmo padrão apontado em R1 (H8: `borders/borderWidths`, `space/spacing`).

**Ação:** **RFC — Consolidação de aliases de props.** Agrupa esta com as de R1. Breaking coordenado.

### 🟢 Menores

#### M-R2-1. Spacer tem barrel quebrado

`src/components/core/spacer/index.ts` não exporta `./interfaces`. `SpacerProps` não chega ao consumidor via import de barrel.

**Ação:** fix imediato (1 linha).

#### M-R2-2. Grid não tem `interfaces/`

Único primitive de R2 sem pasta de tipos. Precisa ser criada para consistência.

#### M-R2-3. `onClick` em Box/Flex

Herança histórica de quando `Clickable` não existia. Redireciona consumidor para usar primitive estrutural como interativo — anti-pattern documentado no CLAUDE.md.

**Ação:** issue — remover da tipagem.

#### M-R2-4. `memo(Component) as typeof Component`

Cast recorrente em Box/Flex para preservar genéricos após `memo`. Se o RFC de H-R2-4 remover os genéricos, o cast some junto. Se não, manter mas comentar.

#### M-R2-5. Empty é componente fantasma

Renderiza `null`, sem consumidor, sem propósito documentado, nome colide com padrão "EmptyState" do mercado. **Requer decisão de produto** (remover / renomear / reimplementar como compound).

#### M-R2-6. Contrato falso do Grid em React Native

`.native.tsx` aceita `templateColumns`, `templateAreas` etc. na tipagem mas ignora em runtime. Silent-fail cross-platform.

**Ação:** RFC (ver abaixo).

---

## 2. Padrões emergentes a cristalizar

Padrões que apareceram repetidos e merecem virar convenção oficial (CONTRIBUTING.md):

### 2.1 Ordem de spread em primitives com contrato semântico

```tsx
// ❌ Antipattern (Flex, Circle, Spacer, Square atuais)
<ArborTransform display="flex" {...props} />

// ✅ Correto (Center atual)
<ArborTransform {...props} display="flex" />
```

Para cada invariante do componente (coisas que **não** devem poder ser desfeitas pelo consumidor), a prop vai **depois** do spread. Complementar com `Omit<...>` na tipagem quando possível.

### 2.2 Omit das props que o componente controla

Pattern de `Center` e `Square`:

```ts
export type CenterProps<T> = Omit<ArborTransformProps<T>, 'display' | 'alignItems' | 'justifyContent'>;
```

Torna impossível passar `alignItems="flex-start"` em um Center — o tipo acusa. É proteção em compile-time, complementar à ordem de spread em runtime.

### 2.3 `.native.tsx` só quando há divergência real

Dos 9 primitives, apenas Grid tem `.native.tsx` — justificado (CSS Grid não existe em RN). Os demais delegam ao `ArborTransform` que resolve por plataforma internamente. Nenhum outro precisa. **Padrão:** só criar `.native.tsx` quando a API do primitive exige ramificação visível.

### 2.4 `displayName` obrigatório em todo componente exportado

Nenhum dos 9 primitives tem. Devtools e logs ficam opacos. Fix trivial.

---

## 3. Achados por componente (resumo)

Links para os reviews completos:

- [Box](./box.md) — ⚠️ Aprovado com fixes menores. Stories e `onClick` precisam de limpeza.
- [Flex](./flex.md) — ⚠️ Fixes menores. Ordem de spread, `flexDir` duplicado, zero teste.
- [Grid](./grid.md) — ⚠️ Fixes menores. Sem `GridProps`; contrato falso em RN.
- [Container](./container.md) — ❌ **Bug crítico** (`"md"` + path de string) + API restritiva.
- [Center](./center.md) — ⚠️ Fixes menores. É o padrão-ouro; falta story e teste.
- [Square](./square.md) — ⚠️ Fixes menores. Ordem de spread do `centerContent` invertida.
- [Circle](./circle.md) — ⚠️ Fixes menores. Ordem de spread do `borderRadius="full"`.
- [Spacer](./spacer.md) — ⚠️ Fixes menores. Barrel quebrado + cast desnecessário.
- [Empty](./empty.md) — ❌ **Requer decisão**: remover, renomear ou reimplementar como compound.

---

## 4. Follow-ups consolidados

### 4.1 Fix imediato (1 PR — alta alavancagem)

**Título sugerido:** `refactor(core): fix invariantes de primitives R2 + stories com tokens`

- [ ] Inverter ordem de spread em Flex, Grid, Square, Circle, Spacer. (CR2-1)
- [ ] Corrigir Container: `paddingInline="medium"` + `breakpoints?.[props.maxWidth]` (remover `Number(...)`). (CR2-3)
- [ ] Exportar `./interfaces` em `src/components/core/spacer/index.ts`. (M-R2-1)
- [ ] Criar `src/components/core/grid/interfaces/GridProps.ts` + exports. (M-R2-2)
- [ ] Adicionar `displayName` em todos os 9 primitives.
- [ ] Reescrever `box.stories.tsx`, `flex.stories.tsx`, `grid.stories.tsx` sem `style={{...}}` e sem `<div>` interno. (CR2-2)
- [ ] Remover cast `as Record<string, unknown>` em Spacer (ajustar tipagem).

### 4.2 Issues (localizadas, sem breaking)

- [ ] Criar stories faltantes: Container, Center, Square, Circle, Spacer. (H-R2-3)
- [ ] Criar testes faltantes: Flex, Grid (web + native), Container, Center, Square, Circle, Spacer. (H-R2-2)
- [ ] Adicionar regressão específica para Container bug de `maxWidth: string`.
- [ ] Remover `onClick` de `BoxProps` e `FlexProps`. (M-R2-3)
- [ ] Promover `fluid`/`maxWidth` de Container a discriminated union.
- [ ] Extrair `resolveMaxWidth` de Container para `utils/` com testes isolados.
- [ ] Avaliar permitir `...rest` em Container (aumentar Pick).

### 4.3 RFCs (breaking/sistêmicos)

- [ ] **RFC-R2-A — `ref` canônico em primitives.** Substituir `innerRef` por `forwardRef<Element, Props>` em Box/Flex/Grid/Container/Center/Square/Circle/Spacer. Inclui codemod. (H-R2-1)
- [ ] **RFC-R2-B — Genéricos em primitives.** Decidir manter/remover `<T extends object>`. Simplifica memoização e tipagem. (H-R2-4)
- [ ] **RFC-R2-C — Consolidação de aliases.** Eleger canonical para `flexDir`/`flexDirection` (Flex), `templateColumns`/`gridTemplateColumns` (Grid), `borders`/`borderWidths`, `space`/`spacing` (R1 H8). Depreciar em onda. (H-R2-5)
- [ ] **RFC-R2-D — Grid cross-platform.** Definir surface area que funciona em RN (ex: `columns?: number | string`) e marcar o resto como web-only via DU. (M-R2-6)
- [ ] **RFC-R2-E — Empty / EmptyState.** Decidir destino do Empty: remover, renomear para sentinela, ou reimplementar como compound de empty-state UI com slots. (M-R2-5)

### 4.4 Dívida cross-cutting que vai para R13

- Lint rule custom bloqueando `<div|span|p|button|...>` em `src/components/**`.
- Lint rule custom bloqueando `style={{...}}` onde há prop declarativa equivalente (mais difícil, mas valioso).
- Convenção "defaults primeiro, props no meio, invariantes depois" registrada no CONTRIBUTING.md.

---

## 5. Critério de saída cumprido

- [x] Todos os 9 componentes têm review preenchido.
- [x] Todos os achados `❌` têm destino (fix imediato ou RFC).
- [x] Todos os achados `⚠️` têm issue prevista.
- [ ] `pnpm test` verde — **a verificar após PR de fix imediato**.
- [ ] Storybook build verde — **a verificar após PR de stories**.
- [x] Entrada em MEMORY.md — ver §7.

---

## 6. Sinais para R3 (core — cross-platform primitives)

R3 cobre `Text`, `Clickable`, `Icon`, `Image`. Herda da R2 as seguintes observações:

- **Ordem de spread / invariantes** — aplicar a mesma rubrica. Clickable em especial tem contrato semântico forte (ser interativo), merece tratamento rigoroso.
- **`forwardRef`** — Text e Clickable são os primeiros candidatos naturais a receber `ref` no DOM (para focus management, `scrollIntoView`, tooltips). RFC-R2-A precisa chegar antes ou junto.
- **`onClick` em primitives não-interativos** — se R2 remover de Box/Flex, R3 deve garantir que Clickable seja **o único** primitive core a expor `onClick` nativo.
- **Anti-pattern `<div>` em stories** — reforçar na review de R3 e nos demos internos dos próprios componentes (alguns consumidores diretos de Box já replicam o anti-pattern em outras fases).

---

## 7. Notas para memória persistente

Fatos arquiteturais não óbvios emergidos na R2, candidatos a salvar em `memory/`:

1. **Convenção "invariantes por último"** — padrão canônico para primitives com contrato semântico (descoberto em `Center`, aplicar nos demais). Fica melhor em CONTRIBUTING que em memory; memória só se precisarmos replicar o padrão em PRs futuros de outros contribuidores.
2. **`innerRef` é dívida técnica** — todo primitive usa, todos precisam migrar para `forwardRef`. Vale memória para que PRs futuros (R3–R12) não **reforcem** o padrão criando mais uso de `innerRef`.
3. **Container depende da natureza híbrida (array+keys) do `createBreakpoints`** — se o RFC de M6/R1 simplificar essa estrutura, Container quebra. Acoplamento oculto a registrar.

Esses três pontos merecem entrar como memória `feedback`/`project` — os demais (bugs, gaps de teste, stories) são ephemeral e vivem nos PRs/issues.

---

## 8. Conclusão

A camada de layout primitives **funciona para os cenários básicos**, mas:

- **Contratos semânticos são vazáveis** em 5 de 9 componentes por ordem de spread incorreta.
- **Container tem bug real em produção** (token inválido + path quebrado).
- **2/3 dos primitives não têm story nem teste.**
- **`ref` canônico ausente** universalmente.
- **Empty é componente fantasma** — decisão de produto pendente.

Nenhum dos problemas é intransponível. Um único PR de fix imediato resolve ~70% dos achados. O restante divide-se em 3 issues localizadas + 5 RFCs (ver §4.4).

**Decisão de entrada para R3:** prosseguir com o PR de fix imediato e RFC-R2-A (ref canônico) abertos ou merged. R3 depende desses dois para não acumular mais dívida nos mesmos eixos.
