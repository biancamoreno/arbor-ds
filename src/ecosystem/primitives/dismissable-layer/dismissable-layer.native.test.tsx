import { render, screen } from '@testing-library/react-native';
import { BackHandler, Text } from 'react-native';
import { DismissableLayer } from './dismissable-layer';

describe('DismissableLayer (native)', () => {
  it('renders children', () => {
    render(
      <DismissableLayer>
        <Text>layer child</Text>
      </DismissableLayer>,
    );
    expect(screen.getByText('layer child')).toBeTruthy();
  });

  it('subscribes onDismiss to hardwareBackPress and unsubscribes on unmount', () => {
    const remove = jest.fn();
    const addEventListener = jest
      .spyOn(BackHandler, 'addEventListener')
      .mockReturnValue({ remove } as never);

    const onDismiss = jest.fn();
    const { unmount } = render(
      <DismissableLayer onDismiss={onDismiss}>
        <Text>layer child</Text>
      </DismissableLayer>,
    );

    expect(addEventListener).toHaveBeenCalledWith('hardwareBackPress', expect.any(Function));
    const handler = addEventListener.mock.calls[0][1] as () => boolean;
    expect(handler()).toBe(true);
    expect(onDismiss).toHaveBeenCalledTimes(1);

    unmount();
    expect(remove).toHaveBeenCalled();

    addEventListener.mockRestore();
  });

  it('does not subscribe when disableEscapeKey is true', () => {
    const addEventListener = jest.spyOn(BackHandler, 'addEventListener');
    addEventListener.mockClear();

    render(
      <DismissableLayer disableEscapeKey>
        <Text>layer child</Text>
      </DismissableLayer>,
    );
    expect(addEventListener).not.toHaveBeenCalled();
    addEventListener.mockRestore();
  });
});
