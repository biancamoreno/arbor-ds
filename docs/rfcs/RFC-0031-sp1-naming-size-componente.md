# RFC-0031 — SP-1: alinhar `size` de componentes para `small | medium | large`

**Status**: **Implementada (2026-05-03)**
**Autores**: arbor-ds-arch
**Data**: 2026-05-02
**Origem**: pattern sistêmico SP-1 catalogado nos reviews R7 (Spinner, Skeleton, Badge, ProgressBar, ProgressCircle) e R8 (Alert interno, Toast interno, Chip público) — 7 evidências sólidas.

---

## Motivação

A codebase usa **dois vocabulários diferentes para a mesma ideia de tamanho**:

| Eixo | Vocabulário | Exemplo |
|---|---|---|
| **Primitivos de escala** | `xsmall / small / medium / large / xlarge / hero` | `spacing.medium`, `borderRadius.small`, `fontSize.large`, `iconSize.medium` |
| **Tamanho de componente** | `sm / md / lg` (e às vezes `xs/xl`) | `<Button size='md'>`, `<Avatar size='lg'>`, `<Chip size='sm'>` |

Inventário (2026-05-02):

| Componente | Prop | Valores |
|---|---|---|
| Avatar | `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` |
| Badge | `size` | `'sm' \| 'md'` |
| Button | `size` | `'sm' \| 'md' \| 'lg'` |
| Card | `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` |
| Checkbox | `size` (CheckboxSize) | `'sm' \| 'md' \| 'lg'` |
| Chip | `size` | `'sm' \| 'md'` |
| Counter | `size` | `'sm' \| 'md' \| 'lg'` |
| Dialog | `size` | `'sm' \| 'md' \| 'lg'` |
| Drawer | `size` | `'sm' \| 'md' \| 'lg'` |
| FAB | `size` | `'sm' \| 'md' \| 'lg'` |
| Field/Input (FieldSize) | `size` | `'sm' \| 'md' \| 'lg'` |
| ProgressBar | `size` | `'sm' \| 'md' \| 'lg'` |
| Radio (RadioSize) | `size` | `'sm' \| 'md' \| 'lg'` |
| Select (SelectSize) | `size` | `'sm' \| 'md' \| 'lg'` |
| Switch (SwitchSize) | `size` | `'sm' \| 'md' \| 'lg'` |
| Tabs | `size` | `'sm' \| 'md'` |

E recipes em `base-theme.ts` declaram `defaultVariants: { size: 'md' }` em 12 lugares.

Internamente o ruído é pior: `Alert.tsx` e `Toast.tsx` mapeiam `size: 'sm'` para `padding: 'small'` no mesmo arquivo. Custo de leitura aumenta sem ganho.

### Por que importa

- **DX/autocomplete**: o consumidor que digita `padding=` recebe `'small' | 'medium' | 'large'`; quando muda para `size=` recebe `'sm' | 'md' | 'lg'`. Escala mental dupla, sem motivo arquitetural.
- **Tematização**: tokens de densidade introduzidos pelo PR3 da RFC-0027 (`sizes.control.{sm,md,lg}`, `sizes.dialog.{sm,md,lg}`) já carregam o vocabulário curto. Migrar agora congela essa decisão para sempre.
- **Coerência com RFC-0028**: o normalize de `iconSize` (`xs/sm/md/lg/xl/hero` → `xsmall/small/medium/large/xlarge/hero`) já estabeleceu o precedente. SP-1 é o segundo passo.
- **Codemod barato**: pre-v1, sem consumidores externos confirmados, sem janela de transição (precedente TD-012).

### O que SP-1 não é

- **Não toca `BreakpointKeys = 'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'`**. Breakpoints são eixo distinto (viewport, não densidade de controle); padrão de mercado é `sm/md/lg` (Tailwind, Chakra, MUI). Mantido.
- **Não toca `iconSize`**. Já foi feito na RFC-0028.
- **Não introduz tamanho novo**. Os tiers permanecem 3 (sm/md/lg → small/medium/large) ou 5 (Avatar: xs/sm/md/lg/xl → xsmall/small/medium/large/xlarge).

---

## Proposta

### 1. Renomeação literal nas APIs públicas

| Antes | Depois |
|---|---|
| `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'xsmall' \| 'small' \| 'medium' \| 'large' \| 'xlarge'` |
| `'sm' \| 'md' \| 'lg'` | `'small' \| 'medium' \| 'large'` |
| `'sm' \| 'md'` | `'small' \| 'medium'` |
| `'none' \| 'sm' \| 'md' \| 'lg'` | `'none' \| 'small' \| 'medium' \| 'large'` |

Aplica-se a:
- `AvatarProps.size`
- `BadgeProps.size`
- `ButtonProps.size`
- `CardProps.padding`
- `CheckboxSize` (re-exportado)
- `ChipRootProps.size`
- `CounterProps.size`
- `DialogProps.size`
- `DrawerProps.size`
- `FabProps.size`
- `FieldSize`
- `ProgressBarProps.size`
- `RadioSize`
- `SelectSize`
- `SwitchSize`
- `TabsProps.size`

### 2. Recipes em `base-theme.ts`

`defaultVariants: { size: 'md' }` → `defaultVariants: { size: 'medium' }` em 12 ocorrências (button, dialog, drawer, field.frame, field.control, select.trigger, select.content, etc.).

### 3. Tokens de densidade

`sizes.control.sm/md/lg` → `sizes.control.small/medium/large`. Idem `sizes.dialog`. As recipes consomem por path string (`'control.medium'`), então a propagação é única:

```ts
// foundations/tokens/semantics/sizes/control.ts
export const controlSize = {
  small:  { minHeight: 32 },
  medium: { minHeight: 44 },
  large:  { minHeight: 52 },
};
```

