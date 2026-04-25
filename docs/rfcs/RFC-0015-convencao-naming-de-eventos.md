# RFC-0015 — Convenção de naming de eventos `on{Verbo}Change` (value-only)

**Status**: **Accepted · Implemented (2026-04-24)**
**Autores**: arbor-ds-architect
**Data**: 2026-04-24
**PR**: (pendente)

## Resumo da implementação (2026-04-24)

- `CheckboxRootProps.onChange` → `onCheckedChange` (web + native).
- `SwitchRootProps.onChange` → `onCheckedChange` (web + native).
- `CounterProps.onChange` → `onValueChange`.
- `RadioRootProps.onCheckedChange` ajustada para `(checked: boolean) => void` (sem segundo argumento `value`).
- `RadioCardProps.onCheckedChange` idem.
- **Sem alias legacy, sem `console.warn`, sem JSDoc `@deprecated`** — substituição direta, alinhada com a postura de TD-012.
- Testes (`checkbox.test.tsx`, `switch.test.tsx`, `radio.test.tsx`) atualizados para a API canônica; assinatura `(true, 'opt1')` em Radio reduzida para `(true)`.
- Stories e playground já estavam limpos (zero ocorrências do nome antigo).
- CONTRIBUTING.md ganhou seção 7 ("Naming de props e eventos") cobrindo RFC-0013 + RFC-0015.
- 536/536 testes verdes · ESLint verde · `tsc -b` verde.

**Origem:** R5 review · gate de R6 · complemento de RFC-0013.
**Depende de:** RFC-0013 (naming de props booleanas) — implementada.
**Alinha com:** TD-012 (Varredura de depreciados) — postura "remoção direta sem janela de transição enquanto não houver consumidores externos".
**Bloqueia:** review de R6 (Checkbox/Radio/RadioCard/Switch/Select).

---

## Motivação

A RFC-0013 padronizou **props** booleanas (`disabled`/`required`/`invalid`/`open` sem `is*`). A contrapartida — **nomes e assinaturas dos handlers de mudança de estado** — não foi tratada, e o resultado é uma inconsistência sistêmica que vai sangrar em R6.

### Inventário atual (2026-04-24)

| Componente | Handler | Assinatura | Padrão |
|---|---|---|---|
| **Accordion** | `onValueChange` | `(value: string \| string[]) => void` | ✅ value-only canônico |
| **Dialog** | `onOpenChange` | `(open: boolean) => void` | ✅ value-only canônico |
| **Tooltip** | `onOpenChange` | `(open: boolean) => void` | ✅ value-only canônico |
| **Tabs** | `onValueChange` | `(value: string) => void` | ✅ value-only canônico |
| **Select** | `onValueChange` | `(value: string) => void` | ✅ value-only canônico |
| **TextInput** | `onValueChange` | `(value: string) => void` | ✅ value-only canônico |
| **TextArea** | `onValueChange` | `(value: string) => void` | ✅ value-only canônico |
| **Radio** | `onCheckedChange` | `(checked: boolean, value: string) => void` | ⚠️ nome OK, **assinatura divergente** |
| **RadioCard** | `onCheckedChange` | `(checked: boolean, value: string) => void` | ⚠️ idem |
| **Checkbox** | `onChange` | `(checked: boolean) => void` | ❌ nome divergente |
| **Switch** | `onChange` | `(checked: boolean) => void` | ❌ nome divergente |
| **Counter** | `onChange` | `(value: number) => void` | ❌ nome divergente |

**Convenção já é dominante** — 7 de 12 componentes seguem `on{Verbo}Change(valor)`. Os 5 restantes (3 com nome errado + 2 com assinatura estendida) são exceções acidentais, não escolha de design.

### Por que isso importa

