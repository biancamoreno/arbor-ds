export const menu = {
  borderRadius: 'medium',
  borderWidth: 'hairline',
  padding: { inline: 'tiny', block: 'tiny' },
  // Items consecutivos ficam colados (hover/active background diferencia);
  // respiro deliberado vem de `Menu.Separator`. Pattern Radix — evita o
  // "double-spacing" inconsistente entre item↔item vs item↔separator↔item.
  gap: 'none',
  shadow: 'lg',
  minWidth: '180px',
  maxWidth: '320px',
  /**
   * Distância (px) entre trigger e content — themable via
   * `createTheme({ components: { menu: { offset: 12 } } })`.
   */
  offset: 6,
  colors: {
    background: 'surface.raised',
    border: 'border.subtle',
    text: 'text.primary',
  },
  item: {
    borderRadius: 'small',
    padding: { inline: 'small', block: 'tiny' },
    gap: 'small',
    minHeight: 'control.small',
    iconSize: 'small',
    colors: {
      text: 'text.primary',
      textDisabled: 'text.disabled',
      icon: 'icon.secondary',
      // Tipografia vem de `<Text variant="bodyMedium">` no slot — produtos
      // overridam via `text.variants.bodyMedium`. Mantém recipe enxuta e
      // alinhada com pattern Tabs/Accordion (memória PCV-28).
      backgroundHover: 'background.subtle',
      backgroundActive: 'background.subtle',
      backgroundPressed: 'background.muted',
      // Tom `critical` — items destrutivos (Excluir, Remover etc.).
      criticalText: 'feedback.critical.solid',
      criticalIcon: 'feedback.critical.solid',
      criticalBackgroundHover: 'feedback.critical.bgSubtle',
      criticalBackgroundActive: 'feedback.critical.bgSubtle',
      criticalBackgroundPressed: 'feedback.critical.bgSubtle',
    },
  },
  label: {
    padding: { inline: 'small', block: 'tiny' },
    colors: {
      text: 'text.tertiary',
    },
    typography: {
      fontSize: 'xs',
      fontWeight: 'medium',
      letterSpacing: 'normal',
      textTransform: 'none',
    },
  },
  separator: {
    width: 'hairline',
    marginBlock: 'tiny',
    color: 'border.subtle',
  },
};
