# RFC-0009 — Tamanhos semânticos para `Icon.size`

**Status**: Implemented
**Autores**: Arquiteto Arbor-DS
**Data**: 2026-04-24
**Aceita em**: 2026-04-24
**Implementada em**: 2026-04-24 (junto com RFC-0010)
**Origem**: R3 · achado em `icon.md`
**PR**: —

---

## Motivação

`Icon.size` aceita `number | string` — valores brutos. Componentes downstream passam `size={16}`, `size={20}`, `size={24}` espalhados em toda a base de código.

Problemas:

- **Sem governança visual.** Não há forma de dizer "ícone padrão", "ícone pequeno", "ícone hero" — só números.
- **Mudança de escala é manual.** Se o DS decide que ícones default passam de 20px para 18px, **todos os call sites** precisam ser atualizados manualmente.
- **Inconsistência cumulativa.** `Button` usa 16, `Alert` usa 20, `Toast` usa 18 — sem padrão visível.
- **Falta paridade com outros tokens do DS.** `Text` usa `variant="body"`, `Badge` usa `size="md"`, `Spacing` usa `medium`. Apenas `Icon` ficou de fora.

## Proposta

Introduzir union semântico `IconSize`:

```ts
type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero';

// Mapeamento (em token de tema)
const iconSize = {
  xs: 12,
  sm: 16,
  md: 20,    // default
  lg: 24,
  xl: 32,
  hero: 48,
};
```

API:

```tsx
type IconProps = {
  name: IconName;
  size?: IconSize | number;  // semântico OU bruto (escape hatch)
  // ... resto permanece
};

<Icon name="check" size="md" />        // ✅ semântico
<Icon name="check" size="hero" />      // ✅ semântico
<Icon name="check" size={14} />        // ✅ escape hatch (uso raro)
```

`size?: IconSize | number` mantém escape hatch numérico para casos onde semântico não basta (ex: ícone de avatar ajustado a 22px). Para esses, exigir comentário inline com justificativa via lint rule (futura).

Tokens vivem em `src/foundations/tokens/components/icon.ts` e são consumidos por `useToken('iconSize.md')` ou via `theme.iconSize`.

Componentes atuais passando números migram para tokens semânticos:

| Atual | Depois |
|---|---|
| `<Icon size={12}>` | `<Icon size="xs">` |
| `<Icon size={16}>` | `<Icon size="sm">` |
| `<Icon size={20}>` | `<Icon size="md">` |
| `<Icon size={24}>` | `<Icon size="lg">` |
| `<Icon size={32}>` | `<Icon size="xl">` |
| `<Icon size={48}>` | `<Icon size="hero">` |

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| Manter número bruto + documentar valores recomendados | Sem força mecânica; convenção decai com o tempo. |
| Usar `'small' \| 'medium' \| 'large'` em vez de t-shirts | Inconsistente com R1-C2 (que prefere t-shirts no DS). |
| Reusar `fontSize` semantic | Ícone não é texto; semântica diferente; acoplaria mudanças. |
| Ramp aberta (`'1' \| '2' \| ... \| '8'`) | Sem semântica; tão opaco quanto número bruto. |

## Impactos e trade-offs

- **Breaking change?** Sim no tipo (mas `number` continua aceito como escape hatch — ninguém quebra em runtime).
- **Impacto em bundle size**: zero.
- **Impacto em performance**: zero.
- **Impacto em DX**: melhora — autocomplete sugere tamanhos canônicos; visual consistente.
- **Impacto em acessibilidade**: leve melhora — tamanhos semânticos podem garantir mínimo de 16px (WCAG sugere) por convenção.
- **Codemod necessário?** Sim — converte números conhecidos para tokens.

## Critérios de aceite

- [ ] `IconSize` definido como union em `IconProps.ts`
- [ ] Token `iconSize` criado em `src/foundations/tokens/components/icon.ts`
- [ ] `Icon` web e native resolvem token semântico para número
- [ ] Todos os consumidores internos migrados (Button, Alert, Toast, Chip, Spinner, NavBar, TabBar, Dialog, Tooltip, Accordion)
- [ ] Story `SizeVariants` atualizada para usar tokens
- [ ] Codemod publicado
- [ ] Migration guide com tabela de mapeamento

## Notas de implementação

- O escape hatch `number` deve permanecer — há casos raros (ex: tamanho computado dinamicamente). Não tornar exclusivamente semântico.
- Considerar conjuntamente com **RFC-0010** (discriminated union de `decorative`) — ambas tocam `IconProps` e podem ser implementadas no mesmo PR para consolidar mudanças.
- Avaliar se `size="hero"` é nome correto ou se `2xl` cabe melhor (alinha com fontSize que tem `2xl`).
- Token `iconSize` pode ser exposto também via `useToken('iconSize.md')` para consumo externo (ex: ajustar layout em torno do ícone).
