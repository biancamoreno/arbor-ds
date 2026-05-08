import { fontWeight as primitiveFontWeight } from '../../primitives';

export const fontWeight = {
  /**
   * value: 400
   */
  regular: primitiveFontWeight[400],
  /**
   * value: 500
   */
  medium: primitiveFontWeight[500],
  /**
   * value: 600 — peso padrão de heading moderno (Linear/Vercel/Stripe).
   */
  semibold: primitiveFontWeight[600],
  /**
   * value: 600 — alinhado a `semibold` por decisão da RFC-0041.
   * Heading "bold" pesa 600, não 700, para identidade contemporânea.
   */
  bold: primitiveFontWeight[600],
  /**
   * value: 700 — preservado para casos de ênfase máxima.
   */
  extrabold: primitiveFontWeight[700],
};
