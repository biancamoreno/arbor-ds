# Review — `Skeleton`

**Fase:** R7 · **Camada:** `feedback` · **Status:** `concluído`
**Revisor:** arbor-ds-arch · **Data:** 2026-05-02 · **Versão atual:** `1.0.0`

---

## 0. Escopo

- **Arquivos fonte:**
  - `src/components/skeleton/core/skeleton.tsx` (82 LOC)
  - `src/components/skeleton/core/skeleton.native.tsx` (102 LOC)
  - `src/components/skeleton/interfaces/SkeletonProps.ts` (18 LOC)
- **Story:** `skeleton.stories.tsx` (4 stories: `Line`, `Circle`, `MultiLine`, `CardSkeleton`).
- **Testes:** `skeleton.test.tsx` (10 cases) + `skeleton.native.test.tsx` (4 cases).
- **Implementação nativa:** `sim` (paridade — `Animated.loop` em opacity; **sem shimmer gradient**, decisão MVP documentada).
- **Classificação cross-platform:** `universal`.
- **Dependências internas:** `Box`, `Flex`, `useTheme`.
- **Consumidores conhecidos:** nenhum interno. Exportado em `native.ts:74`.

---

## 1. Visual

| # | Item | Status | Nota |
|---|---|---|---|
| 1.1 | Variantes declaradas × renderizadas no Storybook batem | ⚠️ | API tem 4 props (`width`, `height`, `borderRadius`, `lines`); stories cobrem todos os usos. **Sem story `Theming` e sem `ReducedMotion`**. |
| 1.2 | Tokens semânticos | ⚠️ | Cores via `theme.colors.background.subtle` / `background.interactive` ✅. **Mas:** default `height='16px'` literal, `borderRadius` cast como `Number(theme.radii.nano) \|\| 4` (native), gradient `25%/50%/75%` mágicos, `backgroundSize: '200% 100%'` literal, `1.4s ease-in-out` literal. |
| 1.3 | Estados visuais | ✅ N/A | Estado único: animado. |
| 1.4 | Escala de tamanhos coerente com DS | ⚠️ | API `width/height` aceita `number \| string` — opt-out total do sistema de tokens. Skeleton **não** usa `'sm'/'md'/'lg'` (diferente de Spinner/Button — dimensão dele é layout-driven, não control-driven). Coerente com a natureza do componente, mas significa que produto que quer "skeleton de avatar pequeno" não tem alias semântico (`size="avatar.sm"`). |
| 1.5 | Contraste ≥ WCAG AA | ✅ | `background.subtle` ≠ `background.interactive` em ambos os modos; pulse permanece visível. |
| 1.6 | Microinterações usam `transition()` | ❌ | Web: `'arbor-shimmer 1.4s ease-in-out infinite'` literal. Native: `duration: 700` × 2 + `Easing.inOut(Easing.ease)` literal. Sem consumo de `theme.motion.duration` / `theme.motion.easing`. Mesmo padrão SP-2 do Spinner. |
| 1.7 | Animações respeitam `usePrefersReducedMotion` | ⚠️ | Web ✅ via `REDUCED_MOTION_CSS` global. **Native ❌** — `Animated.loop` continua rodando (mesma falha SP-3 de Spinner; depende de R1-C4). |
| 1.8 | Ícones do DS | ✅ N/A | — |

**Observações livres:**
- **Paridade visual web↔native incompleta**: web tem **shimmer gradient**, native só tem **pulse de opacity**. Decisão MVP documentada no JSDoc e interface ("gradient cross-platform exigiria `expo-linear-gradient`"). **OK como decisão registrada**, mas é um gap visual entre plataformas que merece nota em CONTRIBUTING (consumidor que quer paridade visual estrita pode optar pelo addon).
- **Keyframe injetado pelo próprio componente** (`injectKeyframes` em `skeleton.tsx:7`), diferente de Spinner que usa o keyframe global do Provider. **Inconsistência arquitetural** — dois componentes do mesmo eixo (R7) escolheram caminhos opostos para o mesmo problema. Vale unificar (provedor tem `arbor-shimmer` ou skeleton tem injeção local? — preferência arquitetural é centralizar no Provider para evitar repeated DOM-style nodes).
- **`borderRadius` default `theme.radii.nano`** — **bug latente em native**: `Number(theme.radii.nano) || 4`. Se `theme.radii.nano` for string `'4px'`, `Number('4px') === NaN` e cai no fallback `4`. Funciona por acidente. RFC themable mínimo (RFC-0027) prevê radii como número; aqui o cast é defensivo demais e esconde um contrato mal-resolvido.

