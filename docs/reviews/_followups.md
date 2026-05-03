# Follow-ups consolidados — R1, R2, R3, R4, R5, R6, R7, R8

> Índice acionável de tudo que ficou em aberto após cada fase de review. Atualizar ao mover itens para "concluído", abrir issue/PR ou rejeitar.

**Última atualização:** 2026-05-03 (RFC-0031 SP-1 implementada — `xs/sm/md/lg/xl` → `xsmall/small/medium/large/xlarge` em 16 props públicas + recipes + density tokens + Spinner por consistência interna; 974/974 verdes; CHANGELOG ganhou entrada Breaking; pre-v1, sem aliases).

> Para débito técnico mapeado (decisões de adiar com plano de resolução), ver [`docs/TECH_DEBT.md`](../TECH_DEBT.md).

---

## Visão geral

| Fase | Fixes pendentes | Issues abertas | RFCs abertas | RFCs implementadas | DoD cumprida? |
|---|---:|---:|---:|---:|---|
| R1 | 0 | 6 | 7 | 0 | parcial — issues C3/C4 não viraram código |
| R2 | 0 | 6 | 2 | 3 (RFC-0001, 0002, 0005 parcial) | parcial — testes verdes 536/536, faltam stories/testes ausentes |
| R3 | 0 | 6 | 2 | 6 (RFC-0006, 0008, 0009, 0010, 0011, 0012) | parcial — testes verdes 598/598, Storybook build não verificado |
| R4 | 0 | 14 | 0 | — | ✅ — bug crítico CR4-1 corrigido, 544/544 verdes |
| R5 | 0 | 24 | 2 (4 candidatas) | 2 (RFC-0013, 0014) | ✅ — fixes triviais aplicados, dead code removido, FileUpload pt-BR, RFCs do gate R6 implementadas (RFC-0013/0014) |
| R6 | 0 | 30+ | 0 (6 candidatas) | — | ✅ — review documentada + fixes triviais aplicados (598/598) |
| R7 | 2 (PB-4, PB-5) | ~10 (B-3/12/count, PC-15/PB-clamp, label/tones/motion sweep, B-anchor-a11y) | 1 candidata (SP-1 size naming) | — | ✅ — 5 reviews + 10 fixes em sweep coletivo, 923/923 verdes |
| R8 | 0 | ~8 (RTL engine whitelist, depreciar colors.status, slot recipe completo Tag/Chip, motion native shim, label i18n, tones cross-comp, Chip-Interativo discussão) | 3 candidatas (SP-1 fica, feedback-tones, Chip-Interativo) | 1 (foundations: `feedback.info.*`) | ✅ — 4 reviews + sweep 8.A/8.B/8.C, 940/940 verdes |

**Total:** 15 RFCs (`RFC-0001` a `RFC-0015`) — 11 implementadas (0001, 0002, 0005, 0006, 0008, 0009, 0010, 0011, 0012, 0013, 0014, 0015), 3 em Draft (0003, 0004, 0007) · ~110 issues · 2 fixes pendentes (R7: PB-4, PB-5) · 4 TDs resolvidas (TD-008, TD-010, TD-011, TD-012). R8 abriu 3 RFCs candidatas (SP-1 confirmada, feedback-tones, Chip-Interativo) e fechou foundations gap `feedback.info.*` que originou no R7.

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

