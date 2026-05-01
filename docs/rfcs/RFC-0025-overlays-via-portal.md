# RFC-0025 — Overlays via Portal (contrato sistêmico)

**Status**: Accepted
**Autores**: @bia
**Data**: 2026-05-01
**PR**: 9bb68b5 (G1+G2) + sequência G3

**Origem**: Item R6-G da fila de execução; precedente direto da [RFC-0020](RFC-0020-select-combobox-wai-aria.md), que portou Select para `Portal` + `DismissableLayer.excludeRef`.

---

## Motivação

Antes deste RFC, o estado dos 5 overlays do DS era inconsistente:

| Componente | Portal | `excludeRef` | Falha observável |
|---|---|---|---|
| Dialog | ✅ | n/a (overlay capta clicks) | — |
| Drawer | ✅ | n/a (overlay capta clicks) | — |
| Popover | ✅ | ❌ | trigger fora do layer fechava-e-reabria em race (`pointerdown` → close, `click` → reopen) |
| Menu | ✅ | ❌ | mesma race do Popover |
| Tooltip | ❌ | n/a | renderizado inline com `position: absolute`; cortado por `overflow: hidden` ancestral; acoplado a `position: relative` do trigger |

A migração já tinha sido feita componente a componente sem contrato escrito. Resultado: cada novo overlay (próximo: FileUpload pop, eventual ColorPicker, etc.) ia repetir os mesmos erros, e revisores não tinham checklist único.

Este RFC formaliza o contrato e fecha o item R6-G.

## Proposta

### Regra 1 — Todo overlay renderiza via `Portal`

Qualquer componente cujo conteúdo aparece **acima** do fluxo normal e **fora** do contexto do trigger (Dialog, Drawer, Popover, Menu, Tooltip, Toast, Select content e equivalentes futuros) deve renderizar via `<Portal>`.

**Por quê:** evita captura por `overflow: hidden`, `transform`, `contain: layout` e `clip-path` ancestrais — todos comuns em layouts de aplicação real (cards, painéis com scroll, animações de transição). Sem Portal, o overlay vira invisível ou cortado e o consumidor precisa reorganizar a árvore — anti-DX.

**Implementação:** primitive `Portal` (web: `ReactDOM.createPortal(children, document.body)`; native: equivalente em `Modal`/`overlay`). Já existe e é a única via permitida.

### Regra 2 — `excludeRef` obrigatório quando trigger vive fora do layer

Quando o trigger que abre o overlay vive **fora** da árvore do conteúdo portalizado e o `DismissableLayer` é usado para fechar por outside-click, o `triggerRef` deve ser passado como `excludeRef` ao `DismissableLayer`.

**Por quê:** sem isso, o `pointerdown` no trigger fecha o layer e o `click` subsequente reabre — toggle morre, double-click parece travar. Bug clássico, silencioso, descoberto na RFC-0020 e replicado em Popover/Menu pela G1.

**Implementação:** o root do compound cria `triggerRef = useRef<HTMLElement | null>(null)` e expõe via contexto. O `Trigger` anexa via `innerRef` (caso default com `Clickable`/`Box`) ou via `cloneElement` + `mergeRefs` (caso `asChild`). O `Content` lê do contexto e passa para o `DismissableLayer`. Helper público: `mergeRefs<T>(...refs)` em `src/ecosystem/utils/functions/merge-refs.ts`.

**Quando não se aplica:**
- Dialog/Drawer: o overlay-backdrop captura cliques fora do painel; trigger fica sob o overlay (não recebe o `pointerdown`). Não precisa.
- Tooltip: dismissa por `mouseleave`/`blur` do próprio trigger; não usa `DismissableLayer`. Não precisa.

### Regra 3 — Posicionamento âncora é responsabilidade do componente

Componentes portalizados que precisam ficar **ancorados ao trigger** (Tooltip ✅, Select ✅, futuro Popover/Menu) devem calcular a posição via `getBoundingClientRect` do `triggerRef` em `useLayoutEffect`, com listeners para `resize` e `scroll` (capture phase).

**Por quê:** Portal quebra a herança de `position: relative` do trigger, então o overlay precisa de coordenadas absolutas. Listeners de `scroll` devem ser na capture phase para captar scrolls de qualquer ancestral, não só `window`.

**Pattern de referência:** `tooltip-content.tsx` (G2) e `select.tsx` (RFC-0020).

```tsx
useLayoutEffect(() => {
  if (!isOpen) return;
  const update = () => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    setPosition(computePosition(trigger.getBoundingClientRect(), placement));
  };
  update();
  window.addEventListener('resize', update);
  window.addEventListener('scroll', update, true); // capture phase
  return () => {
    window.removeEventListener('resize', update);
    window.removeEventListener('scroll', update, true);
  };
}, [isOpen, placement, triggerRef]);
```

**Estado atual:** Popover e Menu hoje posicionam fixo no centro do viewport. Não é regressão deste RFC; é dívida pré-existente — registrada como **TD-023** (anchor positioning unificado), com gatilho "1º caso real de produto exigindo alinhamento ao trigger".

