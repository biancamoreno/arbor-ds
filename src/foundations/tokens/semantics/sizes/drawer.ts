/**
 * Dimensões do painel do Drawer.
 *
 * - `width.*` aplica-se a drawers laterais (`placement: 'left' | 'right'`)
 *   — o painel ocupa toda a altura do viewport e essa é a sua largura.
 * - `height.*` aplica-se a drawers superiores/inferiores (`placement: 'top' |
 *   'bottom'`) — o painel ocupa toda a largura do viewport e essa é a sua
 *   altura.
 *
 * Produtos podem sobrescrever via `createTheme({ sizes: { drawer: {...} } })`.
 */
export const drawerSize = {
  width: {
    small: '320px',
    medium: '420px',
    large: '560px',
  },
  height: {
    small: '240px',
    medium: '320px',
    large: '420px',
  },
};

export type DrawerSize = typeof drawerSize;
