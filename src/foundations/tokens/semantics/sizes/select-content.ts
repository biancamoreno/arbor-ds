/**
 * Altura máxima do listbox de `Select.Content` por `size` do componente.
 * Themable — produtos com listas longas/curtas podem ajustar via
 * `createTheme(base, { tokens: { selectContent: { maxHeight: { ... } } } })`
 * sem editar a recipe `select`.
 */
export const selectContentSize = {
  maxHeight: {
    small: '200px',
    medium: '240px',
    large: '320px',
  },
};

export type SelectContentSize = typeof selectContentSize;