- [x] **Testes web** adicionados em Flex, Grid, Container, Center, Square, Circle, Spacer (2026-04-24 — 598/598 verdes).
- [ ] **Testes native** ainda pendentes para Grid (`grid.native.tsx` sem cobertura).
- [ ] **Stories** ausentes em Container, Center, Square, Circle, Spacer (5 componentes).
- [ ] **Container** — regressão específica de `maxWidth: string`.
- [ ] **Transform — whitelist incompleto (achado durante testes R2)**: `AVAILABLE_STYLE_PROPERTIES` não inclui `grid-template-*`, `grid-column-gap`, `grid-row-gap`, `grid-auto-flow`, `grid-auto-rows/columns`, `marginInline`, `paddingInline`, `justifySelf`, `backgroundImage/Size/Position/Repeat`. Componentes (Grid, Container, Spacer, Image-bg) passam essas props mas são descartadas silenciosamente. Estilo visível hoje vem de `display:grid`/`display:block`/`display:flex`/`flex:1` apenas. Decidir: estender whitelist (PR mecânico) ou tratar como feature de nova fase.
- [ ] **Box / Flex** — remover `onClick` da tipagem (anti-pattern: usar `Clickable`).
- [ ] **Container** — promover `fluid`/`maxWidth` para discriminated union.
- [ ] **Container** — extrair `resolveMaxWidth` para `utils/` com testes isolados.
- [ ] **Container** — avaliar permitir `...rest` (aumentar Pick).

### R4 — Botões e triggers

Issues abertas após review consolidada em [`R4-button-buttongroup-fab.md`](./R4-button-buttongroup-fab.md):

- [ ] **HR4-1** `forwardRef` em Button, IconButton, ButtonGroup, FAB (sweep coordenado).
- [ ] **HR4-2** Avaliar `<PressFeedback>` em Button/FAB (decisão de produto).
- [ ] **HR4-10** Mover `attachedStyle` de Button para ButtonGroup (RFC).
- [ ] **HR4-11** IconButton como variant de Button vs componente separado (RFC).
- [ ] **HR4-12** Token de `keyframe` `arbor-spin` em motion tokens.
- [ ] **HR4-13** FAB `outline="none"` quebra focus visible — condicionar a `:not(:focus-visible)`.
- [ ] **HR4-14** API `position` de FAB: `position?: undefined` em vez de `position="none"` (RFC).
- [ ] **HR4-15** FAB.native: migrar `TouchableOpacity` → `Pressable`.
- [ ] **HR4-16** FAB.native: paridade ou doc para `animateOnMount`.
- [ ] **MR4-2** `IconButton` sem testes próprios.
- [ ] **MR4-3** `IconButton` sem story dedicada.
- [ ] **MR4-4** Warning a11y para Button vazio sem `aria-label`.
- [ ] **MR4-5** Avaliar `ButtonGroup.native.tsx`.
- [ ] **MR4-6** ButtonGroup: warning em dev se filhos não-elementos forem passados.
- [ ] **MR4-8/9/10** Aumentar cobertura de testes (FAB 7→15+, Button 14→15+, ButtonGroup 7→15+).
- [ ] **CR4-3 → TD-004** (TECH_DEBT) Native abstraction para FAB.
- [ ] **CR4-4/5 → TD-005** (TECH_DEBT) Cores e shadows hardcoded em FAB.

### R5 — Formulário base (Field + Input)

Issues abertas após review consolidada em [`R5-form-base.md`](./R5-form-base.md):

**Field:**

- [ ] **F-1** Field.Control: condicionar `aria-describedby` à existência real do Description (CR5-2).
- [ ] **F-2** Field.Control: também injetar `aria-describedby` apontando para `errorId` quando `isInvalid` (cobertura `aria-errormessage` parcial).
- [ ] **F-3** Slots aceitarem props adicionais (`style`, `className`, `id` próprio).
- [ ] **F-4** Recipe variant `size` propagada via `<Field.Root size="md">` (HR5-2).
- [ ] **F-5** Field.native: implementar testes (cobertura zero).
- [ ] **F-6** Field.native: ler tokens via `useTheme()` (TD-005 padrão).
- [ ] **F-7** JSDoc em `Field`/slots documentando contrato compound.
- [ ] **F-8** Stories adicionais: composição completa, `size`, integração Field+Checkbox/Radio/Switch.
- [ ] **F-9** Cast `(slots as Record<string, unknown>)` — bloqueado por **RFC-0007**.
- [ ] **F-10** `forwardRef` no `Field.Root` — sweep TD-007.