- **DX previsível.** Consumidor que aprendeu `<Tabs onValueChange={…}>` espera `<Switch onCheckedChange={…}>` — e encontra `onChange`. Mesmo gap que RFC-0013 resolveu para props.
- **Conflito com `onChange` HTML.** `Checkbox` e `Switch` envolvem `<input>`; consumidor pode esperar `ChangeEvent<HTMLInputElement>` — em vez disso recebe `boolean`. Sobrecarga semântica.
- **Discoverability ruim.** `onChange` em IDE não dá pista do payload. `onCheckedChange` é autoexplicativo.
- **R6 amplifica.** Checkbox/Radio/RadioCard/Switch/Select estão na mesma fase de review — sair de R6 com 4 padrões diferentes é falha de gate.

### Por que separar de RFC-0013

RFC-0013 cita "Convenção 3: Eventos seguem `on{Verbo}Change`" como nota de rodapé — não como decisão obrigatória, sem inventário, sem critérios. RFC-0015 promove essa nota a contrato com escopo, regras de assinatura e checklist.

---

## Proposta

### Regra 1 — Eventos de mudança de estado controlado usam `on{Verbo}Change`

```tsx
// ✅ Padrão canônico
onCheckedChange?: (checked: boolean) => void;
onValueChange?: (value: T) => void;
onOpenChange?: (open: boolean) => void;
onSelectedChange?: (selected: boolean) => void;
onPageChange?: (page: number) => void;
```

O verbo é o **substantivo do estado controlado** + `Change`. Pluralização segue o tipo (`onValuesChange` quando múltiplos).

### Regra 2 — Assinatura é **value-only**

```tsx
// ✅ Apenas o valor novo
onCheckedChange?: (checked: boolean) => void;

// ❌ Assinaturas estendidas com metadata
onCheckedChange?: (checked: boolean, value: string) => void;
onCheckedChange?: (checked: boolean, e: ChangeEvent) => void;
```

Razão: o consumidor já tem `value` no escopo (`<Radio value="a" onCheckedChange={…}>` — o `value` está no JSX). Passar de novo polui assinatura, contraria Radix/HeadlessUI/Mantine, e força tipagem em locais onde não é necessária.

**Exceção justificada:** quando o componente é um *contêiner* que dispara o evento sem que o consumidor saiba o "qual" (ex: `<RadioGroup onValueChange={v => …}>` — consumidor não sabe qual radio mudou; precisa do `value`). Nesse caso, `value` **é o `value` do callback**, não argumento extra.

### Regra 3 — `onChange` HTML é preservado quando aplicável

Componentes que envolvem `<input>`/`<textarea>` podem aceitar `onChange` **adicional** com semântica HTML (`ChangeEvent`). Coexiste com o handler canônico:

```tsx
// ✅ Coexistência válida
<TextInput
  value={text}
  onValueChange={setText}                          // value-only canônico (Arbor)
  onChange={e => analytics.track(e.target.name)}   // event-level (HTML passthrough)
/>
```

Quando consumidor quer só o valor, usa o canônico. Quando precisa do evento bruto, usa o HTML. **Nenhum sobrescreve o outro.** Isso difere de Checkbox/Switch atuais — onde `onChange` foi *redefinido* para receber `boolean`. Esse uso indevido será removido (ver Componentes afetados).

### Regra 4 — Eventos não-Change seguem `on{Verbo}` simples

```tsx
onSubmit?: (data: T) => void;
onClose?: () => void;
onOpen?: () => void;
onSelect?: (item: T) => void;   // ação pontual, não estado controlado
```

`Change` é reservado para **mudança de estado controlado** (par `value`/`onValueChange`).

---

## Componentes afetados

### Renomeação obrigatória (3)

| Componente | Hoje | Proposto | Breaking |
|---|---|---|---|
| **Checkbox** | `onChange?: (checked: boolean) => void` | `onCheckedChange?: (checked: boolean) => void` | ✅ |
| **Switch** | `onChange?: (checked: boolean) => void` | `onCheckedChange?: (checked: boolean) => void` | ✅ |
| **Counter** | `onChange?: (value: number) => void` | `onValueChange?: (value: number) => void` | ✅ |

### Ajuste de assinatura (2)

| Componente | Hoje | Proposto | Breaking |
|---|---|---|---|
| **Radio** | `onCheckedChange?: (checked: boolean, value: string) => void` | `onCheckedChange?: (checked: boolean) => void` | ✅ |
| **RadioCard** | `onCheckedChange?: (checked: boolean, value: string) => void` | `onCheckedChange?: (checked: boolean) => void` | ✅ |