---

## 2. Comportamental

| # | Item | Status | Nota |
|---|---|---|---|
| 2.1 | Teclado | ✅ N/A | Não-focável. |
| 2.2 | Focus management | ✅ N/A | — |
| 2.3 | `role` correto + `aria-*` | ⚠️ | Web: `role="status"` + `aria-label="Carregando"` ✅. Multi-line: `aria-hidden="true"` nas linhas filhas ✅. Native: `accessibilityRole="progressbar"` + `accessibilityLabel`. **Roles divergentes web/native** — mesmo SP-8 do Spinner. **Single-line web** aplica `role="status"` direto na `<SkeletonLine>` (Box `as="span"`); chamadas múltiplas viram múltiplos status — mais elegante seria sempre wrappear (assim como o native faz). |
| 2.4 | Anúncios a leitor de tela | ⚠️ | Múltiplos Skeletons em uma tela = múltiplos `role="status"` = múltiplos anúncios "Carregando". **Página com card-skeleton e múltiplos blocos vai martelar o leitor.** Padrão moderno é envolver toda a região com **um** `role="status"` no nível do consumidor (ex: `<Card aria-busy>`). API atual induz uso ruim. |
| 2.5 | Touch target | ✅ N/A | — |
| 2.6 | Controlado | ✅ N/A | — |
| 2.7 | Cancelável | ✅ N/A | — |
| 2.8 | RTL | ⚠️ | Última linha em multi-line tem `width: 60%` — em RTL pode ficar visualmente "ao contrário" (linha curta na esquerda em vez da direita). Sem `marginInline` ou similar; o gradient shimmer é simétrico mas a redução de largura não é. |

**Observações livres:**
- **`aria-label="Carregando"` hard-coded em pt-BR**, e diferente do Spinner (props `label?` aceita override no Spinner; **Skeleton não aceita `label`**). Inconsistência de API entre dois componentes do mesmo eixo.

---

## 3. Funcional (API)

| # | Item | Status | Nota |
|---|---|---|---|
| 3.1 | API mínima | ⚠️ | 4 props funcionais (`width`/`height`/`borderRadius`/`lines`). Surface OK. **Mas extends `HTMLAttributes<HTMLSpanElement>`** vaza ~50 props HTML para a API pública (mesmo SK-4 = SP-4). |
| 3.2 | Naming segue convenção | ✅ | `width`/`height`/`borderRadius`/`lines` — todos consistentes. |
| 3.3 | Defaults "least surprise" | ⚠️ | `width='100%'`, `height='16px'`, `borderRadius=theme.radii.nano`. **`16px` literal como default** — produto que muda escala de tipografia não vê o skeleton acompanhar. |
| 3.4 | Combinações inválidas via tipo | ⚠️ | `lines={1}` cai no caminho single-line; `lines={2..N}` cai no multi. `lines={0}` ou negativo? — sem guard. Não-crítico. |
| 3.5 | Polimorfismo via `as` | ❌ | Não suportado. Aceita `extends HTMLSpanElement` mas força `Box as="span"` internamente. Decisão razoável (componente é decorativo). |
| 3.6 | `forwardRef` + `displayName` | ❌ | Sem ambos. Mesmo SP-6. |
| 3.7 | Compound | ✅ N/A | — |
| 3.8 | Tipos públicos exportados | ✅ | `SkeletonProps`. |

**Surface area atual:**

```ts
export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement> {
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  lines?: number;
}
```

