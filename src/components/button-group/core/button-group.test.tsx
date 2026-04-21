import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ButtonGroup } from './button-group';
import { Button } from '../../button';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

describe('ButtonGroup', () => {
  it('renderiza children corretamente', () => {
    render(
      <ButtonGroup aria-label="Ações">
        <Button>Cancelar</Button>
        <Button variant="primary">Confirmar</Button>
      </ButtonGroup>,
      { wrapper },
    );
    expect(screen.getByText('Cancelar')).toBeTruthy();
    expect(screen.getByText('Confirmar')).toBeTruthy();
  });

  it('tem role="group" no container', () => {
    render(
      <ButtonGroup aria-label="Ações">
        <Button>A</Button>
      </ButtonGroup>,
      { wrapper },
    );
    expect(screen.getByRole('group')).toBeTruthy();
  });

  it('aplica aria-label no container', () => {
    render(
      <ButtonGroup aria-label="Ações do formulário">
        <Button>A</Button>
      </ButtonGroup>,
      { wrapper },
    );
    expect(screen.getByRole('group', { name: 'Ações do formulário' })).toBeTruthy();
  });

  it('emite warning quando aria-label e aria-labelledby estão ausentes', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <ButtonGroup>
        <Button>A</Button>
      </ButtonGroup>,
      { wrapper },
    );
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('[ButtonGroup]'));
    spy.mockRestore();
  });

  it('propaga isDisabled para filhos via context', () => {
    const onClick = jest.fn();
    render(
      <ButtonGroup aria-label="Ações" isDisabled>
        <Button onClick={onClick}>Ação</Button>
      </ButtonGroup>,
      { wrapper },
    );
    fireEvent.click(screen.getByRole('button', { name: 'Ação' }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('orientation vertical renderiza com múltiplos botões', () => {
    render(
      <ButtonGroup aria-label="Ações" orientation="vertical">
        <Button>A</Button>
        <Button>B</Button>
      </ButtonGroup>,
      { wrapper },
    );
    expect(screen.getByRole('group')).toBeTruthy();
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });

  it('attached=true renderiza botões adjacentes sem gap', () => {
    render(
      <ButtonGroup aria-label="Formatação" attached>
        <Button>Esq</Button>
        <Button>Centro</Button>
        <Button>Dir</Button>
      </ButtonGroup>,
      { wrapper },
    );
    expect(screen.getAllByRole('button')).toHaveLength(3);
    const group = screen.getByRole('group');
    expect(group.style.gap).toBe('');
  });
});
