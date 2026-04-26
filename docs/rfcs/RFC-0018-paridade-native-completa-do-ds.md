# RFC-0018 — Paridade native completa do DS Arbor

**Status**: Draft (ondas 1, 2 e 3 implementadas)
**Autores**: @bia
**Data**: 2026-04-25
**PR**: (commits locais, sem PR remoto)

**Origem**: Diretriz arquitetural — DS é cross-platform por definição. A tag `@platform web-only` é dívida, não classificação aceita.

> **Onda 1 implementada (2026-04-25)** — `Clickable.native.tsx` criado como wrapper `<Pressable>` + `<Box>`; mapeia API canônica web (`onClick`, `role`, `aria-label`) para API native. 8 cases em `clickable.native.test.tsx` verdes. `fab.native.tsx` migrado como primeiro consumidor (substitui `TouchableOpacity`). [TD-004](../TECH_DEBT.md#td-004) **Resolved**.

> **Onda 2 implementada (2026-04-25)** — Form base completa: `textinput.native.tsx` (9 cases), `textarea.native.tsx` (6), `counter.native.tsx` (6), `field.native.tsx` re-implementado via slot recipe `useSlotRecipe('field')` + injeção de `nativeID`/`accessibilityLabelledBy`/`accessibilityDescribedBy`/`editable` em FieldControl (12 cases, 4 novos da TD-009 sem `.skip`). `FieldContext` ganhou `labelId` (compartilhado web+native). `web-only` no contrato: 12 → 10. [TD-009](../TECH_DEBT.md#td-009) **Resolved**. Próximo passo: onda 3 (Form seleção — Radio/Select).

> **Onda 3 implementada (2026-04-25)** — Form seleção: `radio.native.tsx` (`<Pressable accessibilityRole="radio">` + slot recipe `radio` + amarração `FieldContext` via `nativeID`/`accessibilityLabelledBy`, 10 cases) + `select.native.tsx` (`<Pressable accessibilityRole="combobox">` + `<Modal>` bottom-sheet com overlay click-outside; itens `accessibilityRole="menuitem"` + `accessibilityState.selected`, 13 cases). Interfaces de Radio/Select promovidas para `@platform native-ready`. `src/native.ts` exporta Radio/Select. `web-only` no contrato: 10 → 8. **Destrava [RFC-0019](RFC-0019-radio-card-deprecar-ou-unificar.md) + [RFC-0020](RFC-0020-select-combobox-wai-aria.md)** (escopo native).

---

## Motivação

O Arbor-DS é declarado em `CLAUDE.md` como "fonte única de verdade para interfaces web e mobile". Hoje, **12 componentes** estão marcados `@platform web-only` e **não funcionam em React Native**:

| Categoria | Componentes web-only | LOC aproximado |
|---|---|---|
| Core interativo | `Clickable` | ~120 |
| Form base | `Input` (TextInput, TextArea, Counter, FileUpload) | ~600 |
| Form seleção | `Radio`, `RadioCard`, `Select` | ~700 |
| Ação | `Button` | ~150 |
| Navegação | `Pagination`, `Tabs`, `Breadcrumb` | ~400 |
| Conteúdo | `Tag`, `Table`, `Accordion` | ~350 |

**Total:** ~12 componentes / ~2.300 LOC sem suporte mobile.

### Por que isto é um problema arquitetural

1. **Promessa quebrada.** Produto mobile que adota Arbor não consegue construir telas inteiras com o DS. Vira "DS web + componentes mobile à parte". O investimento no DS evapora.
2. **Drift cumulativo.** Cada componente novo que copia o padrão `<input>`/`<button>`/`<select>` HTML aumenta a fronteira artificial.
3. **Componentes Field-aware mistos.** Field tem `.native.tsx`; mas Input (que é Field-aware) não — Field native fica com a integração quebrada.
4. **A decisão de classificar como `web-only` foi nunca tomada.** É efeito colateral do path-of-least-resistance (HTML é mais rápido). Não há RFC documentando trade-off aceito.

### Por que agora

- TD-013 fechou (RFC-0016) — existe rede de testes para qualquer `.native.tsx` novo.
- R7 (feedback indicators) começa em breve. R7 inclui `Spinner`, `ProgressBar`, `Badge` — todos hoje `shared`. Mantendo o padrão, R7 não regride. Mas R8+ (overlays, navegação avançada) pode entrar com mais web-only se a diretriz não estiver formalizada.
- RFC-0017/0019/0020 (gate R7) pressupõem decisão prévia sobre web-only. Sem esta RFC, RFC-0019 (deprecar RadioCard) e RFC-0020 (Select WAI-ARIA combobox) fazem promessas que mobile não cumpre.

---

## Proposta

### Princípio arquitetural (norma)

**Todo componente público do Arbor-DS funciona em web, iOS e Android.** A tag `@platform web-only` é classificação **inválida** — sua presença em qualquer arquivo do `src/` é um bug a ser corrigido, não um estado aceito.

Os dois únicos níveis válidos:

| Tag | Significado |
|---|---|
| `@platform shared` | Funciona em web e native via mesma implementação `.tsx` (delega a `ArborTransform` ou primitives `shared` que já resolvem por plataforma). |
| `@platform native-ready` | Tem implementação dedicada `.native.tsx` por divergência arquitetural ou uso de APIs RN-only. |

`scripts/check-platform-contract.js` passa a:
- **Errar** quando vê `@platform web-only` em qualquer arquivo (após período de migração).
- **Hoje** (nesta RFC): apenas warning forte + listagem dos web-only no fim do output, com referência a esta RFC.

### Estratégia de paridade — por categoria

A migração não é fix-por-fix isolado; segue padrões. Cada categoria abaixo vira sub-PR ou RFC dedicada conforme escopo.

#### Categoria 1 — Foundation: `Clickable.native`

**Por que vem primeiro:** Button, Tag, Pagination, Breadcrumb, RadioCard, Tabs, Accordion — todos delegam click/press para `Clickable`. Sem `Clickable.native`, nenhum deles ganha paridade.

Já mapeado como [TD-004](../TECH_DEBT.md#td-004) — **promovido a RFC dedicada** dentro deste plano:

```tsx
// src/components/core/clickable/core/clickable.native.tsx
import { Pressable } from 'react-native';
import { useArborStyle } from '...';

export const Clickable = forwardRef<unknown, ClickableProps>((props, ref) => {
  return (
    <Pressable
      ref={ref}
      onPress={props.onPress ?? props.onClick}
      disabled={props.disabled}
      accessibilityRole={props.accessibilityRole ?? 'button'}
      accessibilityState={{ disabled: !!props.disabled, ...props.accessibilityState }}
      style={useArborStyle(props)}  // hook que resolve props styled-system → RN style
    >
      {props.children}
    </Pressable>
  );
});
```

Com `Clickable.native` pronto, **Button e Tag** ganham paridade automática (delegam tudo) — talvez precisem só ajuste fino de prop forwarding.

#### Categoria 2 — Form base: `Input` família

**TextInput** → `<TextInput>` RN, que já tem props alinhadas (placeholder, value, onChangeText, secureTextEntry, etc.). Mapping web↔native trivial em props públicas; styled-system aplica-se via `useArborStyle`.

**TextArea** → `<TextInput multiline numberOfLines={N}>`.

**Counter** → composição de Clickable.native (botões `−`/`+`) + Text (display do valor). Após Clickable.native, é refator pequeno.

**FileUpload** → caso mais espinhoso. RN não tem `<input type="file">`. Precisa de:
- iOS/Android: `expo-document-picker` ou `expo-image-picker` para selecionar arquivos.
- Trade-off: introduzir dependência externa **vs** declarar FileUpload como caso-fronteira documentado.
- Decisão proposta: aceitar `expo-document-picker` como dep opcional via `peerDependenciesMeta` (instala se consumidor já tiver).

#### Categoria 3 — Form seleção: `Radio` / `RadioCard` / `Select`

**Radio.native:**

```tsx
// Modelo activedescendant não funciona puro em RN.
// RadioGroup vira focus management explícito via FocusScope (já existe).
<Pressable
  accessibilityRole="radio"
  accessibilityState={{ checked: isChecked, disabled }}
  onPress={() => !disabled && setIsChecked(true)}
>
  <RadioContext.Provider value={...}>
    {children}  // Radio.Indicator + Radio.Label + Radio.Description
  </RadioContext.Provider>
</Pressable>
```

A11y RN: `accessibilityRole="radio"` + `accessibilityState={{ checked }}` é o equivalente nativo de `role="radio"` + `aria-checked` da web. iOS lê "selected"/"not selected", Android lê "checked"/"unchecked".

**Keyboard nav nativo:** RadioGroup precisa de `accessibilityActions` + `onAccessibilityAction` para usuários de teclado externo (iPad com Magic Keyboard, Android com TalkBack + Bluetooth keyboard). MVP: roving foco via `Pressable focusable`.

**RadioCard.native:** trivial após Radio.native — só layout. Mas: [RFC-0019](RFC-0019-radio-card-deprecar-ou-unificar.md) recomenda deprecar RadioCard. Se aceita, **RadioCard.native nunca é escrito** — Radio.native cobre. Manter dependência: deprecação só ativa após Radio.native ser pixel/comportamento paritário.

**Select.native** — caso mais complexo. UX nativa esperada não é "dropdown absolute" (que é UX desktop web). UX mobile é:

- iOS: `ActionSheet` ou modal sliding bottom-up.
- Android: `BottomSheet` ou modal full-screen.

Decisão proposta: **Modal customizado deslizando bottom-up** (paridade entre iOS/Android sem entrar em fragmentação visual). Item registry, keyboard nav, paridade de `aria-activedescendant` viram `accessibilityState={{ selected }}` no item ativo.

```tsx
// Select.native (esboço)
<Pressable onPress={open} accessibilityRole="combobox" accessibilityState={{ expanded: isOpen }}>
  <Text>{displayText}</Text>
  <Icon name="ChevronDown" />
</Pressable>
{isOpen && (
  <Portal>  {/* portal.native usa RN Modal */}
    <DismissableLayer onDismiss={close}>
      <BottomSheetView accessibilityRole="menu">
        {items.map((item) => (
          <Pressable
            key={item.value}
            accessibilityRole="menuitemradio"
            accessibilityState={{ selected: item.value === selectedValue }}
            onPress={() => select(item.value)}
          >
            <Text>{item.displayText}</Text>
          </Pressable>
        ))}
      </BottomSheetView>
    </DismissableLayer>
  </Portal>
)}
```

A API pública é a mesma do web — consumidor escreve `<Select.Trigger /><Select.Content />` igual em ambos. UX/visual diverge propositadamente para não imitar desktop em mobile.

#### Categoria 4 — Navegação: `Pagination` / `Tabs` / `Breadcrumb`

**Pagination.native:** após Clickable.native, é composição de botões + Text. Trivial.

**Tabs.native:** Pressable items + ScrollView horizontal opcional. Mapeamento `accessibilityRole="tab"` + `accessibilityState={{ selected }}`. Já há paralelo em `TabBar.native` que pode ser reaproveitado conceitualmente.

**Breadcrumb.native:** trivial após Clickable.native.

#### Categoria 5 — Conteúdo: `Tag` / `Table` / `Accordion`

**Tag.native:** após Clickable.native, é composição.

**Table.native:** caso fronteira. Tabelas reais em mobile (com sortable/scroll horizontal/ações por linha) são raras — UI mobile costuma virar List de Cards. Decisão proposta: `Table.native` como **lista de cards verticais** com mesma API; ou marcar como composição que recomenda `Card` em mobile e `Table` em web (api distinta nesses casos).

**Accordion.native:** Pressable + LayoutAnimation RN ou `react-native-reanimated`. Trivial mas precisa de motion lib.

### Não-objetivo

Esta RFC **não implementa** os componentes — apenas formaliza a diretriz, define padrões e divide o trabalho. Cada categoria/componente vira PR com critérios próprios.

---

## Plano de execução

Em ondas, do mais destravante para o caso-fronteira.

| Onda | Escopo | Bloqueia |
|---|---|---|
| **1** | `Clickable.native` (categoria 1) | Tudo de categorias 2–5 que delega click |
| **2** | Form base (TextInput.native, TextArea.native, Counter.native) | Field.native unificado (TD-009) |
| **3** | Form seleção (Radio.native, Select.native, RadioCard via deprecação) | RFC-0019, RFC-0020 |
| **4** | Navegação (Pagination, Tabs, Breadcrumb) | — |
| **5** | Conteúdo (Tag, Accordion) | — |
| **6** | Caso-fronteira (FileUpload, Table) — RFCs dedicadas | — |

A onda 1 destrava 80% do trabalho. As ondas 4–5 são triviais após onda 1.

---

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| **Manter `web-only` como classificação aceita** (versão anterior desta RFC) | Vai contra a diretriz arquitetural do produto. DS = fonte única; web-only quebra a promessa. |
| **Implementar tudo em uma única PR mega** | Custo de revisão proibitivo; risco de bugs cumulativos sem rede. Ondas + sub-RFCs por categoria são o caminho. |
| **Adotar RN Paper / NativeBase / etc.** | Adiciona dependência externa pesada; quebra DX (componentes não casam visualmente com versão web do DS); adiciona surface area opaca. RDS é "zero deps de runtime". |
| **Deixar mobile usar lib externa caso a caso** | É o status quo. Arbor vira "DS web + componentes mobile à parte" — não há razão de existir. |
| **Marcar formalmente alguns componentes como web-only "para sempre"** (FileUpload, Table) | Possível para casos extremos, mas precisa RFC dedicada documentando o trade-off. Esta RFC não admite hoje. |

---

## Impactos e trade-offs

- **Breaking change?** **Não direto** — APIs públicas web permanecem inalteradas. Componentes ganham `.native.tsx`. Para consumidor RN, é feature, não breaking.
- **Bundle size:** ~ +30–50 kB no entrypoint native (~12 componentes × ~3 kB médio). Web não muda (tree-shaking exclui `.native.tsx`).
- **Performance:** zero web. Native: Pressable + acessibilidade têm custo nativo igual a qualquer app RN.
- **DX:**
  - **Ganho:** consumidor RN finalmente usa Arbor pra construir tela inteira.
  - **Custo:** maintainer escreve cada componente duas vezes onde diverge. Mitigado por `shared` quando estilo basta.
- **Acessibilidade:** **massivo positivo.** Apps mobile passam a ter a11y consistente com web. Hoje é zero (componente quebra antes da a11y importar).
- **Codemod necessário?** Não.

### Riscos

| Risco | Mitigação |
|---|---|
| Esforço grande (~12 componentes × média 1–2 dias cada) | Ondas; sub-RFCs por categoria; podem entrar paralelo a R7+. |
| Divergência de UX iOS↔Android (Modal vs BottomSheet, ActionSheet vs custom) | Decisão padrão por componente: paridade visual entre iOS/Android prefere customizado. Diferença visual com web é aceitável (UX mobile ≠ UX desktop). |
| FileUpload / Table sem solução boa | Tratar como casos-fronteira em RFCs dedicadas (onda 6). Aceitar deps opcionais (`expo-document-picker`) ou recomendar composição alternativa. |
| Suite native fica lenta (já está em ~30s por mudança de qualquer arquivo) | RFC-0016 já mitigou. Coverage off no project native. Otimizar transformIgnorePatterns conforme libs entram. |
| RFC-0017 (recipes mortas) precisa cobrir versão native também | Recipe é cross-platform por definição (mesma `useSlotRecipe` em web e native). Esta RFC reforça. |

---

## Critérios de aceite

### Norma (esta RFC)

- [ ] `CONTRIBUTING.md` documenta os 2 níveis de tag (`shared` e `native-ready`); web-only é declarado explicitamente como bug.
- [ ] `scripts/check-platform-contract.js` emite warning forte para `@platform web-only`; lista todos no output.
- [ ] Inventário inicial dos 12 web-only registrado em [TD-017](../TECH_DEBT.md#td-017).
- [ ] Esta RFC referenciada em RFC-0019 e RFC-0020 (que tinham premissa errada).

### Critério para fechar TD-017 (auditoria)

Cada um dos 12 componentes:
- [ ] Re-classificado como `shared` ou `native-ready`.
- [ ] Se `native-ready`: tem `.native.tsx` real + `.native.test.tsx` passando.
- [ ] Tag `@platform web-only` removida do código.

`pnpm test:platform-contract` deixa de imprimir warning de web-only.

---

## Notas de implementação

### Dependência com outras RFCs e TDs

- **TD-004** (Clickable.native) — **promovido a primeiro item desta RFC**. Resolução de TD-004 é onda 1.
- **TD-009** (Field.native) — onda 2 destrava a unificação real.
- **RFC-0017** (recipes mortas) — recipes são cross-platform; consumidas por `useSlotRecipe` que tem `.native.ts`. Esta RFC reforça.
- **RFC-0019** (RadioCard deprecação) — agora **só pode** ser aprovada se Radio.native (onda 3) cobrir paridade. Foi atualizada.
- **RFC-0020** (Select combobox) — agora inclui escopo native (onda 3 / Select.native via Modal). Foi atualizada.

### Componentes hoje `shared` — auditoria

`shared` significa "delega 100% pro styled-system". Auditar que **nenhum componente shared** tem `<input>`, `<button>`, `<select>`, `<table>` HTML cru.

Da listagem (alert, avatar, badge, card, chip, progress-bar, progress-circle, skeleton, spinner): cada um precisa ser validado em audit dedicada — escopo da TD-017.

### Estratégia para Storybook native

Storybook tradicional é web. Para validar UX nativa, temos `playground/` (Expo) com 6 screens (Phase 17). Cada componente migrado precisa de pelo menos uma tela exemplificando uso real em mobile. Storybook native (Chromatic + Loki) é fora do escopo desta RFC — RFC dedicada se virar prioridade.

### Pacotes e entrypoints

`src/native.ts` já existe e re-exporta foundations + ecosystem + componentes safe-to-import-em-RN. Após migração, o entrypoint passa a exportar **todos os componentes públicos** — desaparece a divisão "componentes safe vs unsafe".

### Referência

- [`CLAUDE.md`](../../CLAUDE.md) — diretriz de cross-platform.
- [TD-017](../TECH_DEBT.md#td-017) — registro de auditoria sistêmica.
- [RFC-0016](RFC-0016-ambiente-de-testes-cross-platform.md) — destravou esta RFC ao criar a rede de testes native.
- [TD-004](../TECH_DEBT.md#td-004) — Clickable.native (onda 1).
- [TD-009](../TECH_DEBT.md#td-009) — Field unificado (onda 2).
