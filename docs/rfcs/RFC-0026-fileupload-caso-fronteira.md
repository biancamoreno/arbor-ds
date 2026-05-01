# RFC-0026 — FileUpload: caso-fronteira, refator e paridade native

**Status**: Draft
**Autores**: @bia
**Data**: 2026-05-01
**PR**: —

**Origem**: Onda 6 da [RFC-0018](RFC-0018-paridade-native-completa-do-ds.md) (paridade native completa). FileUpload é um dos dois "casos-fronteira" identificados (o outro, Table, foi resolvido pela [RFC-0022](RFC-0022-table-native.md)). Esta RFC fecha o último caso aberto da onda 6 e, no caminho, paga dívidas técnicas pré-existentes do componente.

---

## Motivação

`FileUpload` foi escrito antes do amadurecimento atual do DS. Inspeção do código revela um componente com API funcional mas com várias divergências do contrato canônico do projeto.

### Estado atual

Localização: `src/components/input/core/fileupload.tsx` (não tem pasta própria — vive sob o agrupador `input/`, junto de TextInput/TextArea/Counter/SearchInput).

API pública (de `interfaces/FileUploadProps.ts`):

```ts
export interface FileUploadProps {
  label?: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
  maxFiles?: number;
  onFileSelect?: (files: File[]) => void;
  preview?: boolean;
  previewUrl?: string;
  error?: string;
  disabled?: boolean;
  loading?: boolean;
  dragAndDrop?: boolean;
  onRemove?: () => void;
}
```

Capacidades implementadas:

- Click no drop zone abre file dialog (input nativo escondido + `ref.click()`).
- Drag-and-drop (ativável/desativável via `dragAndDrop`).
- Validação `maxSize`/`maxFiles`.
- Preview de imagem via `previewUrl` + botão "Remover".
- Estados `disabled`/`loading`/`error`.
- Field-aware via `markFieldAware()` — integra com `Field.Control`.

### Diagnóstico

| # | Item | Tipo | Severidade |
|---|---|---|---|
| FU-1 | **Sem `.native.tsx`** — quebra ao importar `arbor-ds/native`. Web-only de fato. | Bug arquitetural | Alta |
| FU-2 | **Sem `fileupload.test.tsx`** — zero cobertura. | Gap | Alta |
| FU-3 | **Sem story** — não aparece em `input.stories.tsx` nem em arquivo próprio. | Gap | Média |
| FU-4 | **Sem `@platform` tag** — passa despercebido no `check-platform-contract.js`. | Governança | Média |
| FU-5 | `onFileSelect: (files: File[]) => void` viola convenção [RFC-0015](RFC-0015-convencao-naming-de-eventos.md) (deveria ser `onChange` ou `onValueChange`). | Naming | Média |
| FU-6 | Drop zone usa `style={{ border: '2px dashed ...', padding: '2rem', backgroundColor: '...', transition: '...' }}` inline. Viola CLAUDE.md regra absoluta. | Anti-pattern | Alta |
| FU-7 | Indicadores visuais usam **emojis literais** (`📤`, `⏳`) em `<Box as="span">` em vez de `Icon` do DS. Quebra fontes RN, screen readers leem o emoji, sem reaproveitamento de `Icon` Lucide. | A11y/visual | Alta |
| FU-8 | Padding/fontSize literais (`'1rem'`, `'2rem'`, `'0.5rem 1rem'`). Não usa tokens — produto consumidor não consegue ajustar densidade via tema. | Tematização | Média |
| FU-9 | Strings em pt-BR hardcoded ("Arraste e solte ou clique para enviar", "Enviando...", "Máximo X MB", "Arquivo enviado", "Pré-visualização"). Sem hook de i18n nem prop para overrides. | i18n | Média |
| FU-10 | `useTheme()` consumido para resolver cores manualmente em vez de deixar a engine resolver via prop (`borderColor="brand.base"`). | Padrão obsoleto | Baixa |
| FU-11 | Botão "Remover" passa `cursor="pointer"`, mas `Clickable` já garante isso — duplicação. | Cosmético | Baixa |
| FU-12 | `Box as="img" src=...` para preview viola "todo `<img>` deve ser `Image` do DS" (já existem `Image.tsx`/`Image.native.tsx` com `mode='img'\|'background'` + loading/error states). | Reuso | Média |

