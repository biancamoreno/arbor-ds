import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Chip } from './chip';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

describe('Chip', () => {
  it('renderiza label', () => {
    render(<Chip><Chip.Label>React</Chip.Label></Chip>, { wrapper });
    expect(screen.getByText('React')).toBeTruthy();
  });

  it('é um <span>', () => {
    const { container } = render(<Chip><Chip.Label>X</Chip.Label></Chip>, { wrapper });
    expect(container.firstChild?.nodeName).toBe('SPAN');
  });

  it('aceita variant filled', () => {
    render(<Chip variant="filled"><Chip.Label>F</Chip.Label></Chip>, { wrapper });
    expect(screen.getByText('F')).toBeTruthy();
  });

  it('aceita variant outlined', () => {
    render(<Chip variant="outlined"><Chip.Label>O</Chip.Label></Chip>, { wrapper });
    expect(screen.getByText('O')).toBeTruthy();
  });

  it('aceita selected=true', () => {
    render(<Chip selected><Chip.Label>Sel</Chip.Label></Chip>, { wrapper });
    expect(screen.getByText('Sel')).toBeTruthy();
  });

  it('aceita tone brand', () => {
    render(<Chip tone="brand"><Chip.Label>Brand</Chip.Label></Chip>, { wrapper });
    expect(screen.getByText('Brand')).toBeTruthy();
  });

  it('aceita size sm', () => {
    render(<Chip size="sm"><Chip.Label>Sm</Chip.Label></Chip>, { wrapper });
    expect(screen.getByText('Sm')).toBeTruthy();
  });

  it('Chip.Remove tem aria-label padrão', () => {
    render(
      <Chip><Chip.Label>Tag</Chip.Label><Chip.Remove /></Chip>,
      { wrapper }
    );
    expect(screen.getByLabelText('Remover')).toBeTruthy();
  });

  it('Chip.Remove aceita label customizado', () => {
    render(
      <Chip><Chip.Label>Tag</Chip.Label><Chip.Remove label="Excluir filtro" /></Chip>,
      { wrapper }
    );
    expect(screen.getByLabelText('Excluir filtro')).toBeTruthy();
  });

  it('Chip.Remove dispara onClick', () => {
    const onRemove = jest.fn();
    render(
      <Chip><Chip.Label>Tag</Chip.Label><Chip.Remove onClick={onRemove} /></Chip>,
      { wrapper }
    );
    fireEvent.click(screen.getByLabelText('Remover'));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('disabled desativa o botão Remove', () => {
    render(
      <Chip disabled><Chip.Label>Dis</Chip.Label><Chip.Remove /></Chip>,
      { wrapper }
    );
    expect((screen.getByLabelText('Remover') as HTMLButtonElement).disabled).toBe(true);
  });

  it('Chip.Icon tem aria-hidden', () => {
    const { container } = render(
      <Chip><Chip.Icon>★</Chip.Icon><Chip.Label>Star</Chip.Label></Chip>,
      { wrapper }
    );
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy();
  });
});