**Input (família):**

- [ ] **I-1** TextArea, SearchInput, Counter, FileUpload: criar testes (CR5-3).
- [ ] **I-2** Stories dedicadas para TextArea, Counter, FileUpload.
- [ ] **I-3** TextInput: remover `outline="none"`; usar `:focus-visible` (HR5-3).
- [ ] **I-4** Counter: substituir `'−'`/`'+'` por `<Icon name="Minus|Plus" />`.
- [ ] **I-5** Counter: substituir `'white'` por token; usar `transition()` helper.
- [ ] **I-6** Counter: `forwardRef` + `role="spinbutton"` + `aria-valuenow/min/max` + setas teclado (HR5-6).
- [x] **I-7** FileUpload: traduzir strings para pt-BR (HR5-7) — aplicado em 2026-04-24.
- [ ] **I-8** FileUpload: substituir emojis por `<Icon />` + `<Spinner />`.
- [ ] **I-9** FileUpload: `forwardRef` + `role="button"` + `tabIndex` + Enter/Space (HR5-8).
- [ ] **I-10** FileUpload: expor erros de validação via callback `onValidationError`.
- [x] **I-11** FileUpload: trocar `transition: 'all 0.2s'` por específico — aplicado (transition('border-color', 'background-color', 'fast')).
- [ ] **I-12** TextInput/TextArea: promover `style.border/backgroundColor/fontFamily` para props (potencialmente coberto por TD-008).
- [ ] **I-13** TextInput: remover sentinel `' '` em `effectiveError` (HR5-12).
- [ ] **I-14** TextArea, SearchInput, Counter, FileUpload: ler `useFieldContext` (HR5-14) — **será resolvido por RFC-0014**.
- [ ] **I-15** Touch target ≥ 44×44 em sm: revisar TextInput/Counter (MR5-6/7).
- [ ] **I-16** Counter: remover redundância `pointerEvents: 'none'` + `disabled`.
- [x] **I-17** Counter: remover default export — aplicado (mais TextInput/TextArea/FileUpload também).
- [ ] **I-18** Stories TextInput: clearable, leftIcon, rightIcon, integração Field.
- [x] **CR5-4 / TD-010** `src/components/input/core/select.tsx` removido em 2026-04-24 (`SelectProps` interface também).

**RFCs do gate R6 — Implementadas (2026-04-24):**

- [x] **[RFC-0013](../rfcs/RFC-0013-convencao-naming-de-props-booleanas.md)** — Convenção `is*` × `disabled`/`open`/`required` (HR5-11). `Field`/`Dialog` migrados para API canônica. Aliases legados (`isDisabled`/`isRequired`/`isInvalid`/`isOpen`) **removidos em 2026-04-24** (sem consumidores externos — sem janela de transição).
- [x] **[RFC-0014](../rfcs/RFC-0014-contrato-canonico-field-aware-components.md)** — Contrato canônico Field.Control × Field-aware components. `FieldContext` ganhou registry de slots; família Input + R6 (Checkbox/Radio/Switch/Select) marcados `isFieldAware`; Field.Control detecta marker e não duplica wiring. Fechou CR5-2, HR5-4, HR5-14, TD-011.

**F-1 (aria-describedby condicional)** e **I-14 (inputs lendo Field context)** — ambos fechados pela implementação de RFC-0014.

**RFCs candidatas R5 (não bloqueantes para R6):**

- [ ] **RFC candidata: Recipe `input` consumida** (`getFieldFrameStyle` imperativo → slot recipe) (CR5-1 / TD-008).
- [ ] **RFC candidata: Polimorfismo `Field.Root` (`as="fieldset"`)** (MR5-11).
- [ ] **RFC candidata: `leftIcon`/`rightIcon` → `startIcon`/`endIcon`** (RTL) (MR5-16).
- [ ] **RFC candidata: Surface area `extends InputHTMLAttributes` → `nativeProps`** (HR5-13).
- [ ] **RFC candidata: Estratégia Field.native** — partir de primitives ou aceitar split formal (HR5-1 / TD-009).