A soma desses pontos torna FileUpload o componente form **menos alinhado** com o restante do DS. Antes da decisão sobre native, o componente precisa ser saneado.

## Proposta

### Decisão arquitetural — caminho native

Três caminhos avaliados:

#### Caminho (a) — `expo-document-picker` como `peerDependency`

`fileupload.native.tsx` consome `expo-document-picker.getDocumentAsync({ type, multiple })`. Web continua com `<input type="file">`.

- **Custo no consumidor**: peer dep nova. Apps Expo já têm `expo-modules-core` instalado por padrão; instalar `expo-document-picker` é trivial (`expo install expo-document-picker`). Apps RN cru exigem mais setup (mas Expo é dominante hoje).
- **Capacidades RN**: ✅ seleção, ✅ accept (via `type: '*/*' | 'image/*' | mime[]`), ✅ multiple (Android 4.4+/iOS 14+), ❌ drag-and-drop (não existe em mobile), ✅ preview por URI, ✅ size validation manual.
- **Bundle web**: 0 KB (não importa em web).
- **Trade-off**: introduz peer dep não trivial. `expo-document-picker` é Expo-flavored — apps "bare RN" precisam de glue extra. Documentação detalhada no CONTRIBUTING.

#### Caminho (b) — `react-native-document-picker` como `peerDependency`

Mesmo padrão de (a), mas usa lib mais agnóstica (Expo + bare RN).

- **Capacidades RN**: idênticas a (a).
- **Custo**: peer dep nova; comunidade mantida (não-Meta), com track record de quebras em major bumps. Adiciona setup nativo (`pod install`/`gradle sync`).
- **Trade-off vs (a)**: melhor compatibilidade com bare RN, pior UX de install em Expo.

#### Caminho (c) — Caso-fronteira documentado (web-only oficial) + fallback gracioso em native

`fileupload.native.tsx` exporta um **placeholder funcional**: renderiza um `Box` informativo com texto "Upload de arquivos requer composição customizada em native — veja docs". Não tenta selecionar arquivo.

A decisão de qual lib usar (Expo, bare, custom screens, integração com câmera) fica para o produto consumidor, que conhece sua plataforma alvo.

- **Custo**: zero peer dep. Documentação fica responsável por explicar.
- **Trade-off**: paridade visual quebrada por design. Consumidor tem que codar caminho native próprio se precisar.

### Recomendação: **caminho (c)** com porta de saída registrada para (a)

**Por quê (c) e não (a):**

1. **Diversidade real de uso**: file upload em mobile raramente é "select file genérico". Os casos reais que aparecem em produto são **camera capture** (foto direto da câmera), **photo gallery picker**, **document scan** ou **upload de áudio gravado** — cada um exige lib diferente (`expo-camera`, `expo-image-picker`, `expo-document-picker`, `expo-av`). Forçar uma lib específica no DS bloqueia os 4 outros casos.

2. **Peer dep custosa**: `expo-document-picker` é peer dep não-trivial. Diferente de `react-native-svg` (que justifica TD-018/RFC-0023 porque já era transitiva via Lucide), nada no DS força hoje a presença de `expo-document-picker`. Adicionar passa o custo para 100% dos consumidores RN, mesmo os que nunca usam FileUpload.

3. **Precedente do projeto**: a [RFC-0018](RFC-0018-paridade-native-completa-do-ds.md) explicitamente abriu a porta para "casos-fronteira em RFCs dedicadas (onda 6). Aceitar deps opcionais (`expo-document-picker`) **ou** recomendar composição alternativa." A escolha de "composição alternativa" é prevista.

4. **Paridade não é simetria 1:1**: o que importa é que `import { FileUpload } from 'arbor-ds/native'` **não quebra** e que o consumidor saiba o que esperar. Um placeholder informativo cumpre isso.

**Por que com porta de saída para (a):**

A RFC abre TD-025 documentando: se em 6 meses 3+ produtos consumidores pedirem implementação real native, promovemos para caminho (a). Critério mensurável, decisão deferida com saída registrada.

### Refator do componente existente (paga FU-5 a FU-12)

Independente do caminho native, o web precisa ser saneado. Mudanças propostas:

#### API revista

