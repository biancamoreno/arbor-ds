# RFC-0033 — Chip-Interativo: contrato explícito para `Chip` selecionável

**Status**: **Accepted (2026-05-02) — Implementada (2026-05-02)**
**Autores**: arbor-ds-architect
**Data**: 2026-05-02
**Origem**: review R8 do `Chip` (achados CH-Bug-1 + CH-A11y-1). Sub-onda 8.D.

---

## Motivação

`Chip.Root` hoje é `<Flex as='span'>` que aceita props `selected`, `disabled` e `onClick`:

```tsx
// src/components/chip/core/chip.tsx (estado atual após sub-ondas 8.A/B/C)
function ChipRoot({ children, variant, size, selected, disabled, tone, onClick, ... }) {
  return (
    <ChipContext.Provider value={{ ... }}>
      <Flex as="span" onClick={onClick} ...>
        {children}
      </Flex>
    </ChipContext.Provider>
  );
}
```

Problemas concretos catalogados na review:

| Achado | Detalhe |
|---|---|
| **CH-Bug-1** | `<span>` não é focável. `Tab` pula o Chip. Mesmo com `onClick`, o teclado não consegue ativar. |
| **CH-A11y-1** | Sem `role='button'` + `aria-pressed`. Leitor de tela anuncia o conteúdo mas não comunica que está "selecionado" nem que é interativo. |
| **CH-DocMismatch** | Docstring atual diz "Chip é tipicamente interativo (selecionável ou removível)". Implementação contradiz. |
| **CH-OnClick fantasma** | `onClick` no `<span>` dispara em mouse mas é inacessível por teclado e por leitor de tela — promessa quebrada. |

A inconsistência tem um motivo histórico válido: em alguns produtos `Chip` é puramente decorativo (usado dentro de uma `<Card>` ou `<Tag>` agrupada, sem interação). Forçar todo Chip a ser button-like rebaixa esses casos (cria nested-button quando o pai já é Clickable, polui ARIA tree).

A RFC define o contrato explícito: **quando Chip é interativo, é interativo de verdade; quando é decorativo, é só visual**.

---

## Proposta

### Caminho recomendado: **(B) Discriminated union explícita**

```ts
// src/components/chip/interfaces/ChipProps.ts

interface ChipBaseProps {
  children: ReactNode;
  variant?: 'filled' | 'outlined' | 'subtle';
  size?: 'small' | 'medium'; // pós-RFC-0031
  tone?: FeedbackTone;       // pós-RFC-0032
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
}

interface ChipDecorativeProps extends ChipBaseProps {
  /** Chip puramente visual. Default. */
  selectable?: false;
  selected?: never;
  onSelectedChange?: never;
}

interface ChipSelectableProps extends ChipBaseProps {
  /** Ativa modo interativo: Root vira button focável com `aria-pressed`. */
  selectable: true;
  /** Estado controlado/semi-controlado. Default `false`. */
  selected?: boolean;
  /** Notificação canônica (RFC-0015 — `on{Verbo}Change(value)`). */
  onSelectedChange?: (selected: boolean) => void;
}

export type ChipRootProps = ChipDecorativeProps | ChipSelectableProps;
```

### Comportamento

| `selectable` | Render | Teclado | ARIA |
|---|---|---|---|
| `false` (default) | `<Flex as='span'>` | inerte | nenhum role |
| `true` | `<Clickable as='button' type='button'>` | Tab/Space/Enter | `role='button'` + `aria-pressed={selected}` |

Quando `selectable={true}`:
- Root passa por `Clickable` (pattern já estabelecido nas RFCs 0008/0018).
- Click/Space/Enter chamam `onSelectedChange(!selected)`.
- `disabled` propaga para `Clickable` (cobre teclado + mouse + a11y).
- Touch target 44×44 já está coberto via `Clickable.native`.

Quando `selectable={false}`:
- Mantém comportamento atual (span). Sem interatividade.
- `selected` é tipo-erro (`never`).
- `onSelectedChange` é tipo-erro (`never`).

### Interação com `Chip.Remove`

`Remove` permanece independente: é um `<button>` aninhado no Chip (válido em HTML quando o pai não é button — covered porque `Chip.Root` selectable=true vira button no caminho selectable; nested-button não é caso real porque `Remove` representa ação distinta).

**Caso edge: Chip selectable + Remove.** Nested button é um problema de a11y conhecido. Resolução proposta: quando `selectable={true}`, `Chip.Remove` automaticamente vira um overlay clicável com `e.stopPropagation()` no handler, sem ser button aninhado. Detalhamento técnico:

