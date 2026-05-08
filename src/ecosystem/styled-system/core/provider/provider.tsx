import { useEffect } from 'react';
import { type ArborTheme, themeLight } from '../../../../foundations';
import { cssInJs, type ThemeProviderProps as ArborProviderProps } from '../../adapters';
import { walkTokenTree, tokenTreeToCssText } from './walk-token-tree';

export type { ArborProviderProps };

const REDUCED_MOTION_CSS =
  '@media (prefers-reduced-motion: reduce) {' +
  '*, *::before, *::after {' +
  'animation-duration: 0.01ms !important;' +
  'animation-iteration-count: 1 !important;' +
  'transition-duration: 0.01ms !important;' +
  'scroll-behavior: auto !important;' +
  '}}';

const GLOBAL_CSS = `
@keyframes arbor-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes arbor-shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
@keyframes arbor-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes arbor-toast-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes arbor-progress-indeterminate {
  0% { left: -35%; right: 100%; }
  60% { left: 100%; right: -90%; }
  100% { left: 100%; right: -90%; }
}
[data-arbor-focusable]:focus-visible {
  outline: 2px solid var(--arbor-color-focus-ring, #3b82f6);
  outline-offset: 2px;
  box-shadow: 0 0 0 4px var(--arbor-color-focus-ring-glow, rgba(59,130,246,0.20));
}
`;

const REDUCED_MOTION_STYLE_ID = 'arbor-reduced-motion';
const GLOBAL_STYLE_ID = 'arbor-global-styles';
const CSS_VARS_STYLE_ID = 'arbor-theme-vars';

function injectStyle(id: string, css: string) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
}

function ensureCssVarsNode(): HTMLStyleElement | null {
  if (typeof document === 'undefined') return null;
  let node = document.getElementById(CSS_VARS_STYLE_ID) as HTMLStyleElement | null;
  if (!node) {
    node = document.createElement('style');
    node.id = CSS_VARS_STYLE_ID;
    document.head.appendChild(node);
  }
  return node;
}

export function ArborProvider({ theme = themeLight, children, ...rest }: Partial<ArborProviderProps<ArborTheme>>) {
  useEffect(() => {
    injectStyle(REDUCED_MOTION_STYLE_ID, REDUCED_MOTION_CSS);
    injectStyle(GLOBAL_STYLE_ID, GLOBAL_CSS);
  }, []);

  useEffect(() => {
    const node = ensureCssVarsNode();
    if (!node) return;
    const vars = walkTokenTree(theme);
    node.textContent = `:root{${tokenTreeToCssText(vars)}}`;
  }, [theme]);

  return (
    <cssInJs.ThemeProvider theme={theme} {...rest}>
      {children}
    </cssInJs.ThemeProvider>
  );
}
