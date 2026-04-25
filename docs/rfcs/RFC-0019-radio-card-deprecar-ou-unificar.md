# RFC-0019 — RadioCard: deprecar / unificar / alinhar

**Status**: Draft
**Autores**: @bia
**Data**: 2026-04-25
**PR**: (a abrir)

**Origem**: R6 review (`HR6-4`, `HR6-5`, `HR6-6`)

---

## Motivação

`RadioCard` e `Radio` resolvem o **mesmo problema** (escolha entre N opções, visual de cartão) com **dois contratos divergentes**. A duplicação é estrutural, não cosmética.

### Comparação lado-a-lado

| Aspecto | `Radio` | `RadioCard` |
|---|---|---|
| Layout visual | Card (padding, border, brand.subtle quando checked, sombra) | **Idêntico** — card (padding, border, brand.subtle quando checked, sombra) |
| API | Compound (`Radio.Root` + `Radio.Indicator` + `Radio.Label` + `Radio.Description`) | Flat (`<RadioCard label={…} description={…} />`) |
| `useControllableState` | ✅ | ❌ — `useState` manual com `checked ?? internal` |
| `useFieldContext` | ✅ — Field-aware completo (RFC-0014) | ❌ — não consome contexto |
| `markFieldAware` | ✅ | ❌ |
| `aria-describedby` / `aria-errormessage` | ✅ via Field | ❌ |
| Tag `@platform` | web-only | web-only |
| Testes | ✅ | ❌ — cobertura zero (CR6-5) |

**O visual já é card em ambos.** Não existe "Radio inline simples" no DS hoje — quem precisa de round-radio compacto monta na mão.

### Por que importa agora

1. **Antes de R7** — Radio será reusado em sweeps de a11y (HR6-1 foco visível, RFC-0017 recipes). Resolver duplicação evita refatorar dois componentes para o mesmo bug.
2. **HR6-7 (RadioGroup)** depende de qual contrato é canônico. RFC-C dos *follow-ups* fica bloqueada até esta decisão.
3. **CR6-5** — escrever testes para RadioCard é trabalho perdido se o componente for deprecado.
4. **RFC-0017 (recipes mortas)** vai migrar Radio para `useSlotRecipe('radio', …)`. Manter RadioCard exige duplicar a recipe ou criar `radioCard` separada — mais surface area.

---

## Proposta

### Caminho recomendado: **(A) Deprecar `RadioCard`**

`RadioCard` é deprecado. A API canônica passa a ser `Radio` (compound + Field-aware). Quem usa RadioCard hoje migra para Radio com codemod.

```tsx
// Antes
<RadioCard
  value="card"
  label="Cartão de crédito"
  description="Visa, Master, Elo"
  checked={value === 'card'}
  onCheckedChange={() => setValue('card')}
/>

// Depois
<Radio
  value="card"
  checked={value === 'card'}
  onCheckedChange={() => setValue('card')}
>
  <Radio.Label>Cartão de crédito</Radio.Label>
  <Radio.Description>Visa, Master, Elo</Radio.Description>
  <Radio.Indicator />
</Radio>
```

### Por que (A) e não (B) ou (C)

Três caminhos foram avaliados. (A) é o recomendado.

| Caminho | Descrição | Análise |
|---|---|---|
| **(A) Deprecar RadioCard, Radio é canônico** | Remove RadioCard. Radio cobre 100% do uso atual. | **Recomendado.** Radio já tem o visual; é compound + Field-aware; alinha com Checkbox/Switch/Select. Reduz surface area em ~150 linhas. |
| **(B) Unificar como `Radio variant="card"` vs `variant="inline"`** | Radio passa a ter prop `variant`. RadioCard vira `variant="card"`. | Adiciona surface area (variant) que **ninguém pediu**. "Inline radio" não existe no produto. Sobre-engenharia. |
| **(C) Manter ambos + alinhar contratos** | RadioCard ganha `useControllableState`, `useFieldContext`, `markFieldAware`. | Mantém duplicação visual e conceitual. Resolve sintoma (Field-aware) sem resolver raiz (dois caminhos para o mesmo problema). Custo de manutenção dobrado permanente. |

### Janela de migração