```ts
// interfaces/FileUploadProps.ts
import type { ReactNode } from 'react';

/** @platform web (native exporta placeholder — ver RFC-0026) */
export interface FileUploadProps {
  /** Tipos MIME aceitos (passa para `<input accept>` em web). Default: `'image/*'`. */
  accept?: string;
  /** Permite selecionar múltiplos arquivos. Default: false. */
  multiple?: boolean;
  /** Tamanho máximo individual em bytes. Default: 5 MB. */
  maxSize?: number;
  /** Quantidade máxima de arquivos quando `multiple=true`. Default: 5. */
  maxFiles?: number;
  /** Habilita drag-and-drop (web). Default: true. */
  dragAndDrop?: boolean;
  /** Estado de upload em andamento controlado pelo consumidor. */
  loading?: boolean;
  /** Mensagem de erro (renderizada quando não há FieldContext). */
  error?: string;
  /** Estado disabled — também respeita FieldContext. */
  disabled?: boolean;
  /** Disparado quando um ou mais arquivos válidos são selecionados/dropados. */
  onFilesChange?: (files: File[]) => void;
  /** URL de pré-visualização (controlado pelo consumidor após upload). */
  previewUrl?: string;
  /** Disparado ao clicar "Remover" no preview. */
  onRemove?: () => void;
  /** Slot opcional para conteúdo customizado dentro da drop zone. */
  children?: ReactNode;
  /** Overrides de texto (para i18n). */
  texts?: {
    dropZone?: string;
    sizeHint?: (formattedMax: string) => string;
    uploading?: string;
    previewLabel?: string;
    removeLabel?: string;
  };
}
```

Mudanças vs. atual:

- **`onFileSelect` → `onFilesChange`** — alinha com [RFC-0015](RFC-0015-convencao-naming-de-eventos.md) (`onValueChange` quando há valor; aqui o "valor" é a coleção de arquivos, então `onFilesChange` lê melhor).
- **Removido `label` e `preview`** — `label` é responsabilidade de `Field.Label`; `preview` ficou ambíguo (boolean que dependia de `previewUrl` para fazer algo). Quando há `previewUrl`, mostra preview; sem, mostra drop zone. Sem prop redundante.
- **Adicionado `texts`** — overrides leves. Não é i18n completo (fora de escopo), mas tira o hardcode pt-BR da árvore — produto inglês ou espanhol consegue customizar sem fork.
- **Adicionado `children`** — slot para drop zone customizada (quando o consumidor quer ícone + texto próprio em vez do default).
- **Removido `onFileSelect: (files: File[])` quando `multiple=false`** — antes a callback recebia sempre array; agora é sempre array (`File[]`), e o consumidor desestrutura `[file] = files` quando sabe que é singular. Convenção mais previsível.

#### Pasta canônica (FU-1, FU-3, FU-4)

Mover de `input/core/fileupload.tsx` para pasta dedicada:

```
src/components/file-upload/
  core/
    file-upload.tsx              # web (refatorado)
    file-upload.native.tsx       # NOVO — placeholder funcional
    file-upload.test.tsx         # NOVO
    file-upload.native.test.tsx  # NOVO
    file-upload.stories.tsx      # NOVO
  interfaces/
    FileUploadProps.ts           # API revista (com @platform tag)
    index.ts
  index.ts
```

`input/core/fileupload.tsx` e `interfaces/FileUploadProps.ts` removidos. Re-export atualizado em `src/components/index.ts`. Também atualizado em `input/index.ts` (deixa de re-exportar) e `input/core/index.ts`.

**Por que pasta própria:** FileUpload tem ciclo de vida e contrato distintos do agrupador `Input` (TextInput/TextArea/Counter/SearchInput são variações de `<input type="text|number">`; FileUpload é compound de drop zone + arquivo selecionado). Tê-lo dentro de `input/` confunde.

#### Saneamento técnico (FU-6 a FU-12)

