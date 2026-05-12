# RFC-0043 — API plana como default (compound `.Root` reservado)

**Status**: Accepted
**Autores**: @bia
**Data**: 2026-05-12
**PR**: (a definir)

---

## Motivação

O Arbor-DS adotou o pattern compound (`Component.Root > Component.Trigger > Component.Content > ...`) como instrumento de composição em vários componentes. Em parte deles, a anatomia padrão é **fixa** — há uma e apenas uma ordem semântica natural, e o consumidor só está repetindo a estrutura mínima sem agregar valor de composição. Nesses casos, o compound deixa de ser composição e vira **cerimônia**.

Exemplos diagnosticados antes desta RFC:

```tsx
// Checkbox pré-RFC: cerimônia
<Checkbox.Root checked={c} onCheckedChange={set}>
  <Checkbox.Indicator />
  <Checkbox.Label>Aceito os termos</Checkbox.Label>
</Checkbox.Root>

// Checkbox pós-PCV-17 + commit 8ac58a0: API plana
<Checkbox checked={c} onCheckedChange={set} label="Aceito os termos" />
```

Mesmo padrão entregue em Radio (`8ac58a0`), Alert/Tooltip/Avatar (`d4fea19`). A varredura identificou **22 componentes com `.Root`** exportado; nem todos justificam compound.

### Por que importa agora

A fila de execução tem PCV-20 (Field) → PCV-21 (TextInput) → PCV-22 (Select) → PCV-23 (FileUpload) na Camada 6 e Dialog/Drawer na Camada 9. Sem regra formalizada, cada PCV corre o risco de manter compound onde plano resolve. Pior, novos componentes nascem replicando o anti-pattern por inércia de cópia.

### Risco se não fizer

- **DX:** consumidor escreve 3-5 elementos para um caso que cabe em 1; documentação infla; onboarding fica mais lento.
- **Manutenção:** três caminhos de uso (compound, plano, mixed) onde dois bastariam.
- **Consistência:** decisões caso-a-caso sem critério produzem ecossistema onde Checkbox é plano, Switch é plano, mas Select e Dialog continuam compound sem justificativa estrutural.

---

## Proposta

### Regra canônica

> **Quando a anatomia padrão é fixa, o top-level entrega API plana via props (`label`/`title`/`description`/`footer`/`action`/`trigger`/`options`).**
> Compound (`Component.Root`, `Component.Trigger`, etc.) permanece exportado, mas é reservado a layouts não-triviais.

**API plana é o caminho recomendado nas stories default**; compound aparece em story `AdvancedCompound` separada, com justificativa.

### Critério de decisão — quando compound é legítimo

Componente fica compound como default se **qualquer** destes for verdade:

1. **Ordem semântica do consumidor importa.** O consumidor decide a ordem dos slots (Card pode ter Media-Header-Body ou Header-Body-Media; Accordion item pode ter Header customizado seguido de Content com qualquer árvore).
2. **Slots são arbitrariamente repetidos.** Tabs.List tem N Triggers; Breadcrumb tem N Items; Menu tem N Items + Separators; Table tem N Rows.
3. **Conteúdo é árvore composta pelo consumidor.** Popover.Content e Tooltip.Content recebem markup arbitrário; Field embrulha Input + HelperText + descrições com lógica field-aware.
4. **Slots opcionais não-discriminantes.** Carousel pode ter Previous + Next + Indicators ou só Indicators; cada combinação muda anatomia.

Se **nenhum** dos quatro for verdade, **o default é plano**.

### Pattern canônico (já validado em Checkbox/Radio/Alert/Tooltip/Avatar)

```tsx
// interfaces/ComponentProps.ts
export interface ComponentProps extends Omit<ComponentRootProps, 'children'> {
  /** Props planas — denominador-comum (Mantine/Chakra-aligned) */
  label?: ReactNode;
  description?: ReactNode;
  /** Compound mode — usado quando children está presente E nenhuma prop plana foi passada */
  children?: ReactNode;
}

// core/component.tsx
function ComponentFlat({ label, description, children, ...rootProps }: ComponentProps) {
  const usesFlatApi =
    label !== undefined ||
    description !== undefined ||
    children === undefined;

  if (!usesFlatApi) {
    return <ComponentRoot {...rootProps}>{children}</ComponentRoot>;
  }

  return (
    <ComponentRoot {...rootProps}>
      {/* anatomia automática derivada das props planas */}
    </ComponentRoot>
  );
}

ComponentFlat.displayName = 'Component';
export const Component = Object.assign(ComponentFlat, {
  Root: ComponentRoot,
  Trigger: ComponentTrigger,
  Content: ComponentContent,
  // ...
});
```

**Regras-chave do pattern:**

