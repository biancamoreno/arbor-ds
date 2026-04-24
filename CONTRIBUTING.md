# Contributing to Arbor DS

## Setup

```bash
git clone https://github.com/<org>/arbor-ds
cd arbor-ds
pnpm install
pnpm dev        # playground em http://localhost:5173
pnpm storybook  # docs em http://localhost:6006
```

## Fluxo de PR

1. Crie uma branch a partir de `main`.
2. Faça as alterações e adicione testes.
3. Crie um changeset descrevendo o impacto:
   ```bash
   pnpm changeset
   ```
4. Abra o PR para `main`.
5. O CI deve passar: lint, typecheck, testes, build, size-limit.
6. Após merge, o bot de release abrirá um PR de versão automaticamente.

## Convenções de commit

Este repositório usa [Conventional Commits](https://www.conventionalcommits.org/).

| Prefixo | Quando usar |
|---|---|
| `feat:` | Nova feature sem quebrar API existente |
| `fix:` | Correção de bug |
| `feat!:` / `fix!:` | Breaking change (requer RFC aceito) |
| `refactor:` | Refatoração interna sem mudança de comportamento |
| `docs:` | Documentação, stories, MDX |
| `test:` | Testes unitários, comportamentais, a11y |
| `chore:` | Tooling, CI, dependências, build |
| `perf:` | Melhoria de performance |
| `style:` | Formatação, tokens visuais sem lógica |

O `commit-msg` hook valida o formato automaticamente via commitlint.

## Como criar um changeset

```bash
pnpm changeset
```

Siga as instruções interativas:
- Selecione o pacote `arbor-ds`.
- Escolha o nível: `patch` (bug fix), `minor` (nova feature), `major` (breaking change).
- Escreva um resumo em uma linha do que mudou.

O arquivo gerado em `.changeset/` deve ser commitado junto com as alterações.

## Fluxo de release

1. PRs são mergeados para `main`.
2. O `changesets/action` acumula changesets e abre um PR de release automaticamente.
3. O time faz review e faz merge do PR de release.
4. O CI executa `pnpm changeset publish` → publica no npm + cria tag no GitHub.

## Definition of Done (por componente)

Para um componente ser considerado estável e mergeável:

- [ ] Props tipadas sem `any` sem justificativa.
- [ ] Recipe em `theme.components` (se aplicável).
- [ ] Implementação `.native.tsx` (se classificado como `shared`).
- [ ] Tag `@platform` documentada nos tipos (`web`, `native`, `shared`).
- [ ] ≥ 15 testes cobrindo comportamento e acessibilidade.
- [ ] Zero violations críticas de `axe`.
- [ ] Story no Storybook com `autodocs` habilitado.
- [ ] MDX com uso correto, uso incorreto, props table e notas de a11y.
- [ ] Changeset criado se a API pública foi modificada.

## Convenções de implementação

Padrões consolidados nas reviews R1–R3 (2026-04-24). Aplicáveis a todo componente novo ou refatoração.

### 1. Invariantes por último

Em primitives com contrato semântico (Center, Square, Circle, Flex, Grid etc.), as props que o componente **garante** (invariantes) vão **depois** do spread de `{...props}`, para impedir que o consumidor sobrescreva o contrato:

```tsx
// ✅ Correto — invariantes ganham
<ArborTransform {...props} display="flex" alignItems="center" />

// ❌ Errado — consumidor pode quebrar o contrato
<ArborTransform display="flex" alignItems="center" {...props} />
```

### 2. `Omit` das props que o componente controla

Quando uma prop é invariante, `Omit<ArborTransformProps, 'alignItems'>` na interface complementa a blindagem em compile-time:

```tsx
// CenterProps explicitamente omite props que Center controla
export type CenterProps = Omit<ArborTransformProps, 'display' | 'alignItems' | 'justifyContent'>;
```

### 3. `displayName` obrigatório

Todo componente público deve definir `displayName` — incluindo os sem `forwardRef`. Importante para React DevTools, mensagens de erro e snapshots.

```tsx
export const Box = forwardRef<HTMLElement, BoxProps>(function Box(...) { ... });
Box.displayName = 'Box';
```

### 4. `.native.tsx` só quando há divergência real

Primitives que delegam ao `ArborTransform` **não precisam** de `.native.tsx` — o `ArborTransform` já resolve por plataforma via `styled-component.ts` (web) e `styled-component.native.ts` (native). Crie `.native.tsx` apenas quando a implementação **realmente diverge** (ex: `Image` usa `<img>` na web e `<RNImage>` na native).

### 5. Stories usam apenas componentes do DS

Sem `<div>`, `<span>`, `<button>` crus em stories. Sem `style={{...}}` quando há prop declarativa equivalente.

```tsx
// ❌ Errado
<div style={{ display: 'flex', gap: '8px' }}>
  <span style={{ color: 'red' }}>label</span>
</div>

// ✅ Correto
<Flex gap="8px">
  <Text as="span" color="red">label</Text>
</Flex>
```

Escape hatch via `style={{...}}` é aceitável apenas para CSS sem prop equivalente (`outline`, `gridTemplateColumns`, `wordBreak`, `backdropFilter` etc.).

### 6. Componentes `platform-split` têm warning de dev para limitações

Componentes com implementações `.tsx` e `.native.tsx` divergentes devem alertar em modo dev sobre props que não funcionam em alguma plataforma:

```tsx
if (process.env.NODE_ENV !== 'production') {
  if (color === 'currentColor' && Platform.OS !== 'web') {
    console.warn('[Icon] color="currentColor" não é suportado em React Native.');
  }
}
```

Exemplos: `Icon.native` para `currentColor`, `Clickable` para `as !== 'button'/'a'` sem `role`.

## RFCs

Mudanças que afetam API pública, breaking changes ou decisões arquiteturais relevantes requerem RFC.

Crie um arquivo em `docs/rfcs/` usando o template `RFC-0000-template.md`.

O RFC precisa ser aceito antes de iniciar a implementação.

## Política de depreciação

- Breaking changes requerem RFC aceito.
- API depreciada permanece por 2 minor versions com JSDoc `@deprecated`.
- Breaking changes de API pública requerem codemod para facilitar a migração.

## Scripts úteis

```bash
pnpm test               # Todos os testes
pnpm lint               # ESLint
pnpm typecheck          # TypeScript
pnpm build:lib          # Build da biblioteca
pnpm size               # Verificar budget de bundle
pnpm storybook          # Docs interativa
pnpm tokens:validate    # Validar tokens
pnpm depcheck           # Verificar fronteiras de dependência
```