- **FU-6**: `<Flex>` da drop zone passa a usar props declarativas (`borderWidth="2px"`, `borderStyle="dashed"`, `borderColor` resolvido por estado, `padding="large"`, `backgroundColor` por estado). Cair `style={{...}}`.
- **FU-7**: emojis `📤`/`⏳` substituídos por `Icon` Lucide (`Icon as={Upload}` para idle, `Icon as={Loader2}` com `aria-label="Enviando"` para loading). Tom semântico via `color="text.secondary"`.
- **FU-8**: padding/fontSize via tokens (`paddingX="large"`, `paddingY="medium"`, `fontSize="small"`/`xsmall"`).
- **FU-9**: textos via prop `texts`. Defaults pt-BR mantidos para não quebrar consumidores existentes.
- **FU-10**: remover `useTheme()`. Estados (idle/dragging/error/disabled) viram cascata de cores via prop.
- **FU-11**: remover `cursor="pointer"` do Clickable Remover.
- **FU-12**: preview de imagem usa `<Image src={previewUrl} alt={...} mode="img" />` do DS em vez de `Box as="img"`.

### Implementação web (refatorada — pseudo-código)

```tsx
// file-upload/core/file-upload.tsx
import React, { useId, useRef, useState } from 'react';
import { Upload, Loader2, X } from 'lucide-react';
import { useFieldContext } from '../../field/context/field-context';
import { markFieldAware } from '../../field/utils/is-field-aware';
import { Flex, Box, Text, Clickable, Icon, Image } from '../../core';
import { transition } from '../../../ecosystem/utils/functions';
import type { FileUploadProps } from '../interfaces';

const DEFAULT_TEXTS = {
  dropZone: 'Arraste e solte ou clique para enviar',
  sizeHint: (max: string) => `Máximo ${max}`,
  uploading: 'Enviando...',
  previewLabel: 'Arquivo enviado',
  removeLabel: 'Remover',
};

function formatBytes(bytes: number): string { /* ... */ }

const FileUploadBase: React.FC<FileUploadProps> = ({
  accept = 'image/*',
  multiple = false,
  maxSize = 5 * 1024 * 1024,
  maxFiles = 5,
  dragAndDrop = true,
  loading,
  error,
  disabled,
  onFilesChange,
  previewUrl,
  onRemove,
  children,
  texts: textsProp,
}) => {
  const fieldCtx = useFieldContext();
  const autoId = useId();
  const inputId = fieldCtx?.fieldId ?? autoId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const t = { ...DEFAULT_TEXTS, ...textsProp };
  const isDisabled = disabled ?? fieldCtx?.disabled ?? false;
  const isInvalid = !!error || !!fieldCtx?.invalid;

  const borderColor = isDragging ? 'brand.base' : isInvalid ? 'feedback.critical.base' : 'border.default';
  const backgroundColor = isDragging ? 'brand.subtle' : isInvalid ? 'feedback.critical.subtle' : 'background.subtle';

  // ... handlers (handleClick, handleChange, handleDrop, handleDragOver/Leave) ...

  if (previewUrl) {
    return (
      <Flex alignItems="center" gap="small" padding="medium" borderRadius="medium" borderWidth="1px" borderStyle="solid" borderColor="border.default">
        <Image src={previewUrl} alt={t.previewLabel} mode="img" width="80px" height="80px" borderRadius="small" />
        <Box flex={1}>
          <Text as="p" fontSize="small" fontWeight="medium" color="text.primary">{t.previewLabel}</Text>
        </Box>
        <Clickable as="button" type="button" onClick={onRemove} aria-label={t.removeLabel} paddingX="medium" paddingY="small" borderRadius="small" color="feedback.critical.base">
          <Icon as={X} aria-hidden /> {t.removeLabel}
        </Clickable>
      </Flex>
    );
  }

  return (
    <Flex
      flexDirection="column" alignItems="center" justifyContent="center"
      gap="micro" padding="large" borderRadius="medium"
      borderWidth="2px" borderStyle="dashed" borderColor={borderColor}
      backgroundColor={backgroundColor}
      opacity={isDisabled ? 0.5 : 1}
      cursor={isDisabled ? 'not-allowed' : 'pointer'}
      onClick={isDisabled ? undefined : handleClick}
      {...(dragAndDrop && !isDisabled ? { onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop } : {})}
      style={{ transition: transition(['border-color', 'background-color'], 'fast') }}
    >
      {children ?? (
        loading ? (
          <>
            <Icon as={Loader2} size="lg" color="text.secondary" aria-hidden />
            <Text as="p" fontSize="small" color="text.secondary">{t.uploading}</Text>
          </>
        ) : (
          <>
            <Icon as={Upload} size="lg" color="text.secondary" aria-hidden />
            <Text as="p" fontSize="small" fontWeight="semibold" color="text.primary">{t.dropZone}</Text>
            <Text as="p" fontSize="xsmall" color="text.secondary">{t.sizeHint(formatBytes(maxSize))}</Text>
          </>
        )
      )}
      <Box as="input" innerRef={inputRef} id={inputId} type="file" accept={accept} multiple={multiple}
           onChange={handleChange} disabled={isDisabled}
           aria-describedby={fieldCtx?.descriptionRegistered ? fieldCtx.descriptionId : undefined}
           aria-required={fieldCtx?.required || undefined}
           aria-invalid={fieldCtx?.invalid || undefined}
           aria-errormessage={fieldCtx?.invalid && fieldCtx?.errorRegistered ? fieldCtx.errorId : undefined}
           display="none" />
    </Flex>
  );
};

FileUploadBase.displayName = 'FileUpload';
export const FileUpload = markFieldAware(FileUploadBase);
```