```tsx
// pseudo
function ChipRoot({ selectable, selected, onSelectedChange, ... }) {
  if (selectable) {
    return (
      <ChipContext.Provider value={{ ..., selectable: true }}>
        <Clickable
          role="button"
          aria-pressed={selected}
          onClick={() => onSelectedChange?.(!selected)}
          onKeyDown={handleSpaceEnter}
          ...
        >
          {children}
        </Clickable>
      </ChipContext.Provider>
    );
  }
  return (
    <ChipContext.Provider value={{ ..., selectable: false }}>
      <Flex as="span" ...>{children}</Flex>
    </ChipContext.Provider>
  );
}

function ChipRemove({ ... }) {
  const { selectable } = useChipContext();
  if (selectable) {
    // Overlay com role="button" mas implementado como <Box as='span'> + listener
    // para evitar nested <button>.
    return <Box as="span" role="button" tabIndex={0} ...>×</Box>;
  }
  return <Clickable as="button" type="button" ...>×</Clickable>;
}
```

**Trade-off aceito:** a anatomia do Remove muda quando o Root vira selectable. É invisível ao consumidor (mesma API de prop), mas explícito no código interno. Documentado no JSDoc do `Chip.Remove`.

### Estado controlado / não-controlado

Padrão `useControllableState` (igual Switch/Checkbox):

```tsx
const [selectedState, setSelected] = useControllableState({
  value: selected,
  defaultValue: false,
  onChange: onSelectedChange,
});
```

Permite `<Chip selectable defaultSelected />` (não-controlado) e `<Chip selectable selected={x} onSelectedChange={...} />` (controlado).

**Adendo:** RFC propõe expor `defaultSelected?: boolean` em `ChipSelectableProps` para paridade com Switch/Checkbox.

### Visual de selected

`getChipColors` já trata `selected` no estado atual. Após RFC-0032, a resolução vem do helper. Sem mudança visual — o que muda é como a interatividade é entregue (focus ring + aria + teclado).

---

## Caminhos rejeitados (mas explorados)

### (A) Inferência por presença de `onClick` ou `selected`

```ts
// se onClick OU selected estão definidos, vira button
```

| Por que descartado |
|---|
| Render polimórfico oculto: o consumidor não sabe que `selected={true}` mudou o elemento HTML. Quebra polimorfismo previsível. Difícil de prever quando combinado com `cloneElement` ou wrappers. |
| API "mágica" — RFC-0008 (tapState) já estabeleceu o pattern de **explicitness over magic**. |
| Quebra silencioso de autocomplete: o consumidor digita `onClick=` sem perceber a mudança de contrato. |

### (C) Span passivo sempre + envolver em Clickable externo

```tsx
<Clickable onClick={...} aria-pressed={selected}>
  <Chip selected={selected}>...</Chip>
</Clickable>
```

| Por que descartado |
|---|
| Empurra responsabilidade de a11y para o consumidor — ponto frágil. Maioria dos consumidores vai esquecer `aria-pressed` ou `role='button'`. |
| Padrão de filtro toggleable é o caso mais comum de Chip (filters, multi-select). DS deve servir o caso comum, não obrigar wrapping. |
| Quebra docstring atual sem ganho real de purismo. |

### (D) Obrigar `selectable` sem default (breaking total)

| Por que descartado |
|---|
| Maioria dos usos atuais é decorativo. Forçar `selectable={false}` em todos eles é ruído. |
| Default `selectable={false}` é a configuração de menor risco e mantém retrocompat de uso decorativo. |

---

## Plano de execução

PR único (mudança coesa):

1. **Tipos** (`ChipProps.ts`): refatorar para discriminated union; adicionar `defaultSelected?` em `ChipSelectableProps`.
2. **`useControllableState`**: importar de `ecosystem/utils` (já existente, usado em Switch/Checkbox).
3. **`chip.tsx`**: ramificar render por `selectable`; integrar `Clickable` no caminho selectable; manter `Flex as='span'` no decorativo.
4. **`chip.native.tsx`**: paridade — `Clickable.native` no caminho selectable.
5. **`ChipContext`**: adicionar `selectable: boolean` para `Chip.Remove` saber qual modo está rodando.
6. **`ChipRemove`**: ramificar por `useChipContext().selectable`; modo `span+role='button'+onKeyDown` quando selectable.
7. **Testes web** (`chip.test.tsx`): adicionar 5 cases — `selectable=false default não focável`, `selectable=true focável via Tab`, `Space/Enter chama onSelectedChange`, `aria-pressed reflete selected`, `disabled bloqueia interação`.
8. **Testes native** (`chip.native.test.tsx`): paridade — `accessibilityState.selected`, `accessibilityRole='button'`, press dispara onSelectedChange.
9. **Stories** (`chip.stories.tsx`): adicionar `Toggleable` (interativo) + `Decorative` (puramente visual). Migrar `<Chip selected={...}>` legado para `<Chip selectable selected={...}>`.
10. **Docstring** (`chip.tsx`): atualizar para refletir os dois modos.
11. **CHANGELOG**: entrada `[Breaking] Chip selected/onClick now require selectable=true`.

### Sequência com RFC-0031 e RFC-0032

- **RFC-0033 pode ir antes ou depois da RFC-0031** — só toca a anatomia de Chip; a renomeação `sm/md` → `small/medium` é literal.
- **RFC-0033 deve ir junto ou depois da RFC-0032** — caminho selectable + tone='warning' (filtro de status) é o caso de uso flagship.

