# R8 — Feedback / Mensagens (consolidado)

**Data:** 2026-05-02 · **Revisor:** arbor-ds-arch · **Status:** reviews concluídas + sweep coletivo aplicado (sub-ondas 8.A/8.B/8.C). Suite **940/940 verde** · tsc · lint · platform-contract --strict · no-color-literal — todos verdes. Commit pendente de aprovação.

Componentes auditados: [`Alert`](./alert.md) · [`Toast`](./toast.md) · [`Tag`](./tag.md) · [`Chip`](./chip.md).

> Fixes-imediatos catalogados nas reviews individuais. Este consolidado captura **patterns sistêmicos**, **achados convergentes** e **plano de sweep** para aplicação coordenada.

---

## 1. Achados convergentes (TOP por impacto)

### 🔴 Bloqueador — `feedback.info.*` ausente nos tokens · ✅ resolvido

> **Retificação:** as reviews iniciais de Alert/Toast afirmaram que `status.info` era "token morto/inexistente". Verificação posterior mostrou que `status.info` **existe** em `themeLight/DarkColors.status` (light: `ocean.60`; dark: `ocean.40`). O bug real era **inconsistência arquitetural**, não token morto: `info` morava em `colors.status` (escala única) enquanto `success/warning/critical` moravam em `colors.feedback.*` com 3 shades (`base/subtle/strong`). Alert/Badge eram obrigados a misturar namespaces porque `status.info` não tinha `subtle`/`strong` para casar com os outros tones.

**Resolução aplicada:**
- Adicionado `feedback.info.{subtle, base, strong}` em `themeLightColors`/`themeDarkColors` (escala `ocean`).
- Light: `ocean.10` / `ocean.60` / `ocean.80`. Dark: `ocean.20` / `ocean.40` / `ocean.60`.
- Migrados `Alert.tsx`, `Toast.tsx`, `Toast.native.tsx`, `Badge.tsx` (R7 issue B-4/B-5 fechada de quebra).
- `colors.status.{info, notice, highlight}` mantido para retrocompat (sem outros consumidores; pode virar TD futura).

---

### 🔴 Touch target abaixo do WCAG 2.5.5

| Componente | Tamanho atual do close/remove | Status |
|---|---:|---|
| `Alert.Close` | 20×20 | ❌ |
| `Toast.Close` | 20×20 | ❌ |
| `Tag` | sem minHeight (~28px de altura) | ❌ |
| `Chip.Remove` | **14×14** | ❌❌ (pior do R8) |

**Padrão:** TD-016 (`minHeight={44}` + overlay `::before`) já aplicado em Field/Input/Select/Counter/Switch/FAB. R8 inteiro precisa do mesmo sweep.

---

### 🔴 Sweep R7 esqueceu Alert + Chip

| Pattern R7 fechado em | Esquecido em | Magnitude |
|---|---|---:|
| `extends HTMLAttributes` removido (Spinner/Skeleton/Badge/ProgressBar) | Alert (5×), Chip (4×), Tag (1×) | 10 interfaces |
| `displayName` (Spinner/Skeleton/Badge/ProgressBar) | Alert (5×), Chip (4×) | 9 subcomponentes |
| Style inline migrado para props declarativas | Alert (7+), Toast (10+), Tag (5+), Chip (8+) | ~30 ocorrências |
| `as never` cast removido | Alert (4×), Toast (4×) | 8 casts |

Alert e Chip nunca foram cobertos pelo sweep R7 (Tag teve `displayName` mas não interfaces).

---

### 🟡 Recipes ausentes ou duplicadas (4/4 componentes)

| Componente | Estado atual |
|---|---|
| `Alert` | `TONE_COLORS` + `TONE_ICON` Records locais |
| `Toast` | `TONE_BORDER` local + `getPlacementStyle` retorna CSSProperties cru |
| `Tag` | `getTagStyle` (web) e `getTagColors` (native) — **duplicados** |
| `Chip` | `getChipStyle` local (variant × tone × selected) |