### R6 — Formulário seleção (Checkbox + Radio + RadioCard + Switch + Select)

Issues abertas após review consolidada em [`R6-form-selection.md`](./R6-form-selection.md).

**Fixes imediatos — concluídos em 2026-04-24 (598/598 testes verdes, lint limpo):**

- [x] **CR6-1** Checkbox: `name` e `value` repassados ao `<input>` via `CheckboxContext` (bug funcional resolvido).
- [x] **CR6-2** RadioCard: `role="radio"` duplicado removido do `<Flex>`; troca por `aria-hidden="true"` (`<input type=radio>` mantém a semântica).
- [x] **HR6-3** Radio: `disabled || …` → `disabled ?? …`; default `disabled = false` removido da destructuring (alinha com Checkbox/Switch/Select).
- [x] **MR6-1** `displayName` adicionado em: Checkbox.Label/Description (web+native), Checkbox.Root/Indicator (native), Radio.Root/Indicator/Label/Description, Switch.Root (native), Switch.Track/Thumb, Select.Root/Trigger/Value/Content/Item.
- [x] **MR6-2** Stories sweep: `<div style={{…}}>` → `<Flex>` / `<Box>` em Checkbox (Disabled/Group/WithDescription), Radio (WithDescription/Group/Sizes), RadioCard (Group/Sizes), Switch (WithLabel/Disabled/Sizes), Select (Sizes).
- [x] **MR6-3 / MR6-4** Select: `placeholder?` e `style?` removidos de `SelectRootProps`; `SelectOption` interface removida (e do index); stories `Default`/`WithDefaultValue`/`WithDisabledItem`/`Sizes`/`Disabled` envoltas em `<Box width="280px">`.
- [x] **CB-2** Checkbox: `displayName` em `CheckboxLabel`, `CheckboxDescription`, `CheckboxRoot`, `CheckboxIndicator` (web + native).
- [x] **CB-3** Checkbox: JSDoc `@platform web-only` incorreto substituído por doc reflete a existência do `.native.tsx`.
- [x] **R-3** Radio: JSDoc `@platform web-only` adicionado em `RadioProps.ts` (não existe `radio.native.tsx`).
- [x] **RC-2** RadioCard: `export default RadioCard` removido; `export { default } from './radio-card'` removido do `core/index.ts`. Confirmado grep: zero importações `import RadioCard` (default) no repo.

**Issues — Checkbox:**

- [ ] **CB-4** `forwardRef` em `CheckboxRoot` (sweep TD-007).
- [ ] **CB-5** `:focus-visible` token quando definido (RFC R1 futura).
- [ ] **CB-6** Native: trocar `Pressable` por `Clickable`.
- [ ] **CB-7** Native: substituir hardcodes (`width: 18`, `borderRadius: 4`, `borderWidth: 2`) por props ou tokens.
- [ ] **CB-8** Native: usar `<Icon name="Check\|Minus" />` em vez de `<Box>` rotacionado.
- [ ] **CB-9** Native: `accessibilityState={{ checked: 'mixed' }}` quando indeterminate.
- [ ] **CB-10** Testes adicionais: focus, keyboard, label click, touch target, RTL, dark theme, anúncio "mixed".
- [ ] **CB-11** Testes nativos (cobertura zero).
- [ ] **CB-12** Stories: integração `<Field>`, form com submit, dark theme.
- [ ] **CB-13** JSDoc explicando contrato de `indeterminate` (caller deve limpar).

**Issues — Radio:**

