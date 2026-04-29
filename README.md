# arbor-ds

Design system cross-platform modular para React e React Native, sem dependência de bibliotecas de UI prontas. Mantém `foundations`, `ecosystem` e `components` como núcleo do sistema.

## Instalação

```bash
npm install arbor-ds
# ou
pnpm add arbor-ds
```

**Peer dependencies:**

```bash
npm install react react-dom
# Para React Native:
npm install react-native react-native-web
```

## Matriz de suporte

| Versão | React | React Native | iOS | Android | Node |
|---|---|---|---|---|---|
| 1.x | 18+ / 19 | 0.74+ | 15+ | API 24+ | 18+ |

## Estrutura do repositório

```
arbor-ds/
├── src/               # Código da biblioteca (publicado)
│   ├── foundations/   # Tokens, temas e escalas visuais
│   ├── ecosystem/     # Styled system, provider, hooks e utils
│   └── components/    # Componentes UI reutilizáveis
├── playground/        # Aplicação demo (não faz parte do pacote publicado)
│   ├── src/           # Código do playground (consome a lib via imports relativos)
│   ├── App.tsx        # Entry Expo (mobile)
│   ├── main.tsx       # Entry web (Vite)
│   └── package.json   # Dependências isoladas do demo
├── docs/              # Decisões arquiteturais e plano de fases
└── scripts/           # Utilitários de tooling
```

## Arquitetura

### Foundations

- `tokens`: escalas primitivas e semanticas de cor, espaco, tipografia, bordas, opacidade e z-index.
- `theme`: `themeLight`, `themeDark` e `createTheme` para extensao por produto.

### Ecosystem

- `styled-system`: `ArborProvider`, `ArborTransform`, hooks e engine de props tipadas.
- `utils`: utilitarios internos usados pela camada de renderizacao e componentes.

### Components

- `core`: primitives de layout e estrutura como `Box`, `Flex`, `Grid`, `Container`, `Text` e afins.
- `input`, `button`, `checkbox`, `radio`, `tag`, `tabs`, `modal`, `drawer`, `tooltip`: componentes base reaproveitaveis.

## Como rodar o playground

```bash
pnpm dev
```

O playground abre em `http://localhost:5173` e demonstra:

- foundations e semantic tokens
- `ArborProvider` + `ArborTransform`
- componentes base e overlays
- troca de tema entre `light`, `spruce` e `dark`

## Como usar o pacote

### Provider e tema

```tsx
import { ArborProvider } from 'arbor-ds/ecosystem';
import { createTheme, themeLight } from 'arbor-ds/foundations';

const theme = createTheme(themeLight, {
  colors: {
    brand: {
      base: '#2F775F',
      strong: '#1F5543',
    },
  },
});

export function App() {
  return <ArborProvider theme={theme}>{/* sua aplicacao */}</ArborProvider>;
}
```

### Componentes

```tsx
import { Box, Button, Text } from 'arbor-ds/components';

export function Hero() {
  return (
    <Box padding="large" borderRadius="large" backgroundColor="surface.raised">
      <Text as="h1" variant="title1">
        Ola, Arbor
      </Text>
      <Text as="p" variant="body">
        Tokens e componentes base aplicados em uma unica camada.
      </Text>
      <Button>Comecar</Button>
    </Box>
  );
}
```

### ArborTransform

```tsx
import { ArborTransform } from 'arbor-ds/ecosystem';

export function Badge({ label }: { label: string }) {
  return (
    <ArborTransform
      as="span"
      display="inline-flex"
      alignItems="center"
      padding="tiny"
      borderRadius="full"
      backgroundColor="brand.subtle"
      color="text.primary"
    >
      {label}
    </ArborTransform>
  );
}
```

## API principal

| Entrypoint | Conteúdo |
|---|---|
| `arbor-ds` | Componentes (default) |
| `arbor-ds/foundations` | Tokens, temas, `createTheme` |
| `arbor-ds/ecosystem` | `ArborProvider`, `ArborTransform`, hooks |
| `arbor-ds/native` | Exports para React Native |

## Contribuindo

Veja [CONTRIBUTING.md](./CONTRIBUTING.md) para setup, convenções de commit, fluxo de PR e Definition of Done.