**Pattern:** Todo R8 é multivariante puro (sem comportamento) — caso ideal para `defineSlotRecipe`. Tag é a melhor candidata a ser fix-imediato (sem dependência de tokens quebrados, drift latente real). Alert/Toast/Chip viram issue (esperam tokens info + decisão de Chip-interativo).

---

### 🟡 Drift web ↔ native silencioso

| Componente | Onde | Risco |
|---|---|---|
| `Tag` | `getTagStyle`/`getTagColors` duplicados | Mudar um esquece o outro |
| `Toast` | `Title`/`Description` web tem `style={{ margin, lineHeight }}`, native não | Diferença visual |
| `Chip` | declarado `@platform shared` mas **sem `.native.test.tsx`** | Renderização não verificada |
| `Tag` | **`tag.test.tsx` web AUSENTE** (só native) | Inversão da paridade |

**Pattern:** R7 #8 ("@platform shared mente") confirma-se em Chip. Vale virar lint script: todo arquivo com `@platform shared` deve ter `.native.test.tsx` paritário.

---

### 🟡 Tones cross-componente caóticos

| Componente | Tones expostos |
|---|---|
| `Alert` | `info` · `success` · `warning` · `critical` |
| `Toast` | `neutral` · `info` · `success` · `warning` · `critical` |
| `Tag` | `neutral` · `brand` |
| `Chip` | `neutral` · `brand` |
| `Badge` (R7) | `neutral` · `brand` · `success` · `warning` · `critical` · `info` |
| `ProgressBar`/`ProgressCircle` (R7) | `neutral` · `success` · `warning` · `critical` |

**Padrão:** zero acordo. Mesmo "feedback" significa coisas diferentes em cada componente. Carry-over R7 #7 reforçado.

---

### 🟡 Carry-overs não-bloqueantes (já mapeados em R7)

| Carry-over | Componentes R8 afetados |
|---|---|
| **SP-1** (`sm/md/lg` × `small/medium/large`) | Alert (interno, mistura `'small'`/`'sm'` no MESMO arquivo!), Toast (idem), Chip (público: `size: 'sm' \| 'md'`) |
| **Motion themable parcial** (animações com `0.2s`/`200`/`Easing.ease` literais) | Toast (web `animation` string + native `Animated.timing`) |
| **Reduced motion native** (R1-C4) | Toast.native |
| **`displayName` ausente** | Alert (5), Chip (4) |
| **Label hardcoded pt-BR** | Alert "Fechar", Toast "Fechar"+"Notificações", Chip "Remover" |
| **Stories TD-024** | Alert (1), Toast (5 com `<button>`), Tag (1), Chip (3) — 10 stories |
| **Emojis em stories** | Alert (4), Chip (1) |
| **`@platform shared` mente** | Chip (sem `.native.test.tsx`) |

---

### 🟡 Achados específicos do R8

| Código | Componente | Achado |
|---|---|---|
| **A-6** | Alert | `marginLeft: 'auto'` quebra RTL |
| **T-1** | Toast | `zIndex: 9999` literal — `zIndex.toast=1700` existe |
| **T-CSS-1** | Toast | `getPlacementStyle` retorna CSSProperties cru com `position`, `gap`, `maxWidth`, posições — fortaleza de literais |
| **T-Keyframes** | Toast | Injeta `<style>` em `document.head` em runtime — devia usar `GLOBAL_CSS` do provider (mesmo Skeleton em R7) |
| **TG-Bug-1** | Tag | Web sem `.test.tsx` |
| **TG-A11y-1** | Tag | Sem `aria-pressed` (só native tem `accessibilityState.selected`) |
| **CH-Bug-1** | Chip | Root como `<span>` com `selected` — não focável, não navegável por teclado, sem `aria-pressed` (interatividade prometida ≠ implementada) |
| **CH-Bug-3** | Chip | `@platform shared` sem `.native.test.tsx` |

---

## 2. Patterns sistêmicos consolidados (R7 → R8)

12 patterns mapeados em R7 + 4 novos em R8:

