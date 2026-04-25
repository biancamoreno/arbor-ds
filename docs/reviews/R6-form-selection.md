# R6 — Formulário · Seleção (Checkbox + Radio + RadioCard + Switch + Select)

**Período:** 2026-04-24
**Estado da base ao iniciar:** R5 fechada (Field + Input), gate R6 cumprido (RFC-0013/0014/0015 implementadas), 536/536 testes verdes.
**Estado ao concluir review:** 5 reviews documentadas (`checkbox.md`, `radio.md`, `radio-card.md`, `switch.md`, `select.md`); fixes triviais a aplicar; 1 bug funcional crítico (Checkbox ignora `name`/`value`); 1 bug a11y crítico (RadioCard `role="radio"` duplicado); a11y de Select abaixo de WAI-ARIA combobox.

---

## Contexto

R6 audita os 5 componentes de **seleção em formulário**: Checkbox (toggle binário), Radio (escolha entre N), RadioCard (Radio em layout de cartão), Switch (on/off), Select (escolha em listbox). Todos compartilham o contrato Field-aware estabelecido em RFC-0014 e a convenção de naming RFC-0013/0015.

A pergunta da auditoria:

1. O contrato Field-aware (RFC-0014) está consistente entre os 5 componentes?
2. O foco de teclado é visível e navegável em cada um?
3. Quais recipes do `base-theme.ts` são consumidas — e quais são dead recipes (TD-008 padrão)?
4. Onde os componentes divergem em surface area, slots fantasma, ou semântica HTML?
5. O que vai sangrar para R7 (feedback indicators) ou R11 (overlays) se não for resolvido agora?

---

## Achados consolidados

### Críticos / Bugs

| ID | Componente | Achado | Status |
|---|---|---|---|
| **CR6-1** | Checkbox | `name` e `value` declarados em `CheckboxRootProps` mas **destruturados como `_name`/`_value`** e nunca repassados ao `<input>`. Form submission HTML clássica perde o checkbox. | Fix imediato (CB-1). 1 linha. |
| **CR6-2** | RadioCard | `role="radio"` declarado **simultaneamente** no `<Flex>` visual e no `<input type=radio>` real → leitor de tela anuncia 2 radios para o mesmo controle. Quebra a11y. | Fix imediato (RC-1). 1 linha. |
| **CR6-3** | Select | A11y de teclado abaixo de WAI-ARIA "Select-Only Combobox": sem setas/Home/End/type-ahead, sem foco no item ativo, sem retorno de foco ao trigger no close, sem `aria-controls`/`aria-activedescendant`. | RFC sistêmica. Refatoração ampla. |
| **CR6-4** | Select | Sem `Portal` — listbox cortado por qualquer ancestor com `overflow: hidden/auto`. Bug em uso real (Select dentro de modal/sidebar/card). | RFC + implementação (compartilhada com R11). |
| **CR6-5** | RadioCard | **Cobertura de testes zero.** Componente com lógica de estado, render condicional, sem proteção. | Issue (RC-4). Sweep dedicado. |
| **CR6-6** | Todos R6 | **Recipes declaradas em `base-theme.ts` mas não consumidas** — `checkbox`, `radio`, `switch`, `select`. Mesma raiz de TD-008 (input recipe morta, resolvido). Theming dinâmico, dark mode token-driven, `createTheme` overrides não afetam os 5 componentes. | RFC sistêmica (compartilhada com TD-008). |

### High