**Observações livres:**
- **API não tem prop `label`** mas Spinner tem. **Inconsistência cross-componente** — qualquer indicador de "Carregando" deveria aceitar override. Trivial de adicionar.
- **`width/height/borderRadius` aceitam `number | string`** — `number` vira `${n}px`; `string` passa direto. Ergonomia OK, mas amplia surface (string permite `'10rem'`, `'calc(...)'`, valores arbitrários — ótimo escape hatch, mas merece doc).

---

## 4. Código

| # | Item | Status | Nota |
|---|---|---|---|
| 4.1 | Sem tags HTML puras | ✅ | Web/native usam Box/Flex. **Stories violam** (`<div style>` em CardSkeleton). |
| 4.2 | Sem `style={{...}}` desnecessário | ❌ | Web: `style={{ width, height, borderRadius, backgroundImage, backgroundSize, animation, ...style }}`. **`width`/`height`/`borderRadius` têm prop declarativa equivalente — promover.** `backgroundImage`/`backgroundSize`/`animation` são escape hatches legítimos (engine não cobre gradient). Native: `style={[lineStyle, { opacity }, style]}` — RN style API; OK. |
| 4.3 | Estrutura de pasta | ✅ | `core/`, `interfaces/`, `index.ts`. |
| 4.4 | Estilo via `defineRecipe` | ⚠️ | Sem recipe. Plausível dado o estilo dinâmico (largura/altura runtime), mas variantes (`shape: 'line' \| 'circle' \| 'rect'` por exemplo) caberiam em recipe e melhorariam a API. |
| 4.5 | Sem `any`, sem cast | ⚠️ | Native faz **cast `as ViewStyle['width']` em width** e **`Number(theme.radii.nano) \|\| 4`**. Cast indica impedância de tipos; o `\|\| 4` esconde NaN silenciosamente. |
| 4.6 | Cobertura de testes | ⚠️ | 10 cases web (sólido em width/height/lines/style). 4 native superficiais (`renders without crashing`, sem assertion da animação ou opacity). **Sem teste de tema. Sem teste de reduced-motion. Sem teste do bug do `Number(theme.radii.nano)` em native (passar string deve funcionar).** |
| 4.7 | Stories | ⚠️ | 4 stories. `CardSkeleton` usa `<div style>` com `border`, `borderRadius`, `padding` literais — **viola TD-024**. Sem `Theming`, sem `ReducedMotion`. |
| 4.8 | `.native.tsx` presente | ✅ | Sim. |
| 4.9 | Imports respeitam camadas | ✅ | — |

**Métricas rápidas:**
- LOC: 82 (web) + 102 (native) + 18 (props) = **202 LOC**.
- Nº de testes: **14** (10 web + 4 native).
- Nº de stories: **4**.
- Dependências externas: **0** runtime.

**Observações livres:**
- **Keyframe injection function-scoped** em `skeleton.tsx:7-19` — efeito colateral em render-pass. Funciona mas é anti-pattern: mover para `useEffect` ou centralizar no Provider (preferência: Provider; já tem `arbor-spin`/`arbor-shake`/`arbor-progress-indeterminate` lá).
- **Não-DRY entre `single-line` e `multi-line`** — multi-line wrappa em Flex; single-line aplica role direto na linha. No native ambos passam pelo Flex. Diferença de estrutura entre plataformas.

---

## 5. Governança

| # | Item | Status | Nota |
|---|---|---|---|
| 5.1 | Export público | ✅ | `components/index.ts` + `native.ts`. |
| 5.2 | Tipos exportados | ✅ | `SkeletonProps`. |
| 5.3 | Changeset | ⚠️ | N/A — sem mudança em curso. |
| 5.4 | Breaking change tem RFC | ⚠️ | Adicionar prop `label` é não-breaking. Renomear `lines` → `count` (alinhado a outros DSes) seria breaking. Sem RFC necessária neste momento. |
| 5.5 | Migration guide | ✅ N/A | — |

---

## 6. Resumo executivo

**Score por eixo:** Visual `2/8` (3 N/A) · Comportamental `1/8` (5 N/A) · Funcional `4/8` · Código `5/9` · Governança `3/5`

**Top 3 achados:**