### Regra 4 — Animação de entrada/saída via `mounted` + `visible`

Overlays com transição de fade/scale/slide na entrada e saída precisam do par `mounted` (controla render) + `visible` (controla CSS `opacity`/`transform`). `mounted` permanece `true` durante o `EXIT_MS` para que o fade-out aconteça antes do desmount. `visible` é flippado via `requestAnimationFrame` após `setMounted(true)` para que a primeira pintura seja `opacity: 0` e a segunda seja `opacity: 1` (sem isso o navegador pinta direto no estado final, sem transição).

**Por quê:** é o único pattern que funciona com `Portal` (que desmonta filho ao retorno `null`) preservando microinteração. Foi usado em Dialog/Drawer/Modal desde a fase 9; a G2 replicou em Tooltip.

```tsx
useEffect(() => {
  if (isOpen) {
    setMounted(true);
    frameRef.current = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frameRef.current);
  }
  setVisible(false);
  const t = setTimeout(() => setMounted(false), EXIT_MS);
  return () => clearTimeout(t);
}, [isOpen]);
```

### Regra 5 — `aria-hidden` em overlays com fade-out

Quando o overlay fica montado durante `EXIT_MS` (regra 4), aplique `aria-hidden={!isOpen || undefined}`. Isso retira o nó da accessibility tree assim que `isOpen=false` — leitores de tela e `queryByRole` deixam de encontrá-lo imediatamente, sem esperar o desmount visual.

**Por quê:** sem isso, `screen.queryByRole('tooltip')` continua retornando o nó por 150ms após o blur, quebrando contratos de teste e potencialmente "dublando" anúncios em VoiceOver/NVDA.

## Estrutura proposta

### Pasta canônica de um overlay

```
src/components/<nome>/
  context/<nome>-context.ts     # tipa triggerRef quando relevante
  core/<nome>.tsx               # Root cria triggerRef e provê
  slots/<nome>-trigger.tsx      # innerRef + cloneElement+mergeRefs em asChild
  slots/<nome>-content.tsx      # Portal + DismissableLayer (excludeRef) + posicionamento
  slots/<nome>-overlay.tsx      # opcional — Dialog/Drawer
```

### Helper público

`src/ecosystem/utils/functions/merge-refs.ts`:

```ts
export function mergeRefs<T>(...refs: Array<Ref<T> | undefined | null>): RefCallback<T> {
  return (value: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') ref(value);
      else (ref as MutableRefObject<T | null>).current = value;
    }
  };
}
```

Já exportado em `ecosystem/utils/functions/index.ts`. Pré-requisito de qualquer compound com `asChild` que precise capturar ref do filho.

## Impactos e trade-offs

- **Bundle**: zero impacto. Tudo em primitives já existentes.
- **DX**: contrato escrito. Novos overlays têm checklist objetivo.
- **A11y**: melhora — regra 5 fecha gap silencioso de fade-out + a11y tree.
- **Performance**:
  - Listeners `scroll` (capture) e `resize` são leves; só ativos com overlay aberto.
  - `requestAnimationFrame` em transição é uma vez por open/close — desprezível.
  - `mergeRefs` cria nova `RefCallback` por render do Trigger; aceitável (Trigger raramente re-renderiza em loops apertados).
- **Breaking change**: nenhum para consumidor. A semântica observável de Popover/Menu mudou (trigger virou toggle), mas nenhum teste de consumidor depende do comportamento "click trigger só abre".

## Critérios de aceite

- [x] Helper `mergeRefs` em `ecosystem/utils/functions/`.
- [x] `triggerRef` no contexto + `excludeRef` no `DismissableLayer` em **Popover** e **Menu**.
- [x] **Tooltip** portalizado com posicionamento via `getBoundingClientRect`.
- [x] Pattern `mounted` + `visible` aplicado em Tooltip; preservado em Dialog/Drawer.
- [x] `aria-hidden` durante exit em Tooltip.
- [x] Suíte verde (864/864), incluindo casos novos: toggle/pointerdown em Popover+Menu, `InsideOverflowClip` em Tooltip.
- [ ] Stories `InsideOverflowClip` para os 5 overlays — visual proof do escape.
- [ ] **TD-023** aberta — anchor positioning unificado para Popover/Menu (gatilho registrado).
- [ ] R6-G marcada como resolvida na tabela de backlog do `TECH_DEBT.md`.

## Notas

### Por que `mergeRefs` no `ecosystem/utils/functions` e não em primitive

`mergeRefs` é puramente funcional, sem dependência de React render-cycle. Não merece pasta própria nem export separado. Agrupar com outras utilities (`transition`, `clone-elements`, `get-token-value`) mantém a área de imports baixa e o contrato simples.

### Cruzamento com outras dívidas

- Encerra **R6-G** integralmente.
- Abre **TD-023** (anchor positioning para Popover/Menu).
- Não toca **TD-005** (theming hardcoded em fab.native), **TD-001/002** (innerRef legado) ou **TD-006** (Button↔ButtonGroup).
- Pode informar futura RFC sobre `FileUpload` / overlays compostos: o contrato deste RFC é pré-requisito.
