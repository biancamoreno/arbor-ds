import React, { createRef } from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { ArborProvider } from '../../../../ecosystem';
import { themeLight } from '../../../../foundations';
import { __resetStyleEngine__ } from '../../../../ecosystem/styled-system/core/styled/styled-component';
import { Image } from './image';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

afterEach(() => {
  const sheet = document.getElementById('arbor-style-engine');
  if (sheet) sheet.textContent = '';
  __resetStyleEngine__();
});

const SRC = 'https://arbor.dev/photo.jpg';

describe('Image — mode="img" (default)', () => {
  it('renderiza um <img> com src e alt', () => {
    render(<Image source={SRC} alt="Foto" />, { wrapper });
    const img = screen.getByAltText('Foto') as HTMLImageElement;
    expect(img.tagName).toBe('IMG');
    expect(img.getAttribute('src')).toBe(SRC);
  });

  it('aceita mode="img" explícito', () => {
    render(<Image mode="img" source={SRC} alt="Foto" />, { wrapper });
    expect(screen.getByAltText('Foto').tagName).toBe('IMG');
  });

  it('aplica object-fit derivado de resizeMode (default "cover")', () => {
    render(<Image source={SRC} alt="Foto" />, { wrapper });
    const style = screen.getByAltText('Foto').getAttribute('style') ?? '';
    expect(style).toMatch(/object-fit: ?cover/i);
  });

  it('resizeMode="contain" → object-fit:contain', () => {
    render(<Image source={SRC} alt="Foto" resizeMode="contain" />, { wrapper });
    const style = screen.getByAltText('Foto').getAttribute('style') ?? '';
    expect(style).toMatch(/object-fit: ?contain/i);
  });

  it('resizeMode="stretch" → object-fit:fill', () => {
    render(<Image source={SRC} alt="Foto" resizeMode="stretch" />, { wrapper });
    const style = screen.getByAltText('Foto').getAttribute('style') ?? '';
    expect(style).toMatch(/object-fit: ?fill/i);
  });

  it('mescla style inline do consumidor com object-fit gerado', () => {
    render(
      <Image source={SRC} alt="Foto" style={{ border: '1px solid red' }} />,
      { wrapper },
    );
    const style = screen.getByAltText('Foto').getAttribute('style') ?? '';
    expect(style).toMatch(/object-fit: ?cover/i);
    expect(style).toMatch(/border: ?1px solid red/i);
  });

  it('marca aria-busy enquanto carrega e remove ao concluir', () => {
    render(<Image source={SRC} alt="Foto" testID="img" />, { wrapper });
    const container = screen.getByTestId('img');
    expect(container.getAttribute('aria-busy')).toBe('true');

    act(() => {
      fireEvent.load(screen.getByAltText('Foto'));
    });
    expect(container.getAttribute('aria-busy')).toBeNull();
  });

  it('exibe skeleton default durante o loading e remove após o load', () => {
    const { container } = render(<Image source={SRC} alt="Foto" />, { wrapper });
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();

    act(() => {
      fireEvent.load(screen.getByAltText('Foto'));
    });
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it('exibe errorFallback default quando a imagem falha', () => {
    render(<Image source="invalid" alt="Foto" />, { wrapper });

    act(() => {
      fireEvent.error(screen.getByAltText('Foto'));
    });
    expect(screen.getByLabelText('Imagem indisponível')).toBeTruthy();
  });

  it('respeita fallback="none" e errorFallback="none"', () => {
    const { container } = render(
      <Image source={SRC} alt="Foto" fallback="none" errorFallback="none" />,
      { wrapper },
    );
    expect(container.querySelector('[aria-hidden="true"]')).toBeNull();

    act(() => {
      fireEvent.error(screen.getByAltText('Foto'));
    });
    expect(screen.queryByLabelText('Imagem indisponível')).toBeNull();
  });

  it('renderiza fallback customizado durante loading', () => {
    render(
      <Image
        source={SRC}
        alt="Foto"
        fallback={<span data-testid="custom-loading">carregando…</span>}
      />,
      { wrapper },
    );
    expect(screen.getByTestId('custom-loading')).toBeTruthy();
  });

  it('renderiza errorFallback customizado em erro', () => {
    render(
      <Image
        source={SRC}
        alt="Foto"
        errorFallback={<span data-testid="custom-error">indisponível</span>}
      />,
      { wrapper },
    );
    act(() => {
      fireEvent.error(screen.getByAltText('Foto'));
    });
    expect(screen.getByTestId('custom-error')).toBeTruthy();
  });

  it('propaga onLoad e onError com o evento', () => {
    const onLoad = jest.fn();
    const onError = jest.fn();
    render(
      <Image source={SRC} alt="Foto" onLoad={onLoad} onError={onError} />,
      { wrapper },
    );

    act(() => {
      fireEvent.load(screen.getByAltText('Foto'));
    });
    expect(onLoad).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.error(screen.getByAltText('Foto'));
    });
    expect(onError).toHaveBeenCalledTimes(1);
  });

  it('forwarda ref para o container', () => {
    const ref = createRef<HTMLElement>();
    render(<Image ref={ref} source={SRC} alt="Foto" testID="img" />, { wrapper });
    expect(ref.current).toBe(screen.getByTestId('img'));
  });
});

describe('Image — mode="background"', () => {
  it('renderiza um container com children sobreposto (não é <img>)', () => {
    render(
      <Image mode="background" source={SRC} testID="bg">
        <span data-testid="overlay-child">Legenda</span>
      </Image>,
      { wrapper },
    );
    expect(screen.getByTestId('overlay-child')).toBeTruthy();
    expect(screen.getByTestId('bg').tagName).not.toBe('IMG');
  });

  it('aplica alt como aria-label do container e role="img"', () => {
    render(
      <Image mode="background" source={SRC} alt="Banner" testID="bg">
        <span>conteúdo</span>
      </Image>,
      { wrapper },
    );
    const container = screen.getByTestId('bg');
    expect(container.getAttribute('aria-label')).toBe('Banner');
    expect(container.getAttribute('role')).toBe('img');
  });

  it('omite role/aria-label quando alt não é fornecido', () => {
    render(
      <Image mode="background" source={SRC} testID="bg">
        <span>x</span>
      </Image>,
      { wrapper },
    );
    const container = screen.getByTestId('bg');
    expect(container.getAttribute('aria-label')).toBeNull();
    expect(container.getAttribute('role')).toBeNull();
  });

  it('marca aria-busy durante o pré-load no modo background', () => {
    render(
      <Image mode="background" source={SRC} testID="bg">
        <span>x</span>
      </Image>,
      { wrapper },
    );
    expect(screen.getByTestId('bg').getAttribute('aria-busy')).toBe('true');
  });
});