1. **SK-1 (a11y)** — Multi-Skeleton em uma tela martela o leitor com múltiplos `role="status"`. API atual induz padrão ruim. **Solução:** prop `aria-busy` (no consumidor) + Skeleton vira `aria-hidden`, OU prop `label?: string | false` aceitando `false` para suprimir o role. Inconsistência também: Skeleton não aceita `label` mas Spinner aceita.
2. **SK-2 (themability)** — `1.4s ease-in-out` literal (web) e `duration: 700` (native) não consomem `theme.motion`. Mesma família de SP-2. Plus: keyframe injetado pelo próprio componente em vez de centralizar no Provider (inconsistência com Spinner).
3. **SK-3 (a11y)** — Native não respeita `prefers-reduced-motion`. Mesma família de SP-3. **Bloqueado por R1-C4.**

**Outros achados:**
- **SK-4** — `extends HTMLAttributes<HTMLSpanElement>` (mesmo SP-4 — typing leak).
- **SK-5** — `style={{ width, height, borderRadius }}` em vez de prop declarativa (mesmo SP-11).
- **SK-6** — sem `forwardRef` + `displayName` (mesmo SP-6).
- **SK-7** — `aria-label="Carregando"` hard-coded em pt-BR; sem prop de override (mesmo SP-7, mas pior — Spinner aceita `label`).
- **SK-8** — paridade visual incompleta (shimmer web vs. pulse native). Decisão MVP documentada — OK manter, mas registrar em CONTRIBUTING.
- **SK-9** — `Number(theme.radii.nano) || 4` no native esconde NaN. Cast/fallback que merece auditoria do contrato `theme.radii.*`.
- **SK-10** — testes native superficiais; sem teste de tema; sem teste de reduced-motion; sem teste do edge-case `radii.nano` string.
- **SK-11** — story `CardSkeleton` viola TD-024 (`<div style>`, border literal).
- **SK-12** — `injectKeyframes()` chamado dentro do render do `SkeletonLine` em vez de `useEffect` no Provider.
- **SK-13** — single-line e multi-line têm estruturas DOM diferentes entre web e native (não-DRY arquitetural).
- **SK-14** — última linha multi-line com `60%` literal — vira RTL-aware? Não. Sem teste RTL.

**Classificação geral:**
- [ ] ✅ Aprovado sem mudanças
- [x] ⚠️ Aprovado com fixes menores (SK-4, SK-5, SK-6, SK-9, SK-11, SK-12 cabem em PR de polimento)
- [ ] ❌ Requer mudanças antes da próxima release

---

## 7. Follow-ups

### Fix imediato (mesmo PR da review) — **aplicados em 2026-05-02**

- [x] **SK-4** — `SkeletonProps` parar de estender `HTMLAttributes`; declarar surface enxuta (`width`, `height`, `borderRadius`, `lines`, `label?`, `style?`, `className?`). ✅
- [ ] ~~**SK-5** — promover `width`/`height`/`borderRadius` para props no `<Box>`.~~ **Revertido após investigação:** esses valores são genuinamente runtime-dynamic (consumidor passa `width={48}` ou `width="50%"`); não há equivalente em token. Skill define "valores altamente dinâmicos ou computados" como escape hatch legítimo para `style={{}}`. **Decisão registrada — não promover.**
- [x] **SK-6** — adicionar `Skeleton.displayName = 'Skeleton'` (web e native). ✅
- [x] **SK-9** — verificado: `theme.radii.nano` é número (4) por construção em `tokens/primitives/borders/border-radius.ts:3`. Cast `Number(theme.radii.nano) || 4` em `skeleton.native.tsx:28` removido — defesa contra problema imaginário. ✅
- [x] **SK-11** — `CardSkeleton` story migrada para `<Flex flexDirection="column" gap="small" padding="medium" borderWidth="hairline" borderStyle="solid" borderColor="border.subtle" borderRadius="medium">`. ✅
- [x] **SK-12** — `@keyframes arbor-shimmer` movido para `GLOBAL_CSS` em `provider.tsx:18`. `injectKeyframes()` removido do componente. ✅
- [x] **Bonus aplicado: SK-1 / SK-7** (originalmente "issue") — prop `label?: string | false` adicionada. Default `'Carregando'`. `label={false}` suprime `role="status"`/`aria-label` (web) e usa `accessibilityElementsHidden` + `importantForAccessibility="no-hide-descendants"` (native). Story `SuppressedAnnouncement` documenta o uso. Alinha com Spinner.

