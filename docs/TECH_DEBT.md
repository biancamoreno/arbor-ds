# Débito técnico — Arbor-DS

> Registro formal de dívidas técnicas conhecidas. Toda dívida criada deliberadamente (decisão de adiar) deve entrar aqui — dívida não registrada vira surpresa futura.
>
> **Atualizar quando:** criar dívida (com `Status: Open`), fechar dívida (`Resolved` + data), ou descobrir que dívida está obsoleta (`Obsolete` + razão).

**Última atualização:** 2026-05-01 (TD-026 aberta — `focusRing` themable adiado em RFC-0027 PR2; recipes consomem via spread estático, override de tema não chega ao anel de foco)

---

## Visão geral

| ID | Título | Origem | Status | Impacto | Plano |
|---|---|---|---|---|---|
| [TD-001](#td-001) | Cast `props.innerRef as Ref<HTMLElement>` em primitives | RFC-0001 | Open | Cosmético (compile-time) | Resolver junto com depreciação de `innerRef` (TD-002) ou em RFC de tipagem do engine |
| [TD-002](#td-002) | `innerRef` legado sem warning de depreciação | RFC-0001 | Open | DX (consumidores não sabem que API mudou) | RFC dedicada definindo timeline + warning de runtime |
| [TD-003](#td-003) | `useClickableContext` adiado | RFC-0008 | Open | Funcional (cobre só `:active` puro, não `pressed` controlado) | RFC quando surgir 1º consumidor real (Card hoverable, Chip selecionável) |
| [TD-004](#td-004) | Componentes `.native.tsx` sem abstração cross-platform | R4 (FAB) | **Resolved (2026-04-25)** | Arquitetural (replicar em N componentes) | RFC-0018 onda 1 — `Clickable.native` criado (Pressable + Box wrapper); FAB.native migrado como primeiro consumidor |
| [TD-005](#td-005) | Cores e shadows hardcoded em `.native.tsx` | R4 (FAB) | **Resolved (2026-05-01)** | — | Fechado pelo PR 3 da RFC-0027 — `fab.native` agora consome `theme.colors.brand.base/text.inverse/...` via `useTheme()` e `theme.colors.shadow.color` (token novo). |
| [TD-006](#td-006) | Acoplamento bidirecional Button↔ButtonGroup via context | R4 (Button) | Open | Manutenção (Button conhece detalhes de ButtonGroup) | RFC: mover `attachedStyle` para ButtonGroup ou criar variant `attached` em Button via theme recipe |
| [TD-007](#td-007) | `forwardRef` ausente em camadas pós-core | R4 (Button/ButtonGroup/FAB) | Open | DX + integração com libs externas | Sweep coordenado pós-R6 (quando teremos mais dados sobre o gap em Field/Input/Card etc.) |
| [TD-008](#td-008) | Recipe `input` morta — substituída por `getFieldFrameStyle` imperativo | R5 (Input) | **Resolved (2026-04-24)** | Theming dinâmico/dark mode/overrides quebrados na família Input | Migrada para slot recipe `frame`/`control` × `size`/`variant`/`state`; TextInput/TextArea consomem via `useSlotRecipe`; `getFieldFrameStyle`/`getFieldColors`/`getFieldSizeStyles` deletados; FieldShell isolado em `field-shell.tsx` |
| [TD-009](#td-009) | `Field.native` em divergência arquitetural com web | R5 (Field) | **Resolved (2026-04-25)** | Drift cross-platform; cobertura zero em native | Re-implementado via opção 1 (RFC-0018 onda 2): `field.native.tsx` consome `useSlotRecipe('field')`; FieldContext ganhou `labelId`; FieldControl injeta `nativeID`/`accessibilityLabelledBy`/`accessibilityState`/`accessibilityDescribedBy`/`editable`; 4 cases de paridade verdes (3 `.skip` removidos) |
| [TD-010](#td-010) | `input/core/select.tsx` é dead code com anti-patterns | R5 (Input) | **Resolved (2026-04-24)** | Confundia contribuidores; contradizia CLAUDE.md | Removido em 2026-04-24 — `input/core/select.tsx` + `input/interfaces/SelectProps.ts` deletados |
| [TD-011](#td-011) | Field — sem registry de slots para condicional `aria-describedby` | R5 (Field, CR5-2) | **Resolved (2026-04-24)** | A11y: aria-describedby aponta para id inexistente quando Description ausente | Resolvido por RFC-0014 — FieldContext ganhou `descriptionRegistered`/`errorRegistered` + register/unregister via `useEffect` nos slots Description/Error |
| [TD-012](#td-012) | Varredura completa de depreciados (Modal, aliases `is*`, flat Checkbox/Tooltip/Drawer, array responsivo) | Pré-release | **Resolved (2026-04-24)** | Surface area dobrada; warnings em runtime; documentação inflada | Removido em 2026-04-24 — sem consumidores externos, sem janela de transição. Ver TD-012 abaixo. |
| [TD-013](#td-013) | Ambiente de testes para componentes `.native.tsx` ausente | TD-009 (estratégia Field.native) | **Resolved (2026-04-25)** | Drift cross-platform sem trava; bloqueia validação de TD-004/005/009 e R6 native | RFC-0016 implementada — jest multi-project (`web` + `native`) + 13/13 `.native.tsx` cobertos + `scripts/check-platform-contract.js` valida paridade |
| [TD-014](#td-014) | Foco visível ausente em inputs ocultos (Radio/RadioCard/Switch/Checkbox web) | R6 review (HR6-1) | **Resolved (2026-04-25)** | A11y crítica — WCAG 2.4.7 quebrado | Pseudo-prop `_focusVisibleWithin` (`:has(:focus-visible)`) + `_focusVisible` no Checkbox.Indicator; engine ganhou `outline*`/`boxShadow`; CONTRIBUTING §8 documenta padrão |
| [TD-015](#td-015) | Slots fantasma `Switch.Track`/`Switch.Thumb` | R6 review (HR6-2) | **Resolved (2026-04-25)** | API mente — slots não-funcionais | RFC-0017 caminho B — `Switch.Track` / `Switch.Thumb` removidos do export; Switch é elementar |
| [TD-016](#td-016) | Touch target abaixo de WCAG 44×44 | R6 review (R6-I) | **Resolved (2026-04-25)** | A11y mobile — Counter sm/md, TextInput sm, Switch md, Select sm/md, Select items | Field/Input/Select recipes com `minHeight: 44` + Counter/Switch com overlay `::before` 44×44; FAB sm 40→44; engine ganhou `content`; CONTRIBUTING §9 documenta padrão |
| [TD-017](#td-017) | 12 componentes em `@platform web-only` violam diretriz cross-platform do DS | Diretriz arquitetural (2026-04-25) | **Resolved (2026-04-28)** | **Crítico** — Promessa do DS quebrada em mobile; Field-aware mistos | RFC-0018 ondas 1–5 + RFC-0021 (Button) + RFC-0022 (Table) entregues; RadioCard removido (RFC-0019 closed); `tag/core/badge.tsx` duplicata morta deletada; `web-only` global em 0; `check-platform-contract --strict` verde |
| [TD-019](#td-019) | Engine native bloqueia `accessibilityElementsHidden` / `importantForAccessibility` | RFC-0018 onda 4 | **Resolved (2026-04-28)** | A11y native (separadores/decoradores) | `systemBlockedPropsByPlatform` plataforma-aware; reaplicado em Breadcrumb.Separator e Pagination.Ellipsis |
| [TD-022](#td-022) | `shadows` órfão em `primitives/` + 13 box-shadows inline em componentes/recipes | Diagnóstico multi-produto (B3) | **Resolved (2026-05-01)** | Theming bloqueado para identidade de elevação (produto não conseguia mudar linguagem de sombras sem fork) | `shadows` adicionado ao `baseTheme`; engine ganhou handler `boxShadow`/`shadow` consumindo escala `shadows`; 13 inlines migrados (Dialog/Drawer/Tooltip/Popover/Menu/Toast/Card/Select/FAB/NavBar + recipes Dialog/Drawer/Card no base-theme) |
| [TD-025](#td-025) | `FileUpload.native` é placeholder; promover para implementação real se demanda materializar | RFC-0026 (PR 2) | Open | DX (consumidor RN precisa integrar lib externa via `children`) | Promover para caminho (a) `expo-document-picker` peer dep quando 3+ produtos consumidores pedirem em < 6 meses |
| [TD-026](#td-026) | `focusRing` não é themable — recipes consomem via spread estático | RFC-0027 (PR 2) | Open | Theming (anel de foco fixo, produto não consegue ajustar offset/largura/cor da identidade) | Engine de pseudos resolver subprops via scale `focusRing` (ex: `outlineColor: 'focusRing.color'` consulta `theme.focusRing.color`) — RFC dedicada |

**Total:** 6 dívidas abertas, 13 resolvidas (TD-008, TD-010, TD-011, TD-012 em 2026-04-24; TD-004, TD-009, TD-013, TD-014, TD-015 e TD-016 em 2026-04-25; TD-017 e TD-019 em 2026-04-28; TD-022 em 2026-05-01).

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
**Status:** **Resolved (2026-04-25)** via RFC-0018 onda 1
**Severidade:** Alta (arquitetural)

### Resolução

Resolvido em 2026-04-25 (commit local) como onda 1 da RFC-0018 (paridade native completa do DS):

- `src/components/core/clickable/core/clickable.native.tsx` criado — wrapper `<Pressable>` + `<Box>`. API canônica web (`onClick`, `disabled`, `role`, `aria-label`, `testID`) mapeada para a API nativa (`onPress`, `accessibilityRole`, `accessibilityLabel`, `accessibilityState`).
- Tag `@platform` em `ClickableProps.ts` atualizada de `web-only` para `native-ready`.
- `clickable.native.test.tsx` adicionado com 8 cases (paridade default role, mapping `role`/`aria-label`, press dispara `onClick`, disabled bloqueia, override de `accessibilityRole`).
- `fab.native.tsx` migrado de `TouchableOpacity` cru para `<Clickable>`. Primeiro consumidor real, valida o pattern.
- TD-005 (theming hardcoded em `fab.native`) **continua aberto** — hex literais `#18736A` etc. permanecem; é trabalho de RFC-0018 onda 2 ou TD-005 dedicada (depende de tokens semânticos consumíveis em RN).

Critérios originais — atendidos pela onda 1.

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
**Status:** Resolved (2026-05-01) · pelo PR 3 da RFC-0027
**Severidade:** Alta (theming)

### Resolução (2026-05-01)

`fab.native.tsx` migrado para `useTheme()`:

- `VARIANT_COLORS` agora resolve em runtime via `theme.colors.brand.base / text.inverse / brand.subtle / text.primary / surface.default`.
- `shadowColor` usa `theme.colors.shadow.color` (token novo `colors.shadow.color` exposto em `themeLightColors`/`themeDarkColors` — `primitiveColor.neutral['100']`).
- Override por produto via `createTheme()` agora propaga corretamente para FAB nativo.



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
**Status:** **Resolved (2026-04-25)** · onda 2 da RFC-0018
**Severidade:** Alta (cross-platform)

### Resolução

`field.native.tsx` re-implementado via **opção 1** (primitives + slot recipe). Mudanças:

- `FieldContext` ganhou `labelId` (compartilhado web+native; chave para amarração `htmlFor` ↔ `accessibilityLabelledBy`).
- `field.native.tsx` consome `useSlotRecipe('field')` igual ao web — fim do hardcode (`gap='micro'`, `fontSize='sm'` etc.).
- `FieldRoot` aceita `style` e o repassa via `Box`.
- `FieldLabel` emite `nativeID={labelId}`.
- `FieldControl` clona o filho injetando: `nativeID={fieldId}`, `accessibilityLabelledBy={labelId}`, `accessibilityState={{ disabled }}`, `accessibilityDescribedBy={...}`, `editable={false}` (quando `disabled`). Respeita o marker `isFieldAware` (mesmo contrato que web).
- `FieldDescription`/`FieldError` emitem `nativeID` correspondente; Error mantém `accessibilityRole='alert'`.

Cobertura: `field.native.test.tsx` agora tem 12 cases verdes (4 novos da TD-009 sem `.skip`); suite total 680/680.



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

## TD-014 — Foco visível ausente em inputs ocultos (Radio/RadioCard/Switch/Checkbox)

**Origem:** R6 review (HR6-1) · 2026-04-25
**Status:** Resolved (2026-04-25)
**Severidade:** Alta (a11y — WCAG 2.4.7)

### Resolução (2026-04-25)

1. **Engine — pseudo-prop nova:** `_focusVisibleWithin` resolve para `&:has(:focus-visible)` (`src/ecosystem/styled-system/system/pseudo-props/pseudos.ts`). Reage só ao foco por teclado mesmo quando o input real é descendente invisível. `:has` tem suporte amplo em todos navegadores modernos.
2. **Engine — props habilitadas:** `outline`, `outlineColor`, `outlineOffset` e `boxShadow` adicionadas em `available-style-properties.ts`. `outlineColor` resolve token de cor via `getColor` no `style-map.ts` (antes já existiam tipados em `interactivity.ts` mas eram silenciosamente descartadas pelo engine).
3. **Recipes (`src/foundations/theme/base-theme.ts`):**
   - `checkbox.base.indicator`: `_focusVisible` (input visível direto).
   - `radio.base.root`: `borderRadius: medium` + `_focusVisibleWithin`.
   - `switch.base.root`: `borderRadius: full` + `_focusVisibleWithin`.
   - Constante `focusRing` reutilizada (`{ outline: '2px solid', outlineColor: 'interactive.default', outlineOffset: '2px' }`).
4. **RadioCard (não consome recipe):** prop direta `_focusVisibleWithin` no `<Box as="label">` raiz.
5. **Tests:** 1 teste assertivo por componente verificando que o stylesheet gerado contém regra `:has(:focus-visible){...outline...}` (ou `:focus-visible{...outline...}` no caso do Checkbox). 686/686 verdes.
6. **CONTRIBUTING §8:** padrão técnico documentado para componentes futuros com input oculto.

### Contexto

Radio, RadioCard, Switch e Checkbox web usam o mesmo padrão técnico: `<input>` real é `position: absolute; opacity: 0; pointerEvents: none`, e o visual é desenhado por `<Box>`/`<Flex>` custom. **Nada** reflete `:focus-visible` no visual — usuário com teclado não vê onde está.

WCAG 2.4.7 (Focus Visible, AA) exige indicador de foco visível em qualquer keyboard-operable component. Sem isso, formulário inteiro vira inacessível para quem não usa mouse.

### Impacto

- A11y crítica em todos os formulários do produto.
- Aplica-se a 4 componentes (e qualquer componente futuro que copie o padrão).
- Não detectado por lint nem CI hoje. Só revisão visual.

### Resolução proposta

**Sweep coordenado**, não fix por componente. Padrão técnico:

```css
/* CSS-in-JS via styled-system */
input:focus-visible + .visual {
  boxShadow: 0 0 0 2px var(--brand-subtle);
  outline: none;
}
```

Em prática, com Arbor styled-system: refletir `:focus-visible` do input oculto via prop `_focusWithin` ou pseudo-prop análoga no `<Flex>` visual. Quando focus-visible no input filho, o ancestor pai aplica boxShadow.

Reaproveita o token `brand.subtle` (já usado para selected state) — coerência visual.

### Critério para fechar

- [ ] Padrão técnico decidido (CSS adjacent sibling × pseudo-prop styled-system).
- [ ] Aplicado em Radio, RadioCard, Switch, Checkbox web.
- [ ] Test cobrindo foco visível (assertion via `getComputedStyle` ou snapshot visual no Storybook).
- [ ] CONTRIBUTING.md menciona padrão para novos componentes com input oculto.

> **Bloqueio cruzado:** RFC-0019 (RadioCard deprecação) reduz escopo a 3 componentes. RFC-0017 (recipes mortas) consolida onde o `state: 'focus'` deve viver na recipe. Ambas vão na mesma janela.

---

## TD-015 — Slots fantasma `Switch.Track` / `Switch.Thumb`

**Origem:** R6 review (HR6-2) · 2026-04-25
**Status:** **Resolved (2026-04-25)** via RFC-0017 (caminho B — Switch elementar)
**Severidade:** Média (DX — API mentirosa)

### Resolução

Resolvido em 2026-04-25 junto com RFC-0017 (recipes mortas R6):

- `SwitchTrack` e `SwitchThumb` removidos do export. `Switch` é agora um componente elementar (`<Switch />` ou `<Switch.Root />`).
- `SwitchTrackProps` e `SwitchThumbProps` removidos de `interfaces/SwitchProps.ts` e `index.ts`.
- Stories e playground atualizados (sem aninhamento Track/Thumb).
- Recipe `switch` mantém slots `root | track | thumb` internamente — usados pelo `SwitchRoot` para desenhar o visual; não expõe composição. Decisão consciente: o consumidor que precisar de visual customizado abrirá RFC dedicada quando o caso de uso surgir.
- Testes verdes (24/24 web + 5/5 native).

Critérios originais — todos atendidos via caminho B.

### Contexto

`Switch` web exporta `Switch.Track` e `Switch.Thumb` como compound members. Mas o visual do switch (track + thumb animados) é renderizado **dentro de `SwitchRoot`** independentemente do que o consumidor monta. `<Switch.Track />` adiciona DOM extra inócuo; `<Switch.Thumb />` idem. **Slots não cumprem promessa de composição.**

```tsx
// Hoje — mentira:
<Switch>
  <Switch.Track>
    <Switch.Thumb />
  </Switch.Track>
</Switch>
// SwitchRoot ignora children e desenha track+thumb internos.
```

### Impacto

- API documentada não funciona como anunciado.
- Consumidor que tenta customizar (`<Switch.Track style={{...}}>`) não vê efeito → frustração silenciosa.
- Inconsistente com Checkbox/Radio/Field que têm slots reais.

### Resolução proposta

Decidir entre:

- **(A) Slots reais.** Refatorar SwitchRoot para renderizar `Switch.Track` e `Switch.Thumb` via children/cloneElement. Permite override visual. Custo: refator interno + atualizar testes + recipe (slot `track`/`thumb` precisa expor variants reais).
- **(B) Tornar Switch elementar.** Remover `Switch.Track` e `Switch.Thumb` do export. SwitchRoot é único. Mais barato; consumidor que precisa custom passa a usar `<Switch as={CustomImpl}>` (não previsto hoje, RFC dedicada se vier).

### Critério para fechar

- [ ] Decisão (A ou B) tomada com critério (existe demanda real de customização?).
- [ ] Implementação aplicada.
- [ ] Recipe `switch` ajustada (RFC-0017 — slots cobrem o que existe).
- [ ] Stories e MDX atualizados.

> **Bloqueio cruzado:** RFC-0017 (recipes mortas) precisa do conjunto definitivo de slots para migrar `switch`. Resolver TD-015 antes ou junto.

---

## TD-016 — Touch target abaixo de WCAG 44×44

**Origem:** R6 review (R6-I) · 2026-04-25
**Status:** Resolved (2026-04-25)
**Severidade:** Alta (a11y mobile — WCAG 2.5.5 / SC 2.5.8)

### Resolução (2026-04-25)

1. **Engine — `content` habilitado:** adicionado em `available-style-properties.ts`. Antes era descartado, impedindo `_before` overlays funcionais.
2. **Recipes (`base-theme.ts`):** `field.size.{sm,md}.control.minHeight` e `input.size.{sm,md}.frame.minHeight` 32/40 → **44**. `select.size.{sm,md}.trigger.minHeight` e `select.size.{sm,md,lg}.item.minHeight` → **44**. `lg` mantido em 48 onde já estava.
3. **FAB (`fab.tsx`):** `SIZE_MAP.sm` 40 → **44**.
4. **Counter (`counter.tsx`):** visual subiu (sm 24→32, md 32→40, lg 40→48) **e** ambos botões ganharam overlay `_before` com `minWidth/minHeight: 44px` centrado via `transform: translate(-50%, -50%)`. Hit area é 44×44 mesmo no sm.
5. **Switch (`switch.tsx`):** track recebeu overlay `_before` 44×44 idêntico (track herda `onClick`, então clicar no overlay ainda toggla).
6. **Tests:** parametrizados `it.each(['sm','md','lg'])` por componente — TextInput/Select inspecionam regra `min-height` no stylesheet; Counter/Switch inspecionam regra `::before{...min-width:44px;min-height:44px}`; FAB checa `style.height`. Novo `counter.test.tsx` criado. **702/702 verdes** (+16).
7. **CONTRIBUTING §9:** padrão e exemplos documentados (`minHeight` em recipe ou `_before` overlay para visuais < 44).

### Contexto

Vários componentes interativos têm área de toque menor que o mínimo WCAG (44×44 CSS pixels). Levantamento atual:

| Componente | Tamanho | Onde |
|---|---|---|
| Counter (R5) | sm: 32×32 / md: 40×40 | Botões `−`/`+` |
| TextInput (R5) | sm: ~32 altura | Touch target só no input field |
| Switch (R6) | md: 44×24 (track), thumb 20×20 | Pressionar fora do track não conta |
| Select (R6) | sm: ~32 / md: ~40 | Trigger e items |
| Select Items (R6) | ~36 altura | Padding 8×16 + fontSize 14 |
| FAB sm (R4) | 40×40 | Atende em md (56) e lg (72), falha em sm |

### Impacto

- A11y mobile crítica. Usuário com motricidade reduzida ou em mobile usa miss-tap.
- Aplica em todos os componentes interativos do DS — vira requisito permanente, não fix pontual.
- Cumulativo: cada componente novo precisa lembrar.

### Resolução proposta

**Sweep + invariante.** Duas frentes:

1. **Fix do existente.** Aumentar tamanhos `sm` para >= 44 onde estão menores. Onde o tamanho visual precisa ficar pequeno (Counter sm, badges), expandir touch target via `padding` invisível ou `::before` overlay (pseudo-prop a definir).

2. **Lint rule custom.** ESLint ou check-platform-contract.js com regra: qualquer componente com `onPress`/`onClick` cujo computed `minHeight` × `minWidth` < 44 emite warning. Não trivial — requer integração com tema. Pode virar fase 2.

### Critério para fechar

- [ ] Fix aplicado nos 6 componentes listados.
- [ ] Storybook tem story `TouchTarget` por componente provando >= 44 em todos os sizes.
- [ ] CONTRIBUTING.md adiciona invariante "touch target >= 44 em qualquer Root interativo".
- [ ] (Opcional) Lint rule implementada.

> Componente novo deve nascer dentro do invariante — se necessário, a recipe (RFC-0017) deve carregar o `min: 44` por default.

---

## TD-017 — `@platform web-only` viola diretriz cross-platform do DS

**Origem:** Diretriz arquitetural (2026-04-25) · formalizada em [RFC-0018](rfcs/RFC-0018-paridade-native-completa-do-ds.md)
**Status:** **Resolved (2026-04-28)** — `web-only` global em 0; `check-platform-contract --strict` verde
**Severidade:** Crítica (promessa do DS)

**Progresso:**
- ✅ Onda 1 (2026-04-25, `ced19a3`) — Clickable.native + 8 cases.
- ✅ Onda 2 (2026-04-25) — TextInput.native (9), TextArea.native (6), Counter.native (6), Field.native unificado (12). Fecha [TD-009](#td-009). `web-only`: 12 → 10.
- ✅ Onda 3 (2026-04-25) — Radio.native + Select.native; RadioCard depreciação via RFC-0019. `web-only`: 10 → 8.
- ✅ Onda 4 (2026-04-26) — Pagination/Tabs/Breadcrumb native. `web-only`: 8 → 5.
- ✅ Onda 5 (2026-04-27) — Tag/Accordion native. `web-only`: 5 → 3.
- ✅ RFC-0021 (2026-04-25) — Button + IconButton native; RadioCard removido. `web-only`: 3 → 1.
- ✅ RFC-0022 (2026-04-28) — Table.native (Flex columnar + ScrollView para `scrollable`; `accessibilityRole='header'` em HeaderCell). **Fecha esta TD.** `web-only`: 1 → 0.


### Contexto

`CLAUDE.md` declara o Arbor-DS como "fonte única de verdade para interfaces web e mobile". Inventário em 2026-04-25 mostra **12 componentes** marcados `@platform web-only`:

| Categoria | Componentes |
|---|---|
| Core interativo | `Clickable` |
| Form base | `Input` (TextInput, TextArea, Counter, FileUpload) |
| Form seleção | `Radio`, `RadioCard`, `Select` |
| Ação | `Button` |
| Navegação | `Pagination`, `Tabs`, `Breadcrumb` |
| Conteúdo | `Tag`, `Table`, `Accordion` |

A classificação `web-only` não foi decisão deliberada — foi efeito colateral do path-of-least-resistance (HTML é mais rápido). Sem RFC documentando trade-off, o débito acumulou silenciosamente.

### Impacto

- **Promessa quebrada.** Produto mobile que adota Arbor-DS não consegue construir telas inteiras com o DS. A motivação de existir do DS evapora em mobile.
- **Drift cumulativo.** Cada componente novo que copia o padrão `<input>`/`<button>`/`<select>` aumenta a fronteira artificial.
- **Field-aware mistos.** Field tem `.native.tsx`; Input que é Field-aware **não** — Field native fica com integração quebrada.
- **Surface area mentirosa em entrypoint native.** `src/native.ts` re-exporta seletivamente, mas o entrypoint default (`arbor-ds`) ainda tipa todos. Consumidor RN que importa do default ganha tipos sem componente.

### Resolução proposta

[RFC-0018 — Paridade native completa do DS](rfcs/RFC-0018-paridade-native-completa-do-ds.md). Resumo:

1. **Norma.** A tag `@platform web-only` é classificação **inválida**. Apenas `shared` e `native-ready` são aceitas.
2. **Plano em 6 ondas:**
   - **Onda 1 — Clickable.native** (resolve [TD-004](#td-004)). Destrava 80% do trabalho restante.
   - **Onda 2 — Form base** (TextInput.native, TextArea.native, Counter.native). Destrava [TD-009](#td-009).
   - **Onda 3 — Form seleção** (Radio.native, Select.native; RadioCard via deprecação RFC-0019).
   - **Onda 4 — Navegação** (Pagination, Tabs, Breadcrumb).
   - **Onda 5 — Conteúdo** (Tag, Accordion).
   - **Onda 6 — Caso-fronteira** (FileUpload, Table) — RFCs dedicadas com decisão sobre deps externas (`expo-document-picker`).
3. **Auditoria de `shared`.** Validar que componentes hoje `shared` realmente delegam tudo (sem `<input>`/`<button>` HTML cru no `.tsx`).

### Critério para fechar

- [x] **Onda 1** — Clickable.native implementado + cobertura ≥ 5 cases. Resolve TD-004. (2026-04-25, `ced19a3`)
- [x] **Onda 2** — TextInput/TextArea/Counter têm `.native.tsx` + suíte. Field.native re-implementado via slot recipe + amarração Label↔Control. Resolve TD-009. (2026-04-25)
- [x] **Onda 3** — Radio.native + Select.native implementados; RadioCard depreciação aguarda RFC-0019. (2026-04-25)
- [x] **Ondas 4–5** — Pagination/Tabs/Breadcrumb/Tag/Accordion convertidos. (2026-04-26 / 2026-04-27)
- [x] **RFC-0021/0022** — Button + IconButton + Table cross-platform; RadioCard removido. (2026-04-25 / 2026-04-28)
- [x] **Norma aplicada:** `node scripts/check-platform-contract.js --strict` verde — a tag `@platform web-only` não existe em nenhum arquivo do `src/`. (2026-04-28)
- [ ] **Auditoria de `shared`** — sweep manual + warning no `check-platform-contract.js` para HTML cru em arquivos `.tsx` (não bloqueia fechamento; pode virar TD própria se aparecer regressão).
- [ ] **CONTRIBUTING.md** documenta os 2 níveis válidos (não bloqueia fechamento).

### Cruzamento com outras dívidas e RFCs

- **TD-004** — Clickable.native = onda 1. Promovido a primeiro item desta auditoria.
- **TD-005** — fab.native theming hardcoded. Já é `native-ready`; sweep cosmético, não bloqueia esta TD.
- **TD-009** — Field unificado. Onda 2 destrava (Input ganha `.native.tsx`).
- **RFC-0017** — recipes consumidas são cross-platform por definição; reforça esta diretriz.
- **RFC-0019** — só pode ser implementada após Radio.native (onda 3).
- **RFC-0020** — agora inclui escopo native (Select.native em onda 3).

### Severidade

Maior dívida arquitetural aberta hoje. Vetor de regressão de produto: cada nova fase (R7+) que entra com `web-only` repete o erro. Esta TD precisa estar **claramente visível** em qualquer planejamento de R7+.

---

## TD-018 — Feedback indicators web-only de fato (R7)

**Origem:** R7 scoping (2026-04-25) · escopo derivado de [TD-017](#td-017) / [RFC-0018](rfcs/RFC-0018-paridade-native-completa-do-ds.md)
**Status:** **Resolved (2026-04-28)** — todas as 5 sub-ondas entregues
**Severidade:** Alta (consistência cross-platform — promessa do DS)

### Resolução total (2026-04-28) — sub-onda 7.5 (Toast.native)

**Sub-onda 7.5 entregue** (commit `61cb431`), fechando TD-018 integralmente:

- `interfaces/ToastProps.ts`: removido `extends HTMLAttributes<HTML*Element>` de todos os subcomponentes (vazava tipos DOM em consumo native); substituído por `style?: CSSProperties` + `testID?: string`. Tag `@platform shared` documentada na interface.
- `core/toast.tsx` (web): props explícitas (sem spread HTML), `Portal mode="overlay"` para que toques passem à UI subjacente em overlays não-modais; `displayName` em todos os 4 subcomponentes + `Toaster`.
- `core/toast.native.tsx`: `Animated.parallel(opacity, translateY)` na entrada com bypass em ambiente de teste; `accessibilityLiveRegion` (`'assertive'` para `tone='critical'`, `'polite'` caso contrário) + `accessibilityRole='alert'`. `getPlacementContainerStyle` própria do native — `*-center` usa `alignItems: 'center'` (RN não suporta `translateX('-50%')`).
- `core/toast.native.test.tsx`: 10 cases (paridade do web) — isolated + harness com `useToast` + `Toaster`.
- `toast-store.ts` + `use-toast.ts` reutilizados sem mudança (já vanilla JS, cross-platform).
- `src/native.ts` exporta `Toast`, `Toaster`, `useToast` + tipos públicos (`ToastTone`, `ToastPlacement`, `ToastItem`, `Toast*Props`, `ToasterProps`, `ToastInput`).

**Suite:** 817 → **831 verdes** (+14 cases). 32/32 `.native.tsx` com paridade de testes. Toast era o último indicator "web-only encoberto" (sem tag, mas usava `document.head` + `transform: translateX('-50%')`); a TD agora pode ser fechada formalmente.

### Resolução parcial (2026-04-28)

**Sub-onda 7.4 (ProgressCircle.native) entregue** via [RFC-0023](rfcs/RFC-0023-progress-circle-native.md):

- Decisão: caminho **(a) reformulado** — `react-native-svg` formalizada como `peerDependency` (`>=13`), movida de `dependencies` (errado) para `peerDependencies`. Custo real adicional de bundle = **0 KB** (Lucide já exige `react-native-svg` como peer; consumidores RN do DS já têm o módulo instalado).
- `progress-circle.native.tsx`: `Svg` + `Circle` + `Animated.loop` rotacionando o **container** (`Animated.View` com `useNativeDriver: true`), não o `strokeDashoffset` — 60fps na UI thread, paridade visual com web.
- `ProgressCircleProps` reescrita sem `extends SVGAttributes<SVGSVGElement>` (vazava tipos DOM em consumo native; sweep confirmou zero consumidores afetados).
- `progress-circle.native.test.tsx` com 14 cases (paridade + extras: tones via `it.each`, `accessibilityValue`, `accessibilityState.busy`, testID).
- `src/native.ts` exporta `ProgressCircle` + `ProgressCircleProps`.
- (b) View + borderRadius + máscaras descartado: zero economia de dependência (já paga via Lucide), fidelidade visivelmente inferior, mais código que SVG. (c) Deprecar em RN descartado: quebra paridade do DS sem ROI técnico.

**Suite:** 803 → **817 verdes** (+14 cases). 30/30 `.native.tsx` com paridade de testes.

### Resolução parcial (2026-04-25)

**Sub-ondas 7.1, 7.2, 7.3 entregues** — 5 dos 7 indicators agora são paritários cross-platform:

1. **7.1 (shared)** — Alert/Badge/ProgressBar mantêm uma única implementação (engine cobre); ganharam `@platform shared` formal na interface + smoke `.native.test.tsx` (Alert: 2 cases, Badge: 3, ProgressBar: 3) + export em `src/native.ts`. ProgressBar `indeterminate` perde animação shimmer em RN (paridade visual aceitável; CSS keyframes não rodam — fica documentado).
2. **7.2 (Spinner.native)** — `Animated.loop` rotacionando `<Icon LoaderCircle>`; tag `@platform native-ready` + `spinner.native.test.tsx` (4 cases) + export. Guard `process.env.NODE_ENV === 'test'` evita disparar `Animated` no jest (mismatch react/react-native-renderer 19.1 ↔ 19.2).
3. **7.3 (Skeleton.native)** — `Animated.sequence` em opacity (0.4↔1.0, 700ms cada lado); tag `native-ready` + `skeleton.native.test.tsx` (4 cases) + export. Sem gradient shimmer no MVP (paridade visual aceitável; gradient cross-platform exigiria `expo-linear-gradient`).

**Suite:** 733 → **741 verdes** (+8 cases novos efetivos no contador). 21/21 `.native.tsx` com paridade de testes.

### Contexto

Levantamento dos 7 feedback indicators existentes contra a diretriz cross-platform:

| Componente | Estado web | API hostil a native |
|---|---|---|
| Toast | ✅ | `document.getElementById` + `<style>` injetado + `Portal` web |
| Skeleton | ✅ | `injectKeyframes()` com `document.head` |
| Spinner | ✅ | `animation: 'arbor-spin ... infinite'` (CSS keyframes) |
| ProgressCircle | ✅ | `<svg>` direto (RN exige `react-native-svg` ou alternativa) |
| ProgressBar | ✅ | só `Box` + `transition()` — provável shared, validar |
| Alert | ✅ | só `Flex/Text/Clickable/Icon` — provável shared, validar |
| Badge | ✅ | só `Box/Flex` — provável shared, validar |

Nenhum tem tag `@platform` declarada. 4 são web-only de fato (silenciosamente); 3 são shared sem registro.

### Por que isto importa

- Diretriz da memória `feedback_cross_platform_obrigatorio` é explícita: `@platform web-only` é bug, não classificação aceita.
- Ausência de tag esconde o problema: `check-platform-contract.js` só falha em casos declarados.
- Toast/Skeleton/Spinner são consumidos em qualquer fluxo de produto (loading, vazio, feedback de ação) — usar o DS no app native sem eles é incompleto.
- ProgressCircle abre decisão de dependência externa (`react-native-svg`) que merece RFC própria.

### Resolução proposta

Plano em 5 sub-ondas, ordenadas por dependência e custo:

| Sub-onda | Componente | Estratégia | Status |
|---|---|---|---|
| **7.1** | Alert / Badge / ProgressBar | tag `@platform shared` + smoke test `.native.test.tsx` por componente | **Done (2026-04-25)** |
| **7.2** | Spinner.native | `Animated.loop` rotacionando `<Icon>`; tag `native-ready` em interface | **Done (2026-04-25)** |
| **7.3** | Skeleton.native | `Animated.sequence` em opacity (sem shimmer gradient no MVP); tag `native-ready` em interface | **Done (2026-04-25)** |
| **7.4** | ProgressCircle.native | `Svg`/`Circle` + `Animated.loop` no container (`useNativeDriver: true`); `react-native-svg` formalizada como `peerDependency` (já transitiva via Lucide). [RFC-0023](rfcs/RFC-0023-progress-circle-native.md). | **Done (2026-04-28)** |
| **7.5** | Toast.native | RN `Modal` + `Animated` slide bottom-up + `toastStore` reaproveitado (vanilla JS) + `Portal.native` | Pending — janela dedicada |

### Decisão (2026-04-25)

**Esta sessão fecha 7.1 + 7.2 + 7.3** (entrega 5 dos 7 indicators paritários, baixo risco). **7.4 e 7.5 ficam para janelas dedicadas** — 7.4 porque exige decisão de dependência (RFC), 7.5 porque é peça densa (Portal nativo + Modal + Animated).

**Não-objetivo desta TD:** criar Snackbar como componente novo. Toast já cobre o slot semântico; se um caso de uso real exigir variante "snackbar", abrir RFC separada para adicionar `variant`/`placement` no Toast existente.

### Critério para fechar

- [x] Alert / Badge / ProgressBar com `@platform shared` + smoke test `.native` (sub-onda 7.1). (2026-04-25)
- [x] Spinner.native implementado + suíte (sub-onda 7.2). (2026-04-25)
- [x] Skeleton.native implementado + suíte (sub-onda 7.3). (2026-04-25)
- [x] ProgressCircle.native — [RFC-0023](rfcs/RFC-0023-progress-circle-native.md) caminho (a) reformulado + implementação (sub-onda 7.4). (2026-04-28)
- [x] Toast.native via `Portal mode="overlay"` + `Animated.parallel` (opacity + translateY) + interfaces saneadas (sub-onda 7.5). (2026-04-28, commit `61cb431`)
- [x] `pnpm test:platform-contract --strict` verde; os 7 indicators têm `@platform` declarada (5 `shared`/paritários + 2 `native-ready`).

---

## TD-019 — Engine native bloqueia props de a11y `accessibilityElementsHidden` / `importantForAccessibility`

**Origem:** RFC-0018 onda 4 (2026-04-25) — descoberto ao implementar `Pagination.Ellipsis.native` e `Breadcrumb.Separator.native`
**Status:** **Resolved (2026-04-28)**
**Severidade:** Média (a11y degradada em separadores/decoradores native; não bloqueia ondas seguintes)

### Resolução (2026-04-28)

1. **`system.blocked.ts`** — `systemBlockedProps` virou `systemBlockedPropsByPlatform: { web: [...], native: [] }`. `systemBlockedProps` continua exportado como alias de `web` (compat).
2. **`system.ts`** — `systemBlockForwardProp(prop, platform = 'web')` aceita parâmetro de plataforma e consulta a lista correta.
3. **`styled-component.native.ts`** — passa `'native'` ao chamar `systemBlockForwardProp` no loop de forward de props.
4. **Reaplicado nos consumidores:** `breadcrumb.native.tsx` (Separator) e `pagination.native.tsx` (Ellipsis) voltaram com `accessibilityElementsHidden importantForAccessibility="no-hide-descendants"`.
5. **Tests:** `getAllByText('/'/'…')` migrados para `{ includeHiddenElements: true }`; novos casos `queryByText(...)` retornam `null` confirmando que screen readers não anunciam mais os decoradores.
6. **Suite:** 793 → **795 verdes** (+2).

### Contexto

A engine `styled-component.native.ts` consulta `systemBlockForwardProp(prop)` antes de repassar props ao host RN. A função usa a lista `systemBlockedProps = ['accessibilityElementsHidden', 'importantForAccessibility']` retornando `false` (não-forward) para essas duas props.

Resultado: ao escrever no `.native.tsx`:

```tsx
<Text accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
  /
</Text>
```

…a engine come essas props antes de chegarem ao `<Text>` host RN. Em produção, screen readers ainda anunciam o "/" / "›" / "…" (a prop nunca alcança o nó nativo). Em testes, o RN testing-library inspeciona props de **composites** (não só host) e marca a subtree como hidden — quebrando `getByText('/')` em `Breadcrumb.Separator` e `getByText('…')` em `Pagination.Ellipsis`.

A lista parece ter sido criada para impedir warnings em web (props não-padrão em DOM), mas o efeito colateral é zerar a a11y nativa para essas duas props específicas.

### Impacto

- Decoradores visuais (separadores, ellipses, dividers, etc.) não conseguem ser ocultados de screen readers em RN sem patch local com `Pressable`/`View` direto.
- RFC-0018 onda 4 (Pagination/Tabs/Breadcrumb) entregou Separator/Ellipsis sem hide-from-a11y → screen reader anuncia "Home, /, Produtos" em vez de "Home, Produtos". Aceitável no MVP, regressão de UX vs intenção.
- Bloqueia outros componentes futuros (dividers em Card, decoradores em Stepper, etc.) de implementar a11y correta.

### Resolução proposta

Tornar a `systemBlockedProps` **plataforma-aware**:

```ts
// system.blocked.ts
export const systemBlockedPropsByPlatform = {
  web: ['accessibilityElementsHidden', 'importantForAccessibility'],  // DOM warnings
  native: [],  // forwardar — RN aceita
};
```

E ajustar `system.ts` para escolher a lista correta por plataforma (engine web vs native).

Outra opção (menor escopo): hard-code no `styled-component.native.ts` que essas duas props **sempre** são forwardadas, ignorando o block list (que vira efetivamente web-only).

### Critério para fechar

- [ ] `accessibilityElementsHidden` e `importantForAccessibility` chegam ao host RN quando passadas em `.native.tsx`.
- [ ] Continuam bloqueadas no engine web (sem warning DOM).
- [ ] Reaplicar em `breadcrumb.native.tsx` (Separator) e `pagination.native.tsx` (Ellipsis) — voltar com `accessibilityElementsHidden importantForAccessibility="no-hide-descendants"`.
- [ ] Smoke tests com `screen.getByText('…', { includeHiddenElements: true })` para validar que a engine deixa passar.

---

## TD-022 — `shadows` órfão + 13 box-shadows inline

**Origem:** Diagnóstico multi-produto (brecha B3) — 2026-05-01
**Status:** **Resolved (2026-05-01)**
**Severidade:** Alta

### Contexto
`primitives/shadows.ts` definia uma escala `none/sm/md/lg/xl` mas **não estava exposta no `baseTheme`**. Como consequência, todas as superfícies elevadas do DS — Dialog, Drawer, Tooltip, Popover, Menu, Toast, Card, Select content, FAB, NavBar e as recipes `dialog`/`drawer`/`card` no `base-theme` — codificavam a sombra como string `rgba(...)` inline dentro de `style={{...}}`. O engine não tinha handler para `boxShadow`, então mesmo se a recipe declarasse `boxShadow: 'lg'` o valor seria passado direto, sem resolver via tema.

Para um produto consumidor, isso significava que mudar a linguagem de elevação exigia editar 10+ arquivos do DS — fork na prática.

### Impacto
- **Theming:** identidade de elevação não-tematizável; produtos consumidores presos à curva visual codificada inline.
- **Consistência interna:** 11 superfícies elevadas com 7 valores ligeiramente diferentes (mesmo offset, alpha distinto), sem critério visível.
- **DX:** anti-pattern silencioso — engenheiros copiavam strings rgba de outros componentes em vez de reusar token.

### Resolução
1. **Engine** — `styleMap` ganhou handler para `boxShadow` e alias `shadow`, ambos resolvendo via `theme.shadows.{token}` (com fallback para valor cru).
2. **baseTheme** — `shadows` (de `primitives/shadows.ts`) passou a integrar `baseTheme`, ficando consumível tanto pela engine quanto por overrides de produto via `createTheme()`.
3. **Sweep** — 13 inlines migrados:
   - `xl` (5 hits): Dialog, Drawer, Tooltip, Popover, Menu, FAB
   - `lg` (2 hits): Toast, Select content
   - `md` (1 hit): Card variant `elevated`
   - `sm` (1 hit): NavBar `elevated`
   - Recipes: `dialog.content`, `drawer.content`, `card.elevated` no `base-theme.ts`
4. **Test ajustado** — `nav-bar.test.tsx` migrou de `header.style.boxShadow` para `getComputedStyle(...).boxShadow` (acoplado ao detalhe inline-style, agora agnóstico).

Avatar `boxShadow: 0 0 0 2px ${ringColor}` (focus ring colorido por status) **manteve inline** — não é elevação; é escape hatch legítimo.

### Critério para fechar
- [x] `shadows` no `baseTheme`
- [x] handler `boxShadow`/`shadow` no engine
- [x] zero hits de `boxShadow:\s*'0` ou `boxShadow:\s*"0` em `src/`
- [x] zero hits de `rgba\(|#[0-9A-Fa-f]{6}` em `src/foundations/theme/`
- [x] suíte verde (859/859)
- [x] `check-platform-contract --strict` verde

### Notas para evolução
A escala `shadows` atual (`sm/md/lg/xl/none`) cobre os usos atuais com aproximação aceitável (alpha varia 0.08–0.20). Caso futuras iterações exijam fidelidade pixel-perfect aos visuais legados, considerar adicionar `2xl` para overlays grandes (Dialog/Drawer com blur 48). Fora de escopo desta dívida.

---

## TD-023 — Anchor positioning ausente em Popover/Menu

**Origem:** [RFC-0025](rfcs/RFC-0025-overlays-via-portal.md) (R6-G) — 2026-05-01
**Status:** Open
**Severidade:** Baixa

### Contexto
A G3 da RFC-0025 confirmou que `Tooltip` e `Select` calculam posição via `getBoundingClientRect` do trigger (com listeners `resize`/`scroll` em capture phase) e que `Dialog`/`Drawer` posicionam por convenção (centro/borda do viewport, sem âncora). `Popover` e `Menu` portalizam mas **posicionam fixos no centro do viewport** (`top: 50%; left: 50%; transform: translate(-50%,-50%)`), o que é placeholder herdado da implementação pré-Portal.

Para a maioria dos consumos de Popover/Menu — picker de filtros sob um botão na toolbar, menu de ações ao lado de uma row, etc. — o posicionamento esperado é **ancorado ao trigger**, não centrado no viewport.

### Impacto
- **DX**: consumidor que usa Popover/Menu para a finalidade canônica (anchor a um botão) precisa hackear via `style` no Content ou abrir mão da semântica.
- **Visual**: experiência imediatamente percebida como "errada"; nenhum produto sério aceita um menu de ações flutuando no centro da tela.
- **Sistêmico**: sem um anchor primitive, Popover/Menu/Tooltip/Select duplicam código de cálculo de posição; cada um com versão sutilmente diferente.

### Resolução proposta
Extrair o pattern de `tooltip-content.tsx` + `select.tsx` para um primitive `useAnchorPosition({ triggerRef, placement, offset })` em `src/ecosystem/primitives/`. Aceitar `placement` (top/right/bottom/left + variantes start/end), recalcular em `resize`/`scroll`/`mutationObserver` opcional.

Aplicar em:
1. `Popover.Content` (substituir `top:50%/left:50%`)
2. `Menu.Content` (idem)
3. Migrar `Tooltip.Content` para o primitive (deduplicação)
4. Avaliar migrar `Select.SelectContent` para o primitive (idem)

API candidata:

```ts
const position = useAnchorPosition({
  triggerRef,
  placement: 'bottom-start',
  offset: 8,
  enabled: isOpen,
});
// position: { top, left } | null
```

### Critério para fechar
- [ ] Primitive `useAnchorPosition` em `ecosystem/primitives/` com testes próprios.
- [ ] `Popover.Content` e `Menu.Content` consomem o primitive; aceitar prop `placement`.
- [ ] `Tooltip.Content` e `Select.SelectContent` migrados (deduplicação).
- [ ] Stories `AnchoredPlacements` em Popover/Menu mostrando 8 placements.
- [ ] Consumidor consegue alinhar um Popover ao trigger sem `style` inline.

**Gatilho para começar:** 1º caso real de produto pedindo Popover/Menu ancorado. Até lá, o placeholder centro-do-viewport é aceitável (use cases atuais são showcase Storybook).

---

## TD-024 — Stories do Storybook usam tags HTML e `style` inline

**Origem:** Sessão R6-G G3 (refator das 5 stories `InsideOverflowClip`) — 2026-05-01
**Status:** Open
**Severidade:** Baixa (documentação)

### Contexto
Praticamente todas as stories existentes do Storybook (Dialog/Drawer/Popover/Menu/Tooltip/Card/Button/Input/Field/Tabs/Accordion/Modal/Avatar/Badge/Alert/Toast/etc.) usam tags HTML diretas (`<div>`, `<button>`, `<p>`, `<a>`, `<label>`, `<input type="checkbox">`) com `style={{...}}` inline (`padding`, `borderRadius`, `cursor`, `background`, `color`, `gap`, `display: flex`, etc.). Cores são literais (`#4a90e2`, `#fff`, `#666`), spacings são números mágicos (`8`, `16`, `32`).

A [CLAUDE.md](../CLAUDE.md) define regra absoluta: nenhum componente do DS usa tags HTML puras nem `style` quando há prop declarativa equivalente. Substituir por `Box`/`Flex`/`Text`/`Clickable` com `as` e tokens. Stories são showcase do próprio DS — eat your own dogfood.

### Impacto
- **DX/credibilidade**: documentação não pratica o que prega. Quem chega ao Storybook copia o pattern visto na story para o próprio código de produto, propagando o anti-pattern.
- **Tematização**: cores literais (`#4a90e2` etc.) não respondem a override de tema. Trocar a marca via `createTheme()` muda só o componente; os exemplos no Storybook continuam azul-padrão. Falsa demonstração de multi-produto.
- **Manutenção**: sweep de tokens (renomeação, depreciação) não pega as stories porque elas não consomem tokens.
- **Severidade baixa**: não afeta runtime, não quebra build, não polui o pacote distribuído (stories ficam fora do bundle). É dívida de documentação.

### Resolução proposta
Sweep arquivo por arquivo, refatorando para Box/Flex/Text/Clickable + tokens. Pattern:

```tsx
// Antes
<div style={{ padding: 16, display: 'flex', gap: 8, color: '#666' }}>
  <button style={{ padding: '8px 16px', borderRadius: 4, cursor: 'pointer' }}>
    Texto
  </button>
</div>

// Depois
<Flex padding="medium" gap="small" color="text.secondary">
  <Clickable as="button" type="button" paddingX="medium" paddingY="small" borderRadius="small" backgroundColor="surface.default">
    Texto
  </Clickable>
</Flex>
```

Trabalho incremental, um arquivo `.stories.tsx` por vez. Ordem sugerida (por densidade de violação + visibilidade):
1. Compounds de overlay (Dialog/Drawer/Popover/Menu/Tooltip) — 4 ainda devem
2. Form (Field/Input/Checkbox/Radio/Switch/Select)
3. Feedback (Alert/Toast/Badge/Spinner/ProgressBar/ProgressCircle/Skeleton)
4. Layout/conteúdo (Card/Avatar/Chip/Tag/Accordion/Tabs/Breadcrumb/Pagination/Table)
5. Action (Button/ButtonGroup/IconButton/FAB)
6. Estrutural (NavBar/TabBar)

Para Triggers de compounds, usar `asChild` + `<Clickable as="button">` evita nested-button e mantém ergonomia.

### Critério para fechar
- [ ] Zero ocorrências de `<div`/`<span`/`<p`/`<button`/`<a` direto em arquivos `*.stories.tsx`.
- [ ] Zero ocorrências de `style={{` em `*.stories.tsx` (exceto escape hatch documentado: backdropFilter, propriedades vendor-prefixadas, animação ad-hoc).
- [ ] Zero literais `#xxxxxx`/`rgba(...)` em `*.stories.tsx` — todas as cores via `text.*`/`surface.*`/`border.*`/`brand.*`.
- [ ] Lint + typecheck verdes.
- [ ] Sample manual no Storybook após cada lote para confirmar que visual não regrediu.

**Gatilho para começar:** janela dedicada de "developer experience polish" (pode ser ondas curtas — 5–8 stories por vez). Ou linha de base obrigatória antes de adicionar nova story (regra "ao tocar um arquivo `.stories.tsx`, refatorar de uma vez").

### Notas
- As 5 stories `InsideOverflowClip` adicionadas pela G3 da RFC-0025 já saíram com o pattern correto (Box/Text/Clickable + tokens) — servem de modelo.
- Decidir se vale lint rule customizada que rejeita JSX intrínseco em arquivos `.stories.tsx` (overhead de regra, mas garante regressão zero).

---

## TD-025 — `FileUpload.native` é placeholder; promover para implementação real se demanda materializar

**Origem:** [RFC-0026](rfcs/RFC-0026-fileupload-caso-fronteira.md) (PR 2) — 2026-05-01
**Status:** Open
**Severidade:** Baixa

### Contexto
A RFC-0026 adotou o caminho **(c)** — `file-upload.native.tsx` exporta um placeholder visualmente paritário ao web em estado idle, **sem** capturar toque para abrir picker. A escolha de lib (`expo-document-picker`, `expo-image-picker`, `expo-camera`, `expo-av`) fica por conta do produto consumidor, integrada via slot `children`.

Critérios que justificaram (c) sobre (a) `expo-document-picker` peer dep:

1. Em mobile, "upload de arquivo" raramente é um picker genérico — é câmera, galeria, scanner, áudio gravado. Cada caso usa lib diferente; forçar uma no DS bloqueia os outros.
2. Peer dep não-trivial passaria custo para 100% dos consumidores RN, mesmo os que nunca usam FileUpload.
3. Diversidade de uso real é alta nesta superfície; congelar lib agora seria decisão prematura.

### Impacto
- **DX (consumidor RN)**: importar `FileUpload` de `arbor-ds/native` não quebra, mas o componente não captura arquivo. Consumidor que precisa de upload nativo real precisa ler o CONTRIBUTING e codar a integração via `children`.
- **Paridade visual**: estado idle bate com web (mesma drop zone dashed); estado preview/loading também bate (Image + Clickable Remover). Lacuna está só na captura.
- **Sistêmico**: nenhum. Decisão é local ao componente, não impacta engine, theming, recipe ou contrato cross-platform global.

### Resolução proposta
Quando o gatilho ocorrer, abrir RFC sucessora promovendo para caminho **(a)**: implementar `file-upload.native.tsx` real via `expo-document-picker` (ou `expo-image-picker` se o caso de uso predominante for imagem) como `peerDependency`. CONTRIBUTING ganha seção de setup (versões compatíveis, comando de install, troubleshooting Expo SDK).

### Critério para fechar
- [ ] `file-upload.native.tsx` real implementado (sem placeholder).
- [ ] Peer dep adicionada ao `package.json` com range testado.
- [ ] `file-upload.native.test.tsx` cobrindo seleção, accept, multiple, maxSize/maxFiles, preview, onRemove.
- [ ] CONTRIBUTING atualizado com setup nativo + troubleshooting.
- [ ] Janela de "deprecation window" do placeholder anterior comunicada (≥ 1 release minor).
- [ ] Suíte verde + `check-platform-contract.js --strict` verde.

### Gatilho para começar
**3+ produtos consumidores** documentando necessidade de FileUpload nativo real em **< 6 meses** a partir de 2026-05-01, OU 1 caso de produto crítico (autenticação, KYC, onboarding regulamentado) que exija upload real cross-platform.

Critério mensurável e finito — se nenhum dos dois ocorrer, o placeholder é a decisão arquitetural correta e a TD pode ser marcada como **Obsolete** com nota explicando por quê.

### Notas
- O slot `children` no placeholder permite que o consumidor coloque sua própria integração (`<Pressable onPress={pickWithExpoDocumentPicker}>`) sem perder o frame visual da drop zone — ver CONTRIBUTING §FileUpload em RN.
- O bloco de preview (`previewUrl` + `onRemove`) **já funciona** em native; a paridade quebrada está só na captura. Promover para (a) é incremento, não refator.

---

## TD-026 — `focusRing` não é themable

**Origem:** [RFC-0027](rfcs/RFC-0027-multi-product-themable-contract.md) (PR 2) — 2026-05-01
**Status:** Open
**Severidade:** Média

### Contexto
RFC-0027 PR 2 trouxe `motion` para o contrato themable e tornou `transition` runtime-aware via `useTransition()`. `focusRing` ficou de fora.

Hoje `focusRing` é uma constante local em `src/foundations/theme/base-theme.ts:20-24`:

```ts
const focusRing = {
  outline: '2px solid',
  outlineColor: 'interactive.default',
  outlineOffset: '2px',
} as const;
```

Recipes consomem via spread estático em `_focusVisible: focusRing` (ou `_focusVisibleWithin: focusRing`). Como o spread é resolvido no module-load do `base-theme.ts`, **override de tema não chega ao anel de foco**: produto pode customizar `interactive.default` (e a cor do anel responde, porque é alias string), mas **não consegue ajustar `outline-width`, `outline-offset` ou `outline-style`** sem editar arquivos do DS.

Tornar isso themable de verdade exige:
1. Expor `focusRing` como token (`tokens/semantics/focus-ring.ts` + `baseTheme.focusRing`).
2. Ensinar a engine de pseudos (`_focusVisible`/`_focusVisibleWithin`) a resolver subprops do tipo `'focusRing.width'` via scale `focusRing` — hoje `outlineWidth` resolve via scale `space`/`borderWidths`, não há rota para `focusRing`.
3. Migrar consumidores das recipes (`checkbox`/`radio`/`switch`/`select.trigger`/...) para a nova API.

Trabalho não-trivial; preferi adiar para não inflar PR 2.

### Impacto
- **Tematização**: produto não consegue ajustar identidade do anel de foco (espessura, offset) — só a cor (que herda de `interactive.default`).
- **Consistência**: contrato multi-produto fica incompleto — skill lista `focusRing` como parte do contrato themable mínimo.
- **A11y**: hoje WCAG 2.4.7 está atendido, mas produtos que precisem aumentar contraste de foco (acessibilidade reforçada) não conseguem via tema.

### Resolução proposta
RFC dedicada quando surgir o primeiro caso real de produto querendo ajustar `outlineWidth`/`outlineOffset`. A RFC deve:
- Adicionar `tokens/semantics/focus-ring.ts` com `{ width, style, color, offset }`.
- Adicionar `baseTheme.focusRing`.
- Estender a engine de pseudos para resolver subprops contra `focusRing` (handler novo ou shorthand `_focusRing: 'default'`).
- Migrar `_focusVisible: focusRing` → API canônica.

### Critério para fechar
- [ ] `baseTheme.focusRing` exposto.
- [ ] Recipes consomem `focusRing` via alias resolvível em runtime.
- [ ] Override de `focusRing.width` em produto-B propaga para `outlineWidth` renderizado (teste de matriz).
- [ ] Suíte verde.

### Gatilho para começar
Primeiro caso real de produto consumidor pedindo ajuste de `outlineWidth`/`outlineOffset` via tema — OR — quando RFC-0027 PR 3 quiser fechar gaps remanescentes de identidade.

---

## Backlog de RFCs candidatas R6 (não bloqueantes para R7)

Mapeamento das demais 2 candidatas R6 que **não** viraram TD nem RFC nesta rodada. Abrir RFC formal **quando o gatilho descrito ocorrer** — não especular agora.

| ID | Título | Gatilho para abrir RFC |
|---|---|---|
| **R6-C** | `RadioGroup` / `CheckboxGroup` / `SwitchGroup` | Primeiro caso de uso real em produto exigindo gestão coletiva (`name` + `value` + accessibility group). Form de checkout multi-opção é candidato natural. |
| **R6-J** | Indicator visual cross-platform unificado para Checkbox | Primeiro reclamo real de paridade visual web↔native (HR6-8 web `accentColor` vs HR6-9 native `Box -45deg`). Ou quando RFC-0017 migrar `checkbox` recipe e o gap visual se tornar evidente. |

**R6-G** foi resolvida pela [RFC-0025](rfcs/RFC-0025-overlays-via-portal.md) em 2026-05-01.

Estas duas permanecem registradas em `_followups.md` como candidatas. Se o gatilho ocorrer dentro do prazo de R11/R12, considerar promover.

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