| ID | Componente | Achado | Status |
|---|---|---|---|
| **HR6-1** | Radio, RadioCard, Switch | **Foco do teclado invisível.** `<input>` é `position: absolute; opacity: 0; pointerEvents: none`; visual desenhado por divs custom; **nada** reflete `:focus-visible`. WCAG 2.4.7 quebrado. | Issue ampla. Sweep "foco visível em inputs ocultos" + RFC. |
| **HR6-2** | Switch | `Switch.Track` e `Switch.Thumb` são **slots fantasma** — visual real é renderizado dentro de `SwitchRoot` independentemente. Caller cria DOM extra inócuo, mas API mente. | RFC (decidir entre slot real ou remoção). |
| **HR6-3** | Radio | `disabled || (fieldCtx?.disabled ?? false)` em vez de `disabled ?? fieldCtx?.disabled ?? false`. Inconsistente com Checkbox/Switch/Select. Quebra contrato Field-aware (RFC-0014: prop local vence). | Fix imediato (R-1). 1 linha. |
| **HR6-4** | RadioCard | **Não consome `useFieldContext` nem `markFieldAware`.** Único R6 fora do contrato Field-aware. | Issue (RC-5). |
| **HR6-5** | RadioCard | Re-implementa `useState + checked ?? internal` em vez de `useControllableState`. Inconsistente com R6. | Issue (RC-6). |
| **HR6-6** | RadioCard, Radio | **Duplicação funcional.** RadioCard é, em essência, um `Radio` em layout de cartão. Dois caminhos divergentes para o mesmo problema. | RFC (deprecar RadioCard ou unificar com `Radio variant="card"`). |
| **HR6-7** | Radio, Switch | **Sem `RadioGroup` / `SwitchGroup`** — caso de uso "selecione uma de N" / "ative várias features" exige consumidor montar `<div role="radiogroup">`/`<div role="group">` + gerenciar `value`/`name` manualmente. | RFC. |
| **HR6-8** | Checkbox web | `accentColor: theme.colors.interactive.default` deixa visual a cargo do user agent. Sem foco do DS, hover, error própria. Visual diverge entre Chrome/Safari/Firefox. | RFC (Indicator custom unificado). |
| **HR6-9** | Checkbox native | Indicator desenha **`<Box>` rotacionado em -45deg** em vez de Icon real. Indeterminate é o mesmo box sem rotação. Sem paridade visual web ↔ native. | Issue (CB-8). |
| **HR6-10** | Select | `▲`/`▼` unicode como chevron. Mesmo anti-pattern HR5-5 (Counter `−`/`+`). | Issue (SE-8). |
| **HR6-11** | Select | `outline="none"` no trigger sem `:focus-visible` substituto. Mesmo padrão HR5-3 (TextInput) e HR4-13 (FAB). | Issue (SE-9). |
| **HR6-12** | Select | `boxShadow: '0 4px 12px rgba(0,0,0,0.1)'` cru + `zIndex: 50` literal. Reincidência de R1-C3 (shadows tematizadas). | Issue (depende de R1-C3 RFC). |
| **HR6-13** | Select | `selectedValue` (string raw) é mostrado no trigger, **não** o children do `<Select.Item>`. UX confuso (selecionar "Apple" mostra "apple"). | RFC (item registry). |
| **HR6-14** | Switch | Touch target 24px (md) abaixo de WCAG 44px. `sm: 20px` pior. | Issue (SW-5). |
| **HR6-15** | Select | Touch target trigger 32px (sm), 40px (md) abaixo de 44. Items 36px abaixo. | Issue (SE-12). |
| **HR6-16** | Switch native | Usa `<View>` direto + `<RNSwitch>` da plataforma — **viola CLAUDE.md** (`View` deveria ser `Box`/`Flex`). `aria-labelledby` ignorado. `size` silenciosamente ignorado. | Issue (SW-8/SW-10). |
| **HR6-17** | Checkbox native | Usa `<Pressable>` direto — viola CLAUDE.md. | Issue (CB-6). |
| **HR6-18** | Radio, Select | Sem `radio.native.tsx`/`select.native.tsx`. Radio sem JSDoc `@platform web-only`; Select com JSDoc ✅. | Issue (R-3, RFC native). |
| **HR6-19** | Todos R6 | **`forwardRef` ausente nos Roots** (apenas `Checkbox.Indicator` e `RadioCard` têm). Reincidência sistêmica (TD-007). | Sweep coordenado. |

### Medium

