import type { Token } from '../../../../ecosystem';
import type { ArborTheme } from '../../../../foundations';

export type PressFeedbackVariant = 'default' | 'highlight';

/**
 * @platform shared
 * Camada de feedback visual para interações de press, ativada via `:active` CSS.
 * Renderiza overlay absoluto que cobre o ancestral interativo posicionado.
 *
 * Composição típica como filho irmão dos children dentro de um `<Clickable>`:
 * ```tsx
 * <Clickable onClick={...}>
 *   <PressFeedback variant="default" />
 *   <Text>Click me</Text>
 * </Clickable>
 * ```
 */
export type PressFeedbackProps = {
  variant?: PressFeedbackVariant;
  borderRadius?: Token<ArborTheme['radii']>;
  borderBottomLeftRadius?: Token<ArborTheme['radii']>;
  borderBottomRightRadius?: Token<ArborTheme['radii']>;
  testID?: string;
};
