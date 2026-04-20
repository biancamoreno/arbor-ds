# Matriz de Suporte por Plataforma

Esta tabela declara o suporte oficial de cada componente do Arbor-DS por plataforma.

## Legenda

| Símbolo | Significado |
|---|---|
| ✅ | Suportado e verificado |
| ⚠️ | Suportado parcialmente ou com ressalvas |
| ❌ | Não suportado — requer implementação dedicada |
| 🚧 | Placeholder — sem implementação |

## Classificações

| Classificação | Descrição |
|---|---|
| `shared` | Funciona em web e React Native via ArborTransform. Sem `.native.tsx` dedicado — plataforma resolvida internamente. |
| `native-ready` | Tem implementação dedicada (`.native.tsx`) verificada para React Native, iOS e Android. |
| `web-only` | Usa APIs DOM exclusivas da web. Não compatível com React Native sem implementação separada. |
| `placeholder` | Pasta/tipo existe mas sem implementação. Não incluso em nenhum entrypoint. |

---

## Core Primitives (`src/components/core/`)

| Componente | Classificação | Web | React Native | iOS | Android | Observação |
|---|---|---|---|---|---|---|
| Box | `shared` | ✅ | ⚠️ | ⚠️ | ⚠️ | `onClick` ignorado em native; use `onPress` |
| Flex | `shared` | ✅ | ⚠️ | ⚠️ | ⚠️ | `onClick` ignorado em native |
| Center | `shared` | ✅ | ⚠️ | ⚠️ | ⚠️ | Centralização via flexbox — funcional em ambas |
| Circle | `shared` | ✅ | ⚠️ | ⚠️ | ⚠️ | Baseado em Square — funcional em ambas |
| Square | `shared` | ✅ | ⚠️ | ⚠️ | ⚠️ | Dimensões fixas via ArborTransform |
| Spacer | `shared` | ✅ | ⚠️ | ⚠️ | ⚠️ | `justifySelf` ignorado em native |
| Container | `shared` | ✅ | ⚠️ | ⚠️ | ⚠️ | `marginInline`/`paddingInline` ignorados em native; use `marginHorizontal` |
| Clickable | `web-only` | ✅ | ❌ | ❌ | ❌ | Usa `button` HTML, `cursor`, `MouseEventHandler` |
| Empty | `shared` | ✅ | ✅ | ✅ | ✅ | Renderiza `null` — sem dependências de plataforma |
| Grid | `native-ready` | ✅ | ✅ | ✅ | ✅ | `.native.tsx` usa flex-wrap como equivalente funcional |
| Image | `native-ready` | ✅ | ✅ | ✅ | ✅ | `.native.tsx` usa `RNImage` do React Native |
| Text | `native-ready` | ✅ | ✅ | ✅ | ✅ | `.native.tsx` sem htmlConverter e truncation web |
| Icon | `placeholder` | 🚧 | 🚧 | 🚧 | 🚧 | Sem implementação |

---

## Componentes de Formulário

| Componente | Classificação | Web | React Native | iOS | Android | Observação |
|---|---|---|---|---|---|---|
| Button | `web-only` | ✅ | ❌ | ❌ | ❌ | Estende `HTMLButtonElement` |
| Checkbox | `web-only` | ✅ | ❌ | ❌ | ❌ | Estende `HTMLInputElement` |
| RadioCard | `web-only` | ✅ | ❌ | ❌ | ❌ | Estende `HTMLInputElement` |
| TextInput | `web-only` | ✅ | ❌ | ❌ | ❌ | Estende `HTMLInputElement` |
| Textarea | `web-only` | ✅ | ❌ | ❌ | ❌ | Estende `HTMLTextAreaElement` |
| Select | `web-only` | ✅ | ❌ | ❌ | ❌ | Usa `<select>` e `<option>` HTML |
| SearchInput | `web-only` | ✅ | ❌ | ❌ | ❌ | Estende TextInput |
| Counter | `web-only` | ✅ | ❌ | ❌ | ❌ | Estende TextInput |
| FileUpload | `web-only` | ✅ | ❌ | ❌ | ❌ | Usa File API do browser |
| Switch | `placeholder` | 🚧 | 🚧 | 🚧 | 🚧 | Sem implementação |

---

## Componentes de Overlay

| Componente | Classificação | Web | React Native | iOS | Android | Observação |
|---|---|---|---|---|---|---|
| Modal | `web-only` | ✅ | ❌ | ❌ | ❌ | Portal DOM, eventos keyboard |
| Drawer | `web-only` | ✅ | ❌ | ❌ | ❌ | Portal DOM, eventos keyboard |
| Tooltip | `web-only` | ✅ | ❌ | ❌ | ❌ | Depende de `hover`/`focus` do DOM |

---

## Componentes de Conteúdo

| Componente | Classificação | Web | React Native | iOS | Android | Observação |
|---|---|---|---|---|---|---|
| Tabs | `web-only` | ✅ | ❌ | ❌ | ❌ | ARIA semântico, keyboard navigation DOM |
| Tag | `web-only` | ✅ | ❌ | ❌ | ❌ | Estende `HTMLButtonElement` |
| Badge | `web-only` | ✅ | ❌ | ❌ | ❌ | Estende `HTMLAttributes<HTMLSpanElement>` |
| Avatar | `placeholder` | 🚧 | 🚧 | 🚧 | 🚧 | Sem implementação |
| Card | `placeholder` | 🚧 | 🚧 | 🚧 | 🚧 | Sem implementação |
| Carousel | `placeholder` | 🚧 | 🚧 | 🚧 | 🚧 | Sem implementação |
| Chip | `placeholder` | 🚧 | 🚧 | 🚧 | 🚧 | Sem implementação |
| ProgressBar | `placeholder` | 🚧 | 🚧 | 🚧 | 🚧 | Sem implementação |

---

## Entrypoints

| Entrypoint | Conteúdo | Para quem |
|---|---|---|
| `arbor-ds` | Todos os componentes (web + shared) | Aplicações web |
| `arbor-ds/native` | Apenas `shared` + `native-ready` | React Native e React Native Web |
| `arbor-ds/foundations` | Tokens, temas, breakpoints | Consumo agnóstico de plataforma |
| `arbor-ds/ecosystem` | Engine, hooks, recipes | Consumo agnóstico de plataforma |

---

## Roadmap de Suporte Native

Componentes prioritários para ganhar implementação `.native.tsx` em fases futuras:

1. **Button** — componente de ação fundamental para qualquer app
2. **Clickable** — primitiva de interação reusada internamente
3. **TextInput / Textarea** — entrada de dados essencial
4. **Checkbox / RadioCard** — formulários
5. **Switch** — toggle state
6. **Tabs** — navegação entre seções

---

## Verificação Automatizada

O script `pnpm test:platform-contract` verifica automaticamente:
- Componentes `native-ready` possuem arquivo `.native.tsx`
- `src/native.ts` não importa componentes `web-only`
- Todos os componentes têm tag `@platform` declarada

Execute localmente: `pnpm test:platform-contract`
