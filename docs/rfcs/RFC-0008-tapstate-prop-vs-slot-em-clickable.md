# RFC-0008 — `tapState`: prop de objeto vs. slot composto em `Clickable`

**Status**: Implemented (com recorte de escopo)
**Autores**: Arquiteto Arbor-DS
**Data**: 2026-04-24
**Aceita em**: 2026-04-24
**Implementada em**: 2026-04-24
**Origem**: R3 · achado em `clickable.md`
**PR**: —
**Bloqueia**: R4 (Button, ButtonGroup, FAB) — **destravada e implementada**

---

## Decisão (2026-04-24)

**Aceita** a proposta central: remover a prop `tapState` e expor o componente como slot composto público. Três recortes sobre a proposta original:

1. **Renomear `TapState` → `PressFeedback`.** "Tap" carrega conotação mobile; "press" cobre web (`:active`/click+hold) e native (`onPressIn`). "Feedback" descreve a responsabilidade (efeito visual) e desambigua do estado `pressed`. Destino: `src/components/core/press-feedback/`.
2. **Adiar `useClickableContext`.** O feedback atual funciona via CSS `:active` puro (ver `tap-state.tsx:30-34`) — não há necessidade imediata de Provider em `Clickable`. Introduzir contexto agora seria construir para demanda hipotética. Migração inicial mantém o modelo CSS. Contexto entra em RFC separada quando surgir o primeiro consumidor real de "pressed controlado por React state" (ex: Card hoverable sincronizado com estado de seleção).
3. **Limpar dead code na migração.** Remover `tapStateRef` em `clickable.tsx:12,35` (declarado e nunca usado). Remover `pressed` controlado + `useImperativeHandle` em `tap-state.tsx:7-15` — o `PressFeedback` simplificado aceita apenas `variant` e props de `radius`, feedback por `:active`. Reintroduzir `pressed` controlado só quando o contexto for adicionado.

Demais itens da seção **Critérios de aceite** permanecem válidos, ajustados aos recortes acima.

---

## Motivação

`Clickable` aceita `tapState?: TapStateProps` — objeto que configura o feedback visual animado de pressed.

```tsx
<Clickable tapState={{ scale: 0.95, opacity: 0.7 }} onClick={...}>
  <Text>Click me</Text>
</Clickable>
```

Problemas observados:

- **Acoplamento implícito.** `Clickable` precisa renderizar `<TapState>` internamente baseado na presença da prop, mantém ref próprio (`tapStateRef`) e passa `tapState` pra dentro. Isso cria um pseudo-slot oculto.
- **Customização limitada.** Não há como compor outros efeitos (ex: ripple, halo de focus animado) sem hardcoded mais props no objeto.
- **Reuso bloqueado.** `TapState` em si é uma primitiva animação — outros componentes (Card hoverable, Chip selecionável) **não conseguem usar** `TapState` sem replicar a lógica de `Clickable`.
- **Confusão de modelo mental.** `tapState` parece configuração; é na verdade ativação opcional de um sub-componente.

## Proposta

**Remover `tapState` como prop** e expor `TapState` como **slot composto opt-in**.

```tsx
// Antes
<Clickable tapState={{ scale: 0.95 }} onClick={...}>
  <Text>Click me</Text>
</Clickable>

// Depois
<Clickable onClick={...}>
  <TapState scale={0.95}>
    <Text>Click me</Text>
  </TapState>
</Clickable>
```

`TapState` vira componente público de primeira classe em `src/components/core/tap-state/` (hoje vive em `src/ecosystem/`). Aceita `children` e aplica o efeito visual animado sobre eles. Usa o contexto de pressed do `Clickable` mais próximo (`useClickableContext()`).

Vantagens:

- **Composição clara.** Quem quer feedback de pressed envolve filhos com `TapState`; quem não quer, não envolve.
- **Reuso.** `Card` hoverable pode usar `<TapState scale={0.98}>` sem precisar de `Clickable`.
- **Clickable mais simples.** Some o ref de TapState, some a lógica de spread condicional, some o TapState importado.
- **Extensibilidade.** Outros efeitos (Ripple, Halo) seguem o mesmo padrão de slot.

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| Manter `tapState` como prop, melhorar tipagem | Não resolve acoplamento nem reuso. |
| Mover `TapState` para `Clickable.TapState` (compound estrito) | Acopla TapState a Clickable. Card hoverable continua sem solução. |
| Renderprop (`<Clickable>{({ pressed }) => ...}</Clickable>`) | Aumenta verbosidade para o caso comum (90% dos consumidores não precisam customizar). |
| Hook (`useTapState()`) | Útil, mas exige boilerplate de aplicar styles manualmente. |

## Impactos e trade-offs

- **Breaking change?** Sim — `tapState` removido. Codemod converte `<Clickable tapState={x}>...` em `<Clickable><TapState {...x}>...`.
- **Impacto em bundle size**: leve aumento (TapState exportado publicamente). `Clickable` reduz.
- **Impacto em performance**: igual ou levemente melhor (TapState só renderiza quando explicitamente usado).
- **Impacto em DX**: melhora — modelo mental claro, autocomplete dedicado para TapState.
- **Impacto em acessibilidade**: melhora — `TapState` pode ler `usePrefersReducedMotion` independentemente, sem depender de Clickable repassar a flag.
- **Codemod necessário?** Sim.

## Critérios de aceite

- [ ] `PressFeedback` criado em `src/components/core/press-feedback/` e exportado publicamente (renomeação aprovada em 2026-04-24)
- [ ] `TapState` atual (`src/ecosystem/utils/components/tap-state/`) removido após migração dos consumidores
- [ ] `Clickable` remove prop `tapState`, remove `tapStateRef` dead code (`clickable.tsx:12,35`) e `setRef` manual (se RFC-0001 já aplicada, usar `ref` canônico direto)
- [ ] `PressFeedback` simplificado: apenas `variant` e props de `radius`; feedback via `:active` CSS (dead code de `pressed` + `useImperativeHandle` removido)
- [ ] `Button`, `ButtonGroup`, `FAB`, `Chip`, `Accordion.Trigger`, `Tabs.Tab` (consumidores de Clickable) revistos para usar nova API
- [ ] Stories cobrem: Clickable sem PressFeedback, Clickable com PressFeedback envolvendo children, PressFeedback com variants
- [ ] Testes cobrem: render, variants, customização de radius, reduced motion respeitado
- [ ] Codemod publicado: `<Clickable tapState={x}>...</Clickable>` → `<Clickable><PressFeedback {...x}>...</PressFeedback></Clickable>`
- [ ] Migration guide com exemplo
- [ ] RFC futura aberta para `useClickableContext` quando surgir consumidor real de pressed controlado

## Notas de implementação

- **Esta RFC bloqueia R4.** Se aprovada após R4 começar, todos os triggers (Button, ButtonGroup, FAB) precisam migrar — retrabalho garantido. **Decidir antes de iniciar R4.**
- O `useClickableContext` é primitiva nova — definir API mínima: `{ pressed: boolean, disabled: boolean }`.
- Para casos sem `Clickable` ao redor, `TapState` aceita `pressed?: boolean` controlado (consumidor gerencia).
- Conjuntamente com **RFC-0001** (ref canônico): `Clickable` simplificado pode descartar a sincronização manual de refs.
- Avaliar se o nome `TapState` é o melhor — "tap" tem conotação mobile/touch; em web o equivalente é "press". Sugestão alternativa: `PressedState` ou `PressFeedback`.