Único `style={{...}}` remanescente: `transition` (CSS shorthand não tem prop declarativa equivalente — escape hatch legítimo da CLAUDE.md).

### Implementação native (placeholder)

```tsx
// file-upload/core/file-upload.native.tsx
import React from 'react';
import { Flex, Text, Icon } from '../../core';
import { Upload } from 'lucide-react-native';
import { markFieldAware } from '../../field/utils/is-field-aware';
import type { FileUploadProps } from '../interfaces';

const FileUploadNativeBase: React.FC<FileUploadProps> = ({ children, texts }) => {
  const message = texts?.dropZone ?? 'Upload de arquivos requer integração nativa específica (expo-document-picker, expo-image-picker, expo-camera). Veja docs do Arbor-DS.';
  return (
    <Flex
      flexDirection="column" alignItems="center" justifyContent="center"
      gap="small" padding="large" borderRadius="medium"
      borderWidth="2px" borderStyle="dashed" borderColor="border.default"
      backgroundColor="background.subtle"
      accessibilityRole="text"
      accessibilityLabel={message}
    >
      {children ?? (
        <>
          <Icon as={Upload} size="lg" color="text.secondary" aria-hidden />
          <Text fontSize="small" color="text.secondary">{message}</Text>
        </>
      )}
    </Flex>
  );
};

FileUploadNativeBase.displayName = 'FileUpload';
export const FileUpload = markFieldAware(FileUploadNativeBase);
```

Comportamento: render visual idêntico ao web em estado idle, **sem** capturar toque para abrir picker. Texto explica que integração nativa é responsabilidade do consumidor.

`accessibilityRole="text"` (não `button`) — não é interativo. Slot `children` permite o consumidor sobrescrever totalmente para integrar sua lib nativa de escolha (o consumidor coloca `<Pressable onPress={pickWithExpoDocumentPicker}>` por dentro).

## Alternativas consideradas

| Alternativa | Por que descartada |
|---|---|
| **(a) `expo-document-picker` peer** | Custo de peer dep não-trivial para 100% dos consumidores RN (mesmo os que não usam FileUpload). Não cobre os outros 4 casos reais (camera, image-picker, av, scan). Bloqueia produtos com cadeia diferente. Reservado como **TD-025**: promover se 3+ produtos consumidores pedirem em 6 meses. |
| **(b) `react-native-document-picker` peer** | Mesmas críticas de (a) + comunidade não-Meta com histórico de breakage. Ganha em compat bare RN, perde em Expo (que é dominante hoje). |
| **Implementar com `expo-modules-core` direto + binding manual** | Reinventa lib externa por dentro do DS. Manutenção alta, custo de teste cross-version do Expo, fora do escopo de um DS de UI. |
| **Não exportar FileUpload em `arbor-ds/native`** | Pior DX que (c). Consumidor que faz `import { FileUpload } from 'arbor-ds'` em código compartilhado quebra build em RN. Placeholder funcional não quebra. |
| **Manter FileUpload sem refator + apenas adicionar `.native.tsx`** | Cobra a dívida pela metade. Já que vamos abrir o componente, fechar dívidas FU-5 a FU-12 no mesmo passe é mais barato que retornar depois. |
| **Refator + caminho (a) numa só RFC** | Aumenta superfície de revisão e mistura "saneamento" com "decisão arquitetural sobre lib externa". Caminho (c) permite a RFC ser auto-contida; promoção para (a) entra em RFC futura quando o gatilho ocorrer. |

