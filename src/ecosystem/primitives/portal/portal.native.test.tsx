import { render, screen } from '@testing-library/react-native';
import { Modal, View } from 'react-native';
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

  it('mode default ("modal") sets inner View pointerEvents="auto"', () => {
    render(
      <Portal>
        <></>
      </Portal>,
    );
    const innerView = screen.UNSAFE_getAllByType(View)[0];
    expect(innerView.props.pointerEvents).toBe('auto');
  });

  it('mode="overlay" sets inner View pointerEvents="box-none" so taps pass through transparent areas', () => {
    render(
      <Portal mode="overlay">
        <></>
      </Portal>,
    );
    const innerView = screen.UNSAFE_getAllByType(View)[0];
    expect(innerView.props.pointerEvents).toBe('box-none');
  });
});