Como a RDS está pré-1.0 e [TD-012](../TECH_DEBT.md#td-012) estabeleceu o padrão "remover sem janela de transição até v1.0", **propõe-se remoção direta**:

- `RadioCard` removido na próxima minor.
- `RadioCardProps` removido do export público.
- `src/components/radio-card/` deletado.
- Codemod publicado em `scripts/codemods/radio-card-to-radio.js` para usuários internos (playground + casos enterprise).

Se a RDS estivesse pós-1.0 ou tivéssemos consumidor externo conhecido, abriríamos janela de 2 minor com `@deprecated` JSDoc + warning de runtime. Hoje não há demanda para esse caminho.

### Codemod (jscodeshift)

Cobre o caso 90%:

```js
// Pseudocode do transform
RadioCard → Radio

// Convert flat props to compound children
<RadioCard label={X} description={Y} ...rest />
↓
<Radio ...rest>
  <Radio.Label>{X}</Radio.Label>
  {Y && <Radio.Description>{Y}</Radio.Description>}
  <Radio.Indicator />
</Radio>
```

Usuário com `<RadioCard><CustomChild /></RadioCard>` (5–10% restante) precisa migrar manualmente — codemod imprime aviso.

---

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| Deprecar Radio (manter RadioCard) | Radio é canônico no padrão DS — compound + Field-aware. RadioCard é o "fora da curva". Inverter seria erro arquitetural. |
| Manter ambos + alinhar (caminho C) | Não resolve raiz da duplicação. Custo de manutenção permanente. |
| Variant-based (caminho B) | Sobre-engenharia. Inline radio não existe no produto. Adicionar variant agora é especular sobre necessidades hipotéticas. |
| Unificar como variant **e** depois deprecar (transição B → A) | Duplica trabalho. Saltar direto para (A) é mais barato. |
| Manter status quo | R6 review já catalogou 4 issues abertas só por causa da divergência. Cresce a cada componente novo. |

---

## Impactos e trade-offs

- **Breaking change?** **Sim** — `RadioCard` é removido do export público. Próxima minor.
- **Impacto em bundle size**: **redução** ~ 1.5 kB (RadioCard.tsx tem 147 linhas com hardcodes).
- **Impacto em performance**: zero.
- **Impacto em DX**:
  - **Ganho:** API canônica única. Field-aware automático. Consistência com R6 inteiro.
  - **Custo:** consumidor migra. Codemod cobre o caso comum; restante é manual mas trivial.
- **Impacto em acessibilidade**: **ganho líquido** — Radio integra com Field para `aria-describedby`/`aria-errormessage`. RadioCard hoje não.
- **Codemod necessário?** **Sim** — `scripts/codemods/radio-card-to-radio.js`.

### Riscos

| Risco | Mitigação |
|---|---|
| Consumidor que estende `RadioCardProps` perde tipo | Codemod converte; runtime warning na release que precede a remoção. |
| Visual de Radio diverge sutilmente de RadioCard (tamanhos, espaçamentos) | RFC-0017 (recipes mortas) padroniza Radio via `useSlotRecipe`; antes da deprecação, validar pixel-paridade lado a lado no Storybook. |
| Stories e docs apontando para RadioCard | Sweep simultâneo: stories deletadas, MDX atualizado. |

---

## Critérios de aceite

- [ ] `src/components/radio-card/` deletado.
- [ ] `RadioCard` e `RadioCardProps` removidos de todos os entrypoints (`src/components/index.ts`, etc.).
- [ ] Codemod `scripts/codemods/radio-card-to-radio.js` cobrindo conversão flat → compound.
- [ ] Stories migradas para Radio (sem perda de cenários).
- [ ] Testes de Radio cobrem casos antes em RadioCard (label/description/disabled/checked).
- [ ] `docs/migration/radio-card-to-radio.md` documentando passo a passo manual + codemod.
- [ ] Changeset major/minor (a depender da política de release vigente).

---

## Notas de implementação

### Dependência com outras RFCs

- **RFC-0017 (recipes mortas)** deve resolver `radio` recipe **antes** desta — Radio precisa estar consumindo recipe pra que removar RadioCard não regrida theming.
- **RFC-0018 (web-only)** — Radio mantém `web-only`. Decisão de unificação não muda essa classificação.
- **RFC futura — RadioGroup (R6-C)** — ganha contrato canônico único como base.

### Não-objetivo

Esta RFC **não** introduz `variant` no Radio. Se surgir caso de uso real de "inline radio" (e.g., grupo horizontal compacto), abrir RFC dedicada — não especular.

### Referência

- [`docs/reviews/R6-form-selection.md`](../reviews/R6-form-selection.md) — achados consolidados (HR6-4/5/6).
- [TD-012](../TECH_DEBT.md#td-012) — política "remover sem janela até v1.0" (precedente recente).