| ID | Componente | Achado | Status |
|---|---|---|---|
| **MR6-1** | Todos R6 | `displayName` parcial ou ausente em sub-componentes (Radio: 0/4, Select: 0/5, Switch: 1/3, Checkbox: 2/4). Mesmo padrão MR5-1. | Fix imediato (sweep). |
| **MR6-2** | Stories Radio, Switch, Select, Checkbox, RadioCard | `<div style={{ display: 'flex', ... }}>` cru em stories `Group`/`WithLabel`/`Sizes`/`Disabled`. Anti-pattern documentado em CONTRIBUTING (R3 padrão emergente). | Fix imediato. |
| **MR6-3** | Select | `placeholder?` em `SelectRootProps` (nunca consumido) e `style?` em `SelectRootProps` (nunca repassado). Story `Default` faz `style={{ width: 280 }}` que cai por terra. | Fix imediato (SE-1/SE-2/SE-4). |
| **MR6-4** | Select | `SelectOption` interface exportada na API pública, **não consumida pelo compound**. Resíduo de refactor anterior. | Fix imediato (SE-3). |
| **MR6-5** | Radio | `Indicator` é **fixo 20×20** independente do `size`. Em `lg` (padding 20), proporção quebra. | Issue (R-6). |
| **MR6-6** | RadioCard | Bug visual: `sm` e `md` têm mesmo `titleSize: '16px'` e `descriptionSize: '10px'`. Diferem só em padding. | Issue (RC-8). |
| **MR6-7** | Switch web | `transform: translateX(${px}px)` fixo — em RTL, thumb não inverte. | Issue (SW-7). |
| **MR6-8** | Todos R6 | **Sem `Switch`/`Radio`/`Checkbox` respeitando `usePrefersReducedMotion`** apesar de aplicarem `transition()`. | Issue ampla. |
| **MR6-9** | Checkbox, RadioCard | `extends InputHTMLAttributes` em `CheckboxIndicatorProps` e `RadioCardProps` — surface area implícita ampla (HR5-13 padrão). | RFC `nativeProps` curado. |
| **MR6-10** | Select | Outside click + Escape registrados manualmente em `document` em vez de usar `DismissableLayer` (`ecosystem/primitives`). | Issue (SE-13). |
| **MR6-11** | Select | `useOverlayStack` existe mas Select não usa. Múltiplos selects abertos têm comportamento Escape ambíguo. | Issue (SE-14). |
| **MR6-12** | RadioCard | `default export` (único de R6 com isso). | Fix imediato (RC-2). |
| **MR6-13** | Checkbox | JSDoc `@platform web-only` em `CheckboxProps.ts:3` está incorreto (existe `checkbox.native.tsx`). | Fix imediato (CB-3). |
| **MR6-14** | Todos R6 | `style={{...}}` aplicando props que existem declarativas (`width`, `height`, `padding`, `gap`, `backgroundColor`, `transition`, `boxShadow`, `borderRadius`, `border`, `color`). Sweep amplo viável. | Issue ampla. |

### Low

| ID | Componente | Achado | Status |
|---|---|---|---|
| **LR6-1** | Todos R6 | Sem JSDoc nos sub-componentes explicando contrato compound (qual filho é obrigatório, qual é opcional, ordem). | Documentação. |
| **LR6-2** | Checkbox | Indeterminate é prop de leitura — caller deve limpar após `onCheckedChange`. Sem doc explicando. | Documentação (CB-13). |
| **LR6-3** | RadioCard | `children?` como escape hatch após `description` — sem doc. | Documentação. |
| **LR6-4** | Select | Default `defaultValue = ''` (sentinel "vazio") em vez de `undefined`. Sem doc. | Documentação. |
| **LR6-5** | Switch | Diferença visual cross-platform (web custom × SO native) sem doc. | Documentação (SW-10). |

---

## Padrões emergentes (cruzando R1–R6)

1. **Recipe declarada × recipe ignorada** — confirmado em **TD-008** (input, resolvido) e em **5 componentes R6** (`checkbox`/`radio`/`switch`/`select` + RadioCard sem nem declarar). Vale RFC sistêmica que **define quando declarar uma recipe é obrigatório consumir** — declaração sem consumo é dívida deliberada, não código morto neutro. Hoje as recipes do theme dão a impressão de que o sistema é theme-driven; na prática é hardcoded-driven.

2. **Foco invisível em inputs ocultos** — Radio, RadioCard, Switch, Checkbox web (parcialmente — `accentColor` desenha algo mas não é DS). Padrão técnico (input visualmente oculto, visual custom desenhado) **sem** a contraparte (refletir `:focus-visible` no visual). WCAG 2.4.7 quebrado em 4 dos 5 R6. Sweep + RFC para padrão.

3. **`Outline: none` em triggers focáveis** — FAB (HR4-13), TextInput (HR5-3), Select Trigger (HR6-11). Padrão recorrente. Vale lint rule ou refactor coordenado.

4. **Touch target < 44×44** — Counter sm 24×24 (HR5-7), TextInput sm 32px (MR5-6), Switch md 24px (HR6-14), Select sm 32px / md 40px (HR6-15). WCAG 2.5.5 (AAA) e best practice mobile-web. Definir invariante do DS.

