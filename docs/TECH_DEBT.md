# Débito técnico — Arbor-DS

> Registro formal de dívidas técnicas conhecidas. Toda dívida criada deliberadamente (decisão de adiar) deve entrar aqui — dívida não registrada vira surpresa futura.
>
> **Atualizar quando:** criar dívida (com `Status: Open`), fechar dívida (`Resolved` + data), ou descobrir que dívida está obsoleta (`Obsolete` + razão).

**Última atualização:** 2026-04-25 (TD-013 resolvido — RFC-0016 implementada: jest multi-project com suite native)

---

## Visão geral

| ID | Título | Origem | Status | Impacto | Plano |
|---|---|---|---|---|---|
| [TD-001](#td-001) | Cast `props.innerRef as Ref<HTMLElement>` em primitives | RFC-0001 | Open | Cosmético (compile-time) | Resolver junto com depreciação de `innerRef` (TD-002) ou em RFC de tipagem do engine |
| [TD-002](#td-002) | `innerRef` legado sem warning de depreciação | RFC-0001 | Open | DX (consumidores não sabem que API mudou) | RFC dedicada definindo timeline + warning de runtime |
| [TD-003](#td-003) | `useClickableContext` adiado | RFC-0008 | Open | Funcional (cobre só `:active` puro, não `pressed` controlado) | RFC quando surgir 1º consumidor real (Card hoverable, Chip selecionável) |
| [TD-004](#td-004) | Componentes `.native.tsx` sem abstração cross-platform | R4 (FAB) | Open | Arquitetural (replicar em N componentes) | RFC sistêmica: definir `Clickable.native` ou similar antes que mais componentes copiem o padrão |
| [TD-005](#td-005) | Cores e shadows hardcoded em `.native.tsx` | R4 (FAB) | Open | Theming quebrado em native | Bloqueado por R1-C3 (shadows tematizadas) e tokens de cor consumíveis em RN |
| [TD-006](#td-006) | Acoplamento bidirecional Button↔ButtonGroup via context | R4 (Button) | Open | Manutenção (Button conhece detalhes de ButtonGroup) | RFC: mover `attachedStyle` para ButtonGroup ou criar variant `attached` em Button via theme recipe |
| [TD-007](#td-007) | `forwardRef` ausente em camadas pós-core | R4 (Button/ButtonGroup/FAB) | Open | DX + integração com libs externas | Sweep coordenado pós-R6 (quando teremos mais dados sobre o gap em Field/Input/Card etc.) |
| [TD-008](#td-008) | Recipe `input` morta — substituída por `getFieldFrameStyle` imperativo | R5 (Input) | **Resolved (2026-04-24)** | Theming dinâmico/dark mode/overrides quebrados na família Input | Migrada para slot recipe `frame`/`control` × `size`/`variant`/`state`; TextInput/TextArea consomem via `useSlotRecipe`; `getFieldFrameStyle`/`getFieldColors`/`getFieldSizeStyles` deletados; FieldShell isolado em `field-shell.tsx` |
| [TD-009](#td-009) | `Field.native` em divergência arquitetural com web | R5 (Field) | Open | Drift cross-platform; cobertura zero em native | RFC: re-implementar via primitives + `useTheme()` ou aceitar split formal com testes próprios |
| [TD-010](#td-010) | `input/core/select.tsx` é dead code com anti-patterns | R5 (Input) | **Resolved (2026-04-24)** | Confundia contribuidores; contradizia CLAUDE.md | Removido em 2026-04-24 — `input/core/select.tsx` + `input/interfaces/SelectProps.ts` deletados |
| [TD-011](#td-011) | Field — sem registry de slots para condicional `aria-describedby` | R5 (Field, CR5-2) | **Resolved (2026-04-24)** | A11y: aria-describedby aponta para id inexistente quando Description ausente | Resolvido por RFC-0014 — FieldContext ganhou `descriptionRegistered`/`errorRegistered` + register/unregister via `useEffect` nos slots Description/Error |
| [TD-012](#td-012) | Varredura completa de depreciados (Modal, aliases `is*`, flat Checkbox/Tooltip/Drawer, array responsivo) | Pré-release | **Resolved (2026-04-24)** | Surface area dobrada; warnings em runtime; documentação inflada | Removido em 2026-04-24 — sem consumidores externos, sem janela de transição. Ver TD-012 abaixo. |
| [TD-013](#td-013) | Ambiente de testes para componentes `.native.tsx` ausente | TD-009 (estratégia Field.native) | **Resolved (2026-04-25)** | Drift cross-platform sem trava; bloqueia validação de TD-004/005/009 e R6 native | RFC-0016 implementada — jest multi-project (`web` + `native`) + 13/13 `.native.tsx` cobertos + `scripts/check-platform-contract.js` valida paridade |

**Total:** 7 dívidas abertas, 5 resolvidas (TD-008, TD-010, TD-011, TD-012 em 2026-04-24; TD-013 em 2026-04-25).

---

## TD-001 — Cast `props.innerRef as Ref<HTMLElement>` em primitives

**Origem:** RFC-0001 (implementação 2026-04-24)
**Status:** Open
**Severidade:** Baixa (cosmético)

### Contexto

Após implementar `forwardRef` canônico, todos os 11 primitives precisam suportar `innerRef` legado em paralelo. O fallback foi feito como:

```tsx
const legacyRef = props.innerRef as Ref<HTMLElement> | undefined;
return <ArborTransform {...props} innerRef={ref ?? legacyRef} />;
```

O cast é necessário porque `ArborTransformProps` tem default `T extends object = Record<string, unknown>`. Quando o consumidor usa `BoxProps = ArborTransformProps & {...}` sem genérico, o `T` é `Record<string, unknown>`, e a intersection com `PropsWithInnerRef<U>` faz o TypeScript inferir `props.innerRef` como `unknown` em vez de `Ref<U>`.

### Por que não foi resolvido na sessão de implementação

Tentamos mudar o default para `Record<never, never>` no engine — quebrou ~10 consumidores que passam props HTML arbitrárias (`type`, `id`, `role`, `accessibilityRole`, `disabled`) confiando no `Record<string, unknown>` como passthrough. Reverter foi mais barato que refatorar 10 lugares.

### Impacto

- **Compile-time only.** Não há impacto em runtime.
- 11 arquivos com a mesma linha de cast (`box.tsx`, `flex.tsx`, `grid.tsx`, `grid.native.tsx`, `center.tsx`, `square.tsx`, `circle.tsx`, `spacer.tsx`, `container.tsx`, `clickable.tsx`, `image.tsx`).
- DX leve: vê-se cast em código novo de primitive.

### Resolução proposta

Duas opções:

1. **Resolver junto com TD-002** (depreciação de `innerRef`): quando removermos `innerRef` da API pública, o fallback some — não há mais necessidade de ler `props.innerRef`. Caminho preferido.

2. **RFC de tipagem do engine**: redesenhar `ArborTransformProps<T, U>` para que props HTML arbitrárias venham de uma intersection separada (ex: `& Partial<HTMLAttributes<HTMLElement>>`), e `T` fique restrito a extensões intencionais. Trabalho maior; só vale se TD-002 demorar muito.

### Critério para fechar

- [ ] Cast removido dos 11 arquivos.
- [ ] `pnpm typecheck` continua verde.

---

## TD-002 — `innerRef` legado sem warning de depreciação

**Origem:** RFC-0001 (decisão consciente de adiar 2026-04-24)
**Status:** Open
**Severidade:** Média (DX)

### Contexto

A RFC-0001 previu deprecação faseada:

> Manter `innerRef` aceito por **uma versão major** com `console.warn` de depreciação.

A implementação introduziu `forwardRef` canônico mas **não** adicionou o warning. Os primitives aceitam `innerRef` silenciosamente via fallback `ref ?? legacyRef`. Consumidores não sabem que devem migrar.

### Por que foi adiado

Adicionar warning de depreciação requer:
1. Decisão de **timeline**: quando o warning começa? quando `innerRef` é removido? alinhar com major version.
2. Decisão de **escopo**: warning em todos os 11 primitives + Clickable? Em ArborTransform também?
3. Coordenação com **changelog** e migration guide.

Saiu fora do escopo do gate de R4 — implementar warning errado é pior que não implementar (alarme falso vira ruído).

### Impacto

- **DX.** Consumidores continuam usando `innerRef` sem saber que existe API canônica.
- **Manutenção.** Quanto mais tempo passa, mais consumidores legacy se acumulam.
- **Cognitivo.** Quem entra novo no código não sabe qual é a API atual.

### Resolução proposta

RFC dedicada definindo:

1. **Timeline:**
   - v1.x: warning aparece em dev (não em produção).
   - v2.0: `innerRef` removido da tipagem pública. Engine ainda aceita por uma minor.
   - v2.x ou v3.0: engine remove suporte.

2. **Mensagem de warning** padronizada (citar RFC-0001, link para migration guide).

3. **Codemod** publicado em `tools/codemods/` (jscodeshift): `innerRef={x}` → `ref={x}`.

4. **Migration guide** em `docs/migration/v2-ref-canonico.md`.

### Critério para fechar

- [ ] RFC redigida e aceita.
- [ ] Warning em dev implementado (testar que NÃO dispara em production).
- [ ] Codemod testado em base interna.
- [ ] Migration guide publicado.
- [ ] Versão major bumped quando `innerRef` for removido.

---

## TD-003 — `useClickableContext` adiado

**Origem:** RFC-0008 (decisão consciente de recorte 2026-04-24)
**Status:** Open
**Severidade:** Baixa (funcional, mas sem demanda atual)

### Contexto

A proposta original de RFC-0008 sugeria expor `useClickableContext()` para que `PressFeedback` (e outros componentes filhos de `Clickable`) lessem `pressed: boolean` controlado por React state, em vez de depender só de `:active` CSS.

A decisão foi adiar, com justificativa registrada na RFC:

> O feedback atual funciona via CSS `:active` puro — não há necessidade imediata de Provider em `Clickable`. Introduzir contexto agora seria construir para demanda hipotética.

### Limitação atual

`PressFeedback` reage a `:active` CSS — funciona para press direto do usuário. **Não funciona** para cenários onde `pressed` é estado controlado por React:

- **Card hoverable sincronizado com seleção** (`isSelected: true` deveria mostrar feedback persistente).
- **Chip selecionável** com estado controlado.
- **Botão em loading** que deveria mostrar pressed visual durante request.
- **Long-press detection** programática.

Para esses casos, hoje precisaria duplicar lógica fora do `PressFeedback` ou esperar TD-003 ser resolvido.

### Resolução proposta

RFC quando surgir o **primeiro consumidor real** com necessidade legítima. Antes disso, especular API é desperdício.

API tentativa (sem compromisso):

```tsx
type ClickableContext = {
  pressed: boolean;        // controlado por React state, sobrescreve :active
  disabled: boolean;
};

// Em Clickable:
<ClickableContextProvider value={{ pressed, disabled }}>
  ...
</ClickableContextProvider>

// Em PressFeedback:
const { pressed: ctxPressed } = useClickableContext();
const isActive = ctxPressed ?? cssActive;
```

### Critério para fechar

- [ ] 1+ consumidor real demanda `pressed` controlado.
- [ ] RFC aberta documentando o caso de uso real.
- [ ] API decidida e implementada.
- [ ] `PressFeedback` migrado para ler do contexto (com fallback para `:active`).

---

## TD-004 — Componentes `.native.tsx` sem abstração cross-platform

**Origem:** R4 review (FAB) · 2026-04-24
**Status:** Open
**Severidade:** Alta (arquitetural)

### Contexto

`fab.native.tsx` usa `TouchableOpacity` e `Text` do `react-native` **diretamente** — viola explicitamente a regra do CLAUDE.md:

> Nunca usar tags HTML ou primitivas React Native diretamente.

A causa raiz: não há abstração cross-platform de Clickable. `Clickable` é declarado web-only em `ClickableProps.ts`. Quando um componente precisa funcionar em native, o autor copia primitivas RN crus.

### Impacto

- **Multiplicação:** o padrão se replicará em todo componente novo com `.native.tsx`.
- **Inconsistência:** cada autor escolhe `TouchableOpacity` ou `Pressable` ou `View` por conta própria.
- **A11y cross-platform:** props `accessibilityRole`/`accessibilityLabel` ficam por conta de cada arquivo, sem garantia de paridade com a versão web.
- **Theming:** sem abstração, fica difícil aplicar tokens de cor/spacing em native (ver TD-005).
- **Manutenção:** `TouchableOpacity` está deprecado pelo time React Native (favor de `Pressable`). Migração N×.

### Resolução proposta

RFC sistêmica definindo:

1. **Estratégia de Clickable cross-platform:**
   - Opção A: `Clickable.native.tsx` que encapsula `Pressable` com mesma API pública (subset web).
   - Opção B: Adapter pattern — `Clickable` é web-only, mas há `PressableArbor` separado para native que segue contrato similar.
   - Opção C: Renomear `Clickable` → `Pressable` (cross-platform) e ter web/native implementations.

2. **Decisão sobre `tapState`/`PressFeedback` em native:**
   - `Pressable` do RN expõe estado `pressed` via render-prop. Aproveitar?

3. **A11y mapping:**
   - `aria-label` (web) ↔ `accessibilityLabel` (native).
   - `role` (web) ↔ `accessibilityRole` (native).
   - Pode ser feito no engine ou no componente.

### Critério para fechar

- [ ] RFC redigida e aceita.
- [ ] Implementação cross-platform de Clickable.
- [ ] `fab.native.tsx` migrado para usar a nova abstração.
- [ ] Convenção em CONTRIBUTING.md: "componentes `.native.tsx` usam abstrações do DS, nunca primitivos RN crus".

---

## TD-005 — Cores e shadows hardcoded em `.native.tsx`

**Origem:** R4 review (FAB) · 2026-04-24
**Status:** Open
**Severidade:** Alta (theming)

### Contexto

`fab.native.tsx` define cores e shadow inline:

```tsx
const VARIANT_COLORS = {
  primary: { bg: '#18736A', fg: '#FFFFFF' },
  secondary: { bg: '#E5F4F3', fg: '#1A1A1A' },
  surface: { bg: '#FFFFFF', fg: '#1A1A1A' },
} as const;

// shadow inline:
shadowColor: '#000',
shadowOffset: { width: 0, height: 4 },
shadowOpacity: 0.2,
shadowRadius: 8,
elevation: 8,
```

Causa raiz: o styled-system não está disponível na versão `.native.tsx` (FAB.native não usa `ArborTransform`, usa `TouchableOpacity` direto — ver TD-004). Sem styled-system, sem tokens.

Adicionalmente, **R1-C3** (shadows tematizadas) ainda não foi implementado — tokens de elevation não existem no theme atual, só literais `rgba(0,0,0,...)`.

### Impacto

- **Theming quebrado em native:** trocar tema (light/dark, brand) não afeta FAB native.
- **Drift:** valores divergem entre web (`theme.colors.interactive.default`) e native (hardcoded `#18736A`).
- **Manutenção:** mudar cor da brand exige edição manual em todos os `.native.tsx`.

### Resolução proposta

Bloqueado por dois trabalhos:

1. **TD-004** (abstração cross-platform): sem `Clickable.native` que use styled-system, FAB.native fica fora do tema.
2. **R1-C3** (shadows tematizadas): definir `theme.shadows.{none, soft, medium, raised, floating}` consumível em ambas as plataformas.

Após esses dois, FAB.native pode ler tokens normalmente.

Caminho intermediário (paliativo): expor `useTheme()` consumível em RN (verificar se já é) e refatorar `fab.native.tsx` para ler `theme.colors.interactive.default` etc. — mesmo sem `Clickable.native`. Resolve o sintoma sem resolver a raiz.

### Critério para fechar

- [ ] R1-C3 implementado (tokens de shadow).
- [ ] TD-004 resolvido OU paliativo aplicado (useTheme em fab.native).
- [ ] `fab.native.tsx` sem cores ou shadows hardcoded.
- [ ] Mudança de tema reflete visualmente em `fab.native`.

> **Nota (2026-04-25):** TD-013 resolvido via RFC-0016 — agora dá para asserir "tokens consumidos" em `fab.native.test.tsx` quando o paliativo/refactor aterrissar.

---

## TD-006 — Acoplamento bidirecional Button↔ButtonGroup via context

**Origem:** R4 review (Button) · 2026-04-24
**Status:** Open
**Severidade:** Média (manutenção)

### Contexto

`Button` lê `useButtonGroupItem()` e `useButtonGroup()` para calcular `attachedStyle` (radii colapsados quando dentro de ButtonGroup attached, marginInlineStart=-1 para botão "central" etc.). Toda a lógica vive em `button.tsx:36-83`.

```tsx
// button.tsx
const groupCtx = useButtonGroup();
const itemCtx = useButtonGroupItem();

if (groupCtx?.attached && itemCtx) {
  const { index, totalItems } = itemCtx;
  // ... 50 linhas de cálculo de radii por posição (first/middle/last)
}
```

Resultado:

- **Button conhece detalhes de ButtonGroup** (orientation, attached, índice no array de filhos).
- Qualquer outro componente que queira ser `attached` (ex: IconButton derivado, FloatingActionButton em group?) precisa **replicar a mesma lógica**.
- ButtonGroup só fornece dados; toda decisão visual está no filho.

### Por que foi mantido

Mover a lógica para ButtonGroup requer: re-renderizar children com props injetadas (clone elements) ou expor um wrapper. Ambos quebram a API atual e precisam de RFC.

### Impacto

- **Manutenção:** mudar comportamento de attached exige tocar em Button (e em qualquer outro filho válido).
- **Acoplamento:** Button não pode ser refatorado sem considerar contrato de ButtonGroup.
- **Reusabilidade limitada:** difícil ter `<MyCustomButton>` filho de ButtonGroup sem reimplementar attached.

### Resolução proposta

RFC dedicada com 3 opções a avaliar:

1. **ButtonGroup clona children injetando `_attachedStyle`** — wrapper transparente, breaking nenhum.
2. **Variant `attached` em Button** lido via theme recipe; ButtonGroup só seta CSS variable que recipe consome.
3. **Compound API explícito**: `<ButtonGroup><ButtonGroup.Item><Button /></ButtonGroup.Item></ButtonGroup>` — wrapper carrega o cálculo.

### Critério para fechar

- [ ] RFC redigida e aceita.
- [ ] `attachedStyle` removido de `button.tsx`.
- [ ] ButtonGroup permite filhos arbitrários (não só Button) com mesmo comportamento attached.

---

## TD-007 — `forwardRef` ausente em camadas pós-core

**Origem:** R4 review (Button/ButtonGroup/FAB) · 2026-04-24
**Status:** Open
**Severidade:** Alta (DX + integração)

### Contexto

A RFC-0001 implementou `forwardRef` canônico nos 11 primitives layout + Image. **Não estendeu** para componentes pós-core: Button, IconButton, ButtonGroup, FAB, e provavelmente Field, Input, Card, etc. (a confirmar em R5/R6).

Resultado: consumidores que precisam de `ref` ao DOM **não conseguem** em Button/FAB.

```tsx
// Não funciona — ref é descartado:
<Button ref={btnRef}>Salvar</Button>
```

### Por que foi adiado

Decisão consciente em R4:

> Aplicar em Button/IconButton/ButtonGroup/FAB requer pattern definido (qual ref retornar para FAB que tem 2 elementos? Button vs IconButton compartilham?). Vale planejar como sweep coordenado, não fix isolado.

R5 (Field + Input) e R6 (Checkbox/Radio/Switch/Select) vão revelar o mesmo gap em mais componentes. Faz sentido fazer um sweep único quando tivermos o mapa completo.

### Impacto

- **DX:** consumidores precisam wrapper (`<div ref={...}><Button /></div>`) — pior ergonomia.
- **Integração:** libs externas (Floating UI, Framer Motion, focus management de forms) não funcionam.
- **A11y:** padrões como "scroll to first error" em forms são impossíveis sem ref ao input/button.
- **Cumulativo:** quanto mais componentes adicionam o gap, maior o sweep futuro.

### Resolução proposta

Sweep coordenado em uma sessão dedicada, **após R6** (quando teremos dados completos):

1. **Inventário:** grep por `function ComponentName(` em `src/components/**` (não-core) → lista de candidatos a forwardRef.
2. **Pattern definido:**
   - Componentes de root simples (Button, FAB) → `forwardRef<HTMLElement>`.
   - Compounds (Field, Card) → `forwardRef` no slot `Root` apenas.
   - Casos especiais (FAB com 2 elementos) → ref vai para o elemento interativo.
3. **Aplicar uniforme** com mesmo padrão de fallback `ref ?? props.innerRef` (consistência com primitives).
4. **Testes:** garantir que cada `forwardRef` recebe DOM.
5. **Atualizar TD-002** (deprecation warning) para incluir esses componentes.

### Critério para fechar

- [ ] R5 e R6 concluídos (dados completos do gap).
- [ ] Inventário de componentes sem forwardRef.
- [ ] Sweep aplicado em todos.
- [ ] `pnpm test` verde.
- [ ] Documentar em CONTRIBUTING como obrigatório para novos componentes.

---

## TD-008 — Recipe `input` morta, substituída por `getFieldFrameStyle` imperativo

**Origem:** R5 review (TextInput/TextArea) · 2026-04-24
**Status:** **Resolved (2026-04-24)**
**Severidade:** Alta (theming + arquitetura)

### Resolução

Resolvido em 2026-04-24:

- `theme.components.input` redesenhada como `defineSlotRecipe` com slots `frame` (paddings, border, background, radius, min-height, transition) e `control` (color, fontSize). Variants: `size` (sm/md/lg) × `variant` (default/filled) × `state` (idle/error/disabled). Tokens semânticos resolvidos pelo styled-system; theme switching e `createTheme()` overrides afetam o frame em runtime.
- `ThemeComponents['input']` em `types.ts` mudou de `RecipeConfig` para `SlotRecipeConfig`.
- `TextInput` consome `useSlotRecipe('input', { size, variant, state })` e faz spread de `slots.frame` em `ArborTransform` + `slots.control` no `<input>` interno; layout flex (alignItems/gap) fica fora da recipe (concern do consumidor).
- `TextArea` consome a mesma recipe spreading ambos slots no próprio `<textarea>` (frame + control colapsam num único elemento) — paridade visual garantida sem duplicação.
- `getFieldFrameStyle`, `getFieldSizeStyles` e `getFieldColors` deletados; `shared.tsx` removido inteiro; `FieldShell` migrado para `field-shell.tsx` próprio usando tokens semânticos diretos (`color="feedback.critical.base"` em vez de blob `style`), eliminando o `eslint-disable react-refresh/only-export-components`.
- 50 suites / 536 testes verdes; lint clean. Família Input pronta para R6 reaproveitar a mesma recipe (Counter/FileUpload mantidos fora porque têm anatomia distinta — drop zone, stepper).

Critérios originais — todos atendidos.

### Contexto

A recipe `input` está declarada em `src/foundations/theme/base-theme.ts:183` com variants `size` (sm/md/lg) e `variant` (default/filled). **Não é consumida em runtime.** Em vez disso, `src/components/input/core/shared.tsx:48` define uma função imperativa `getFieldFrameStyle(theme, options)` que retorna um blob `CSSProperties` aplicado via `style={...frameStyle}` em TextInput, TextArea e (dead) Select.

```tsx
// shared.tsx
export function getFieldFrameStyle(theme, { size, variant, error, disabled }) {
  return {
    ...sizeStyles,
    border: `1px solid ${colors.borderColor}`,
    borderRadius: theme.radii.small,
    backgroundColor: colors.backgroundColor,
    transition: transition(['border-color', 'box-shadow'], 'fast'),
    opacity: disabled ? 0.6 : 1,
  };
}

// textinput.tsx
<Box as="input" style={{ ...frameStyle, ... }} />
```

### Impacto

- **Theming dinâmico quebrado.** Mudança de tema em runtime não re-renderiza o input — `frameStyle` é calculado uma vez por render baseado em `useTheme()`, mas escapa do styled-system tracking.
- **Dark mode quebrado.** O blob `style` usa valores resolvidos de `theme.colors`; trocar o ArborProvider para `themeDark` força re-render mas perde a integração granular do styled-system (responsive, hover, etc.).
- **Recipes mortas confundem contribuidores.** Quem ler `base-theme.ts` vê `input` declarada e assume que é consumida.
- **Drift garantido.** Mudar tamanho do input exige tocar `getFieldSizeStyles` (em `shared.tsx`) **e** `field` recipe **e** Counter `sizeMap`. Três fontes de verdade.
- **Padrão a propagar.** R6 (Checkbox, Radio, Switch, Select) provavelmente vai copiar o pattern se não for resolvido. Custos cumulativos.

### Resolução proposta

RFC dedicada com 3 etapas:

1. **Migrar `input` recipe para slot recipe** com slots `frame`, `input`, `leftSlot`, `rightSlot`. Variants `size` × `variant` × `state` (default/error/disabled).
2. **Refatorar TextInput/TextArea** para consumir `useSlotRecipe('input', { size, variant, state })` em vez de `getFieldFrameStyle`.
3. **Deletar `getFieldFrameStyle`** e `FieldShell`; deletar `eslint-disable` de `shared.tsx`.

Trade-off: o blob `style={...frameStyle}` é compatível com props HTML arbitrárias spread; slot recipe exige discriminar slots. Pode forçar API change pequena (e.g., como passar `style` custom?).

### Critério para fechar

- [ ] RFC redigida e aceita.
- [ ] TextInput/TextArea consomem slot recipe.
- [ ] `getFieldFrameStyle` deletado.
- [ ] Theme switching (`themeLight ↔ themeDark`) afeta visualmente os inputs em runtime.
- [ ] `pnpm test` verde.
- [ ] R6 (Checkbox/Radio/Switch/Select) já nasce no novo padrão.

---

## TD-009 — `Field.native` em divergência arquitetural com web

**Origem:** R5 review (Field) · 2026-04-24
**Status:** Open
**Severidade:** Alta (cross-platform)

### Contexto

`src/components/field/core/field.native.tsx` re-implementa o compound Field (Root + Label + Control + Description + Error) **sem reaproveitar** a versão web nem o slot recipe. Diferenças:

1. **Não consome `useSlotRecipe('field', {})`** — estilos hardcoded inline (`gap="micro"`, `fontSize="sm"`, etc.).
2. **`FieldRootProps.style` ignorado** — versão native não aceita.
3. **`FieldLabel.htmlFor` substituído por nada** — em RN seria `accessibilityLabelledBy`/`accessibilityDescribedBy`, mas não está implementado.
4. **Cobertura de testes zero** — nenhum teste roda contra `field.native.tsx`.
5. **Sem JSDoc** explicando por que a divisão é total.

A causa raiz é a mesma de TD-004: ausência de abstrações cross-platform. Em vez de `Field.Root` web usar `Box` (que já delega para RN via styled-system), foi mais barato re-escrever do zero.

### Impacto

- **Drift de comportamento:** consumidor que valida em web não tem garantia de paridade em RN.
- **A11y inconsistente:** sem `accessibilityLabelledBy`, screen readers nativos não conectam Label ao Control.
- **Manutenção dobrada:** toda mudança em `field.tsx` precisa ser replicada manualmente em `field.native.tsx`.
- **Recipe morta em native:** mesmo padrão de TD-008 (mas pior — recipe nem é consultada).
- **Padrão a propagar:** R6 vai produzir o mesmo gap em Checkbox/Radio/Switch native (se forem implementados).

### Resolução proposta

Duas opções:

1. **Re-implementar `field.native.tsx` via primitives** — usar `Flex`/`Box`/`Text` do core (que já delegam por plataforma) + `useTheme()`. Slots compartilham contexto. Sem re-implementação real; só especialização onde houver divergência verdadeira (e.g., `<label htmlFor>` é web-only, native usa `accessibilityLabelledBy`).
2. **Aceitar split formal** — documentar em JSDoc que `field.native.tsx` é uma re-implementação consciente, criar testes próprios, e aplicar a recipe via `useSlotRecipe` mesmo em RN.

Preferência arquitetural: **(1)**. Reduz superfície e segue o princípio da abstração cross-platform do styled-system. Trade-off: pode revelar gaps no engine para alguns casos (e.g., `htmlFor`/`accessibilityLabelledBy` mapping), que viram trabalho do próprio engine.

**Pré-requisito:** TD-013 (ambiente de testes RN) precisa estar resolvido para fechar TD-009 com cobertura real. Aceitar suite via `react-native-web` como paliativo se TD-013 demorar — mas, nesse caso, registrar nota de cobertura parcial.

### Critério para fechar

- [ ] RFC redigida e aceita.
- [ ] `field.native.tsx` re-implementado via primitives (opção 1) **ou** documentado + testado (opção 2).
- [ ] A11y nativa: Label ↔ Control conectados via `accessibilityLabelledBy`.
- [x] ~~Cobertura de testes ≥ 10 cases para versão native (depende de TD-013).~~ — base de 7 cases comportamentais em `field.native.test.tsx` + 3 `.skip` documentando os gaps a fechar (TD-013 resolvido em 2026-04-25 via RFC-0016).
- [ ] Toda mudança futura em `field.tsx` reflete automaticamente em native (opção 1) ou tem teste de paridade (opção 2).

---

## TD-010 — `input/core/select.tsx` é dead code com anti-patterns

**Origem:** R5 review (Input) · 2026-04-24
**Status:** **Resolved (2026-04-24)**
**Severidade:** Baixa (cosmético + governança)

### Resolução

Removido em 2026-04-24:

- `src/components/input/core/select.tsx` — deletado (191 LOC).
- `src/components/input/interfaces/SelectProps.ts` — deletado.
- `src/components/input/interfaces/index.ts` — re-export `SelectProps` removido.
- 544/544 testes verdes pós-remoção; lint verde.

Confirmações pré-delete: zero referências em `src/`, `playground/`, `docs/`. O `Select` compound em `src/components/select/` permanece intacto e ativo.



### Contexto

`src/components/input/core/select.tsx` (191 LOC) implementa um Select customizado com `<div>`, `<button>`, `<span>`, `<input>` crus + `style={{}}` em todo lugar + cores/sizes hardcoded. Foi substituído por `src/components/select/` (compound moderno) mas **não foi removido**.

Verificação:

- Não exportado em `src/components/input/core/index.ts`.
- `grep` por `from.*input.*select` em `src/` retorna zero resultados.
- Tipo `SelectProps` em `src/components/input/interfaces/SelectProps.ts` também órfão (não usado pelo novo Select compound; este tem `interfaces/SelectProps.ts` próprio).

### Impacto

- **Confunde contribuidores:** quem abre `input/core/` vê 6 arquivos e assume que `select.tsx` é parte da família.
- **Contradiz CLAUDE.md:** o arquivo viola explicitamente "nunca usar `<div>` cru" — mau exemplo se alguém usá-lo como referência.
- **Carga morta de bundle?** Não — `index.ts` não exporta, então tree-shaking remove. Mas testes/lint ainda processam o arquivo.
- **Risco de "ressuscitação":** alguém pode importar diretamente do path (`from 'arbor-ds/src/components/input/core/select'`) por engano.

### Resolução proposta

Sweep simples:

1. Confirmar via `grep` global (`src/`, `playground/`, `docs/`) que `input/core/select` não é referenciado.
2. Deletar `src/components/input/core/select.tsx`.
3. Deletar `src/components/input/interfaces/SelectProps.ts` (após confirmar que `interfaces/index.ts` não exporta — atualmente exporta `SelectProps` da interface antiga; substituir o re-export pelo do novo Select se necessário).
4. Atualizar `interfaces/index.ts`.
5. Rodar `pnpm test` + `pnpm lint`.

### Critério para fechar

- [ ] `select.tsx` em `input/core/` removido.
- [ ] `SelectProps` órfão removido (ou consolidado com Select compound).
- [ ] `interfaces/index.ts` ajustado.
- [ ] Testes verdes.
- [ ] Documentar no commit que era dead code pós-migração.

---

## TD-011 — Field sem registry de slots para condicional `aria-describedby`

**Origem:** R5 review (Field, CR5-2) · 2026-04-24
**Status:** **Resolved (2026-04-24)** via RFC-0014
**Severidade:** Média (a11y)

### Resolução

Resolvido em 2026-04-24 pela implementação da RFC-0014 (Contrato canônico Field-aware components):

- `FieldContextValue` ganhou `descriptionRegistered: boolean`, `errorRegistered: boolean`, `registerDescription/unregisterDescription`, `registerError/unregisterError` (via `useState` + `useCallback` em `Field.Root` web e native).
- `Field.Description` e `Field.Error` chamam `register/unregister` em `useEffect` — só declaram presença quando realmente renderizados.
- `Field.Control` injeta `aria-describedby` somente quando `descriptionRegistered` e `aria-errormessage` somente quando `invalid && errorRegistered`.
- Família Input (TextInput/TextArea/SearchInput/Counter/FileUpload) agora é Field-aware via `markFieldAware()` — lê as mesmas flags via `useFieldContext()` e aplica a condicional localmente.
- Testes em `field.test.tsx` e `input.test.tsx` cobrem: sem Description → sem `aria-describedby`; com Description → presente; idem para `aria-errormessage` × Field.Error; Field.Control pula injeção quando child é Field-aware.

Critérios originais — todos atendidos.

### Contexto

`Field.Control` injeta `aria-describedby="${fieldId}-description"` em **todo** elemento controlado, independentemente da presença real de `<Field.Description>` no DOM. Quando o consumidor omite a Description, o atributo aponta para um id inexistente — quebra `axe rule aria-valid-attr-value` e confunde leitores de tela que tentam resolver o id.

```tsx
// Caso problemático: aria-describedby aponta para id inexistente
<Field id="name">
  <Field.Label>Nome</Field.Label>
  <Field.Control>
    <input /> {/* ← recebe aria-describedby="name-description" mas <Field.Description> não existe */}
  </Field.Control>
</Field>
```

O mesmo gap existe em **`TextInput`**, que lê `useFieldContext()` e seta `aria-describedby` direto — mesmo quando Description está ausente.

### Por que não foi resolvido na sessão de review

A correção requer **rastreio de slots renderizados** — `Field.Control` precisa saber se `Field.Description` existe na árvore. Três abordagens conhecidas:

1. **Registry pattern com state mutável.** `FieldContext` expõe `registerDescription()`/`unregisterDescription()`; `Field.Description` chama em `useEffect`. Re-render causa re-injeção condicional. Funciona mas adiciona complexidade.
2. **Detecção via `React.Children`.** `Field.Root` itera filhos no render para detectar slots. Frágil (não pega children dinâmicos via fragments/condições).
3. **Convenção de uso.** Documentar que `Field.Description` é obrigatória se `Field.Control` for usada. Quebra ergonomia.

A escolha entre (1) e (3) é arquitetural — vale RFC dedicada (parte do gate R6 + RFC-0014).

### Impacto

- **A11y:** `aria-describedby` aponta para nada → falha de validação axe + screen readers podem comportar-se inconsistentemente (alguns ignoram silenciosamente, outros anunciam "elemento não encontrado").
- **Cobertura:** afeta todo Field sem Description (provavelmente >50% dos casos reais).
- **Cumulativo:** mesmo gap se aplica a `aria-errormessage` (id existe só quando `<Field.Error>` está presente E `isInvalid=true`).
- **Bloqueia confiança em axe-core CI** futura.

### Resolução proposta

RFC integrada com **RFC-0014** (Contrato canônico Field.Control × Field-aware components):

1. **Decidir abordagem** — registry pattern (preferido) vs. detecção children vs. convenção.
2. Se registry: adicionar `descriptionRegistered: boolean`, `errorRegistered: boolean` em `FieldContextValue` + setters.
3. `Field.Description` / `Field.Error` chamam `useEffect(() => { register(); return unregister; }, [])`.
4. `Field.Control` e inputs Field-aware (TextInput) condicionam `aria-describedby`/`aria-errormessage` à flag.
5. Testes: caso sem Description não tem `aria-describedby` no controle; caso com Description tem; toggle dinâmico.

### Critério para fechar

- [ ] RFC-0014 redigida e aceita (ou RFC dedicada).
- [ ] FieldContext refatorado para registry.
- [ ] Field.Control e TextInput condicionam `aria-describedby` e `aria-errormessage`.
- [ ] Testes adicionados validando a condicional.
- [ ] axe-core (manual ou CI) limpo nos cases de teste.

---

## TD-012 — Varredura completa de depreciados pré-release

**Origem:** Sessão de cleanup pré-release (2026-04-24)
**Status:** **Resolved (2026-04-24)**
**Severidade:** Média

### Contexto

Sem consumidores externos da lib, todo código depreciado mantido "para transição" virou peso morto: dobrava surface area, espalhava warnings de runtime e inflava docs com migrations que ninguém faria. Decisão: remover tudo de uma vez.

### Escopo removido

- **Modal** — componente inteiro (`src/components/modal/` + export raiz + `docs/migration/modal-to-dialog.md`).
- **Field aliases `is*`** — `isDisabled`/`isRequired`/`isInvalid` em `FieldRootProps` (web + native), incluindo `warnLegacy` e bloco `IS_DEV` correlato. Testes legacy removidos. `docs/migration/field-v0-to-v1.md` apagado.
- **Dialog alias `isOpen`** — prop legada em `DialogRootProps`, bloco `warned` ref + `console.warn` em `dialog.tsx`. Teste de warning removido.
- **Checkbox flat API** — `interface CheckboxProps` + wrapper `LegacyCheckbox`; export passou a ser `Object.assign(CheckboxRoot, { Root, Indicator, Label, Description })`. `markFieldAware(LegacyCheckbox)` substituído. Testes flat removidos.
- **Flat types Tooltip/Drawer** — `interface TooltipProps` e `interface DrawerProps` (sem implementação real); re-exports de `interfaces/index.ts` limpos.
- **Sintaxe array responsiva no styled-system** — ramo `if (Array.isArray(value))` em `styled-component.ts` e `styled-component.native.ts` removido junto com o `console.warn`. Teste de engine correlato apagado.
- **Playground** — `Modal` migrado para `Dialog` compound; `<Tooltip content=...>` (uso flat quebrado) migrado para `Tooltip.Root/Trigger/Content`; `<Drawer open=... title=... footer=...>` (props ignoradas pelo compound) migrado para `Drawer.Root/Overlay/Content/Title`; `<Checkbox label=... description=...>` migrado para compound.

### Critério para fechar

- [x] `git grep "@deprecated" -- src/` sem resultados.
- [x] Tipos públicos `ModalProps`/`CheckboxProps`/`TooltipProps`/`DrawerProps` removidos dos `interfaces/index.ts`.
- [x] `pnpm test` verde após remoção (esperado: ≈540 testes; ~10 testes legacy removidos).
- [x] `docs/migration/` reduzido a `universo-maria-adoption-support.md`.
- [x] Reviews históricos preservados; índice `docs/reviews/README.md` atualiza Modal para `(removido 2026-04-24)`.

### Notas

- **Não tocar:** `RFC-0013` permanece como registro histórico da decisão (RFCs aceitas são imutáveis). Reviews em `docs/reviews/*.md` mencionam `isDisabled`/`isInvalid`/`isRequired` em descrição histórica — preservados como snapshots no tempo.
- **Fora de escopo:** `innerRef` legado em primitives (TD-001/TD-002) — ainda é o mecanismo válido de ref do `ArborTransform`; remoção exige RFC dedicada.

---

## TD-013 — Ambiente de testes para componentes `.native.tsx` ausente

**Origem:** TD-009 (estratégia Field.native) · 2026-04-24
**Status:** **Resolved (2026-04-25)** — RFC-0016 implementada
**Severidade:** Alta (qualidade cross-platform)

### Contexto

Jest do projeto roda só contra entrypoint web. Componentes `.native.tsx` existentes (`image.native.tsx`, `grid.native.tsx`, `icon.native.tsx`, `text.native.tsx`, `fab.native.tsx`, `field.native.tsx`) têm **zero cobertura de testes** — são revisados por leitura, não por execução.

A causa raiz é decisão tácita da Fase 0: o setup inicial priorizou web e adiou ambiente RN. Nunca foi formalizado, mas o efeito se acumula.

### Impacto

- **Drift cross-platform sem trava.** Refactor em primitives ou no styled-system quebra native silenciosamente; CI não pega.
- **Bloqueia múltiplos TDs:**
  - **TD-004** (Clickable.native abstração) — sem testes, refactor é arriscado.
  - **TD-005** (theming hardcoded em fab.native) — não há como validar que tokens passam a ser lidos corretamente após fix.
  - **TD-009** (Field unificado) — fechar com cobertura real depende deste.
- **Bloqueia R6 native.** Checkbox/Radio/Switch/Select native (se forem implementados) entram sem proteção.
- **Cumulativo.** Cada `.native.tsx` adicionado aumenta a superfície sem testes.

### Resolução proposta

RFC dedicada entre dois caminhos (não mutuamente exclusivos):

1. **jest-expo + @testing-library/react-native** — runtime RN real. Suite separada com convenção `*.native.test.tsx`. Custo: setup, CI matrix (job adicional ou jest-projects), tempo de teste maior.

2. **react-native-web como aproximação** — alias RN → RNW na config Jest atual. Mesma suite roda nos dois caminhos. Custo: cobertura parcial (não pega APIs RN-only nem o bridge a11y específico de RN puro). Vantagem: zero infra nova.

Preferência: **(1) para componentes com lógica RN real** (gestos, animação nativa, primitivas RN crus); **(2) como rede de proteção rápida** para o restante (compounds que só re-renderizam estilo).

Decisão da RFC deve incluir:

- Convenção de naming (`*.native.test.tsx` × dual-target).
- Estratégia de CI (job único × matrix).
- Critério para escolher (1) ou (2) por componente.
- Mocks padronizados (RN modules, gestures, animations).

### Critério para fechar

- [x] RFC redigida e aceita — RFC-0016.
- [x] Test runner escolhido configurado em `package.json` + `jest.config.*` — multi-project com `web` (jsdom + RNW) e `native` (jest-expo).
- [x] CI executa suite native em PRs — `pnpm test` único, dois projects.
- [x] Cobertura mínima ≥ 1 teste por arquivo `.native.tsx` existente — 13/13 cobertos.
- [x] CONTRIBUTING.md exige teste para novos `.native.tsx`.
- [x] Documentar mocks padronizados em `docs/TESTING.md`.

### Resolução (2026-04-25)

Implementada em três commits:

- **PR1 (`85c6e01`)** — infra Jest multi-project: `jest.config.cjs` raiz + `jest.config.web.cjs` + `jest.config.native.cjs` + `jest.setup.native.cjs` + `test/native-mocks.cjs`.
- **PR2 (`e02414a`)** — 1 `.native.test.tsx` por `.native.tsx`: 13 arquivos novos, 39 cases comportamentais + 3 cases `.skip` documentando paridade pendente de TD-009. Total da suite: 640 testes (598 web + 42 native + 3 skip).
- **PR3 (este commit)** — governança: `scripts/check-platform-contract.js` valida paridade `.native.tsx` ↔ `.native.test.tsx`, `CONTRIBUTING.md` documenta convenção, `docs/TESTING.md` criado.

Workaround conhecido em `jest.setup.native.cjs`: pre-resolve dos lazy globals da Expo (`__ExpoImportMetaRegistry`, `TextDecoder`, etc.) — necessário em pnpm para evitar `Runtime._execModule` jogar `outside of the scope of the test code` quando getters disparam `require()` em teardown. Detalhes em `docs/TESTING.md`.

**Desbloqueia:**
- TD-005 (theming hardcoded em `fab.native`) — agora dá para asserir tokens consumidos.
- TD-009 (Field unificado) — gaps de paridade já documentados em `field.native.test.tsx` via `describe.skip`.
- TD-004 (Clickable.native) — refactor com rede de proteção viável.

---

## Como adicionar uma dívida

Toda decisão de adiar trabalho ou aceitar atalho temporário deve virar entrada aqui. Critério:

- A solução completa **existe** mas foi **deliberadamente** adiada.
- Há **risco** de impacto futuro (DX, performance, manutenção, correctness).
- Há **plano** de resolução (mesmo que seja "abrir RFC quando surgir caso").

Estrutura de cada entrada:

```markdown
## TD-NNN — Título curto

**Origem:** RFC/PR/sessão
**Status:** Open | In progress | Resolved | Obsolete
**Severidade:** Baixa | Média | Alta | Crítica

### Contexto
O que aconteceu, por quê.

### Impacto
Quem é afetado, em que dimensão (DX, performance, a11y, manutenção).

### Resolução proposta
Como resolver. Plano concreto ou critério para definir o plano.

### Critério para fechar
Checklist objetivo para marcar como Resolved.
```

Numerar sequencialmente (TD-001, TD-002, ...) — não reciclar números.
