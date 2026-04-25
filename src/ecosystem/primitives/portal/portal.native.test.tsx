import { render, screen } from '@testing-library/react-native';
import { Modal } from 'react-native';
import { Portal } from './portal';

describe('Portal (native)', () => {
  it('renders children inside an RN Modal', () => {
    render(
      <Portal>
        <></>
      </Portal>,
    );
    expect(screen.UNSAFE_getByType(Modal)).toBeTruthy();
  });
});