5. **Field-aware contract com 1 desvio + 1 inconsistência** — RadioCard fora do contrato (HR6-4); Radio com `||` em vez de `??` (HR6-3). RFC-0014 quase respeitada — vale documentar em CONTRIBUTING como receita oficial.

6. **Slots fantasma** — Switch.Track/Thumb são wrappers vazios sem efeito (HR6-2). Auditar outros compounds buscando o mesmo: slot exposto que não recebe estilo do recipe, não tem variant, e cujo conteúdo é puro children pass-through.

7. **`extends HTMLAttributes` sem curadoria** — TextInput (HR5-13), Counter, Checkbox.Indicator, RadioCard. Surface area pública gigante implícita. RFC `nativeProps` curado vale.

8. **Strings unicode como ícones** — Counter `−`/`+` (HR5-5), Select `▲`/`▼` (HR6-10). Mesmo anti-pattern. Sweep.

9. **`<View>`/`<Pressable>` direto em `.native.tsx`** — Checkbox.native, Switch.native. Viola CLAUDE.md. Sweep + lint rule.

10. **Ausência de `RadioGroup`/`CheckboxGroup`/`SwitchGroup`** — caso de uso primário de Radio (escolha entre N) e comum de Checkbox/Switch (lista de toggles) exige composição manual. RFC.

11. **Stories usam `<div style={...}>`** — reincidência R2-CR2-2/R3-CR3-3/MR5-4. Sweep coordenado, fix trivial.

12. **`forwardRef` ausente em Roots de R6** — TD-007 reincidência. Sweep.

13. **RadioCard como duplicata de Radio** — caso limítrofe entre "componente próprio" e "variant de Radio". Vale RFC para decisão antes de R6 fechar.

14. **Sem `Portal` em overlays** — Select.Content (HR6-4); R11 (Dialog/Drawer/Tooltip/Popover) terá o mesmo problema. Definir agora poupa retrabalho.

15. **APIs residuais** — `SelectOption`, `placeholder`/`style` em SelectRootProps (resíduo). Vale sweep "código morto na API pública" pós-R6.

---

## Decisões de arquitetura — 2026-04-24

**CR6-1 (Checkbox name/value bug) — fix imediato.** 1 linha. Aplicar antes de qualquer outra coisa.

**CR6-2 (RadioCard role="radio" duplicado) — fix imediato.** Trivial. Remove a duplicação.

**CR6-3 (Select a11y combobox) — RFC + refatoração.** É a peça arquitetural mais relevante de R6. Não é fix; é refactoring do componente para cumprir WAI-ARIA "Select-Only Combobox" pattern. Provavelmente exige:
- Item registry (display × value).
- Focus management (foco em item ativo on open, retorno ao trigger on close).
- Keyboard handler em SelectContent (setas, Home/End, type-ahead).
- `aria-controls` + `aria-activedescendant`.
- Render via `Portal`.
RFC define escopo. Trabalho de 1–2 dias.

**CR6-4 (Select sem Portal) — agrupar com R11.** Decidir padrão de Portal para overlays do DS antes de R11 (Dialog/Drawer/Tooltip/Popover/Menu) pega Select de carona.

**CR6-5 (RadioCard sem testes) — issue, não fix imediato.** Após decisão sobre HR6-6 (deprecar ou unificar), suíte de teste se materializa naturalmente.

**CR6-6 (recipes mortas em R6) — RFC sistêmica.** Mesmo escopo de TD-008. Decidir entre implementar consumo via `useSlotRecipe` para todos os 5 OU remover as recipes do theme. Não fix isolado por componente — deve ser coordenado.

**HR6-1 (foco invisível) — sweep + RFC pequena.** Definir padrão "input oculto + visual custom → refletir `:focus-visible` no visual via boxShadow/outline". Aplicar nos 4 componentes (Radio, RadioCard, Switch, Checkbox web).

**HR6-2 (slots fantasma Switch) — RFC.** Decisão entre slot real (refactor visual) ou remoção (Switch elementar). Vale também auditar Card/Dialog/Drawer slots para mesmo problema.

**HR6-3 (Radio `||` vs `??`) — fix imediato.** 1 linha.

