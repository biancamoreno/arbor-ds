# Como testar o Arbor DS

## Testes unitários (Jest)

Execute todos os testes:

```bash
pnpm test
```

Execute um arquivo específico:

```bash
pnpm test src/ecosystem/styled-system/core/transform/new-transform/create-style
```

---

## Testar na Web

### Opção 1: Vite (recomendado para web)

```bash
pnpm dev
```

Abre o playground em `http://localhost:5173` com os componentes renderizados em HTML (DOM).

### Opção 2: Expo Web (react-native-web)

```bash
pnpm start:web
```

Abre o app Expo em modo web usando react-native-web. Útil para validar o mesmo código em ambos os ambientes.

---

## Testar no Mobile (iOS/Android)

### Pré-requisitos

- **iOS**: Mac com Xcode
- **Android**: Android Studio e emulador configurado
- [Expo Go](https://expo.dev/go) no celular (opcional, para teste em dispositivo físico)

### Executar

```bash
pnpm start
```

No terminal do Expo:

- Pressione `i` para abrir no simulador iOS
- Pressione `a` para abrir no emulador Android
- Escaneie o QR code com o app Expo Go para testar no celular

---

## Exportar Web para produção

```bash
pnpm export:web
```

Gera os arquivos estáticos em `dist/` para deploy.

---

## Resumo dos comandos

| Comando        | Descrição                    |
|----------------|------------------------------|
| `pnpm test`    | Testes unitários (Jest)      |
| `pnpm dev`     | Web com Vite                 |
| `pnpm start`   | App Expo (mobile)            |
| `pnpm start:web` | Web via Expo (react-native-web) |
| `pnpm export:web` | Build web para produção  |