## Impactos e trade-offs

- **Bundle**: zero impacto. Web não muda peso (refator estrutural, mesma capacidade); native adiciona ~400 B (placeholder). Nenhuma peer dep nova.
- **Breaking changes**:
  - **`onFileSelect` → `onFilesChange`**: rename. Consumidores existentes do FileUpload (zero conhecidos no monorepo arbor-ds; auditar antes de release) precisam renomear.
  - **`label` removido**: consumidores que usavam fora de Field precisam migrar para `<Field><Field.Label>...</Field.Label><Field.Control><FileUpload .../></Field.Control></Field>`. Recomendado universalmente — é a forma canônica.
  - **`preview` removido**: comportamento agora deriva de `previewUrl !== undefined`. Consumidores que passavam `preview={false}` com `previewUrl` setado precisam parar de passar `previewUrl`.
  - Mudanças aceitas como breaking porque o componente está pré-1.0 (sem usuários externos) e o naming antigo violava convenções já fechadas (RFC-0015).
- **DX**:
  - Pasta dedicada — encontrável e refatorável isoladamente.
  - Slot `children` em vez de explosão de props para customizar drop zone.
  - `texts` permite i18n light sem hook completo.
  - Native que não quebra é preservação de DX cross-platform.
- **A11y**:
  - Web: `aria-required`/`aria-invalid`/`aria-errormessage` já mapeados; preservados.
  - Web: emojis substituídos por `Icon` com `aria-hidden` (não polui screen reader); textos descritivos via `Text`.
  - Native: `accessibilityRole="text"` + `accessibilityLabel` no placeholder.
- **Performance**:
  - Web: `useTheme()` removido — uma source de re-render a menos.
  - Native: render leve, sem state.
- **Tematização**:
  - Cores via prop (`brand.base`, `feedback.critical.base`, `background.subtle`) — consumer override por `createTheme()` propaga.
  - Spacings via token — consumer ajusta densidade.

## Critérios de aceite

### Antes da implementação (esta RFC)
- [ ] Decisão arquitetural confirmada: caminho **(c)** com porta de saída para (a) registrada como **TD-025**.
- [ ] Plano de execução validado.

### Implementação (PRs subsequentes)

**PR 1 — Refator e mudança de pasta (sem native ainda)**
- [ ] Pasta `src/components/file-upload/` criada com layout canônico.
- [ ] `file-upload.tsx` (web) escrito conforme pseudo-código acima.
- [ ] `FileUploadProps` revista (com `@platform shared` — porque o native existirá em PR 2).
- [ ] `file-upload.test.tsx` cobrindo: render default, `accept` propagado, `multiple`, `maxSize` rejeitando, `maxFiles` truncando, drag-over/leave/drop, click abre dialog, preview/remover, disabled/loading/error, integração com Field (`fieldId`/`disabled`/`invalid`/`describedby`/`errormessage`).
- [ ] `file-upload.stories.tsx` com `Default`, `Multiple`, `WithPreview`, `Disabled`, `Loading`, `WithError`, `WithFieldContext`, `CustomTexts`, `CustomDropZone`. Todas usando Box/Flex/Text/Clickable + tokens (RFC-0025 e TD-024).
- [ ] `input/core/fileupload.tsx` + `input/interfaces/FileUploadProps.ts` removidos; `input/index.ts` deixa de re-exportar; `src/components/index.ts` aponta para a nova pasta.
- [ ] Sweep de consumidores internos do `onFileSelect` → `onFilesChange` (auditar).
- [ ] Lint + typecheck verdes; suíte verde.

**PR 2 — Implementação native (placeholder) + contrato**
- [ ] `file-upload.native.tsx` escrito conforme pseudo-código.
- [ ] `file-upload.native.test.tsx` cobrindo: render default, `accessibilityLabel` por padrão, `texts.dropZone` override, slot `children` substitui conteúdo, sem capturar toque para abrir picker.
- [ ] `@platform shared` na interface (com nota explicando comportamento native).
- [ ] `check-platform-contract.js --strict` continua verde.
- [ ] CONTRIBUTING ganha seção "FileUpload em RN — caminhos recomendados" listando `expo-document-picker`/`expo-image-picker`/`expo-camera`/`expo-av` com snippets de integração via slot `children`.
- [ ] **TD-025** aberta com critério de promoção para caminho (a).