Recomendação: **0032 → 0033 → 0031** (tipo expansion → contrato → renomeação cosmética).

---

## Alternativas consideradas

(Caminhos A/C/D detalhados na seção anterior.)

| Outras alternativas | Por que descartadas |
|---|---|
| **`as` polimórfico (`<Chip as='button'>`)** | Empurra decisão de a11y para o consumidor. Não tem como obrigar `aria-pressed` automaticamente. Padrão `as` é melhor para layout (Box/Flex), não para semântica de controle. |
| **`Chip.Selectable` como subcomponent separado** | Duplica anatomia (mesmo visual em dois caminhos de import). Discoverability pior — `Chip.Root` aceita props não-funcionais é menos confuso que `Chip.Root`/`Chip.Selectable.Root` distintos. |
| **Migrar para padrão `ToggleGroup` (Radix-like)** | Escopo maior — vira RFC futura quando R6-C (CheckboxGroup/RadioGroup/SwitchGroup) abrir. Aqui resolvemos só o componente unitário. |

---

## Impactos e trade-offs

| Eixo | Avaliação |
|---|---|
| **Breaking change** | **Sim — parcial.** Consumidores com `<Chip selected={...} onClick={...}>` precisam adicionar `selectable`. Pre-v1, sem consumidores externos. |
| **Bundle** | +~150 bytes (`useControllableState` já importado em outros componentes). |
| **Performance** | 0 (mesmo render path por modo). |
| **DX** | **Positivo** — contrato explícito; tipo-erro guia o consumidor; autocomplete revela `selectable` antes de sugerir `selected`. |
| **A11y** | **Crítico positivo** — fecha CH-Bug-1 + CH-A11y-1; teclado funciona; SR anuncia `pressed`. |
| **Codemod** | Sim (interno) — substituir `<Chip selected onClick=` por `<Chip selectable selected onSelectedChange=`. ~3 hits internos. |
| **Compatibilidade RFC-0030** | `selected` (canônico, sem `is*`) ✅. `onSelectedChange` (canônico `on{Verbo}Change`) ✅. |
| **Compatibilidade RFC-0015** | `onSelectedChange(selected)` value-only ✅. |

---

## Critérios de aceite

- [ ] `ChipRootProps` é discriminated union; TS rejeita `<Chip selected />` sem `selectable`.
- [ ] `<Chip selectable selected onSelectedChange={...}>` renderiza `<button>` com `role='button'` + `aria-pressed={selected}` + `tabIndex` natural.
- [ ] `<Chip>conteúdo</Chip>` continua renderizando `<span>` sem ARIA de interação (modo decorativo).
- [ ] Tab navega para Chip selectable; Space/Enter chama `onSelectedChange(!selected)`.
- [ ] `disabled` bloqueia interação em ambos os modos (no decorativo é só estilo; no selectable bloqueia teclado + click + foco).
- [ ] `Chip.Remove` dentro de Chip selectable não gera nested `<button>` (HTML válido).
- [ ] Native: `accessibilityRole='button'` + `accessibilityState.selected={selected}` quando selectable.
- [ ] `defaultSelected` funciona como não-controlado em modo selectable.
- [ ] Testes: web +5 cases, native +4 cases.
- [ ] Stories: `Toggleable` + `Decorative` + `WithRemove` cobrindo combinações.
- [ ] Suite verde: `pnpm test` (940 + 9 = 949) · `pnpm tsc -b` · `pnpm lint` · `pnpm test:platform-contract --strict`.
- [ ] CHANGELOG.md ganha entrada de breaking change.

---

## Notas de implementação

- **Sequência com 0032:** se 0033 for antes de 0032, `tone` em Chip continua `'neutral' | 'brand'`. Sem perda — RFC-0032 expande depois sem tocar em Chip-selectable.
- **`useControllableState`:** já existe em `src/ecosystem/utils/functions/use-controllable-state.ts`. Mesmo hook usado em Switch/Checkbox/Counter.
- **Risco de Remove em modo selectable:** o Remove vira um span com `role='button'` + `tabIndex={0}` + listener Space/Enter. Validar com leitor de tela real (NVDA + VoiceOver mobile) que ambos os controles são anunciados independentemente.
- **`ChipContext.selectable`:** novo campo. Documentar que o context é interno (não público).
- **Pattern reutilizável:** este caminho selectable serve de referência para **TD-003** (`useClickableContext` para Card hoverable, etc.). Quando TD-003 abrir, vale checar se vale extrair `Selectable` mixin compartilhado.
- **Acessibilidade WCAG referente:** 2.1.1 (Keyboard), 4.1.2 (Name/Role/Value), 2.4.7 (Focus Visible — herdado de `Clickable`).
- **Migração:** abrir issue CH-Migration depois da aceitação para rastrear consumidores internos (zero esperado pre-v1; sweep verificatório).