> **Nota sobre Radio:** o `value` está disponível como prop do próprio `<Radio value="…">` — consumidor já o tem no escopo do callback. Para casos de `RadioGroup`, a contagem fica no contêiner com `onValueChange(value)` (que é o uso correto).

### Sem mudança (7)

Accordion, Dialog, Tooltip, Tabs, Select, TextInput, TextArea — já no padrão.

---

## Estratégia de migração — **sem janela de transição**

Esta RFC adota a **mesma postura de TD-012**: sem aliases legados, sem `console.warn`, sem tipos `@deprecated`. Justificativa registrada na memória do projeto:

> Sem consumidores externos, manter aliases legados/warnings era peso morto. Surface area dobrada, docs infladas com migrations que ninguém faria, console poluído em dev.

A política se aplica diretamente a esta RFC:

- **Renomeação direta** das props no tipo público.
- **Substituição direta** dos consumidores internos (stories, playground, testes).
- **Sem fallback** `onCheckedChange ?? onChange` — o nome antigo deixa de ser aceito pelo TypeScript.
- **Sem codemod** — ferramenta sem consumidor interno é peso morto também. Quando a lib ganhar consumidores externos (gate de release pública), revisitar a política e avaliar se vale codemod retroativo a partir das RFCs aceitas.

### Diferença operacional vs. RFC-0013

RFC-0013 manteve aliases originalmente; eles foram removidos depois pela TD-012. RFC-0015 **nasce** alinhada com a postura final — sem ciclo de transição transitório. Reduz trabalho de implementação e não cria peso morto que precise ser varrido depois.

### Caso especial — Radio/RadioCard (mudança de assinatura)

Como o nome (`onCheckedChange`) não muda, o TypeScript **não** rejeita a chamada antiga `(checked, value) => …`. JavaScript ignora args extras silenciosamente. Resultado prático:

- Consumidores internos (stories, testes) que ainda usam o segundo argumento devem ser migrados manualmente.
- Não há detecção runtime — `Function.length` é heurística frágil; sem warning, sem custo.

---

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| **A. Padronizar tudo em `onChange(value)`** | Mais curto, perde discriminação (Tabs e Switch teriam o mesmo nome — autocomplete confuso, refactor difícil). Conflita com `onChange` HTML. Diverge de Radix/HeadlessUI/Mantine. |
| **B. Manter aliases por X versões com warning** | **Rejeitada por TD-012.** Sem consumidores externos, é peso morto. Quando houver release pública, política pode mudar — não agora. |
| **C. Não decidir; cada componente escolhe** | Status quo — exatamente o problema desta RFC. |
| **D. Manter `onCheckedChange(checked, value)` em Radio** | Conveniência marginal (consumidor já tem `value` via prop). Diverge da regra value-only. Justifica exceção sem benefício claro. |
| **E. Padronizar em `on{Verbo}` simples (sem `Change`)** | `onValue`/`onChecked`/`onOpen` não distinguem mudança de estado de evento pontual. Ambiguidade entre `onSelect` (pontual) e `onSelectedChange` (controlado). |

---

## Impactos e trade-offs

- **Breaking change?** **Sim** — 5 componentes (3 nomes + 2 assinaturas). Sem janela de transição (alinhado com TD-012).
- **Impacto em bundle size**: 0 (renomeações puras).
- **Impacto em performance**: 0.
- **Impacto em DX**:
  - **Positivo:** convenção uniforme; autocomplete dá pista do payload; alinhado com ecossistema.
  - **Negativo (interno):** stories/testes/playground que usam o nome antigo precisam ser migrados na mesma PR. Inventário pequeno e localizado.
- **Impacto em acessibilidade**: 0.
- **Codemod necessário?** Não nesta janela (sem consumidores externos). Reavaliar antes do primeiro release público.

### Risco