### Sucesso
- [ ] Suíte cresce em ~25 testes (web ~18 + native ~7).
- [ ] FileUpload aparece no Storybook com 9 stories funcionais.
- [ ] `import { FileUpload } from 'arbor-ds/native'` retorna componente que renderiza sem erro em Expo.
- [ ] Consumidor RN que precisa de upload real consegue usar slot `children` para integrar lib externa em < 30 LoC.

## Notas

### Por que `texts` e não i18n completo
O DS não tem hoje hook de i18n. Adicionar agora seria escopo lateral. Prop `texts` opcional com defaults pt-BR é mínimo viável; produtos consumidores podem mapear de seu i18n próprio (`texts={{ dropZone: t('upload.dropZone') }}`). Quando o DS ganhar `useArborI18n()` no futuro, `FileUpload` migra com mudança trivial (manter prop como override final).

### Por que slot `children` em vez de mais props
Drop zone tem variações infinitas (ícone diferente por tipo de arquivo, instruções verbosas, branding pesado). Em vez de adicionar `iconSlot`, `instructionSlot`, `helperSlot` etc., um único `children` que substitui o conteúdo do interior é mais clean. Consumidor que quer só trocar o ícone copia o snippet padrão e troca o ícone — explícito é melhor que mágico.

### Cruzamento com outras dívidas
- **TD-024** (sweep stories Storybook): a story nova de FileUpload já nasce conforme. Ajuda a baixar o backlog de TD-024.
- **TD-018** (web-only): FileUpload é o último web-only ainda em aberto silencioso (não estava no scoreboard porque está dentro de `input/`, não em pasta própria). PR 2 fecha.
- **TD-019** (engine native a11y props): não impactado.
- **RFC-0014** (Field-aware): comportamento preservado — `markFieldAware()` continua. Wiring de `aria-*` mantido.
- **RFC-0015** (naming de eventos): rename de `onFileSelect` → `onFilesChange` é o último ajuste de naming pendente em campos.
- **RFC-0025** (overlays via Portal): não impactado — FileUpload não é overlay.

### TD-025 — porta de saída registrada

**Conteúdo a abrir junto com PR 2:**

> **TD-025 — FileUpload native como placeholder; promover para implementação real se demanda materializar.**
> Status: Open · Severidade: Baixa
> Resolução proposta: implementar `file-upload.native.tsx` real via `expo-document-picker` (ou `expo-image-picker` se o caso de uso predominante for imagem) como peer dep.
> Gatilho: 3+ produtos consumidores documentando necessidade de FileUpload nativo em < 6 meses, OU 1 caso de produto crítico (autenticação, KYC) que exija upload real cross-platform.
> Critério para fechar: implementação real com peer dep adicionada; placeholder removido; CONTRIBUTING atualizado com setup; testes native completos; suíte verde.

### Riscos

- **Audit de consumidores externos** — projeto pré-release, não há mapeamento certo. Mitigação: `grep` no monorepo arbor-ds antes de release; se houver consumo via `playground/`, migrar junto.
- **Peer dep futura** — se a porta (a) for ativada, o ecossistema já vai estar maior. Mitigar com 1 mês de "deprecation window" do placeholder antes de remover.
- **Slot `children` com conteúdo customizado quebra o `<input type="file">` escondido** — não, o input fica fora de `children` na hierarquia (irmão do `<Flex>` que recebe o slot). Sem risco.

### Ordem de execução sugerida

1. Esta RFC aceita.
2. PR 1 (refator + mudança de pasta + testes web + stories) — pode entrar isolado, mantém comportamento web igual com API revista.
3. PR 2 (native placeholder + TD-025 + CONTRIBUTING) — fecha o contrato cross-platform.

Dois PRs em sequência. Não há razão de fundir — PR 1 é "saneamento técnico", PR 2 é "decisão arquitetural cross-platform". Mantê-los separados facilita revisão e isola riscos.
