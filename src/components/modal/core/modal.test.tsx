import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './modal';
import { ArborProvider } from '../../../ecosystem';
import { themeLight } from '../../../foundations';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ArborProvider theme={themeLight}>{children}</ArborProvider>
);

describe('Modal', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    act(() => { jest.runAllTimers(); });
    jest.useRealTimers();
  });

  it('não renderiza quando open=false', () => {
    render(<Modal open={false} onOpenChange={jest.fn()} />, { wrapper });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renderiza quando open=true', () => {
    render(<Modal open title="Meu Modal" onOpenChange={jest.fn()} />, { wrapper });
    act(() => { jest.runAllTimers(); });
    expect(screen.getByRole('dialog')).toBeTruthy();
  });

  it('renderiza título', () => {
    render(<Modal open title="Título do Modal" onOpenChange={jest.fn()} />, { wrapper });
    act(() => { jest.runAllTimers(); });
    expect(screen.getByText('Título do Modal')).toBeTruthy();
  });

  it('renderiza description', () => {
    render(<Modal open title="T" description="Descrição do modal" onOpenChange={jest.fn()} />, { wrapper });
    act(() => { jest.runAllTimers(); });
    expect(screen.getByText('Descrição do modal')).toBeTruthy();
  });

  it('chama onOpenChange ao clicar no botão fechar', () => {
    const onOpenChange = jest.fn();
    render(<Modal open title="T" onOpenChange={onOpenChange} />, { wrapper });
    act(() => { jest.runAllTimers(); });
    fireEvent.click(screen.getByLabelText('Close modal'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('chama onOpenChange ao pressionar Escape', () => {
    const onOpenChange = jest.fn();
    render(<Modal open title="T" onOpenChange={onOpenChange} />, { wrapper });
    act(() => { jest.runAllTimers(); });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('chama onOpenChange ao clicar no overlay quando closeOnOverlayClick=true', () => {
    const onOpenChange = jest.fn();
    render(<Modal open title="T" closeOnOverlayClick onOpenChange={onOpenChange} />, { wrapper });
    act(() => { jest.runAllTimers(); });
    fireEvent.click(screen.getByRole('presentation'));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('não chama onOpenChange ao clicar no overlay quando closeOnOverlayClick=false', () => {
    const onOpenChange = jest.fn();
    render(<Modal open title="T" closeOnOverlayClick={false} onOpenChange={onOpenChange} />, { wrapper });
    act(() => { jest.runAllTimers(); });
    fireEvent.click(screen.getByRole('presentation'));
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('desmonta após animação de saída (200ms)', () => {
    const { rerender } = render(<Modal open title="T" onOpenChange={jest.fn()} />, { wrapper });
    act(() => { jest.runAllTimers(); });
    expect(screen.getByRole('dialog')).toBeTruthy();

    rerender(<ArborProvider theme={themeLight}><Modal open={false} title="T" onOpenChange={jest.fn()} /></ArborProvider>);
    act(() => { jest.advanceTimersByTime(250); });

    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('tem aria-modal=true', () => {
    render(<Modal open title="T" onOpenChange={jest.fn()} />, { wrapper });
    act(() => { jest.runAllTimers(); });
    expect(screen.getByRole('dialog').getAttribute('aria-modal')).toBe('true');
  });
});