- [ ] **R-4** `forwardRef` em `RadioRoot`.
- [ ] **R-5** Foco visível (boxShadow/outline no card via `:focus-visible` do input oculto).
- [ ] **R-6** `Indicator` deve escalar com `size` (sm: 16, md: 20, lg: 24).
- [ ] **R-7** Respeitar `usePrefersReducedMotion`.
- [ ] **R-8** Promover `gap`/`padding`/`backgroundColor`/`transition` de `style` para props.
- [ ] **R-9** Testes: keyboard real (`fireEvent.click` em vez de só ler `disabled`), setas, focus, sizes, RTL, integração `<Field>`.
- [ ] **R-10** Story: integração `<Field>` completa, dark theme, RadioGroup quando existir.
- [ ] **R-11** Decidir comportamento native (criar `radio.native.tsx` ou guard de import).

**Issues — RadioCard:**

- [ ] **RC-4** Criar suíte de testes (cobertura zero — escrever 12+ casos).
- [ ] **RC-5** Adicionar `useFieldContext` + `markFieldAware(RadioCard)`.
- [ ] **RC-6** Trocar `useState + checked ?? internal` por `useControllableState`.
- [ ] **RC-7** Foco visível.
- [ ] **RC-8** Bug visual `sm`/`md` indistinguíveis em font (ajustar `sizeMap`).
- [ ] **RC-9** Promover `style` declarativas onde existem props.
- [ ] **RC-10** Respeitar `usePrefersReducedMotion`.

**Issues — Switch:**

- [ ] **SW-3** `forwardRef` em `SwitchRoot`.
- [ ] **SW-4** Foco visível no track quando `<input>` recebe `:focus-visible`.
- [ ] **SW-5** Touch target ≥ 44×44 (padding wrapper).
- [ ] **SW-6** Respeitar `usePrefersReducedMotion`.
- [ ] **SW-7** RTL: usar `inset-inline-start` em vez de `transform: translateX`.
- [ ] **SW-8** Native: trocar `View` por `Box`/`Flex`; mapear `aria-labelledby`.
- [ ] **SW-9** Native: criar testes.
- [ ] **SW-10** JSDoc + Storybook docs para diferença visual cross-platform.
- [ ] **SW-11** Promover `style` declarativas.
- [ ] **SW-12** Story: integração `<Field>`, dark theme.

**Issues — Select:**

- [ ] **SE-7** `forwardRef` em `SelectTrigger`.
- [x] **SE-8** Substituir `▲`/`▼` por `<Icon name="ChevronDown" />` com rotação CSS. (RFC-0020)
- [x] **SE-9** Foco visível no trigger. (RFC-0020 — `_focusVisible: focusRing` no slot trigger)
- [ ] **SE-10** Promover `style` declarativas (height/padding/fontSize/border/backgroundColor/color).
- [ ] **SE-11** `transition()` em open/close + `usePrefersReducedMotion`.
- [x] **SE-12** Touch target ≥ 44×44 em `sm`/`md`. (TD-016 + recipe `select`)
- [x] **SE-13** Substituir outside-click manual por `DismissableLayer`. (RFC-0020 — `Portal` + `DismissableLayer` com `excludeRef={triggerRef}`)
- [ ] **SE-14** `useOverlayStack` para múltiplos selects.
- [x] **SE-15** Stories: `<Field>`, controlado, dark theme, conteúdo longo, portal. (RFC-0020 — `KeyboardOnly`/`InsideOverflowClip`/`LongList`/`WithFieldContext`/`Theming`)
- [x] **SE-16** Testes: keyboard (setas/Home/End/type-ahead), focus, RTL, dark theme. (RFC-0020 — 52 cases web + 16 native)

**RFCs candidatas R6 (não bloqueantes para R7, mas decidir antes de R7 fechar):**

