# R1 — Auditoria de Foundations

**Fase:** R1 · **Escopo:** `src/foundations/**` + ecosystem helpers (`transition`, `usePrefersReducedMotion`) · **Data:** 2026-04-22
**Status:** concluído · **Revisor:** arquiteto

---

## 0. Escopo auditado

- `src/foundations/tokens/primitives/` — color, spacing, sizes, motion, opacity, shadows, borders, typography
- `src/foundations/tokens/semantics/` — color (light/dark), borders, spacing, typography, z-index, opacity
- `src/foundations/tokens/components/` — text
- `src/foundations/theme/` — base-theme, themeLight, themeDark, createTheme, types
- `src/foundations/breakpoints/` — createBreakpoints
- `src/ecosystem/utils/functions/transition.ts`
- `src/ecosystem/styled-system/system/hooks/use-prefers-reduced-motion.ts`

---

## 1. Inventário

### 1.1 Primitives

| Token | Localização | Forma |
|---|---|---|
| color | `primitives/color.ts` | 19 ramps (aqua, emerald, forestGreen, lavender, lime, moss, neutral, ocean, orange, red, rose, royalBlue, sandstone, sapphire, scarlet, sky, tangerine, ultraviolet, violet, yellow) |
| spacing | `primitives/spacing.ts` | 0–96 em passos de 4 (25 valores) |
| sizes | `primitives/sizes.ts` | 32/40/48/56/64 (apenas 5) |
| motion | `primitives/motion.ts` | `duration` (5) + `easing` (4) |
| opacity | `primitives/opacity.ts` | 0–100 em passos de 8 + `alphaColor` (black/white) |
| shadows | `primitives/shadows.ts` | none/sm/md/lg/xl (5) |
| borderRadius | `primitives/borders/border-radius.ts` | 0,4,8,12,16,20,24,28,32,36,40,44,48,1000 |
| borderWidth | `primitives/borders/border-width.ts` | 0,1,2,3,4,6,8,12 |
| fontFamily | `primitives/typography/font-family.ts` | figtree/system/mono/serif |
| fontSize | `primitives/typography/font-size.ts` | 10,12,14,16,18,20,24,28,32 |
| fontWeight | `primitives/typography/font-weight.ts` | 400/500/700 |
| letterSpacing | `primitives/typography/letter-spacing.ts` | tightest → widest (5) |
| lineHeight | `primitives/typography/line-height.ts` | 12,20,24,28,32,36 |

### 1.2 Semantics

