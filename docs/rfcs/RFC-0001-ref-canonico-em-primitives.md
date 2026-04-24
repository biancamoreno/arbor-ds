# RFC-0001 — `ref` canônico em primitives (substituir `innerRef`)

**Status**: Implemented
**Autores**: Arquiteto Arbor-DS
**Data**: 2026-04-24
**Aceita em**: 2026-04-24
**Implementada em**: 2026-04-24
**Origem**: R2 · achado H-R2-1
**PR**: —

---

## Motivação

Os 9 primitives de layout (`Box`, `Flex`, `Grid`, `Container`, `Center`, `Square`, `Circle`, `Spacer`, `Empty`) **não usam `forwardRef`**. Quem precisa de `ref` ao DOM passa a prop ad-hoc `innerRef`, exposta pelo `ArborTransform`.

Consequências:

- Diverge da convenção React/comunidade (`ref` é a API canônica).
- Bibliotecas externas que esperam `ref` (Floating UI, Framer Motion, libs de scroll, autoFocus de formulário) não funcionam sem wrapper.
- React DevTools mostra `Memo(BoxComponent)` em vez de `Box`.
- O padrão `innerRef` se propaga: `Clickable` (R3) **reconstroi internamente** a sincronização entre `ref` externo e `innerRef` interno (`clickable.tsx:6-22`). Toda nova abstração que precise de ref interno **e** externo replica o mesmo boilerplate.

Impacto sistêmico: 9 primitives + N componentes downstream que dependem deles.

## Proposta

Migrar os 9 primitives para `forwardRef<Element, Props>` canônico. Manter `innerRef` aceito por **uma versão major** com `console.warn` de depreciação.

```tsx
// Antes
function BoxComponent<T extends object>(props: BoxProps<T>) {
  return <ArborTransform {...props} />;
}

// Depois
const BoxComponent = forwardRef<HTMLElement, BoxProps>((props, ref) => {
  return <ArborTransform {...props} innerRef={ref} />;
});
BoxComponent.displayName = 'Box';
```

Internamente o `ArborTransform` continua usando `innerRef` — apenas o **contrato público** muda. Nenhum primitive expõe mais `innerRef` na sua tipagem.

`Clickable` deixa de fazer sincronização manual: passa `ref` direto para `Flex`, que repassa para `ArborTransform`.

`Empty` é exceção (renderiza `null`) — não recebe `forwardRef`. (Ver RFC-0005 sobre destino do `Empty`.)

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| Aceitar `innerRef` como API oficial do DS | Diverge da convenção React; quebra integração com libs externas que injetam `ref`. |
| Migrar `ArborTransform` para `forwardRef` direto | Mais arriscado (engine de baixo nível); RFC separada se houver demanda. |
| Codemod opcional | Sem codemod, migração de consumidores fica manual e propensa a erro silencioso. |

## Impactos e trade-offs

- **Breaking change?** Sim, mas com período de coexistência: `innerRef` continua funcionando e emite `console.warn` por uma major. Removido na seguinte.
- **Impacto em bundle size**: desprezível (`forwardRef` é primitiva React, sem custo de runtime).
- **Impacto em performance**: nenhum.
- **Impacto em DX**: melhora — autocomplete de `ref`, integração natural com libs externas, DevTools com nomes corretos.
- **Impacto em acessibilidade**: viabiliza padrões de focus management hoje custosos (`label.htmlFor` com scroll para erro, `useImperativeHandle` em formulários compostos).
- **Codemod necessário?** Sim — `innerRef={x}` → `ref={x}`. Trivial via jscodeshift.

## Critérios de aceite

- [ ] Os 9 primitives (exceto `Empty`) usam `forwardRef` canônico
- [ ] `displayName` definido em todos
- [ ] `innerRef` ainda funciona com warning de depreciação
- [ ] Codemod publicado em `tools/codemods/`
- [ ] Migration guide em `docs/migration/`
- [ ] `Clickable` simplificado (remove sincronização manual de refs)
- [ ] Testes adicionados garantindo que `ref` recebe o elemento DOM correto

## Notas de implementação

- Ordem: começar por `Box` (mais consumido) e `Flex` (composto por outros). `Container`, `Center`, `Square`, `Circle` herdam o padrão.
- `Spacer` é o único candidato a `forwardRef` mas sem caso de uso óbvio — manter para uniformidade.
- Considerar extrair um hook `useComposedRef(externalRef, internalRef)` em `src/ecosystem/utils/` para casos como `Clickable` que ainda precisem de ref interno+externo (TapState).
- Avaliar conjuntamente com **RFC-0002** (genéricos): se removidos, a assinatura de `forwardRef` simplifica.