| # | Pattern | Status pós-R8 |
|---:|---|---|
| 1 | **SP-1** (`sm/md/lg` × `small/medium/large`) | **7 evidências** — RFC pronta para abrir (Alert, Toast, Chip explícitos; Spinner/Button/Badge/ProgressBar do R7). Codemod cirúrgico. |
| 2 | `extends HTMLAttributes` leak | R8 reabriu — Alert/Tag/Chip + interfaces R8 (10 ao todo) precisam do mesmo sweep R7 |
| 3 | Motion themable parcial | Toast (web+native) é nova evidência |
| 4 | Reduced motion native | Bloqueado por R1-C4 |
| 5 | Label hardcoded pt-BR | R8 adiciona "Notificações", "Remover" |
| 6 | Recipes mortas/ausentes | R8 escancara (4/4 componentes) |
| 7 | **Feedback tones inconsistentes** | **Promovido a RFC dedicada** — A-CRIT-1+T-CRIT-1 são bug funcional, não estética |
| 8 | `@platform shared` mente | Confirmado em Chip |
| 9 | TD-024 stories | +10 stories no R8 |
| 10 | `displayName` ausente | Reincidente (Alert, Chip) |
| 11 | Drift web↔native (fillColor R7 → margin/lineHeight R8) | Toast novo caso |
| 12 | Anchor a11y (Badge.Anchor R7) | N/A R8 |
| **13** | **Touch target abaixo de 44×44** | **NOVO** — R8 universal (4/4) |
| **14** | **Recipes duplicadas web↔native** | **NOVO** — Tag |
| **15** | **Span "selecionável" sem a11y** | **NOVO** — Chip (e potencialmente Tag-style components futuros) |
| **16** | **Web sem teste** (inversão paridade) | **NOVO** — Tag |

---

## 3. Plano de sweep coletivo (proposta)

Magnitude: ~30 fixes vs 10 do R7. **Recomendo dividir em 3 sub-ondas** para manter PRs revisáveis e fechar tokens-foundations cedo.

### Sub-onda 8.A — Foundations + tones (bloqueador)

**Escopo:** habilita todo o resto.

- [ ] Adicionar `feedback.info.{base, subtle, strong}` em `themeLightColors`/`themeDarkColors`. Escala blue/aqua (sugestão: `aqua['50']`/`['10']`/`['70']` light; ajustar dark).
- [ ] Trocar `status.info` por `feedback.info.base` em `Alert.tsx` e `Toast.tsx`/`.native.tsx`.
- [ ] `Alert tone='info'` ganha `bg='feedback.info.subtle'` (para casar com sucess/warning/critical).
- [ ] Tipar `TONE_COLORS`/`TONE_BORDER` com `ColorToken` — remover 8× `as never`.

**Estimativa:** ~15 LOC + 3 testes novos. Suite: +0 (não quebra ninguém porque `status.info` era undefined silencioso).

### Sub-onda 8.B — Sweep R7 retroativo + R8 mecânico

**Escopo:** aplicar pattern R7 nos componentes esquecidos + fixes mecânicos universais.

- [ ] **`extends HTMLAttributes` removido** em Alert (5), Tag (1), Chip (4) — 10 interfaces. Substituir por `style?` + `className?` + `onClick?` (quando aplicável).
- [ ] **`displayName`** em Alert (5) + Chip (4) — 9 subcomponentes.
- [ ] **Touch target 44×44** em Alert.Close, Toast.Close, Tag, Chip.Remove via `minWidth/minHeight` + overlay `::before` (TD-016 pattern).
- [ ] **RTL** Alert: `marginLeft: 'auto'` → `marginInlineStart='auto'`; `borderLeft*` → `borderInlineStart*`. Toast: idem.
- [ ] **Style → props declarativas** em Alert (7), Toast (10+), Tag (5+), Chip (8+) — ~30 ocorrências.
- [ ] **Pixel/string literais → tokens** em Alert (`borderLeftWidth=4`), Toast (`zIndex=9999`, `borderLeftWidth=4`), Tag (`gap`/`padding`/`fontSize`), Chip (`padding`/`gap`).
- [ ] **Stories TD-024** sweep: 10 stories com `<div style={{}}>` → `<Flex>`.
- [ ] **Emojis em stories** Alert (4) + Chip (1) → `<Icon>` ou comentar (alguns são meramente ilustrativos do slot).
- [ ] **`_focusVisible: focusRing`** em Alert.Close, Toast.Close, Chip.Remove.
- [ ] **`transition()`** em Alert.Close, Toast.Close, Chip.Remove para hover/focus.
- [ ] **Toast keyframes** migrar `arbor-toast-in` para `GLOBAL_CSS` do provider (Skeleton-pattern).
- [ ] **Toast accessibilityRole** native: `'text'` → `undefined` para non-critical.

