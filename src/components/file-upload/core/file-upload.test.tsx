import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Field } from '../../field';
import { FileUpload } from './file-upload';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function renderUpload(ui: React.ReactElement) {
  return render(ui, { wrapper: Wrapper });
}

function makeFile(name: string, size: number, type = 'image/png'): File {
  const file = new File(['x'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

function getHiddenInput(container: HTMLElement): HTMLInputElement {
  const input = container.querySelector('input[type="file"]');
  if (!input) throw new Error('hidden file input not found');
  return input as HTMLInputElement;
}

describe('FileUpload standalone', () => {
  it('renders default drop zone with localized message', () => {
    renderUpload(<FileUpload />);
    expect(screen.getByText('Arraste e solte ou clique para enviar')).toBeTruthy();
  });

  it('renders sizeHint with formatted maxSize', () => {
    renderUpload(<FileUpload maxSize={1024 * 1024} />);
    expect(screen.getByText(/Máximo\s+1\s*MB/)).toBeTruthy();
  });

  it('renders loading state when loading=true', () => {
    renderUpload(<FileUpload loading />);
    expect(screen.getByText('Enviando...')).toBeTruthy();
    expect(screen.queryByText('Arraste e solte ou clique para enviar')).toBeNull();
  });

  it('forwards accept and multiple attributes to hidden input', () => {
    const { container } = renderUpload(<FileUpload accept="application/pdf" multiple />);
    const input = getHiddenInput(container);
    expect(input.accept).toBe('application/pdf');
    expect(input.multiple).toBe(true);
  });

  it('calls onFilesChange with valid files on change', () => {
    const onFilesChange = jest.fn();
    const { container } = renderUpload(
      <FileUpload onFilesChange={onFilesChange} maxSize={10_000} />,
    );
    const input = getHiddenInput(container);
    const file = makeFile('a.png', 5_000);
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFilesChange).toHaveBeenCalledTimes(1);
    expect(onFilesChange.mock.calls[0][0]).toEqual([file]);
  });

  it('rejects files that exceed maxSize', () => {
    const onFilesChange = jest.fn();
    const { container } = renderUpload(
      <FileUpload onFilesChange={onFilesChange} maxSize={1_000} />,
    );
    fireEvent.change(getHiddenInput(container), {
      target: { files: [makeFile('big.png', 5_000)] },
    });
    expect(onFilesChange).not.toHaveBeenCalled();
  });

  it('truncates to maxFiles when multiple=true', () => {
    const onFilesChange = jest.fn();
    const { container } = renderUpload(
      <FileUpload onFilesChange={onFilesChange} multiple maxFiles={2} maxSize={10_000} />,
    );
    fireEvent.change(getHiddenInput(container), {
      target: {
        files: [
          makeFile('a.png', 100),
          makeFile('b.png', 100),
          makeFile('c.png', 100),
        ],
      },
    });
    expect(onFilesChange).toHaveBeenCalledTimes(1);
    expect(onFilesChange.mock.calls[0][0]).toHaveLength(2);
  });

  it('opens file dialog when drop zone is clicked', () => {
    const { container } = renderUpload(<FileUpload />);
    const input = getHiddenInput(container);
    const click = jest.spyOn(input, 'click');
    fireEvent.click(screen.getByText('Arraste e solte ou clique para enviar'));
    expect(click).toHaveBeenCalled();
  });

  it('does NOT open file dialog when disabled', () => {
    const { container } = renderUpload(<FileUpload disabled />);
    const input = getHiddenInput(container);
    const click = jest.spyOn(input, 'click');
    fireEvent.click(screen.getByText('Arraste e solte ou clique para enviar'));
    expect(click).not.toHaveBeenCalled();
  });

  it('handles drop and forwards files', () => {
    const onFilesChange = jest.fn();
    const { container } = renderUpload(
      <FileUpload onFilesChange={onFilesChange} maxSize={10_000} />,
    );
    const dropZone = screen.getByText('Arraste e solte ou clique para enviar')
      .parentElement as HTMLElement;
    const file = makeFile('drop.png', 100);
    fireEvent.dragOver(dropZone, { dataTransfer: { files: [file] } });
    fireEvent.drop(dropZone, { dataTransfer: { files: [file] } });
    expect(onFilesChange).toHaveBeenCalledWith([file]);

    expect(getHiddenInput(container)).toBeTruthy();
  });

  it('does NOT handle drop when dragAndDrop=false', () => {
    const onFilesChange = jest.fn();
    renderUpload(
      <FileUpload dragAndDrop={false} onFilesChange={onFilesChange} maxSize={10_000} />,
    );
    const dropZone = screen.getByText('Arraste e solte ou clique para enviar')
      .parentElement as HTMLElement;
    fireEvent.drop(dropZone, { dataTransfer: { files: [makeFile('x.png', 100)] } });
    expect(onFilesChange).not.toHaveBeenCalled();
  });

  it('renders preview block when previewUrl is provided', () => {
    renderUpload(<FileUpload previewUrl="https://example.com/x.png" />);
    expect(screen.getByText('Arquivo enviado')).toBeTruthy();
    expect(screen.getByLabelText('Remover')).toBeTruthy();
  });

  it('calls onRemove when Remove button is clicked', () => {
    const onRemove = jest.fn();
    renderUpload(<FileUpload previewUrl="https://example.com/x.png" onRemove={onRemove} />);
    fireEvent.click(screen.getByLabelText('Remover'));
    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('renders error message when error prop is set and no Field context', () => {
    renderUpload(<FileUpload error="Arquivo inválido" />);
    expect(screen.getByText('Arquivo inválido')).toBeTruthy();
  });

  it('renders custom texts when provided', () => {
    renderUpload(
      <FileUpload
        texts={{
          dropZone: 'Drop here',
          sizeHint: (m) => `Up to ${m}`,
          uploading: 'Uploading',
        }}
      />,
    );
    expect(screen.getByText('Drop here')).toBeTruthy();
    expect(screen.getByText(/Up to/)).toBeTruthy();
  });

  it('drop zone is a button accessible via keyboard (Enter)', () => {
    const { container } = renderUpload(<FileUpload />);
    const input = getHiddenInput(container);
    const click = jest.spyOn(input, 'click');
    const dropZone = screen.getByText('Arraste e solte ou clique para enviar')
      .parentElement as HTMLButtonElement;
    expect(dropZone.tagName).toBe('BUTTON');
    expect(dropZone.getAttribute('type')).toBe('button');
    fireEvent.click(dropZone);
    expect(click).toHaveBeenCalled();
  });

  it('hidden input is focusable (visually-hidden, not display:none)', () => {
    const { container } = renderUpload(<FileUpload />);
    const input = getHiddenInput(container);
    expect(input.style.display).not.toBe('none');
    expect(input.style.position).toBe('absolute');
  });

  it('renders custom children inside drop zone', () => {
    renderUpload(
      <FileUpload>
        <span data-testid="custom-slot">Custom</span>
      </FileUpload>,
    );
    expect(screen.getByTestId('custom-slot')).toBeTruthy();
    expect(screen.queryByText('Arraste e solte ou clique para enviar')).toBeNull();
  });
});

describe('FileUpload FieldContext integration', () => {
  it('picks up fieldId from Field context', () => {
    const { container } = renderUpload(
      <Field id="upload-field">
        <Field.Control>
          <FileUpload />
        </Field.Control>
      </Field>,
    );
    expect(getHiddenInput(container).id).toBe('upload-field');
  });

  it('picks up disabled from FieldContext', () => {
    const { container } = renderUpload(
      <Field id="u" disabled>
        <Field.Control>
          <FileUpload />
        </Field.Control>
      </Field>,
    );
    expect(getHiddenInput(container).disabled).toBe(true);
  });

  it('picks up aria-required from Field', () => {
    const { container } = renderUpload(
      <Field id="u" required>
        <Field.Control>
          <FileUpload />
        </Field.Control>
      </Field>,
    );
    expect(getHiddenInput(container).getAttribute('aria-required')).toBe('true');
  });

  it('picks up aria-invalid and aria-errormessage when Field is invalid with Field.Error', () => {
    const { container } = renderUpload(
      <Field id="u" invalid>
        <Field.Control>
          <FileUpload />
        </Field.Control>
        <Field.Error>obrigatório</Field.Error>
      </Field>,
    );
    const input = getHiddenInput(container);
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-errormessage')).toBe('u-error');
  });

  it('picks up aria-describedby when Field.Description is present', () => {
    const { container } = renderUpload(
      <Field id="u">
        <Field.Control>
          <FileUpload />
        </Field.Control>
        <Field.Description>JPG/PNG até 5 MB</Field.Description>
      </Field>,
    );
    expect(getHiddenInput(container).getAttribute('aria-describedby')).toBe('u-description');
  });

  it('does NOT render local error when inside Field context', () => {
    renderUpload(
      <Field id="u" invalid>
        <Field.Control>
          <FileUpload error="local err" />
        </Field.Control>
        <Field.Error>field err</Field.Error>
      </Field>,
    );
    expect(screen.queryByText('local err')).toBeNull();
    expect(screen.getByText('field err')).toBeTruthy();
  });
});