- Discriminação por **prop**, nunca por introspecção de children (`React.Children.map`, type checking de filhos). Prop discrimina o modo de forma explícita.
- `children === undefined` também ativa modo plano — permite `<Component aria-label="x" />` sem nada dentro.
- Compound continua exportado em `.Root`/`.Trigger`/etc — **sem breaking** para quem já consome.
- Naming alinhado com denominador-comum do mercado: `label`, `title`, `description`, `footer`, `action`, `trigger`, `options`, `placeholder`.
- Stories: default em modo plano; story `AdvancedCompound` separada para layouts não-triviais.

### Classificação auditada de componentes

| Componente | Classificação | Status | Notas |
|---|---|---|---|
| **Alert** | Plano | ✅ Entregue (`d4fea19`) | `title`, `description`, `action` |
| **Avatar** | Plano | ✅ Entregue (`d4fea19`) | `name`, `src`, `fallback` |
| **Checkbox** | Plano | ✅ Entregue (`8ac58a0`) | `label`, `description` |
| **Radio** | Plano | ✅ Entregue (`8ac58a0`) | `label`, `description` |
| **Switch** | Plano | ✅ Já plano | `label`, `description` |
| **Tooltip** | Plano | ✅ Entregue (`d4fea19`) | `content` + children como anchor |
| **Toast** | Plano | ✅ Já plano via store | `toast.add({ title, description, tone })` |
| **Badge** | Plano | ✅ Já plano | `<Badge>conteúdo</Badge>` direto |
| **Chip** | Plano | ✅ Já plano | `<Chip>texto</Chip>`; `.Icon`/`.Remove` opcionais |
| **Tag** | Plano | ✅ Já plano (PCV-10) | Decorativa pura |
| **Counter** | Plano | ✅ Já plano | `label`, `value`, `onValueChange` |
| **Dialog** | **Migrar** | ⏳ Camada 9 PCV-32 | `title`, `description`, `footer`, `trigger` |
| **Drawer** | **Migrar** | ⏳ Camada 9 PCV-33 | Mesmo pattern de Dialog |
| **Select** | **Migrar** | ⏳ Camada 6 PCV-22 | `options[]`, `placeholder` |
| **FileUpload** | **Auditar** | ⏳ Camada 6 PCV-23 | Decisão durante PCV |
| **Popover** | **Auditar** | ⏳ Camada 8 PCV-30 | Provável compound (conteúdo árvore) |
| **Field** | Compound | ✅ Compound legítimo | Field-aware lógica + ordem variável |
| **Card** | Compound | ✅ RFC-0036 | Slots reordenáveis (Media edge-to-edge) |
| **Accordion** | Compound | ✅ RFC-0037 | N Items repetidos |
| **Tabs** | Compound | ✅ RFC-0038 | N Triggers repetidos |
| **Carousel** | Compound | ✅ RFC-0034 | Slots opcionais não-discriminantes |
| **Menu** | Compound | ✅ Já compound | N Items + Separators |
| **Breadcrumb** | Compound | ✅ Já compound | N Items repetidos |
| **Pagination** | Compound | ✅ Já compound | Layout de controles variável |
| **Table** | Compound | ✅ Já compound | N Rows + N Columns |
| **NavBar / TabBar** | Compound | ✅ Já compound | Slots start/center/end |
| **ButtonGroup** | Compound | ✅ Já compound | N Buttons repetidos |

**Resumo do trabalho restante:**
- 3 migrações confirmadas: **Select** (PCV-22), **Dialog** (PCV-32), **Drawer** (PCV-33).
- 2 auditorias: **FileUpload** (PCV-23), **Popover** (PCV-30) — decisão durante PCV respectivo.
- 0 breaking — compound legado preservado em `.Root` em todos.

---

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| Migrar tudo agressivamente para plano, deprecar compound | Quebra consumidores; perde flexibilidade real onde compound é necessário (Card/Accordion/Tabs). |
| Manter compound como único caminho em todos | Cerimônia desnecessária; perde paridade com mercado (Mantine/Chakra). |
| Detectar children mágica/automaticamente (introspectar `React.Children`) | Frágil, opaco, mata tree-shaking, quebra TypeScript autocompletion. Tornado **anti-pattern explícito**. |
| Mixed: aceitar `label` E filhos compound ao mesmo tempo | Ambiguidade — quem ganha? Stories ficam confusas. Plano e compound são **mutuamente exclusivos** por construção. |
| Caso-a-caso sem regra documentada | Estado atual. Replica o anti-pattern por inércia. |

---

## Impactos e trade-offs

- **Breaking change?** Não. Compound (`.Root`/`.Trigger`/...) permanece exportado em todos os componentes. Migração para plano é aditiva.
- **Impacto em bundle size**: ~0 (wrappers triviais; tree-shaking preserva compound onde só plano é usado).
- **Impacto em performance**: nulo (decisão de roteamento é check de `undefined` em props).
- **Impacto em DX**: positivo — caso padrão fica em 1 linha; documentação default mais limpa; onboarding mais rápido.
- **Impacto em acessibilidade**: neutro — anatomia gerada pelo wrapper plano espelha exatamente a anatomia compound (mesmos atributos ARIA, mesma ordem de leitura).
- **Codemod necessário?** Não — compound segue válido. Stories migradas manualmente por PCV.