**Resultado:** Suite 912 → **919/919 verde** (+7 testes Skeleton: label custom web, label false single web, label false multi-line web, displayName web, label custom native, label false native, displayName native). `tsc -b` ✓ · `lint` ✓ · `platform-contract --strict` ✓ · `no-color-literal` ✓.

### Issue (mudança localizada, sem breaking change)

- [x] ~~**SK-1**~~ — promovido a fix imediato e implementado. Prop `label?: string | false` adicionada.
- [x] ~~**SK-7**~~ — coberto por SK-1 (consumidor pode passar `label="Loading"` no provider/wrapper internacional). Default `'Carregando'` mantido. Decisão de produto sobre default cross-componente continua pendente para CONTRIBUTING (sweep R7+R8).
- [ ] **SK-8 (doc)** — documentar em CONTRIBUTING §"Skeleton em RN": gap visual deliberado (pulse vs. shimmer); como adotar `expo-linear-gradient` se produto quiser paridade estrita.
- [ ] **SK-10** — testes: tema (override de `background.subtle` muda cor do skeleton), reduced-motion (web), opacity transform real no native, `borderRadius` como string `'8px'` em native (validar contrato sem o cast antigo).
- [ ] **SK-14** — definir comportamento RTL ou registrar decisão "última linha 60% sempre à esquerda".

### RFC (sistêmico ou breaking change)

- [ ] **SK-2 (motion)** — entra na mesma RFC de motion-themable que SP-2. Skeleton consome `theme.motion.duration.slow`/`xslow` + easing. Não é RFC dedicada, é issue acoplada ao seguimento da RFC-0027.
- [ ] **SK-3** — depende de **R1-C4** (`usePrefersReducedMotion.native`). Mesma issue de SP-3.
- [ ] **SK-13** — unificar estrutura `single` vs. `multi` entre web e native — não-breaking se renderizar igual, mas demanda decisão. Cabe em RFC ou em sweep de polimento ao final de R7.

---

## 8. Notas de arquiteto

- **Padrão `sm/md/lg` confirmado como NÃO-universal:** Skeleton não usa namespace de control sizes (decisão correta — geometria é layout-driven). Significa que **SP-1 não escala automaticamente para todos os componentes de R7**; é um achado específico de Spinner+Button. **Continuar observando ProgressBar e ProgressCircle antes de redigir RFC.**
- **Padrão emergente "componente injeta seu próprio keyframe":** Skeleton faz; Spinner consome do Provider. Provider já tem `arbor-spin`/`arbor-shake`/`arbor-progress-indeterminate` — adicionar `arbor-shimmer` mantém o caminho centralizado e remove DOM-side-effects do componente. Boa oportunidade de padronizar para R7.
- **Padrão emergente "label hard-coded":** Spinner aceita prop `label`; Skeleton não. Toast e Alert provavelmente também têm strings em pt-BR. Vale fazer um sweep ao final de R7/R8 para alinhar todos.
- **Padrão emergente "extends HTMLAttributes leakage":** Spinner e Skeleton ambos extendem HTML props num componente cross-platform. **Atinge potencialmente todos os feedback indicators**. Forte candidato a fix imediato sweep ao final de R7.
- **Bug latente `Number(theme.radii.nano) || 4` (native):** se for sintoma de impedância no contrato themable, vale investigar **antes** de outros componentes nativos consumirem `theme.radii.*` da mesma forma. **Triggera mini-auditoria no contrato themable de borderRadius** — vale 30min de investigação antes de continuar R7.
- **`role="status"` em massa = ruído:** padrão Skeleton atual induz pragas de a11y. Se o sweep do feedback (R7+R8) confirmar o problema em outros componentes (Spinner, Alert, Toast — todos `role="status"` provavelmente), vale uma RFC focada em "estratégia de anúncio para indicadores cumulativos".