### 4. Migração interna (Alert/Toast)

Componentes que hoje mapeiam `size: 'sm'` para `padding: 'small'` no corpo (Alert, Toast, Chip pós-RFC-0033) ficam coerentes vocabulariamente após a renomeação — o `size='small'` casa com `padding='small'`, eliminando a tradução mental.

### 5. Sem aliases

Precedente TD-012 (2026-04-24): pré-release sem consumidores externos, sem janela de transição. CHANGELOG documenta a quebra; consumidores internos do monorepo migram no mesmo PR.

---

## Plano de execução

PR único, codemod literal:

1. **Tipos** (~16 arquivos `interfaces/*Props.ts` + `*Size` re-exports). Substituição literal `'sm'` → `'small'`, `'md'` → `'medium'`, `'lg'` → `'large'`, `'xs'` → `'xsmall'`, `'xl'` → `'xlarge'`.
2. **Recipes** (`src/foundations/theme/base-theme.ts`): `size: 'md'` → `size: 'medium'`; chaves de variants `sm/md/lg` → `small/medium/large`.
3. **Density tokens** (`sizes/control.ts`, `sizes/dialog.ts`): renomear chaves; ajustar consumidores em recipes (`'control.sm'` → `'control.small'` etc.).
4. **Componentes web** (cores que ramificam por `size`): substituições literais (~20 ocorrências em Alert/Toast/Chip + qualquer Field-aware que faz `size === 'sm'`).
5. **Componentes native**: idem.
6. **Stories** (`*.stories.tsx`): `args: { size: 'md' }` → `'medium'`. Stories que iteram sobre arrays `['sm','md','lg']` → `['small','medium','large']`.
7. **Testes** (`*.test.tsx` / `*.native.test.tsx`): substituições literais nos asserts e nos array-iterators (Button.native.test, IconButton.native.test, theme-matrix.test).
8. **Storybook controls** (`argTypes`): `options: ['sm','md','lg']` → `['small','medium','large']` em ~16 stories.
9. **Docs**: CONTRIBUTING.md (se mencionar `sm/md/lg`), CHANGELOG.md (entrada explícita).

### Codemod sugerido

```bash
# regex literal escopado a interfaces + componentes
grep -rE "'(xs|sm|md|lg|xl)'" src/components src/foundations \
  --include="*.ts" --include="*.tsx" \
  | grep -v "BreakpointKeys" \
  | grep -v "node_modules"
```

Validação manual de cada hit (não substituir em comentários/docstrings que se referem a breakpoints).

---

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| **Manter `sm/md/lg` em todos os componentes; renomear primitivos `small/medium/large` → `sm/md/lg`** | Reverteria RFC-0028 (iconSize) e contrariaria padrão de spacing/radius/fontSize. Ondas maiores de migração. Vocabulário longo é mais legível em recipes (`borderRadius='small'` é mais claro que `borderRadius='sm'`). |
| **Aliases legacy com `console.warn`** | TD-012 já fixou o padrão "remoção sem janela". Manter aliases agora seria regressão de governança. |
| **Migrar só Alert/Toast/Chip (componentes do R8) e adiar o resto** | Não resolve o problema sistêmico — DX dupla persiste. Custo cumulativo aumenta com cada nova superfície. |
| **`size: 1 \| 2 \| 3` (numérico)** | Perde semântica; obriga consumidor a memorizar mapeamento. Padrão fora do mercado. |
| **`density` em vez de `size`** | Termo válido, mas afasta do vocabulário existente (`spacing`, `borderRadius`). Mudança maior de marca da prop sem ganho proporcional. |

---

## Impactos e trade-offs

| Eixo | Avaliação |
|---|---|
| **Breaking change** | **Sim** — 16 props públicas. Sem aliases. |
| **Bundle** | Neutro (renomeações). |
| **Performance** | 0. |
| **DX** | **Positivo** — vocabulário único cross-system; autocomplete previsível; recipes lêem-se em prosa. |
| **A11y** | 0. |
| **Codemod** | Necessário (interno). Não publicado externamente: pre-v1. |
| **Migração** | 1 PR único, ~25 arquivos tocados em substituições literais. |

---

## Critérios de aceite

- [ ] `grep -rE "size\\??:\\s*'sm'" src/components` retorna 0 hits.
- [ ] `grep -rE "size:\\s*'(sm|md|lg)'" src/foundations/theme/base-theme.ts` retorna 0 hits.
- [ ] `BreakpointKeys` continua `'base' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'` (não tocado).
- [ ] `pnpm test` verde (940/940 esperado).
- [ ] `pnpm tsc -b` verde.
- [ ] `pnpm lint` verde.
- [ ] `pnpm test:platform-contract --strict` verde.
- [ ] CHANGELOG.md ganha entrada `[Breaking] component size props normalized to 'small'/'medium'/'large'`.
- [ ] Inventário de evidências SP-1 (R7 + R8) marcado como fechado em `docs/reviews/_followups.md`.

---

## Notas de implementação

- **Order of changes**: tipos → recipes → tokens de densidade → componentes → stories → testes. Cada camada compila antes da próxima — evita cascata de erros impossíveis de ler.
- **Risco lateral**: `theme-matrix.test.tsx` itera sobre tamanhos. Usar `as const` na lista para o TS sinalizar drift.
- **Storybook controls**: revisar `argTypes` manualmente — `options: [...]` não dispara erro de tipo.
- **`Card.padding`**: única superfície onde a prop não se chama `size`. Renomeação literal mesmo, justificada pela coerência cross-system.
- **Dependência futura**: TD-034 (slot recipe completo Tag/Chip) consome esse vocabulário — abrir TD-034 só após esta RFC aceita.
