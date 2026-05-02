import { useEffect } from 'react';
import { type ArborTheme, themeLight } from '../../../../foundations';
import { cssInJs, type ThemeProviderProps as ArborProviderProps } from '../../adapters';

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
@keyframes arbor-progress-indeterminate {
  0% { left: -35%; right: 100%; }
  60% { left: 100%; right: -90%; }
  100% { left: 100%; right: -90%; }
}
[data-arbor-focusable]:focus-visible {
  outline: 2px solid transparent;
  box-shadow: 0 0 0 2px var(--arbor-surface, #fff), 0 0 0 4px var(--arbor-brand, #3b82f6);
}
.arbor-card-hoverable:hover, .arbor-card-clickable:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12) !important;
}
.arbor-card-clickable:active { transform: scale(0.99); }
`;

const REDUCED_MOTION_STYLE_ID = 'arbor-reduced-motion';
const GLOBAL_STYLE_ID = 'arbor-global-styles';

function injectStyle(id: string, css: string) {
  if (typeof document === 'undefined' || document.getElementById(id)) return;
  const style = document.createElement('style');
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
}

export function ArborProvider({ theme = themeLight, children, ...rest }: Partial<ArborProviderProps<ArborTheme>>) {
  useEffect(() => {
    injectStyle(REDUCED_MOTION_STYLE_ID, REDUCED_MOTION_CSS);
    injectStyle(GLOBAL_STYLE_ID, GLOBAL_CSS);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.style.setProperty('--arbor-brand', theme.colors.brand.base);
    document.documentElement.style.setProperty('--arbor-surface', theme.colors.surface.default);
  }, [theme]);

  return (
    <cssInJs.ThemeProvider theme={theme} {...rest}>
      {children}
    </cssInJs.ThemeProvider>
  );
}