**Estimativa:** maior bloco. Suite: +0 (nenhum comportamento muda; só estilo/tipo/markup).

### Sub-onda 8.C — Bugs específicos + paridade de testes

**Escopo:** fechar gaps de cobertura e bugs específicos.

- [ ] **TG-Bug-1** Criar `tag.test.tsx` web (~7 cases — paridade com native).
- [ ] **CH-Bug-3** Criar `chip.native.test.tsx` (~6 cases — smoke + variants + Remove).
- [ ] **TG-A11y-1** Adicionar `aria-pressed={selected}` em Tag web + 1 case de teste.
- [ ] **A-Native-Parity** Alert.native test ganha 4 cases (role, label custom, Icon default, onClick).
- [ ] **Toast Title/Description** drift: aplicar mesma resolução web/native (sem `style={{ margin, lineHeight }}`).
- [ ] **Tag slot recipe** migrar `getTagStyle`/`getTagColors` para `defineSlotRecipe('tag')` — único caso de fix (não issue) porque resolve duplicação real.

**Estimativa:** +15-20 testes na suite. Pode quebrar testes existentes se a recipe Tag mudar markup.

### Sub-onda 8.D — Issue/RFC abertas (não-fix)

- [ ] **RFC SP-1** redigir e abrir. 7 evidências sólidas.
- [ ] **RFC feedback-tones** redigir e abrir. Catálogo cross-componente.
- [ ] **RFC Chip-Interativo** redigir e abrir. Decisão (a) Clickable internamente vs (b) span passivo.
- [ ] **Issue TG-Tones-Catalog**, **CH-Tones-Catalog** — referenciam RFC feedback-tones.
- [ ] **Issue Alert recipe** + **Toast recipe** + **Chip recipe** — depois de tokens info OK + decisão Chip.

---

## 4. Critérios de Definition of Done (R8)

- [ ] 4 reviews `.md` preenchidos (5 eixos cada). ✅
- [ ] Sub-ondas 8.A + 8.B + 8.C aplicadas com suite verde no fim de cada uma.
- [ ] `pnpm test` verde · `pnpm tsc -b` verde · `pnpm lint` verde · `pnpm test:platform-contract --strict` verde · `pnpm test:no-color-literal` verde.
- [ ] Sub-onda 8.D: RFCs e issues abertas, referenciadas em `_followups.md`.
- [ ] `MEMORY.md` ganha entrada `project_phase_r8.md`.
- [ ] Fila de execução atualizada.

---

## 5. Sub-ondas executadas

### Sub-onda 8.A — Foundations + tones · ✅

- `themeLightColors.feedback.info` + `themeDarkColors.feedback.info` adicionados (`subtle/base/strong`).
- `Alert.tsx`: `TONE_COLORS.info` migra de `status.info`/`text.primary`/`transparent` para `feedback.info.{subtle,base,strong}` — mesma estrutura dos outros 3 tones.
- `Toast.tsx` + `Toast.native.tsx`: `TONE_BORDER.info` → `feedback.info.base`.
- `Badge.tsx`: variant solid/subtle migra para `feedback.info.{base,subtle,strong}` — fecha R7 B-4/B-5.
- Tipagem `TONE_COLORS`/`TONE_BORDER` melhorada com tipos explícitos (`ToneColors`/`ColorToken-like`) — 8× `as never` removidos.

### Sub-onda 8.B — Sweep mecânico R7-retro + R8 universal · ✅