**HR6-4 + HR6-5 + HR6-6 (RadioCard fora do contrato + duplica Radio) — RFC.** Decidir entre:
- (a) Deprecar RadioCard, oferecer `<Radio.Root variant="card">`.
- (b) Manter ambos, alinhar contratos (Field-aware, useControllableState).
- (c) Tornar RadioCard composição declarativa de Radio.
RFC vale antes de R7 (Radio será reusado).

**HR6-7 (RadioGroup/CheckboxGroup) — RFC.** Lacuna de produto significativa. R6 não fecha sem decisão.

**MR6-1 (displayName ausente) — fix imediato.** Sweep coordenado em todo R6.

**MR6-2 (stories `<div style>`) — fix imediato.** Sweep coordenado.

**MR6-3/MR6-4 (Select APIs residuais) — fix imediato.** Limpeza de surface area.

---

## Gate para R7 (Feedback indicators — Badge/Spinner/Skeleton/ProgressBar/ProgressCircle)

R7 não compartilha contrato Field-aware nem usa input semântico. Mas compartilha:

- **Recipes declaradas × consumidas** (Spinner, ProgressBar, ProgressCircle têm recipes em `base-theme.ts` — verificar se são consumidas).
- **Tokens semânticos** (cores de feedback: success, warning, critical, info).
- **Motion tokens** (animação de spinner, progress fill).
- **`forwardRef` + `displayName` em Root** (sweep TD-007 deve já estar pronto).

R7 pode iniciar **mesmo com** as RFCs de R6 em draft, **desde que**:

- [x] R6 review documentado (5 componentes + este consolidado).
- [ ] **CR6-1 (Checkbox name/value)** aplicado — fix de 1 linha, faz sentido fechar antes.
- [ ] **CR6-2 (RadioCard role duplicado)** aplicado — fix de 1 linha.
- [ ] **HR6-3 (Radio disabled `||`)** aplicado — fix de 1 linha.
- [ ] **MR6-1 (displayName sweep)** aplicado.
- [ ] **MR6-2 (stories `<div>` sweep)** aplicado.
- [ ] **MR6-3/MR6-4 (Select APIs residuais)** removidas.
- [ ] (Não bloqueante) RFCs candidatas R6 abertas em draft (recipes mortas, RadioCard, RadioGroup, foco visível, slots fantasma, Select combobox).
- [ ] (Não bloqueante) Decisão sobre HR6-6 (RadioCard) **antes** de R7 fechar — não bloqueia R7 começar.

**Sweep coordenado pós-R6 sugerido (não bloqueante para R7):**

