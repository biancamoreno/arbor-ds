import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Text } from '../../core/text';
import { Carousel } from './carousel.native';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function fireLayout(testID: string, width = 300, height = 200) {
  const el = screen.getByTestId(testID);
  fireEvent(el, 'layout', { nativeEvent: { layout: { x: 0, y: 0, width, height } } });
}

describe('Carousel (native) — render + a11y', () => {
  it('Root expõe accessibilityLabel obrigatório', () => {
    render(
      <Carousel ariaLabel="Produtos em destaque" testID="root">
        <Carousel.Content testID="content">
          <Carousel.Item><Text>A</Text></Carousel.Item>
          <Carousel.Item><Text>B</Text></Carousel.Item>
        </Carousel.Content>
      </Carousel>,
      { wrapper: Wrapper },
    );
    expect(screen.getByLabelText('Produtos em destaque')).toBeTruthy();
  });

  it('Items recebem accessibilityLabel "N de M" (sem palavra "slide" — APG)', async () => {
    render(
      <Carousel
        ariaLabel="X"
        testID="root"
        nativeListProps={{ initialNumToRender: 10 }}
      >
        <Carousel.Content testID="content">
          <Carousel.Item><Text>A</Text></Carousel.Item>
          <Carousel.Item><Text>B</Text></Carousel.Item>
          <Carousel.Item><Text>C</Text></Carousel.Item>
        </Carousel.Content>
      </Carousel>,
      { wrapper: Wrapper },
    );
    // Antes do layout, o Content é placeholder. Disparamos onLayout para montar a FlatList.
    await act(async () => {
      fireLayout('content', 300);
    });

    // FlatList em jest-expo só monta o primeiro item visível (virtualização);
    // garantimos que (a) o pattern "N de M" está aplicado e (b) "slide"
    // NÃO aparece no label (APG).
    expect(screen.getByLabelText('1 de 3')).toBeTruthy();
    expect(screen.queryByLabelText(/slide/i)).toBeNull();
  });
});

describe('Carousel (native) — Indicators dual pattern', () => {
  it('Tabs pattern (slidesPerView=1, total ≤ 7) usa accessibilityRole="tab"', async () => {
    render(
      <Carousel ariaLabel="X" slidesPerView={1}>
        <Carousel.Content testID="content">
          <Carousel.Item><Text>A</Text></Carousel.Item>
          <Carousel.Item><Text>B</Text></Carousel.Item>
        </Carousel.Content>
        <Carousel.Indicators />
      </Carousel>,
      { wrapper: Wrapper },
    );
    await act(async () => {
      fireLayout('content', 300);
    });

    const tabs = screen.getAllByRole('tab');
    expect(tabs.length).toBe(2);
    expect(tabs[0].props.accessibilityState?.selected).toBe(true);
    expect(tabs[1].props.accessibilityState?.selected).toBe(false);
  });

  it('Group pattern (>7) NÃO usa role="tab"', async () => {
    render(
      <Carousel ariaLabel="X" slidesPerView={1}>
        <Carousel.Content testID="content">
          {Array.from({ length: 8 }, (_, i) => (
            <Carousel.Item key={i}><Text>{String(i)}</Text></Carousel.Item>
          ))}
        </Carousel.Content>
        <Carousel.Indicators />
      </Carousel>,
      { wrapper: Wrapper },
    );
    await act(async () => {
      fireLayout('content', 300);
    });

    expect(screen.queryAllByRole('tab').length).toBe(0);
    // Os indicators viram buttons individuais
    const buttons = screen.queryAllByRole('button');
    const slideButtons = buttons.filter((b) =>
      typeof b.props.accessibilityLabel === 'string' &&
      b.props.accessibilityLabel.startsWith('Ir para slide'),
    );
    expect(slideButtons.length).toBe(8);
  });
});

describe('Carousel (native) — navegação', () => {
  it('Previous é disabled em activeIndex=0', () => {
    render(
      <Carousel ariaLabel="X" defaultActiveIndex={0}>
        <Carousel.Content testID="content">
          <Carousel.Item><Text>A</Text></Carousel.Item>
          <Carousel.Item><Text>B</Text></Carousel.Item>
        </Carousel.Content>
        <Carousel.Previous />
        <Carousel.Next />
      </Carousel>,
      { wrapper: Wrapper },
    );

    const prev = screen.getByLabelText('Slide anterior');
    expect(prev.props.accessibilityState?.disabled).toBe(true);
  });

  it('click em Indicator atualiza activeIndex (controlled)', async () => {
    const onChange = jest.fn();
    render(
      <Carousel ariaLabel="X" defaultActiveIndex={0} onActiveIndexChange={onChange}>
        <Carousel.Content testID="content">
          <Carousel.Item><Text>A</Text></Carousel.Item>
          <Carousel.Item><Text>B</Text></Carousel.Item>
        </Carousel.Content>
        <Carousel.Indicators />
      </Carousel>,
      { wrapper: Wrapper },
    );
    await act(async () => {
      fireLayout('content', 300);
    });
    const tabs = screen.getAllByRole('tab');
    fireEvent.press(tabs[1]);
    expect(onChange).toHaveBeenCalledWith(1);
  });
});