- **Stories/playground não migrados** quebram o build TypeScript após o rename. Tratar como teste de cobertura — o `tsc -b` é o gate.
- **Consumidores externos não existem** hoje, mas se isso mudar antes de release, esta RFC precisa ser reavaliada (provavelmente reintroduzindo aliases temporários).

---

## Critérios de aceite

### Tipos públicos

- [ ] `CheckboxRootProps.onChange` → `onCheckedChange`.
- [ ] `SwitchRootProps.onChange` → `onCheckedChange`.
- [ ] `CounterProps.onChange` → `onValueChange`.
- [ ] `RadioRootProps.onCheckedChange` assinatura `(checked: boolean) => void` (sem `value`).
- [ ] `RadioCardProps.onCheckedChange` idem.

### Implementação

- [ ] `checkbox.tsx` (web + native) lê `onCheckedChange`.
- [ ] `switch.tsx` (web + native) lê `onCheckedChange`.
- [ ] `counter.tsx` lê `onValueChange`.
- [ ] `radio.tsx` chama `onCheckedChange(checked)` — não `(checked, value)`.
- [ ] `radio-card.tsx` idem.
- [ ] **Sem fallback** `onCheckedChange ?? onChange`. Sem warning. Sem `@deprecated` no tipo.

### Consumidores internos

- [ ] Stories de Checkbox/Switch/Counter/Radio/RadioCard atualizadas.
- [ ] Playground atualizado (verificar `playground/src/`).
- [ ] Testes (`*.test.tsx`) atualizados.

### Documentação

- [ ] CONTRIBUTING.md ganha seção "Naming de eventos" (junto com a seção de RFC-0013).
- [ ] Entrada em `docs/rfcs/README.md` movendo RFC-0015 para "RFCs implementadas" ao mergear.
- [ ] Memória atualizada — entrada `project_rfc_0015.md` e linha em `MEMORY.md`.

### Validação

- [ ] `pnpm test` verde.
- [ ] `tsc -b` verde.
- [ ] `pnpm lint` verde.

---

## Notas de implementação

### Ordem sugerida

1. **Atualizar tipos** em `CheckboxProps`/`SwitchProps`/`CounterProps`/`RadioProps`/`RadioCardProps`.
2. **Atualizar implementação** dos 5 componentes (substituição direta, sem fallback).
3. **`tsc -b`** — usar erros de tipo como roteiro de migração de stories/testes/playground.
4. **Atualizar consumidores internos** até `tsc -b` passar.
5. **Rodar testes** — esperam-se quebras semânticas mínimas (renome sem mudança de comportamento).
6. **Atualizar CONTRIBUTING.md.**
7. **Mover RFC-0015 para "RFCs implementadas"** no README.
8. **Atualizar memória.**

### Escopo do que **não** muda

- `onSubmit`, `onClose`, `onOpen` (não-Change) — já seguem padrão `on{Verbo}` simples; sem ação.
- Eventos pontuais (`onSelect` em Menu, `onClick` em Clickable) — sem mudança.
- Event handlers com semântica HTML preservada (`onFocus`, `onBlur`, `onKeyDown`) — fora de escopo.
- Componentes da família Input que já usam `onValueChange` — sem mudança.

### Dependências entre RFCs

- **RFC-0013 (naming de props booleanas)** — pré-requisito conceitual.
- **RFC-0014 (Field-aware contract)** — independente; eventos de Field não estão em escopo (Field não tem handler canônico próprio — usa do átomo).
- **RFC-0016 (slot recipe / TD-008)** — independente; pode rodar em paralelo.

### Quando reavaliar

- **Antes do primeiro release público** com consumidores externos. A política "remoção direta sem alias" pressupõe ausência de consumidores externos. Se isso mudar, esta RFC precisa de adendo definindo janela de transição mínima e codemod.

---

## Recomendação

**Aceitar e implementar antes de iniciar R6 review.** Inventário de mudança é pequeno (5 componentes + stories/testes/playground), inteiramente coberto pelo `tsc -b` como gate, sem dívida de transição. Estimativa: **meio dia**.

Coerente com a postura sistêmica estabelecida por TD-012 — não cria peso morto que vire varredura futura.