| Alias | Valores | Vincula a |
|---|---|---|
| spacing | none, nano, micro, tiny, small, medium, large, huge, giant | primitives 0/4/8/12/16/20/24/28/**40** |
| borderRadius | none, nano, micro, small, medium, large, huge, giant, full | primitives 0/4/8/12/16/24/32/40/1000 |
| borderWidth | none, hairline, thin, medium, thick, heavy, bold, giant | primitives 0/1/2/3/4/6/8/12 |
| fontSize | xsmall, xs, sm, small, md, medium, lg, large, xlarge | primitives 10/12/14/16/18/20/24/28/32 |
| fontWeight | regular, medium, bold | primitives 400/500/700 |
| lineHeight | xxsmall, xsmall, small, medium, large, xlarge | primitives 12/20/24/28/32/36 |
| letterSpacing | tightest, tight, normal, wide, widest | primitives 1:1 |
| fontFamily | sans, mono, serif, system | primitives (sans = figtree) |
| opacity | none, lightest, lighter, light, medium, strong, stronger, strongest, solid | primitives 0/8/16/24/40/56/72/88/100 |
| zIndex | 17 níveis (hide → tooltip) | flat |

### 1.3 Component tokens

- `tokens/components/` exporta apenas `text` (orphan — redefinido em `base-theme.ts`).
- `base-theme.ts` define recipes de: `text`, `button`, `field`, `input`, `checkbox`, `radio`, `switch`, `select`, `dialog`, `drawer`, `tooltip`, `badge`, `card`, `chip`, `avatar`, `alert`, `accordion`, `toast`. **Total: 18 recipes.**
- Componentes sem recipe no tema (estilo hardcoded no componente): `tabs`, `tag`, `breadcrumb`, `pagination`, `spinner`, `skeleton`, `progressBar`, `progressCircle`, `table`, `navBar`, `tabBar`, `fab`, `buttonGroup`, `popover`, `menu`, `carousel`, `radioCard`, `modal` (deprecating).

### 1.4 Themes

- `themeLight`, `themeDark`: spread de `baseTheme` + `colors` + `mode`.
- `createTheme` faz merge profundo recursivo. Funciona, mas não valida tipos de tokens injetados.
- `Theme.ts` exporta tipo `ArborTheme = (ThemeLight | ThemeDark) & {...}` — cast força `colors` e `components` como `ThemeLight['...']`, o que **anula a diferenciação entre light e dark no tipo**.

### 1.5 Breakpoints

- `createBreakpoints` mistura array numérico + chaves nomeadas no mesmo objeto (truque tipado).
- Valores em `base-theme.ts`: sm 640, md 768, lg 1024, xl 1280, 2xl 1536.

### 1.6 Motion helpers

- `transition(props, duration, easing)` em `ecosystem/utils/functions/transition.ts` consome `motionTokens` direto do primitive.
- `usePrefersReducedMotion` implementado **apenas para web** (`window.matchMedia`). **Não funciona em React Native.**

---

## 2. Achados

### 🔴 Críticos — bloqueiam consistência do DS

#### C1. Brand e feedback.success são visualmente idênticos
- `brand.base = aqua['60']` **e** `feedback.success.base = aqua['60']` no tema light.
- Mesma situação no dark (`aqua['50']` para ambos).
- Consequência: um botão "primary" e um alert "success" têm a mesma cor — impossível diferenciar CTA de sucesso.
- **Impacto:** sistêmico. Toda mensagem de sucesso herda ambiguidade.
- **Ação:** definir uma rampa de verde distinta para success (ex: `emerald` ou `forestGreen`, que já existem em primitives).

#### C2. Naming de fontSize semantic mistura duas convenções
- Coexistem `xsmall/xs/sm/small/md/medium/lg/large/xlarge` — 9 valores com **duas nomenclaturas concorrentes** (t-shirt vs descritiva).
- `sm = 14`, `small = 16`, `md = 18`, `medium = 20` — consumidor não tem como adivinhar qual é qual sem abrir o arquivo.
- **Impacto:** DX. Autocomplete mostra 9 opções ambíguas.
- **Ação (RFC):** eleger uma convenção única (recomenda-se t-shirt: `xs/sm/md/lg/xl/2xl`) e migrar.

#### C3. Shadows não respeitam dark theme
- `shadows` hardcoda `rgba(0,0,0,0.08...0.20)`. Em tela escura, sombras pretas são invisíveis ou viram "faixa escura".
- Nem `themeLight` nem `themeDark` sobrescrevem shadows.
- **Impacto:** sistêmico. Qualquer componente com elevation perde affordance no dark.
- **Ação:** mover shadows para dentro de `themeLight`/`themeDark` ou criar `tokens/semantics/shadows.ts` com chaves semânticas (none/xs/sm/md/lg/xl) resolvidas por tema.

#### C4. `usePrefersReducedMotion` não é cross-platform
- Usa `window.matchMedia` — quebra silenciosamente em React Native (retorna `false` no SSR path).
- **Impacto:** paridade cross-platform. Animações em RN não respeitam reduce motion.
- **Ação:** implementação `.native.ts` com `AccessibilityInfo.isReduceMotionEnabled()` + listener; manter a web atual.

#### C5. `tokens/components/text/text.ts` é orphan
- Define as mesmas variantes que `base-theme.ts` → `components.text`, mas **ninguém o importa** dentro do tema.
- Risco: uma edição em um lugar não propaga para o outro; stale data.
- **Impacto:** governança. Fonte única de verdade quebrada.
- **Ação:** remover `tokens/components/text/` (ou inverter: importar de lá no `base-theme.ts` e apagar a cópia inline).

#### C6. 18 componentes não têm recipe no tema
- `tabs`, `tag`, `breadcrumb`, `pagination`, `spinner`, `skeleton`, `progressBar`, `progressCircle`, `table`, `navBar`, `tabBar`, `fab`, `buttonGroup`, `popover`, `menu`, `carousel`, `radioCard` — estilo hardcoded no componente.
- Consequência: theming por produto (via `createTheme`) **não afeta esses 17 componentes**.
- **Impacto:** sistêmico. Promessa de theming é parcial.
- **Ação:** R2–R12 já cobrem componente-a-componente; este achado define que todos precisam ganhar recipe durante a revisão.

---

### 🟡 Altos — DX / escalabilidade

#### H1. Spacing semantic tem salto irregular entre `huge` (28) e `giant` (40)
- Passos: 0, 4, 8, 12, 16, 20, 24, 28, **40**. Todos os demais incrementos = 4; último = 12.
- Consumidor que espera progressão linear quebra a escala.
- **Ação:** ou incluir um `xlarge` (32) entre huge e giant, ou documentar explicitamente que giant é o salto para layouts amplos.

#### H2. borderRadius primitives `20, 28, 36, 44` nunca aliasados
- Slots órfãos. Ninguém consegue usá-los semanticamente.
- **Ação:** ou remover do primitive, ou ampliar semantic para 4 níveis adicionais.

#### H3. `alphaColor` em `opacity.ts` com escalas hand-picked
- Black tem 8/16/20/28/36/40/48/52/60/68/72/80; White tem 16/24/28/36/44/52/56/64/72/80/84/92 — **listas diferentes**.
- Não sistemático; originou de picks de Figma.
- **Ação:** normalizar para um stop system consistente (ex: 5/10/20/30/40/50/60/70/80) ou mover para `semantics/` com aliases.

#### H4. Ramps de cor têm densidade diferente
- `aqua, ocean, sapphire, sky`: 12 stops (10–120). Demais: 10 stops (10–100).
- Themes só usam `aqua, neutral, ocean, orange, red, rose, sandstone, yellow` — 8 de 19. 11 ramps são **não-consumidas**.
- **Ação:** decidir se ramps não-consumidas são reserva estratégica ou morta (e documentar).

#### H5. `ArborTheme` force-casta `colors` e `components` para o tipo do light
- `ThemeDark['colors']` idêntico ao `ThemeLight['colors']` por intersecção, mas o cast é fraco.
- Quem escreve `createTheme(themeDark, {...})` perde pistas de tipagem.
- **Ação:** modelar como união discriminada por `mode` ou promover `ThemeShape` como contrato-raiz.

#### H6. `base-theme.ts` mistura recipes com e sem `defineSlotRecipe`
- `button`, `badge`, `card`, `chip`, `input`, `text` — objetos literais.
- `field`, `checkbox`, `radio`, `switch`, `select`, `dialog`, `drawer`, `tooltip`, `avatar`, `alert`, `accordion`, `toast` — `defineSlotRecipe(...)`.
- Inconsistência convencional; a engine aceita ambos mas leitor do código não sabe qual padrão seguir.
- **Ação:** adotar wrapper (`defineRecipe` / `defineSlotRecipe`) em 100% dos casos.

#### H7. `ThemeComponents` (types.ts) declara slots que não existem no tema (`tabs`, `tag`)
- Dois declarados, zero implementados. Indicam contratos desejados mas não cumpridos.
- **Ação:** remover declarações órfãs ou cumprir o contrato agora.

#### H8. `base-theme` expõe aliases duplicados
- `borders: borderWidth, borderWidths: borderWidth` (ambos apontam para o mesmo).
- `sizes: spacing, space: spacing` — aparente duplicação, mas ambos são load-bearing: o transform engine usa `theme.space` (padding/margin/gap via `getSpace`) e `theme.sizes` (width/height via `getSize`/`getWidth`).
- **Ação:** remover apenas `borders` (zero consumidores confirmados). Manter `sizes` e `space` — remover exige refactor do engine.

---

### 🟢 Menores — ajustes pontuais

#### M1. `borderRadius.full = 1000` é um hack
- Sugestão: usar `9999` ou documentar como "effectively infinite".

#### M2. `lineHeight` semantic e primitive ambos em px, mas semantic não cobre todos os primitives
- OK para RN. Considerar ratio (`1.2`, `1.5`) para web quando houver.

#### M3. `fontWeight` pula 300 e 600
- Apenas 400/500/700. Pode limitar designs. Avaliar necessidade.

#### M4. 291 ocorrências de `style={{...}}` em 95 arquivos de componentes
- Não-foundations mas diretamente relacionado à governança de tokens.
- Muitos são `<svg style={{...}}>` (aceitável) ou overrides dinâmicos (ex: `transform: rotate(${n}deg)`). Triagem real fica para R2+.
- **Ação:** R2–R12 devem auditar caso a caso com a rubrica eixo 4.2.

#### M5. 2 arquivos usam tags HTML cruas
- `src/components/core/icon/core/icon-showcase.tsx` (provavelmente showcase, baixa prioridade).
- `src/components/input/core/select.tsx` (crítico — entra em R6).

#### M6. `createBreakpoints` retorna objeto híbrido (array + keys)
- Funciona, mas tipagem é frágil. Qualquer `Object.keys(breakpoints)` mistura índices numéricos e nomes.
- **Ação:** considerar API alternativa (objeto simples + array derivado) em futuro RFC.

---

## 3. Gaps semânticos detectados

- **shadows:** sem semantic layer (`surface.shadow`, `overlay.shadow`).
- **colors:** sem `focus.ring`, `focus.outline` como aliases — componentes hardcodam cor de foco.
- **opacity:** sem alias para overlay (`overlay.backdrop` está em `background.overlay` via cor, não em opacity).
- **motion:** sem aliases semânticos (`fade`, `collapse`, `slideIn`) para padronizar intenções.
- **typography:** sem aliases agregados (`display.large`, `body.default`) que combinem size+weight+line-height — hoje o componente compõe três tokens separados.

---

## 4. Recomendações sistêmicas

### 4.1 Prioridade imediata (pré-R2)

1. **C1 brand vs success** — escolher rampa diferente para success; atualiza ambos os temas.
2. **C5 text orphan** — remover `tokens/components/text/`.
3. **C6 plano de recipes** — documentar que R2–R12 vão adicionar recipe a cada componente faltante.

### 4.2 Durante R2–R12

- **C3 shadows tematizadas** — quando Card (R9) for revisado, resolver shadows por tema.
- **C4 usePrefersReducedMotion nativo** — criar `.native.ts` em R3 (quando Text/Clickable/Icon forem avaliados, motion é transversal).
- **H6 recipe wrapper uniforme** — normalizar à medida que cada componente cair na fila.

### 4.3 Pós-R12 (R13 consolidação)

- **C2 rename de fontSize** — RFC com migration. Breaking change coordenado.
- **H3 alphaColor normalizar** — RFC.
- **H4 ramps não consumidas** — decisão estratégica (podar vs preservar).

---

## 5. Follow-ups

### Fix imediato (baixo risco, mesmo PR)
- [x] Remover `src/foundations/tokens/components/text/` (C5). ✓ 2026-04-23
- [x] Remover alias `borders` de `baseTheme` (H8 — `sizes`/`space` mantidos: são load-bearing do engine). ✓ 2026-04-23
- [x] Remover `tabs` de `ThemeComponents` — contrato não cumprido (H7). ✓ 2026-04-23
- [x] `feedback.success` → rampa `emerald` em light e dark (C1). ✓ 2026-04-23

### Issue
- [ ] Shadows por tema (C3).
- [ ] `usePrefersReducedMotion.native.ts` (C4).
- [ ] Padronizar wrapper de recipe em 100% dos slots de `base-theme.ts` (H6).
- [ ] `ThemeComponents` — remover `tag` ou implementar recipe (H7).
- [ ] Spacing `xlarge` entre huge e giant (H1).
- [ ] borderRadius — aliasear 20/28/36/44 ou removê-los (H2).

### RFC
- [ ] RFC — Convenção única de nomeação de fontSize (C2). Breaking. Afeta todos os componentes.
- [ ] RFC — Shadows semantic layer tematizada (C3).
- [ ] RFC — Cor `focus.ring` + `focus.outline` como semantic token (gap).
- [ ] RFC — Motion semantic layer (`fade`, `collapse`, `slideIn`) (gap).
- [ ] RFC — Typography aggregate tokens (`body.default`, `display.large`) (gap).
- [ ] RFC — Normalização de `alphaColor` (H3).
- [ ] RFC — Poda de ramps não consumidas (H4).

---

## 6. Notas de arquiteto

- A arquitetura em três níveis (primitives → semantics → components) está **presente mas incompleta**. A camada semântica tem lacunas (shadows, motion, typography aggregate, focus), e `tokens/components/` está praticamente vazio.
- O tema é **híbrido**: foundations (base-theme) misturado com recipes de componente. Faz sentido como ponto de partida, mas quando os 17 componentes faltantes ganharem recipe, o `base-theme.ts` vai estourar. **Refator futuro:** extrair cada recipe para seu próprio arquivo (`theme/components/<nome>.ts`) e apenas importar no base-theme.
- `createTheme` funciona mas não valida estrutura injetada — consumidor pode passar chave inexistente. Em R13 avaliar schema validation leve.
- Prioridade pragmática: **não travar R2 em cima de todos os RFCs**. Os achados **C1, C5, C6** são blockers reais; os demais podem ser endereçados em paralelo.

---

## 7. Conclusão

Foundations sustentam o que existe hoje, mas **não estão prontos para escalar sem correções**. Os 6 itens críticos precisam entrar na fila antes que as fases R2–R12 gerem trabalho em cima de tokens ambíguos (fontSize, success vs brand) ou gaps (shadows no dark, reduced motion em RN).

**Decisão de entrada para R2:** prosseguir com os blockers C1, C5, C6 resolvidos ou explicitamente tratados como issues abertas. Os demais (RFCs) não bloqueiam, desde que os componentes novos que forem revisados **não introduzam mais débito nos mesmos eixos**.
