import type { ReactNode } from 'react';

/**
 * @platform native-ready
 * Top app bar com slots `start`/`center`/`end`. Web usa `<header>` semântico;
 * `nav-bar.native.tsx` usa `Box` + safe-area iOS.
 */
export interface NavBarProps {
  /** Slot esquerdo — tipicamente um IconButton (voltar, menu, fechar) */
  start?: ReactNode;
  /** Slot direito — tipicamente IconButton(s) de ação */
  end?: ReactNode;
  /** Título de texto exibido no centro */
  title?: string;
  /**
   * Valor 0–100 para exibir ProgressBar no centro.
   * Sobrepõe `title`. Útil para fluxos multi-etapa ou upload.
   */
  progress?: number;
  /** Label acessível para a ProgressBar (aria-label) */
  progressLabel?: string;
  /** Tom da ProgressBar — padrão "brand" */
  progressTone?: 'brand' | 'success' | 'warning' | 'critical';
  /**
   * Slot central customizado.
   * Sobrepõe `progress` e `title`.
   * Use para casos como SearchBar inline ou breadcrumb.
   */
  center?: ReactNode;
  /** Aplica glass effect (backdrop-filter blur) no fundo */
  blurred?: boolean;
  /** Adiciona box-shadow para indicar elevação sobre o conteúdo */
  elevated?: boolean;
  /** Aplica padding-top para safe-area do iOS (status bar) — padrão true */
  safeAreaTop?: boolean;
  /** Label acessível para o elemento header */
  'aria-label'?: string;
}