- [ ] **RFC candidata R6-A: Recipes mortas em R6** — `checkbox`/`radio`/`switch`/`select` declaradas em `base-theme.ts` mas não consumidas. Mesmo padrão de TD-008 (resolvido). Decidir entre implementar consumo ou remover do theme. **Sweep coordenado.**
- [ ] **RFC candidata R6-B: Foco visível em inputs ocultos** — padrão técnico recorrente em Radio/RadioCard/Switch/Checkbox. Definir como refletir `:focus-visible` no visual desenhado (boxShadow/outline/peer-style). Resolve HR6-1.
- [ ] **RFC candidata R6-C: `RadioGroup` / `CheckboxGroup` / `SwitchGroup`** — caso de uso primário (escolha entre N, lista de toggles) hoje exige consumidor montar `<div role="...">` + gerenciar estado coletivo manualmente. Lacuna de produto.
- [ ] **RFC candidata R6-D: `RadioCard` — deprecar, unificar como `Radio variant="card"` ou alinhar contratos** — duplicação funcional com Radio (mesma intenção, contratos divergentes, manutenção dobrada).
- [ ] **RFC candidata R6-E: Slots reais ou remoção em `Switch.Track`/`Switch.Thumb`** — slots fantasma hoje. Decidir entre refactor para slot real ou tornar Switch elementar.
- [x] **RFC candidata R6-F: Select cumprindo WAI-ARIA "Select-Only Combobox"** — RFC-0020 implementada (web + native). Activedescendant, item registry, type-ahead com normalize NFD pt-BR, Portal+DismissableLayer com `excludeRef`, focus-visible via recipe.
- [ ] **RFC candidata R6-G: Render via `Portal` para overlays** — Select.Content + R11 (Dialog/Drawer/Tooltip/Popover/Menu). Definir antes de R11 poupa retrabalho.
- [ ] **RFC candidata R6-H: Estratégia native para componentes form web-only** — Radio/RadioCard/Select sem `.native.tsx`. Decidir entre re-implementar ou marcar formal `web-only` com guard de import.
- [ ] **RFC candidata R6-I: Touch target padrão do DS** — invariante WCAG 44×44 mínimo em todos os componentes interativos. Cobre Counter (R5), TextInput sm (R5), Switch md (R6), Select sm/md (R6), items (R6).
- [ ] **RFC candidata R6-J: Indicator visual cross-platform unificado para Checkbox** — substituir `accentColor` (web, dependente do user agent) e Box rotacionado (native, sem ícone real) por SVG/Icon próprio com paridade. Resolve HR6-8/HR6-9.

### R3 — Core cross-platform primitives

- [x] **Text** — testes (polimorfismo, ref, role, parsing HTML, truncamento) adicionados 2026-04-24.
- [ ] **Text** — stories por variante tipográfica nomeada (`bigNumber`, `body`, `display1–4`, `title1–2`, etc.).
- [ ] **Text** — story para HTML parsing com `onLinkPress`.
- [ ] **Text** — story para truncamento com `numberOfLines={2}`.
- [ ] **Text** — fixar `lineHeight` hardcoded (`'20px'`) na recipe para usar token.
- [ ] **Text** — **bug de truncamento**: `maxHeight: calc(${lineHeight} * ${n})` vira `NaNpx` no transform (getSize interpreta string como numero). Follow-up registrado via teste de truncamento (cobre display/overflow mas não max-height).
- [ ] **Text** — investigar `onPress`/`onLinkPress` na interface: html-converter não liga `onLinkPress` ao click nativo do `<a>` no web hoje (teste cobre só href atributo).
- [x] **Clickable** — testes (renderização, click, ref, TapState, keyboard) — implementados na Fase R4/gate.
- [ ] **Clickable** — stories (default, com TapState, polimórfico, disabled, em composição).
- [x] **Clickable** — warning de dev para `as !== 'button'/'a'` sem `role` (ativo em dev).
- [ ] **Clickable** — documentar `PressFeedback` no JSDoc com exemplo.
- [ ] **Icon** — testes para `icon.native.tsx` (normalização de `currentColor`, size string, `accessibilityElementsHidden/Label`).
- [x] **Image** — testes web (18 testes: mode="img"/"background", resizeMode, fallback, errorFallback, aria-busy, onLoad/onError, ref) adicionados 2026-04-24.
- [ ] **Image** — testes native (normalização source, dimensões percentuais, transição de status com `onLoad`/`onError` da RN).
- [x] **Image** — stories ampliadas (`Default`, `Contain`, `Stretch`, `CenterMode`, `Background`, `ErrorState`, `CustomFallback`, `NoFallback`) adicionadas 2026-04-24.
- [x] **Image** — `forwardRef` adicionado (verificado em teste).
- [x] **Image** — comportamento dual substituído por `mode: 'img'|'background'` (RFC-0011 implementada 2026-04-24); JSDoc atualizado em `ImageProps.ts`.

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
| [RFC-0005](../rfcs/RFC-0005-empty-vs-empty-state.md) | Destino do componente `Empty` | R2-E · M-R2-5 | nada | **Implemented parcial (2026-04-24)** — `Empty` removido; `EmptyState` compound em RFC futura |

