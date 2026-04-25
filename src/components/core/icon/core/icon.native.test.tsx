import { render, screen } from '@testing-library/react-native';
import { Icon } from './icon';

describe('Icon (native)', () => {
  it('returns null when name does not match a Lucide export', () => {
    const { toJSON } = render(<Icon name={'not-a-real-icon' as never} decorative />);
    expect(toJSON()).toBeNull();
  });

  it('renders an SVG icon when name matches', () => {
    render(<Icon name="Plus" aria-label="add" decorative={false} />);
    const matches = screen.getAllByLabelText('add');
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].props.accessibilityElementsHidden).toBe(false);
  });

  it('hides from a11y when decorative', () => {
    const { toJSON } = render(<Icon name="Plus" decorative />);
    expect(toJSON()).toBeTruthy();
  });
});
