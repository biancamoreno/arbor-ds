import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { FocusScope } from './focus-scope';

describe('FocusScope (native)', () => {
  it('renders children (no-op trap on native)', () => {
    render(
      <FocusScope>
        <Text>focus child</Text>
      </FocusScope>,
    );
    expect(screen.getByText('focus child')).toBeTruthy();
  });
});