---

## Critérios de aceite

- [x] RFC redigida e aprovada
- [x] Template PCV (RFC-0042) ganha dimensão 8 "API plana avaliada" + linha de checklist
- [x] Skill `arbor-ds-arch` ganha anti-pattern "compound `.Root` cerimonial"
- [x] Pattern canônico documentado e exemplificado
- [x] Lista auditada por componente publicada
- [ ] PCV-22 (Select) aplica regra: caminho default `<Select options={...} />`; compound preservado para grupos/sub-headers customizados
- [ ] PCV-32 (Dialog) aplica regra: `title`/`description`/`footer`/`trigger`
- [ ] PCV-33 (Drawer) aplica regra: mesmo pattern de Dialog
- [ ] PCV-23 (FileUpload), PCV-30 (Popover): decisão registrada no PR (plano ou compound legítimo)

---

## Notas de implementação

### Naming canônico das props planas

Para reduzir variabilidade e alinhar com denominador-comum do mercado, props planas usam este vocabulário:

| Prop | Significado | Tipo |
|---|---|---|
| `label` | Texto principal / rótulo do controle | `ReactNode` |
| `title` | Cabeçalho de bloco (Dialog/Drawer/Alert) | `ReactNode` |
| `description` | Texto secundário/explicativo | `ReactNode` |
| `helperText` | Texto auxiliar do controle (Field) | `ReactNode` |
| `footer` | Bloco inferior (Dialog/Drawer/Card flat) | `ReactNode` |
| `action` | CTA único (Alert/Toast) | `ReactNode` |
| `trigger` | Elemento que abre overlay (Dialog/Drawer/Tooltip) | `ReactNode` |
| `content` | Corpo de overlay simples (Tooltip) | `ReactNode` |
| `options` | Coleção tipada (Select/Menu se aplicável) | `T[]` |
| `placeholder` | Texto de placeholder | `string` |
| `startSlot` / `endSlot` | Ornamentos (ícone à esquerda/direita) | `ReactNode` |

### Pattern para componentes com `options[]`

Select é o caso paradigmático:

```ts
export interface SelectOption<V = string> {
  value: V;
  label: ReactNode;
  disabled?: boolean;
  group?: string; // sub-header opcional
}

<Select
  value={v}
  onValueChange={set}
  placeholder="Selecione..."
  options={[
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue', disabled: true },
  ]}
/>
```

**Decisões fixadas para PCV-22:**
- `renderOption?: (option) => ReactNode` permitido para casos avançados.
- Conviver com Children API: **não**. Plano e compound são mutuamente exclusivos (passou `options` → ignora children; passou `.Root`/`.Trigger`/`.Content` direto → ignora `options`). Não há modo mixed.
- Custom item com ícone/descrição: `SelectOption` aceita `startSlot` e `description` opcionais; sem necessidade de `renderOption` no caso comum.
- A11y WAI-ARIA combobox (RFC-0020) preservada — wrapper plano monta a árvore correta internamente.

### Pattern para overlays (Dialog/Drawer)

```tsx
<Dialog
  open={o}
  onOpenChange={set}
  title="Confirmar exclusão"
  description="Essa ação é irreversível."
  trigger={<Button>Excluir conta</Button>}
  footer={
    <Flex gap="small" justifyContent="flex-end">
      <Button variant="ghost" onClick={() => set(false)}>Cancelar</Button>
      <Button variant="danger" onClick={confirm}>Excluir</Button>
    </Flex>
  }
>
  {/* body opcional via children, quando precisar de markup intermediário */}
</Dialog>
```

**Body via children + props planas convivem** neste único caso, com regra clara: `title`/`description` viram cabeçalho; `footer` vira rodapé; `children` (se passado) vira body entre eles. Esta é a **exceção controlada** — Dialog/Drawer têm uma anatomia padrão com 3 zonas (header/body/footer), duas são padronizadas, uma é livre.

### Stories

- **Default**: API plana, caso mais comum.
- **AdvancedCompound** (opcional): demonstra compound `.Root` quando justificável; aparece **apenas** se o componente tem caso real de layout não-trivial.
- Stories migradas como parte do PCV correspondente; não é trabalho separado.

### Lint guard (futuro, não bloqueante para v1)

Considerar lint customizado que detecte `<Component.Root>` quando todos os usos no codebase pudessem ser planos. Adiar até pós-v1 — regra está em RFC + skill + template PCV; replicação é improvável.

---

## Referências

- Memory `project_flat_api_backlog.md` (superseded por esta RFC)
- Commits de referência: `8ac58a0` (Checkbox + Radio), `d4fea19` (Alert + Tooltip + Avatar)
- RFC-0020 (Select WAI-ARIA combobox) — pré-requisito a11y para PCV-22
- RFC-0030 (overlays `open`/`onOpenChange`) — pré-requisito de naming para Dialog/Drawer
- RFC-0042 (PCV) — ganha dimensão 8 referenciando esta RFC