describe('Carousel (native) — autoplay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });

  it('avança ao próximo slide a cada interval (loop soft)', async () => {
    const onChange = jest.fn();
    render(
      <Carousel
        ariaLabel="X"
        onActiveIndexChange={onChange}
        autoplay={{ interval: 1000, pauseOnInteraction: false }}
      >
        <Carousel.Content testID="content">
          <Carousel.Item><Text>A</Text></Carousel.Item>
          <Carousel.Item><Text>B</Text></Carousel.Item>
        </Carousel.Content>
        <Carousel.PlayPause />
      </Carousel>,
      { wrapper: Wrapper },
    );
    await act(async () => {
      fireLayout('content', 300);
    });

    expect(onChange).not.toHaveBeenCalled();
    act(() => { jest.advanceTimersByTime(1000); });
    expect(onChange).toHaveBeenLastCalledWith(1);
    // wrap soft: 1 (último) → 0
    act(() => { jest.advanceTimersByTime(1000); });
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it('Carousel.PlayPause não renderiza quando autoplay=false', () => {
    render(
      <Carousel ariaLabel="X">
        <Carousel.Content testID="content">
          <Carousel.Item><Text>A</Text></Carousel.Item>
        </Carousel.Content>
        <Carousel.PlayPause />
      </Carousel>,
      { wrapper: Wrapper },
    );
    expect(screen.queryByLabelText(/Pausar|Reproduzir/)).toBeNull();
  });

  it('PlayPause toggla pause manual', () => {
    render(
      <Carousel
        ariaLabel="X"
        autoplay={{ interval: 1000, pauseOnInteraction: false }}
      >
        <Carousel.Content testID="content">
          <Carousel.Item><Text>A</Text></Carousel.Item>
        </Carousel.Content>
        <Carousel.PlayPause />
      </Carousel>,
      { wrapper: Wrapper },
    );
    expect(screen.getByLabelText('Pausar autoplay')).toBeTruthy();
    fireEvent.press(screen.getByLabelText('Pausar autoplay'));
    expect(screen.getByLabelText('Reproduzir autoplay')).toBeTruthy();
  });
});

describe('Carousel (native) — orientation', () => {
  it('default horizontal: FlatList recebe horizontal=true', async () => {
    render(
      <Carousel ariaLabel="X">
        <Carousel.Content testID="content">
          <Carousel.Item><Text>A</Text></Carousel.Item>
          <Carousel.Item><Text>B</Text></Carousel.Item>
        </Carousel.Content>
      </Carousel>,
      { wrapper: Wrapper },
    );
    await act(async () => { fireLayout('content', 300, 200); });
    const list = screen.getByTestId('content');
    expect(list.props.horizontal).toBe(true);
  });

  it('vertical: FlatList recebe horizontal=false', async () => {
    render(
      <Carousel ariaLabel="X" orientation="vertical">
        <Carousel.Content testID="content">
          <Carousel.Item><Text>A</Text></Carousel.Item>
          <Carousel.Item><Text>B</Text></Carousel.Item>
        </Carousel.Content>
      </Carousel>,
      { wrapper: Wrapper },
    );
    await act(async () => { fireLayout('content', 300, 400); });
    const list = screen.getByTestId('content');
    expect(list.props.horizontal).toBe(false);
  });
});

describe('Carousel (native) — lazy mounting', () => {
  it('lazy=true: FlatList recebe windowSize=3 e removeClippedSubviews=true por default', async () => {
    render(
      <Carousel ariaLabel="X" lazy>
        <Carousel.Content testID="content">
          <Carousel.Item><Text>A</Text></Carousel.Item>
          <Carousel.Item><Text>B</Text></Carousel.Item>
        </Carousel.Content>
      </Carousel>,
      { wrapper: Wrapper },
    );
    await act(async () => { fireLayout('content', 300, 200); });
    const list = screen.getByTestId('content');
    expect(list.props.windowSize).toBe(3);
    expect(list.props.removeClippedSubviews).toBe(true);
  });

  it('lazy=false: defaults da RN preservados (windowSize undefined)', async () => {
    render(
      <Carousel ariaLabel="X">
        <Carousel.Content testID="content">
          <Carousel.Item><Text>A</Text></Carousel.Item>
          <Carousel.Item><Text>B</Text></Carousel.Item>
        </Carousel.Content>
      </Carousel>,
      { wrapper: Wrapper },
    );
    await act(async () => { fireLayout('content', 300, 200); });
    const list = screen.getByTestId('content');
    expect(list.props.windowSize).toBeUndefined();
  });

  it('lazy=true + nativeListProps.windowSize: consumidor sobrescreve default', async () => {
    render(
      <Carousel ariaLabel="X" lazy nativeListProps={{ windowSize: 7 }}>
        <Carousel.Content testID="content">
          <Carousel.Item><Text>A</Text></Carousel.Item>
          <Carousel.Item><Text>B</Text></Carousel.Item>
        </Carousel.Content>
      </Carousel>,
      { wrapper: Wrapper },
    );
    await act(async () => { fireLayout('content', 300, 200); });
    const list = screen.getByTestId('content');
    expect(list.props.windowSize).toBe(7);
  });
});

describe('Carousel (native) — render prop', () => {
  it('Indicators chama children render prop com {index, active, total}', async () => {
    render(
      <Carousel ariaLabel="X">
        <Carousel.Content testID="content">
          <Carousel.Item><Text>A</Text></Carousel.Item>
          <Carousel.Item><Text>B</Text></Carousel.Item>
        </Carousel.Content>
        <Carousel.Indicators>
          {({ index, active, total }) => (
            <Text key={index} testID={`dot-${index}`}>
              {index + 1}/{total}/{active ? 'on' : 'off'}
            </Text>
          )}
        </Carousel.Indicators>
      </Carousel>,
      { wrapper: Wrapper },
    );
    await act(async () => {
      fireLayout('content', 300);
    });

    expect(screen.getByTestId('dot-0').props.children.join('')).toBe('1/2/on');
    expect(screen.getByTestId('dot-1').props.children.join('')).toBe('2/2/off');
  });
});