- Recipes mortas R6 (RFC + implementação).
- Foco visível em inputs ocultos.
- `forwardRef` em Roots (TD-007).
- "Purge hardcodes" + transition tokens (continuação de R5 padrão #5).
- `<View>`/`<Pressable>` direto em `.native.tsx` (lint + refactor).

---

## Gate R7 fechado (2026-04-25)

Trilho de governança da gate cumprido:

### Fixes imediatos aplicados (R6 review → main)

- [x] CR6-1 (Checkbox `name`/`value`)
- [x] CR6-2 (RadioCard `role` duplicado)
- [x] HR6-3 (Radio `??` em vez de `||`)
- [x] MR6-1 (`displayName` sweep)
- [x] MR6-2 (stories `<div style>` sweep)
- [x] MR6-3/MR6-4 (Select APIs residuais)

### RFC-0016 (TD-013) executada

`docs/rfcs/RFC-0016-ambiente-de-testes-cross-platform.md` — implementada em três PRs (`85c6e01` / `e02414a` / `e863085`). Suite 72 projects · 640 testes (598 web + 42 native + 3 skip TD-009).

### 4 RFCs R6 redigidas

| ID R6 | RFC | Cobertura |
|---|---|---|
| R6-A | [RFC-0017 — Recipes mortas em R6](../rfcs/RFC-0017-recipes-mortas-em-r6.md) | Migrar checkbox/radio/switch/select para `useSlotRecipe` (mesmo playbook de TD-008) |
| R6-D | [RFC-0019 — RadioCard: deprecar / unificar / alinhar](../rfcs/RFC-0019-radio-card-deprecar-ou-unificar.md) | Recomenda deprecar `RadioCard`; Radio passa a ser canônico (com Radio.native pronto via RFC-0018) |
| R6-F | [RFC-0020 — Select cumprindo WAI-ARIA combobox + escopo native](../rfcs/RFC-0020-select-combobox-wai-aria.md) | Web: activedescendant + item registry + Portal + keyboard completo. Native: Select via Modal/BottomSheet com mesma API. |
| R6-H | [RFC-0018 — Paridade native completa do DS](../rfcs/RFC-0018-paridade-native-completa-do-ds.md) | **Reescrita após diretriz arquitetural (2026-04-25):** DS é cross-platform por definição; `web-only` é bug. Plano em 6 ondas para os 12 componentes hoje em web-only. Originou TD-017. |

### 3 follow-ups registrados como TD

| ID R6 | TD | Plano |
|---|---|---|
| R6-B | [TD-014](../TECH_DEBT.md#td-014) — Foco visível em inputs ocultos | Sweep coordenado: refletir `:focus-visible` do input no visual |
| R6-E | [TD-015](../TECH_DEBT.md#td-015) — Slots fantasma Switch.Track/Thumb | Decidir slots reais ou Switch elementar (junto com RFC-0017) |
| R6-I | [TD-016](../TECH_DEBT.md#td-016) — Touch target < WCAG 44×44 | Sweep + invariante DS (lint rule futura) |

### 3 candidatas catalogadas no backlog (abrir RFC quando gatilho ocorrer)

- **R6-C** — RadioGroup / CheckboxGroup / SwitchGroup. Gatilho: caso de uso real em produto.
- **R6-G** — Portal para overlays. Gatilho: antes de R11 (Dialog/Drawer/Tooltip/Popover/Menu).
- **R6-J** — Indicator unificado cross-platform Checkbox. Gatilho: gap visual virar evidente após RFC-0017.

Detalhe em `docs/TECH_DEBT.md` seção "Backlog de RFCs candidatas R6".

### Ordem sugerida de execução (atualizada 2026-04-25)

A diretriz cross-platform reordenou prioridades. RFC-0018 deixou de ser sub-decisão de R6 e virou plano sistêmico (TD-017). Implementação dela acontece em **paralelo a tudo**, em ondas.

1. **Antes de R7 começar**
   - RFC-0017 (R6-A — recipes mortas) — limpa terreno para R7 não copiar o erro
   - RFC-0018 onda 1 (Clickable.native — TD-004) — destrava 80% das outras ondas
2. **Em paralelo a R7**
   - RFC-0017 aplicada por componente (checkbox primeiro, depois switch, depois radio, depois select)
   - RFC-0018 onda 2 (Form base — TextInput.native, TextArea.native, Counter.native) — destrava TD-009
   - TD-014 (foco visível) — sweep coordenado pequeno
   - TD-016 (touch target) — sweep coordenado pequeno
3. **Pode atravessar R7**
   - RFC-0018 onda 3 (Form seleção — Radio.native, Select.native)
   - RFC-0019 (R6-D — RadioCard deprecação) — só ativa após Radio.native paritário
   - RFC-0020 (R6-F — Select combobox + escopo native) — peça maior, web e native em sincronia
4. **Após R7 / paralelo a R8**
   - RFC-0018 ondas 4–5 (Pagination, Tabs, Breadcrumb, Tag, Accordion)
5. **Antes de R11**
   - R6-G (Portal overlays) — abrir RFC formal
   - RFC-0018 onda 6 (FileUpload, Table) — caso-fronteira
6. **Quando gatilho ocorrer**
   - R6-C, R6-J, TD-015 (Switch slots) — não bloqueiam nenhuma fase

---

## Métricas R6

| Componente | LOC | Testes | Stories | Native | Recipe consumida | Field-aware | forwardRef Root |
|---|---:|---:|---:|---|---|---|---|
| Checkbox | 271 | 16 | 5 | ✅ (custom) | ❌ | ✅ | ❌ |
| Radio | 213 | 18 | 5 | ❌ | ❌ | ⚠️ (`\|\|` bug) | ❌ |
| RadioCard | 168 | **0** | 4 | ❌ (web-only) | ❌ (sem recipe) | ❌ | ✅ |
| Switch | 219 | 22 | 5 | ✅ (delega RN) | ❌ | ✅ | ❌ |
| Select | 310 | 23 | 5 | ❌ (web-only) | ❌ | ✅ | ❌ |
| **Total** | **1181** | **79** | **24** | 2/5 | 0/5 | 3/5 + 1 ⚠️ | 1/5 |
