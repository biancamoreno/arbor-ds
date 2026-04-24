# Débito técnico — Arbor-DS

> Registro formal de dívidas técnicas conhecidas. Toda dívida criada deliberadamente (decisão de adiar) deve entrar aqui — dívida não registrada vira surpresa futura.
>
> **Atualizar quando:** criar dívida (com `Status: Open`), fechar dívida (`Resolved` + data), ou descobrir que dívida está obsoleta (`Obsolete` + razão).

**Última atualização:** 2026-04-24

---

## Visão geral

| ID | Título | Origem | Status | Impacto | Plano |
|---|---|---|---|---|---|
| [TD-001](#td-001) | Cast `props.innerRef as Ref<HTMLElement>` em primitives | RFC-0001 | Open | Cosmético (compile-time) | Resolver junto com depreciação de `innerRef` (TD-002) ou em RFC de tipagem do engine |
| [TD-002](#td-002) | `innerRef` legado sem warning de depreciação | RFC-0001 | Open | DX (consumidores não sabem que API mudou) | RFC dedicada definindo timeline + warning de runtime |
| [TD-003](#td-003) | `useClickableContext` adiado | RFC-0008 | Open | Funcional (cobre só `:active` puro, não `pressed` controlado) | RFC quando surgir 1º consumidor real (Card hoverable, Chip selecionável) |

**Total:** 3 dívidas abertas, 0 resolvidas.

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