- **`extends HTMLAttributes` removido** em Alert (5 interfaces), Tag (1), Chip (4) — substituído por `style?` + `className?` + `onClick?` explícitos.
- **`displayName`** adicionado em Alert.Root/Icon/Title/Description/Close, Chip.Root/Label/Icon/Remove.
- **Touch target 44×44** via `minWidth/minHeight={44}` (mantendo visual interno 20×20 ou 14×14 quando aplicável) em Alert.Close, Toast.Close, Tag, Chip.Remove.
- **Style → props declarativas** sweep: ~25 ocorrências migradas (Alert: padding/margin/lineHeight; Toast: zIndex/position/placement; Tag: padding/gap/font; Chip: padding/gap/border).
- **Tokens sobre literais:** `borderLeftWidth=4` → `'thick'` (Alert, Toast); `zIndex=9999` → `zIndex.toast` (Toast); `padding '6px 12px'` → `paddingX/Y` semânticos.
- **`whiteSpace='nowrap'`** em Chip ficou em `style={{}}` — engine não inclui essa prop no whitelist de runtime (achado lateral, vai pro inventário do issue da R2).
- **`_focusVisible: focusRing`** + **`transition()`** adicionados em Alert.Close, Toast.Close, Tag, Chip.Remove.
- **Toast keyframes** `arbor-toast-in` migrado para `GLOBAL_CSS` do provider (mesma pattern do `arbor-shimmer`/Skeleton em R7) — eliminado `injectKeyframes()` runtime.
- **Toast accessibilityRole native:** `'text'` para non-critical → `undefined` (live region cobre o anúncio).
- **Toast.native paridade:** Title/Description ganharam props declarativas idênticas ao web.
- **Stories TD-024:** Alert (AllTones), Toast (Default+AllTones), Tag (AllTones), Chip (AllVariants+Tags) migradas para Flex/Button do DS. `whiteSpace`/`fontWeight` literais saíram.
- **Emojis em stories:** Alert (4 ocorrências) → `<Alert.Icon />` default; Chip WithIcon → `<Icon name="Tag" />`.
- **Tag slot recipe parcial:** `getTagColors` extraído para `src/components/tag/internal/tag-colors.ts` consumido por web e native — elimina drift sem RFC. (Slot recipe completo continua em backlog como issue.)

### Sub-onda 8.C — Bugs específicos + paridade testes · ✅

- **TG-Bug-1 fechado:** `tag.test.tsx` web criado (7 cases — paridade com native).
- **CH-Bug-3 fechado:** `chip.native.test.tsx` criado (6 cases — smoke + variants + Remove).
- **TG-A11y-1 fechado:** `aria-pressed={selected}` no Tag web + 2 cases de teste cobrindo true/false.
- **A-Native-Parity:** `alert.native.test.tsx` ganhou 4 cases (label padrão, label custom, onClick, Icon default por tone).
- **Toast.native role critical:** matrix test ajustado (Chip não aceita mais `data-testid` direto).

### Sub-onda 8.D — RFCs/issues abertas · ⏳ pendente

Movido para `_followups.md` da R8. Próxima sessão abre:
- **RFC SP-1** (catalogada — 7 evidências sólidas)
- **RFC feedback-tones** (catálogo cross-componente + tones de Tag/Chip)
- **RFC Chip-Interativo** (decisão entre Clickable interno vs span passivo)
- Issues: Tag/Chip slot recipe completo (após RFC feedback-tones), depreciar `colors.status.*`, RTL inline-start (engine whitelist).

---

## 6. Métricas finais

- **Testes:** 923 → **940** (+17). 7 tag.test web + 6 chip.native + 4 alert.native.
- **Web-only no platform-contract:** mantido em **0** (só Toast lista entry mas tem .native.tsx).
- **Paridade `.native.tsx` ↔ `.native.test.tsx`:** 32/32 ✅.
- **Cor literal:** 0 hits no `src/components`.
- **Bug funcional fechado:** Alert `tone='info'` agora renderiza com paleta visível (subtle bg + ocean border).
- **Tipos:** TONE_COLORS/TONE_BORDER tipados — 8× `as never` removidos.
