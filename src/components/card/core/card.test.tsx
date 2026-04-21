import React from 'react';
import { render, screen } from '@testing-library/react';
import { Card } from './card';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

describe('Card', () => {
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

  it('aceita variant outlined', () => {
    render(<Card variant="outlined"><Card.Body>X</Card.Body></Card>, { wrapper });
    expect(screen.getByText('X')).toBeTruthy();
  });

  it('aceita variant elevated', () => {
    render(<Card variant="elevated"><Card.Body>X</Card.Body></Card>, { wrapper });
    expect(screen.getByText('X')).toBeTruthy();
  });

  it('aceita variant flat', () => {
    render(<Card variant="flat"><Card.Body>X</Card.Body></Card>, { wrapper });
    expect(screen.getByText('X')).toBeTruthy();
  });

  it('aceita padding none', () => {
    render(<Card padding="none"><Card.Body>X</Card.Body></Card>, { wrapper });
    expect(screen.getByText('X')).toBeTruthy();
  });

  it('aceita padding lg', () => {
    render(<Card padding="lg"><Card.Body>X</Card.Body></Card>, { wrapper });
    expect(screen.getByText('X')).toBeTruthy();
  });

  it('passa className extra', () => {
    const { container } = render(<Card className="my-card"><Card.Body>X</Card.Body></Card>, { wrapper });
    expect(container.querySelector('.my-card')).toBeTruthy();
  });

  it('variant hoverable adiciona classe arbor-card-hoverable', () => {
    const { container } = render(<Card variant="hoverable"><Card.Body>X</Card.Body></Card>, { wrapper });
    expect(container.querySelector('.arbor-card-hoverable')).toBeTruthy();
  });

  it('variant clickable adiciona classe arbor-card-clickable e cursor pointer', () => {
    const { container } = render(<Card variant="clickable"><Card.Body>X</Card.Body></Card>, { wrapper });
    expect(container.querySelector('.arbor-card-clickable')).toBeTruthy();
    const card = container.firstChild as HTMLElement;
    expect(card.style.cursor).toBe('pointer');
  });
});
