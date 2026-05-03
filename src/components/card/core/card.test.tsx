import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from './card';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

describe('Card (web)', () => {
  it('renderiza Card.Body com conteúdo', () => {
    render(<Card><Card.Body>Conteúdo</Card.Body></Card>, { wrapper });
    expect(screen.getByText('Conteúdo')).toBeTruthy();
  });

  it('renderiza Card.Header', () => {
    render(<Card><Card.Header>Título</Card.Header></Card>, { wrapper });
    expect(screen.getByText('Título')).toBeTruthy();
  });

  it('renderiza Card.Footer', () => {
    render(<Card><Card.Body>X</Card.Body><Card.Footer>Rodapé</Card.Footer></Card>, { wrapper });
    expect(screen.getByText('Rodapé')).toBeTruthy();
  });

  it('renderiza Card.Media', () => {
    render(<Card><Card.Media><img alt="media" src="x.jpg" /></Card.Media></Card>, { wrapper });
    expect(screen.getByAltText('media')).toBeTruthy();
  });

  describe('variants', () => {
    it.each(['outlined', 'elevated', 'flat'] as const)('aceita variant %s', (variant) => {
      render(<Card variant={variant}><Card.Body>X</Card.Body></Card>, { wrapper });
      expect(screen.getByText('X')).toBeTruthy();
    });
  });

  describe('paddings (SP-1)', () => {
    it.each(['none', 'xsmall', 'small', 'medium', 'large', 'xlarge'] as const)(
      'aceita padding %s',
      (padding) => {
        render(<Card padding={padding}><Card.Body>X</Card.Body></Card>, { wrapper });
        expect(screen.getByText('X')).toBeTruthy();
      },
    );
  });

  describe('Card decorativo', () => {
    it('renderiza como <div>, sem botão', () => {
      render(<Card><Card.Body>X</Card.Body></Card>, { wrapper });
      expect(screen.queryByRole('button')).toBeNull();
    });

    it('passa className extra', () => {
      const { container } = render(
        <Card className="my-card"><Card.Body>X</Card.Body></Card>,
        { wrapper },
      );
      expect(container.querySelector('.my-card')).toBeTruthy();
    });
  });

  describe('Card interativo', () => {
    it('renderiza como <button> com aria-label', () => {
      render(
        <Card interactive onClick={() => {}} aria-label="Abrir produto">
          <Card.Body>X</Card.Body>
        </Card>,
        { wrapper },
      );
      const button = screen.getByRole('button', { name: 'Abrir produto' });
      expect(button.tagName).toBe('BUTTON');
    });

    it('dispara onClick', () => {
      const handleClick = jest.fn();
      render(
        <Card interactive onClick={handleClick} aria-label="Abrir">
          <Card.Body>X</Card.Body>
        </Card>,
        { wrapper },
      );
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Card.Media edge-to-edge', () => {
    it.each(['none', 'xsmall', 'small', 'medium', 'large', 'xlarge'] as const)(
      'não aplica margin negativa em padding %s',
      (padding) => {
        const { container } = render(
          <Card padding={padding}>
            <Card.Media><img alt="m" src="x.jpg" /></Card.Media>
            <Card.Body>X</Card.Body>
          </Card>,
          { wrapper },
        );
        const media = container.querySelector('img')!.parentElement!;
        const styleAttr = media.getAttribute('style') ?? '';
        expect(styleAttr).not.toMatch(/margin:\s*-/);
      },
    );
  });

  describe('CSS global removido', () => {
    it('não adiciona classes arbor-card-hoverable/clickable', () => {
      const { container } = render(
        <Card interactive onClick={() => {}} aria-label="x">
          <Card.Body>X</Card.Body>
        </Card>,
        { wrapper },
      );
      expect(container.querySelector('.arbor-card-hoverable')).toBeNull();
      expect(container.querySelector('.arbor-card-clickable')).toBeNull();
    });
  });
});