### R3

| ID | Título | Origem | Bloqueia | Status |
|---|---|---|---|---|
| [RFC-0006](../rfcs/RFC-0006-istruncated-vs-numberoflines-em-text.md) | Consolidar `isTruncated` e `numberOfLines` | R3-A · `text.md` | nada | **Implemented (2026-04-24)** — `isTruncated` removido de `TextProps` e `TypographyProps` (engine); `noOfLines` órfão removido junto |
| [RFC-0007](../rfcs/RFC-0007-tipagem-generica-de-userecipe.md) | Tipagem genérica do retorno de `useRecipe` | R3-B · `text.md` | múltiplos componentes que casteiam recipes | Draft |
| [RFC-0008](../rfcs/RFC-0008-tapstate-prop-vs-slot-em-clickable.md) | `tapState`: prop vs. slot em `Clickable` | R3-C · `clickable.md` | ~~R4~~ (destravada) | **Implemented c/ recorte (2026-04-24)** |
| [RFC-0009](../rfcs/RFC-0009-tamanhos-semanticos-em-icon.md) | Tamanhos semânticos para `Icon.size` | R3-D · `icon.md` | — | **Implemented (2026-04-24)** |
| [RFC-0010](../rfcs/RFC-0010-discriminated-union-decorative-em-icon.md) | Discriminated union `decorative` + `aria-label` | R3-E · `icon.md` | — | **Implemented (2026-04-24)** |
| [RFC-0011](../rfcs/RFC-0011-modo-de-renderizacao-explicito-em-image.md) | Modo de renderização explícito em `Image` | R3-F · `image.md` | implementar com RFC-0012 | **Implemented (2026-04-24)** |
| [RFC-0012](../rfcs/RFC-0012-loading-e-error-states-em-image.md) | Estados de loading/error em `Image` | R3-G · `image.md` | implementar com RFC-0011 | **Implemented (2026-04-24)** |

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

## Convenções registradas em CONTRIBUTING.md ✅

**Confirmado em 2026-04-24:** todas as 6 convenções emergentes das reviews já estão documentadas em `CONTRIBUTING.md` §Convenções de implementação (§1–§6), além da §7 cobrindo naming de props booleanas (RFC-0013) e eventos (RFC-0015).

1. ✅ **Invariantes por último** — `CONTRIBUTING.md §1`
2. ✅ **`Omit` das props que o componente controla** — `CONTRIBUTING.md §2`
3. ✅ **`displayName` obrigatório** — `CONTRIBUTING.md §3`
4. ✅ **`.native.tsx` só quando há divergência real** — `CONTRIBUTING.md §4`
5. ✅ **Stories usam apenas componentes do DS** — `CONTRIBUTING.md §5`
6. ✅ **Componentes `platform-split` têm warning de dev** — `CONTRIBUTING.md §6`
7. ✅ **Naming de props (RFC-0013) e eventos (RFC-0015)** — `CONTRIBUTING.md §7`

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
