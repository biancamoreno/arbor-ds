# RFC-0010 — Discriminated union `decorative` + `aria-label` em `Icon`

**Status**: Draft
**Autores**: Arquiteto Arbor-DS
**Data**: 2026-04-24
**Origem**: R3 · achado em `icon.md`
**PR**: —

---

## Motivação

`IconProps` declara hoje:

```ts
interface IconProps {
  decorative?: boolean;          // default true → aria-hidden
  'aria-label'?: string;
  // ...
}
```

A combinação `decorative={false}` (ícone semântico) **sem `aria-label`** é **válida em TypeScript**. O componente emite `console.warn` em dev, mas o erro só aparece em runtime — e em produção, **nada acontece**: o ícone é anunciado pelo screen reader como vazio ou ignorado, sem feedback ao desenvolvedor.

Para um primitivo usado em **10+ componentes** do DS (Alert, Button, Toast, Tooltip, Dialog, NavBar, TabBar, Chip, Accordion, Spinner), esse buraco de a11y se replica em toda a árvore.

## Proposta

Modelar `IconProps` como **discriminated union** que força `aria-label` quando o ícone não é decorativo.

```ts
type IconBaseProps = {
  name: IconName;
  size?: IconSize | number;
  color?: string;
  strokeWidth?: number;
  style?: CSSProperties;
};

type IconDecorativeProps = IconBaseProps & {
  decorative: true;
  'aria-label'?: never;          // ❌ proibido se decorativo
};

type IconSemanticProps = IconBaseProps & {
  decorative: false;
  'aria-label': string;          // ✅ obrigatório se semântico
};

type IconDefaultProps = IconBaseProps & {
  decorative?: undefined;        // omitido = default decorative=true
  'aria-label'?: never;
};

export type IconProps = IconDecorativeProps | IconSemanticProps | IconDefaultProps;
```

Comportamento:

```tsx
<Icon name="check" />                                  // ✅ decorativo (default)
<Icon name="check" decorative />                       // ✅ explicitamente decorativo
<Icon name="check" decorative={false} aria-label="Sucesso" />  // ✅ semântico
<Icon name="check" decorative={false} />               // ❌ erro de TypeScript
<Icon name="check" aria-label="Sucesso" />             // ❌ erro (label sem decorative=false)
```

Erros agora aparecem **em compile-time** — não em runtime, não em produção.

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| Manter warn de runtime | Não pega em produção; build passa silencioso. |
| Tornar `aria-label` sempre obrigatório | Polui chamadas de ícones decorativos (que são maioria). |
| Aceitar `aria-label=""` para decorativos | Hack; quebra autocomplete; não evita o erro semântico. |
| Adicionar test runtime via `@axe-core/react` | Útil em paralelo, mas não substitui validação de tipo. |

## Impactos e trade-offs

- **Breaking change?** Tecnicamente sim — código que escrevia `decorative={false}` sem label deixa de compilar. Em runtime, **comportamento já estava errado**, então quem migra está corrigindo bug, não regredindo.
- **Impacto em bundle size**: zero.
- **Impacto em performance**: zero.
- **Impacto em DX**: melhora — TypeScript é o linter de a11y.
- **Impacto em acessibilidade**: melhora significativa — bug silencioso vira erro de build.
- **Codemod necessário?** Não, mas script de detecção pode mostrar onde adicionar `aria-label` antes da migração.

## Critérios de aceite

- [ ] `IconProps` modelado como discriminated union
- [ ] `console.warn` de runtime removido (substituído por erro de tipo)
- [ ] Todos os consumidores internos passam `aria-label` quando `decorative={false}`
- [ ] Documentação no JSDoc de `IconProps` explicando o contrato
- [ ] Stories cobrem: ícone decorativo (sem label), ícone semântico (com label), erro intencional (em comentário, com `@ts-expect-error`)
- [ ] Teste de tipo cobrindo combinações inválidas

## Notas de implementação

- Implementar **conjuntamente com RFC-0009** (tamanhos semânticos) — ambas mexem em `IconProps`, mesmo PR consolida.
- `aria-label` em React TypeScript é case-sensitive (`'aria-label'`, não `ariaLabel`). Manter consistente com convenção web.
- Considerar adicionar `aria-labelledby?: string` como alternativa (ícone aponta para label externo). Avaliar se vale a pena agora ou se aguarda demanda.
- A union pode ficar verbosa para outros componentes que estendem `IconProps` — exportar `IconDecorativeProps`, `IconSemanticProps`, `IconDefaultProps` separadamente para permitir composição.
- Verificar se a union infere corretamente em React.forwardRef — pode haver edge case com generics.
