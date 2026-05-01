import type { ReactNode } from 'react';

/**
 * Overrides leves de texto para i18n. Sem hook completo (fora de escopo); produtos
 * mapeiam de seu i18n próprio: `texts={{ dropZone: t('upload.dropZone') }}`.
 */
export interface FileUploadTexts {
  /** Mensagem principal da drop zone idle. */
  dropZone?: string;
  /** Texto auxiliar com tamanho máximo formatado. */
  sizeHint?: (formattedMax: string) => string;
  /** Mensagem exibida em estado `loading`. */
  uploading?: string;
  /** Label do bloco de preview quando há `previewUrl`. */
  previewLabel?: string;
  /** Label e `aria-label` do botão "Remover". */
  removeLabel?: string;
}

/**
 * @platform shared (web ativo; native exporta placeholder — ver RFC-0026)
 *
 * Componente de upload de arquivos. Field-aware (RFC-0014): integra com
 * `Field.Control` para wiring de `aria-*` quando dentro de `<Field>`.
 *
 * Em React Native, `FileUpload` renderiza um placeholder visualmente paritário
 * que **não captura toque** para abrir picker — integrações reais (camera,
 * image-picker, document-picker) ficam por conta do consumidor via slot
 * `children`. Ver TD-025 e seção "FileUpload em RN" do CONTRIBUTING.
 */
export interface FileUploadProps {
  /** Tipos MIME aceitos (passa para `<input accept>` em web). Default: `'image/*'`. */
  accept?: string;
  /** Permite selecionar múltiplos arquivos. Default: `false`. */
  multiple?: boolean;
  /** Tamanho máximo individual em bytes. Default: `5 * 1024 * 1024` (5 MB). */
  maxSize?: number;
  /** Quantidade máxima de arquivos quando `multiple=true`. Default: `5`. */
  maxFiles?: number;
  /** Habilita drag-and-drop em web. Default: `true`. */
  dragAndDrop?: boolean;
  /** Estado de upload em andamento controlado pelo consumidor. */
  loading?: boolean;
  /** Mensagem de erro (renderizada quando não há `FieldContext`). */
  error?: string;
  /** Estado disabled — também respeita `FieldContext`. */
  disabled?: boolean;
  /** Disparado quando um ou mais arquivos válidos são selecionados/dropados. */
  onFilesChange?: (files: File[]) => void;
  /** URL de pré-visualização (controlada pelo consumidor após upload). */
  previewUrl?: string;
  /** Disparado ao clicar "Remover" no preview. */
  onRemove?: () => void;
  /** Slot opcional para conteúdo customizado dentro da drop zone idle. */
  children?: ReactNode;
  /** Overrides de texto para i18n. */
  texts?: FileUploadTexts;
}
