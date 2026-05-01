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

### 4. Cross-platform por definição — sem `web-only`

**Todo componente público do Arbor-DS funciona em web, iOS e Android.** A tag `@platform web-only` é classificação **inválida** (RFC-0018) — sua presença em qualquer arquivo do `src/` é um bug a corrigir.

Os dois únicos níveis válidos:

| Tag | Significado | Quando usar |
|---|---|---|
| `@platform shared` | Mesma implementação `.tsx` em web e native; delega a `ArborTransform` ou primitives shared. | Box, Flex, Center, Card, Badge, etc. |
| `@platform native-ready` | Implementação dedicada `.native.tsx` por divergência arquitetural ou uso de APIs RN-only. | Text, Image, Field, Checkbox, Switch, Select (após onda 3 da RFC-0018), etc. |

Primitives que delegam 100% ao `ArborTransform` **não precisam** de `.native.tsx` — o engine já resolve por plataforma via `styled-component.ts` (web) e `styled-component.native.ts` (native). Crie `.native.tsx` apenas quando a implementação **realmente diverge** (ex: Field usa `<label>+<input>` na web e `<Pressable>+accessibilityRole` na native).

> **Em migração:** 12 componentes ainda estão em `web-only` ([TD-017](docs/TECH_DEBT.md#td-017)). Pull requests novos não podem introduzir mais. Componentes existentes serão migrados em ondas via [RFC-0018](docs/rfcs/RFC-0018-paridade-native-completa-do-ds.md).

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

### 7. Naming de props e eventos

**Props booleanas (RFC-0013):** API pública usa nomes alinhados com HTML/ARIA, **sem prefixo `is`**.

```tsx
// ✅ Correto
<Field disabled required invalid />
<Dialog open onOpenChange={…} />
<Checkbox checked indeterminate />

// ❌ Errado
<Field isDisabled isRequired isInvalid />
<Dialog isOpen />
```

Variáveis derivadas locais dentro do componente podem usar `is*` para legibilidade (`const isInteractive = !disabled && !readOnly`).

**Eventos de mudança de estado controlado (RFC-0015):** usar `on{Verbo}Change` com assinatura **value-only**.

```tsx
// ✅ Correto — nome explícito + assinatura value-only
onCheckedChange?: (checked: boolean) => void;
onValueChange?: (value: T) => void;
onOpenChange?: (open: boolean) => void;

// ❌ Errado — onChange ambíguo (conflita com onChange HTML)
onChange?: (checked: boolean) => void;

// ❌ Errado — assinatura estendida (consumidor já tem `value` no escopo do JSX)
onCheckedChange?: (checked: boolean, value: string) => void;
```

**Exceção legítima:** componentes que envolvem `<input>`/`<textarea>` podem aceitar `onChange` HTML adicional **com semântica preservada** (`(e: ChangeEvent) => void`). Não redefinir o significado de `onChange`.

**Eventos pontuais (não-Change):** seguem `on{Verbo}` simples — `onSubmit`, `onClose`, `onSelect`. `Change` é reservado para par `value`/`onValueChange`.

### 8. Foco visível em componentes com input oculto (WCAG 2.4.7)

Componentes que escondem o `<input>` real (`position:absolute; opacity:0; pointerEvents:none`) e desenham um controle visual próprio (Radio, Switch, Counter, etc.) **devem refletir o `:focus-visible` do input no controle desenhado**. Sem isso, o usuário com teclado não enxerga onde está e o formulário viola WCAG 2.4.7 (AA).

Padrão técnico DS:

```tsx
// No slot do wrapper que contém o input + visual:
_focusVisibleWithin: {
  outline: '2px solid',
  outlineColor: 'interactive.default',
  outlineOffset: '2px',
}

// Quando o input já é visível (ex: Checkbox.Indicator usa <Box as="input">):
_focusVisible: {
  outline: '2px solid',
  outlineColor: 'interactive.default',
  outlineOffset: '2px',
}
```

`_focusVisibleWithin` resolve para `&:has(:focus-visible)` — reage só ao foco por teclado, suportado em todos os navegadores modernos. O wrapper deve ter `borderRadius` apropriado para o anel acompanhar a forma do controle. Cada componente novo desse padrão precisa de **1 teste assertivo** verificando a regra de outline no stylesheet gerado.

### 9. Touch target ≥ 44×44 (WCAG 2.5.5)

Todo elemento interativo (botão, trigger, item de lista, ícone clicável, input) **deve ter área de toque mínima de 44×44 CSS pixels** em qualquer size do componente. Sem exceção. Aplica para web e native.

**Caminho preferido — bumpar `minHeight` na recipe:**

```ts
// Em base-theme.ts
size: {
  sm: { control: { minHeight: '44px' } },  // não menos que 44
  md: { control: { minHeight: '44px' } },
  lg: { control: { minHeight: '48px' } },
}
```

**Quando o visual precisa ser menor que 44 (ex: Counter compacto, Switch),** preserve o visual e expanda apenas a área de toque com overlay invisível via `_before`:

```tsx
<Clickable
  position="relative"
  _before={{
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '44px',
    minHeight: '44px',
  }}
  style={{ width: 24, height: 24 /* visual compacto */ }}
>
  …
</Clickable>
```

O `::before` herda os event handlers do parent — clicar no overlay dispara `onClick` do botão. **Cada componente novo interativo precisa de teste assertivo** verificando `min-height >= 44` (no slot via recipe) ou regra `::before{min-width:44px;min-height:44px}` (no overlay).

## RFCs

Mudanças que afetam API pública, breaking changes ou decisões arquiteturais relevantes requerem RFC.

Crie um arquivo em `docs/rfcs/` usando o template `RFC-0000-template.md`.

O RFC precisa ser aceito antes de iniciar a implementação.

## Política de depreciação

- Breaking changes requerem RFC aceito.
- API depreciada permanece por 2 minor versions com JSDoc `@deprecated`.
- Breaking changes de API pública requerem codemod para facilitar a migração.

## Testes cross-platform

A suite Jest roda dois projects (RFC-0016): `web` (jsdom + RNW alias) e `native` (jest-expo + RN). `pnpm test` executa ambos. Detalhes em [`docs/TESTING.md`](docs/TESTING.md).

### Convenção de naming

- `*.test.tsx` — teste **web**. Roda em jsdom.
- `*.native.test.tsx` — teste **native**. Roda em jest-expo. O resolver pega `.native.tsx` automaticamente quando o teste importa o componente.

Não use `*.web.test.tsx` — web é o default; assimetria reflete a plataforma majoritária.

### Onde testar

| Característica do componente | Web | Native |
|---|---|---|
| Re-render só de estilo (delega 100% para `ArborTransform`) | Suficiente | Opcional |
| Lógica RN-específica (gestos, animação, `Pressable`, `accessibilityRole`/`accessibilityState`) | Recomendado | **Obrigatório** |
| Compound Field-aware com a11y (`Field`, `Checkbox`, `Switch`, `Radio`, `Select`) | **Obrigatório** | **Obrigatório** — paridade de contrato |
| Divergência arquitetural deliberada (ex.: hardcode em `fab.native.tsx` até TD-004) | n/a | **Obrigatório** — trava a divergência |

`scripts/check-platform-contract.js` falha o build quando um arquivo `.native.tsx` existe sem `.native.test.tsx` irmão. Adicionar `.native.tsx` sem teste não passa em CI.

### Princípios de redação

- **Comportamentais, não snapshot.** Visual regression em RN é problema de Storybook native, fora do escopo do unit.
- **Asserções por intenção pública** (`getByLabelText`, `getByRole`, `accessibilityState`), não por implementação interna.
- **Sem mocks de styled-system.** Se o teste falhar porque o styled-system mudou, é exatamente isso que a suite native quer detectar.

## FileUpload em RN — caminhos recomendados

Por decisão arquitetural ([RFC-0026](docs/rfcs/RFC-0026-fileupload-caso-fronteira.md)), `FileUpload.native` é um **placeholder visualmente paritário** com o web em estado idle: renderiza a drop zone dashed, **não captura toque** e não abre picker. O bloco de preview (`previewUrl` + `onRemove`) funciona normalmente em ambas as plataformas.

A escolha de lib de captura fica por conta do produto consumidor, porque "upload de arquivo" em mobile raramente é um picker genérico — é câmera, galeria, scanner ou áudio gravado. Cada caso usa lib diferente. O slot `children` permite injetar a integração preferida sem perder o frame visual da drop zone.

### Decidindo a lib

| Caso de uso | Lib recomendada | Notas |
|---|---|---|
| Documento genérico (PDF, planilha, .zip) | `expo-document-picker` | Cobre Android/iOS; suporta `multiple`, `type` MIME. |
| Foto da galeria + foto via câmera | `expo-image-picker` | API única para `launchImageLibraryAsync` e `launchCameraAsync`. Default para fluxos de avatar/perfil. |
| Captura ao vivo de câmera (preview embedded, scanner, KYC) | `expo-camera` | Quando o produto precisa de viewfinder dentro do app, não dialog do sistema. |
| Gravação de áudio | `expo-av` | Para upload de voz; combinar com UI custom de waveform/timer. |
| Bare RN (sem Expo) | `react-native-document-picker` ou `react-native-image-picker` | Comunidade mantida; setup nativo (`pod install`/`gradle sync`). |

A maturidade do ecossistema Expo torna `expo-*` a escolha default em 2026; o DS não bloqueia nenhuma das alternativas.

### Snippet — integração via `children` (Expo, document picker)

```tsx
import * as DocumentPicker from 'expo-document-picker';
import { FileUpload, Clickable, Icon, Text } from 'arbor-ds/native';

function ProfileDocumentUpload({ onPick }: { onPick: (uri: string) => void }) {
  const handlePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
    if (!result.canceled) onPick(result.assets[0].uri);
  };

  return (
    <FileUpload>
      <Clickable
        onClick={handlePick}
        accessibilityRole="button"
        accessibilityLabel="Selecionar documento"
        flexDirection="column"
        alignItems="center"
        gap="micro"
      >
        <Icon name="Upload" size="xl" color="text.secondary" decorative />
        <Text fontSize="small" fontWeight="semibold" color="text.primary">
          Toque para selecionar um documento
        </Text>
      </Clickable>
    </FileUpload>
  );
}
```

O `FileUpload` envelope mantém o frame visual paritário (border dashed, padding, background). O `children` é um `Clickable` que dispara o picker e é o único elemento interativo — o frame em si não captura toque (por design do placeholder).

### Snippet — preview controlado pelo consumidor

`previewUrl` + `onRemove` funcionam idênticos web↔native. Após o upload concluir, o consumidor passa a URI:

```tsx
const [uri, setUri] = useState<string | undefined>();

return (
  <FileUpload
    previewUrl={uri}
    onRemove={() => setUri(undefined)}
  >
    {/* drop zone customizada (idle) */}
  </FileUpload>
);
```

### Quando esperar implementação real native

[TD-025](docs/TECH_DEBT.md#td-025) registra a porta de saída para o caminho **(a)** com peer dep `expo-document-picker`. Gatilho mensurável: 3+ produtos consumidores documentando necessidade real em < 6 meses, OU 1 caso de produto crítico (KYC, autenticação regulamentada). Sem o gatilho, o placeholder é a decisão arquitetural correta.

## Scripts úteis

```bash
pnpm test                       # Todos os testes (web + native)
pnpm test -- --selectProjects web    # Só suite web
pnpm test -- --selectProjects native # Só suite native
pnpm lint                       # ESLint
pnpm typecheck                  # TypeScript
pnpm build:lib                  # Build da biblioteca
pnpm size                       # Verificar budget de bundle
pnpm storybook                  # Docs interativa
pnpm tokens:validate            # Validar tokens
pnpm depcheck                   # Verificar fronteiras de dependência
pnpm test:platform-contract     # Paridade .tsx ↔ .native.tsx ↔ .native.test.tsx
```
