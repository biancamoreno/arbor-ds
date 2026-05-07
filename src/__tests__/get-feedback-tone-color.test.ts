import { getFeedbackToneColor } from '../foundations/theme/get-feedback-tone-color';
import { themeLight } from '../foundations/theme/themeLight';
import { themeDark } from '../foundations/theme/themeDark';
import type { ArborTheme } from '../foundations/theme/Theme';
import type { FeedbackTone, FeedbackToneSlot } from '../foundations/tokens/semantics/color/feedback-tone';

const TONES: FeedbackTone[] = ['neutral', 'brand', 'success', 'warning', 'critical', 'info'];
const SLOTS: FeedbackToneSlot[] = ['subtle', 'base', 'strong'];

const themes: Array<[string, ArborTheme]> = [
  ['themeLight', themeLight as unknown as ArborTheme],
  ['themeDark', themeDark as unknown as ArborTheme],
];

describe('getFeedbackToneColor', () => {
  describe.each(themes)('%s', (_name, theme) => {
    test.each(SLOTS)('neutral × %s resolve para text/background', (slot) => {
      const result = getFeedbackToneColor(theme, 'neutral', slot);
      const expected =
        slot === 'subtle' ? theme.colors.background.subtle :
        slot === 'strong' ? theme.colors.text.primary :
        theme.colors.text.secondary;
      expect(result).toBe(expected);
    });

    test.each(SLOTS)('brand × %s resolve para papel canônico em colors.brand', (slot) => {
      const result = getFeedbackToneColor(theme, 'brand', slot);
      const expected =
        slot === 'subtle' ? theme.colors.brand.bgElement :
        slot === 'strong' ? theme.colors.brand.text :
        theme.colors.brand.solid;
      expect(result).toBe(expected);
    });

    test.each(['success', 'warning', 'critical', 'info'] as const)(
      '%s consome papel canônico em colors.feedback.{tone}',
      (tone) => {
        SLOTS.forEach((slot) => {
          const expected =
            slot === 'subtle' ? theme.colors.feedback[tone].bgElement :
            slot === 'strong' ? theme.colors.feedback[tone].text :
            theme.colors.feedback[tone].solid;
          expect(getFeedbackToneColor(theme, tone, slot)).toBe(expected);
        });
      },
    );
  });

  test('cobre 6 tones × 3 slots × 2 themes (36 combinações)', () => {
    const seen = new Set<string>();
    themes.forEach(([name, theme]) => {
      TONES.forEach((tone) => {
        SLOTS.forEach((slot) => {
          const result = getFeedbackToneColor(theme, tone, slot);
          expect(typeof result).toBe('string');
          expect(result.length).toBeGreaterThan(0);
          seen.add(`${name}:${tone}:${slot}`);
        });
      });
    });
    expect(seen.size).toBe(36);
  });

  test('override de tema propaga via createTheme', () => {
    // Smoke: trocar feedback.warning.solid num override e confirmar que o helper lê o novo valor.
    const overridden: ArborTheme = {
      ...(themeLight as unknown as ArborTheme),
      colors: {
        ...themeLight.colors,
        feedback: {
          ...themeLight.colors.feedback,
          warning: {
            ...themeLight.colors.feedback.warning,
            solid: '#FF00FF',
          },
        },
      },
    };
    expect(getFeedbackToneColor(overridden, 'warning', 'base')).toBe('#FF00FF');
    // Outros slots intocados.
    expect(getFeedbackToneColor(overridden, 'warning', 'subtle')).toBe(
      themeLight.colors.feedback.warning.bgElement,
    );
  });
});
