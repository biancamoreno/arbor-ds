import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { createTheme, themeLight } from '../../../foundations';
import { ArborProvider } from '../../../ecosystem/styled-system';
import { Field } from '../../field';
import { Select } from './select';
import type { SelectOption } from '../interfaces/SelectProps';
import { extractDisplayText, normalizeForTypeahead } from '../utils/extract-display-text';

const theme = createTheme(themeLight, {});

function Wrapper({ children }: { children: React.ReactNode }) {
  return <ArborProvider theme={theme}>{children}</ArborProvider>;
}

function renderSelect(ui: React.ReactElement) {
  return render(ui, { wrapper: Wrapper });
}

function BasicSelect({
  value,
  onValueChange,
  disabled,
  defaultValue = '',
}: {
  value?: string;
  onValueChange?: (v: string) => void;
  disabled?: boolean;
  defaultValue?: string;
}) {
  return (
    <Select defaultValue={defaultValue} onValueChange={onValueChange} disabled={disabled} value={value}>
      <Select.Trigger>
        <Select.Value placeholder="Pick one" />
      </Select.Trigger>
      <Select.Content>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
        <Select.Item value="cherry" disabled>Cherry (disabled)</Select.Item>
      </Select.Content>
    </Select>
  );
}

describe('Select.Root', () => {
  it('renders the trigger', () => {
    renderSelect(<BasicSelect />);
    expect(screen.getByRole('combobox')).toBeTruthy();
  });

  it('shows placeholder when no value selected', () => {
    renderSelect(<BasicSelect />);
    expect(screen.getByText('Pick one')).toBeTruthy();
  });

  it('content is hidden when closed', () => {
    renderSelect(<BasicSelect />);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('opens content on trigger click', () => {
    renderSelect(<BasicSelect />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeTruthy();
  });

  it('shows items when open', () => {
    renderSelect(<BasicSelect />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('Apple')).toBeTruthy();
    expect(screen.getByText('Banana')).toBeTruthy();
  });

  it('closes on item selection', () => {
    renderSelect(<BasicSelect />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Apple'));
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('calls onValueChange with selected value', () => {
    const onValueChange = jest.fn();
    renderSelect(<BasicSelect onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Apple'));
    expect(onValueChange).toHaveBeenCalledWith('apple');
  });

  it('shows display-text (not value) after selection', () => {
    renderSelect(<BasicSelect />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Banana'));
    // SelectValue mostra display-text "Banana", não o value cru "banana".
    expect(screen.getByRole('combobox').textContent).toContain('Banana');
    expect(screen.getByRole('combobox').textContent).not.toContain('banana');
  });

  it('closes on Escape key from the trigger', () => {
    renderSelect(<BasicSelect />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeTruthy();
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('toggles open/close on trigger click', () => {
    renderSelect(<BasicSelect />);
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeTruthy();
    fireEvent.click(trigger);
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('is disabled when disabled=true', () => {
    renderSelect(<BasicSelect disabled />);
    expect((screen.getByRole('combobox') as HTMLButtonElement).disabled).toBe(true);
  });

  it('does not open when disabled', () => {
    renderSelect(<BasicSelect disabled />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});

describe('Select.Item', () => {
  it('renders items with role="option"', () => {
    renderSelect(<BasicSelect />);
    fireEvent.click(screen.getByRole('combobox'));
    const options = screen.getAllByRole('option');
    expect(options.length).toBe(3);
  });

  it('disabled item has aria-disabled', () => {
    renderSelect(<BasicSelect />);
    fireEvent.click(screen.getByRole('combobox'));
    const disabledItem = screen.getByText('Cherry (disabled)').closest('[role="option"]');
    expect(disabledItem?.getAttribute('aria-disabled')).toBe('true');
  });

  it('does not call onValueChange for disabled item', () => {
    const onValueChange = jest.fn();
    renderSelect(<BasicSelect onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Cherry (disabled)'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('selected item has aria-selected=true', () => {
    renderSelect(<BasicSelect defaultValue="apple" />);
    fireEvent.click(screen.getByRole('combobox'));
    const options = screen.getAllByRole('option');
    const apple = options.find(o => o.textContent === 'Apple');
    expect(apple?.getAttribute('aria-selected')).toBe('true');
  });
});

describe('Select trigger a11y', () => {
  it('has role="combobox"', () => {
    renderSelect(<BasicSelect />);
    expect(screen.getByRole('combobox')).toBeTruthy();
  });

  it('has aria-expanded=false when closed', () => {
    renderSelect(<BasicSelect />);
    expect(screen.getByRole('combobox').getAttribute('aria-expanded')).toBe('false');
  });

  it('has aria-expanded=true when open', () => {
    renderSelect(<BasicSelect />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('combobox').getAttribute('aria-expanded')).toBe('true');
  });

  it('has aria-haspopup="listbox"', () => {
    renderSelect(<BasicSelect />);
    expect(screen.getByRole('combobox').getAttribute('aria-haspopup')).toBe('listbox');
  });

  it('has aria-controls pointing to the listbox id', () => {
    renderSelect(<BasicSelect />);
    fireEvent.click(screen.getByRole('combobox'));
    const trigger = screen.getByRole('combobox');
    const listbox = screen.getByRole('listbox');
    expect(trigger.getAttribute('aria-controls')).toBe(listbox.getAttribute('id'));
  });

  it('exposes aria-activedescendant when open and points to an option id', () => {
    renderSelect(<BasicSelect />);
    fireEvent.click(screen.getByRole('combobox'));
    const trigger = screen.getByRole('combobox');
    const activeId = trigger.getAttribute('aria-activedescendant');
    expect(activeId).toBeTruthy();
    const options = screen.getAllByRole('option');
    expect(options.some(o => o.id === activeId)).toBe(true);
  });

  it('does not expose aria-activedescendant when closed', () => {
    renderSelect(<BasicSelect />);
    expect(screen.getByRole('combobox').getAttribute('aria-activedescendant')).toBeNull();
  });
});

// W2 — keyboard
describe('Select keyboard (W2)', () => {
  function openWithKey(key: string) {
    fireEvent.keyDown(screen.getByRole('combobox'), { key });
  }

  it('opens with ArrowDown and activedescendant points to first enabled', () => {
    renderSelect(<BasicSelect />);
    openWithKey('ArrowDown');
    const trigger = screen.getByRole('combobox');
    const options = screen.getAllByRole('option');
    expect(trigger.getAttribute('aria-activedescendant')).toBe(options[0].id);
  });

  it('opens with ArrowUp and activedescendant points to last enabled', () => {
    renderSelect(<BasicSelect />);
    openWithKey('ArrowUp');
    const trigger = screen.getByRole('combobox');
    const options = screen.getAllByRole('option');
    // Cherry está disabled → último enabled é Banana (index 1).
    expect(trigger.getAttribute('aria-activedescendant')).toBe(options[1].id);
  });

  it('opens with Enter and points to selected item when value preset', () => {
    renderSelect(<BasicSelect defaultValue="banana" />);
    openWithKey('Enter');
    const trigger = screen.getByRole('combobox');
    const options = screen.getAllByRole('option');
    expect(trigger.getAttribute('aria-activedescendant')).toBe(options[1].id);
  });

  it('ArrowDown when open advances activedescendant skipping disabled', () => {
    renderSelect(<BasicSelect />);
    openWithKey('ArrowDown'); // active = Apple (0)
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' }); // → Banana (1)
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' }); // Cherry disabled → fica em Banana
    const trigger = screen.getByRole('combobox');
    const options = screen.getAllByRole('option');
    expect(trigger.getAttribute('aria-activedescendant')).toBe(options[1].id);
  });

  it('Home jumps to first enabled item', () => {
    renderSelect(<BasicSelect />);
    openWithKey('ArrowUp'); // active = Banana
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Home' });
    const trigger = screen.getByRole('combobox');
    const options = screen.getAllByRole('option');
    expect(trigger.getAttribute('aria-activedescendant')).toBe(options[0].id);
  });

  it('End jumps to last enabled item', () => {
    renderSelect(<BasicSelect />);
    openWithKey('ArrowDown'); // active = Apple
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'End' });
    const trigger = screen.getByRole('combobox');
    const options = screen.getAllByRole('option');
    expect(trigger.getAttribute('aria-activedescendant')).toBe(options[1].id);
  });

  it('Enter on active item selects + closes + restores focus', () => {
    const onValueChange = jest.fn();
    renderSelect(<BasicSelect onValueChange={onValueChange} />);
    openWithKey('ArrowDown'); // active = Apple
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith('apple');
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole('combobox'));
  });

  it('Space on active item selects', () => {
    const onValueChange = jest.fn();
    renderSelect(<BasicSelect onValueChange={onValueChange} />);
    openWithKey('ArrowDown');
    fireEvent.keyDown(screen.getByRole('combobox'), { key: ' ' });
    expect(onValueChange).toHaveBeenCalledWith('apple');
  });

  it('Escape closes and restores focus to trigger', () => {
    renderSelect(<BasicSelect />);
    openWithKey('ArrowDown');
    expect(screen.getByRole('listbox')).toBeTruthy();
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Escape' });
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole('combobox'));
  });

  it('Tab when open closes the listbox', () => {
    renderSelect(<BasicSelect />);
    openWithKey('ArrowDown');
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'Tab' });
    expect(screen.queryByRole('listbox')).toBeNull();
  });

  it('type-ahead matches by displayText prefix', () => {
    renderSelect(<BasicSelect />);
    openWithKey('ArrowDown'); // start at Apple
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'b' });
    const trigger = screen.getByRole('combobox');
    const options = screen.getAllByRole('option');
    expect(trigger.getAttribute('aria-activedescendant')).toBe(options[1].id); // Banana
  });

  it('outside click closes and restores focus', () => {
    renderSelect(<BasicSelect />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('listbox')).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole('combobox'));
  });
});

describe('Select item registry (W1)', () => {
  it('exposes display-text via SelectValue when value preset and listbox closed', () => {
    renderSelect(<BasicSelect defaultValue="banana" />);
    // Listbox fechado, mas trigger mostra "Banana" (display-text), não "banana".
    const trigger = screen.getByRole('combobox');
    expect(trigger.textContent).toContain('Banana');
  });

  it('explicit displayText prop overrides extracted text', () => {
    renderSelect(
      <Select defaultValue="card">
        <Select.Trigger><Select.Value placeholder="x" /></Select.Trigger>
        <Select.Content>
          <Select.Item value="card" displayText="Cartão de crédito (display)">
            <span>icon-here</span> Cartão de crédito
          </Select.Item>
        </Select.Content>
      </Select>,
    );
    const trigger = screen.getByRole('combobox');
    expect(trigger.textContent).toContain('Cartão de crédito (display)');
  });
});

describe('Select utils (W1)', () => {
  it('extractDisplayText flattens nested children', () => {
    expect(
      extractDisplayText(
        <span>
          <span>Cartão</span> de crédito
        </span>,
      ),
    ).toBe('Cartão de crédito');
  });

  it('extractDisplayText handles plain string and number', () => {
    expect(extractDisplayText('Apple')).toBe('Apple');
    expect(extractDisplayText(42)).toBe('42');
  });

  it('normalizeForTypeahead strips diacritics and lowercases', () => {
    expect(normalizeForTypeahead('São Paulo')).toBe('sao paulo');
    expect(normalizeForTypeahead('AÇÃO')).toBe('acao');
  });
});

describe('Select chevron icon (W1)', () => {
  it('renders ChevronDown svg (Lucide) and rotates when open', () => {
    renderSelect(<BasicSelect />);
    const svg = document.querySelector('svg.lucide-chevron-down');
    expect(svg).toBeTruthy();
    const wrapperBefore = (svg!.parentElement as HTMLElement).getAttribute('style') ?? '';
    expect(wrapperBefore).toMatch(/rotate\(0deg\)/);
    fireEvent.click(screen.getByRole('combobox'));
    const wrapperAfter = (svg!.parentElement as HTMLElement).getAttribute('style') ?? '';
    expect(wrapperAfter).toMatch(/rotate\(180deg\)/);
  });
});

describe('Select slot recipe (RFC-0017)', () => {
  it('produces different trigger classNames for sm vs lg (recipe is consumed)', () => {
    const { unmount } = renderSelect(
      <Select size="small" defaultValue="">
        <Select.Trigger><Select.Value placeholder="x" /></Select.Trigger>
      </Select>,
    );
    const smClass = (screen.getByRole('combobox') as HTMLButtonElement).className;
    unmount();

    renderSelect(
      <Select size="large" defaultValue="">
        <Select.Trigger><Select.Value placeholder="x" /></Select.Trigger>
      </Select>,
    );
    const lgClass = (screen.getByRole('combobox') as HTMLButtonElement).className;

    expect(smClass).not.toEqual(lgClass);
  });

  it('createTheme override on select recipe injects custom styles', () => {
    const overriddenTheme = createTheme(themeLight, {
      recipes: {
        select: {
          slots: ['root', 'trigger', 'value', 'icon', 'content', 'item', 'itemText'],
          base: {
            trigger: { borderRadius: 'huge' },
          },
          variants: {},
          defaultVariants: {},
        },
      },
    });

    render(
      <ArborProvider theme={overriddenTheme}>
        <Select defaultValue="">
          <Select.Trigger><Select.Value placeholder="x" /></Select.Trigger>
        </Select>
      </ArborProvider>,
    );

    const allStyles = Array.from(document.head.querySelectorAll('style'))
      .map(node => node.textContent ?? '')
      .join(' ');
    expect(allStyles).toMatch(/border-radius:\s*32px/);
  });
});

describe('Select FieldContext integration', () => {
  it('picks up aria-describedby from Field', () => {
    renderSelect(
      <Field id="sel-field">
        <Field.Control>
          <BasicSelect />
        </Field.Control>
        <Field.Description>Choose wisely</Field.Description>
      </Field>,
    );
    expect(screen.getByRole('combobox').getAttribute('aria-describedby')).toBe('sel-field-description');
  });

  it('picks up aria-invalid from Field', () => {
    renderSelect(
      <Field id="sel-field" invalid>
        <Field.Control>
          <BasicSelect />
        </Field.Control>
      </Field>,
    );
    expect(screen.getByRole('combobox').getAttribute('aria-invalid')).toBe('true');
  });

  it('picks up disabled from FieldContext', () => {
    renderSelect(
      <Field id="sel-field" disabled>
        <BasicSelect />
      </Field>,
    );
    expect((screen.getByRole('combobox') as HTMLButtonElement).disabled).toBe(true);
  });
});

describe('Select accessibility — touch target (TD-016, WCAG 2.5.5)', () => {
  it.each(['small', 'medium', 'large'] as const)('trigger minHeight is >= 44 in size %s', size => {
    renderSelect(
      <Select defaultValue="" size={size}>
        <Select.Trigger>
          <Select.Value placeholder="Pick one" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="apple">Apple</Select.Item>
        </Select.Content>
      </Select>,
    );
    const triggerClass = (screen.getByRole('combobox').className.split(' ').pop())!;
    const sheet = document.getElementById('arbor-style-engine')?.textContent ?? '';
    const minHeightMatch = new RegExp(`\\.${triggerClass}\\{[^}]*min-height:(\\d+)px`).exec(sheet);
    expect(minHeightMatch).not.toBeNull();
    expect(Number(minHeightMatch![1])).toBeGreaterThanOrEqual(44);
  });
});

describe('Select Portal (RFC-0020)', () => {
  it('renders listbox in a Portal so it escapes overflow:hidden ancestors', () => {
    renderSelect(
      <div data-testid="overflow-clip" style={{ overflow: 'hidden', height: 40 }}>
        <BasicSelect />
      </div>,
    );
    fireEvent.click(screen.getByRole('combobox'));
    const listbox = screen.getByRole('listbox');
    const clip = screen.getByTestId('overflow-clip');
    expect(clip.contains(listbox)).toBe(false);
    expect(document.body.contains(listbox)).toBe(true);
  });

  it('clicking the trigger while open does not close-then-reopen via DismissableLayer', () => {
    renderSelect(<BasicSelect />);
    const trigger = screen.getByRole('combobox');
    fireEvent.click(trigger);
    expect(screen.queryByRole('listbox')).not.toBeNull();
    fireEvent.pointerDown(trigger);
    fireEvent.click(trigger);
    expect(screen.queryByRole('listbox')).toBeNull();
  });
});

describe('Select accessibility — visible focus (HR6-11, WCAG 2.4.7)', () => {
  it('emits :focus-visible outline rule on the trigger', () => {
    renderSelect(<BasicSelect />);
    const triggerClass = (screen.getByRole('combobox').className.split(' ').pop())!;
    const sheet = document.getElementById('arbor-style-engine')?.textContent ?? '';
    const focusRule = new RegExp(`\\.${triggerClass}:focus-visible\\{[^}]*outline`);
    expect(sheet).toMatch(focusRule);
  });
});

// PCV-22 — API plana (RFC-0043)
const FLAT_OPTIONS: SelectOption[] = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry (disabled)', disabled: true },
];

function BasicSelectFlat({
  value,
  onValueChange,
  disabled,
  defaultValue = '',
}: {
  value?: string;
  onValueChange?: (v: string) => void;
  disabled?: boolean;
  defaultValue?: string;
}) {
  return (
    <Select
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      placeholder="Pick one"
      options={FLAT_OPTIONS}
    />
  );
}

describe('Select flat API (PCV-22, RFC-0043)', () => {
  it('renders trigger from options[] without compound JSX', () => {
    renderSelect(<BasicSelectFlat />);
    expect(screen.getByRole('combobox')).toBeTruthy();
    expect(screen.getByText('Pick one')).toBeTruthy();
  });

  it('opens listbox and renders items from options[]', () => {
    renderSelect(<BasicSelectFlat />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toBeTruthy();
    expect(screen.getAllByRole('option').length).toBe(3);
    expect(screen.getByText('Apple')).toBeTruthy();
  });

  it('selects from options[] via click', () => {
    const onValueChange = jest.fn();
    renderSelect(<BasicSelectFlat onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('Banana'));
    expect(onValueChange).toHaveBeenCalledWith('banana');
  });

  it('honors disabled option in flat options[]', () => {
    const onValueChange = jest.fn();
    renderSelect(<BasicSelectFlat onValueChange={onValueChange} />);
    fireEvent.click(screen.getByRole('combobox'));
    const disabledItem = screen.getByText('Cherry (disabled)').closest('[role="option"]');
    expect(disabledItem?.getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(screen.getByText('Cherry (disabled)'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('uses option.label as displayText fallback', () => {
    renderSelect(<BasicSelectFlat defaultValue="apple" />);
    const trigger = screen.getByRole('combobox');
    expect(trigger.textContent).toContain('Apple');
  });

  it('keyboard type-ahead works with flat options', () => {
    renderSelect(<BasicSelectFlat />);
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'ArrowDown' });
    fireEvent.keyDown(screen.getByRole('combobox'), { key: 'b' });
    const trigger = screen.getByRole('combobox');
    const options = screen.getAllByRole('option');
    expect(trigger.getAttribute('aria-activedescendant')).toBe(options[1].id);
  });

  it('renders Check icon trailing the selected item (D4 paridade)', () => {
    renderSelect(<BasicSelectFlat defaultValue="apple" />);
    fireEvent.click(screen.getByRole('combobox'));
    const listbox = screen.getByRole('listbox');
    const appleOption = Array.from(listbox.querySelectorAll('[role="option"]')).find(
      o => o.textContent?.includes('Apple'),
    );
    expect(appleOption).toBeTruthy();
    const check = appleOption?.querySelector('svg.lucide-check');
    expect(check).toBeTruthy();
  });

  it('renders startSlot and description from SelectOption (D1 médio)', () => {
    renderSelect(
      <Select
        defaultValue="card"
        options={[
          {
            value: 'card',
            label: 'Cartão',
            description: 'Aprovação imediata',
            startSlot: <span data-testid="card-icon">$</span>,
          },
        ]}
      />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByTestId('card-icon')).toBeTruthy();
    expect(screen.getByText('Aprovação imediata')).toBeTruthy();
  });

  it('renders emptyMessage when options=[]', () => {
    renderSelect(
      <Select placeholder="vazio" options={[]} emptyMessage="Nenhum resultado" />,
    );
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('Nenhum resultado')).toBeTruthy();
    expect(screen.queryAllByRole('option').length).toBe(0);
  });

  it('omits emptyMessage when not provided (anatomia atual mantida)', () => {
    renderSelect(<Select placeholder="vazio" options={[]} />);
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.queryByRole('listbox')).toBeTruthy();
    expect(screen.queryAllByRole('option').length).toBe(0);
  });

  it('falls back to compound when children provided and options undefined', () => {
    renderSelect(
      <Select>
        <Select.Trigger>
          <Select.Value placeholder="compound only" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="x">From compound</Select.Item>
        </Select.Content>
      </Select>,
    );
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('From compound')).toBeTruthy();
  });

  it('options ganha sobre children no modo mixed (children ignorado)', () => {
    renderSelect(
      <Select
        placeholder="mixed"
        options={[{ value: 'flat', label: 'From flat' }]}
      >
        <Select.Trigger>
          <Select.Value placeholder="compound" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="compound-only">From compound</Select.Item>
        </Select.Content>
      </Select>,
    );
    fireEvent.click(screen.getByRole('combobox'));
    expect(screen.getByText('From flat')).toBeTruthy();
    expect(screen.queryByText('From compound')).toBeNull();
  });

  it('Field-aware: SelectFlat herda disabled de FieldContext', () => {
    renderSelect(
      <Field id="flat-field" disabled>
        <Select placeholder="x" options={[{ value: 'a', label: 'A' }]} />
      </Field>,
    );
    expect((screen.getByRole('combobox') as HTMLButtonElement).disabled).toBe(true);
  });

  it('Field.Control não injeta props porque SelectFlat é field-aware', () => {
    renderSelect(
      <Field id="flat-ctrl">
        <Field.Control>
          <Select placeholder="x" options={[{ value: 'a', label: 'A' }]} />
        </Field.Control>
        <Field.Description>desc</Field.Description>
      </Field>,
    );
    expect(screen.getByRole('combobox').getAttribute('aria-describedby')).toBe(
      'flat-ctrl-description',
    );
  });

  it('warn em dev quando label é ReactNode sem displayText e extração vazia', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    renderSelect(
      <Select
        placeholder="x"
        options={[{ value: 'icon-only', label: <svg aria-hidden="true" /> }]}
      />,
    );
    expect(warn).toHaveBeenCalled();
    expect(warn.mock.calls[0][0]).toMatch(/displayText/);
    warn.mockRestore();
  });

  it('extrai displayText automaticamente quando label é string', () => {
    renderSelect(
      <Select
        defaultValue="a"
        placeholder="x"
        options={[{ value: 'a', label: 'Alpha' }]}
      />,
    );
    expect(screen.getByRole('combobox').textContent).toContain('Alpha');
  });
});

describe('Select theming — sizes.selectContent.maxHeight (sub-PR PCV-22)', () => {
  it('createTheme override em sizes.selectContent.maxHeight propaga no CSS', () => {
    const overriddenTheme = createTheme(themeLight, {
      sizes: {
        selectContent: {
          maxHeight: { medium: '180px' },
        },
      },
    });

    render(
      <ArborProvider theme={overriddenTheme}>
        <Select placeholder="x" options={[{ value: 'a', label: 'A' }]} />
      </ArborProvider>,
    );

    fireEvent.click(screen.getByRole('combobox'));
    const allStyles = Array.from(document.head.querySelectorAll('style'))
      .map(node => node.textContent ?? '')
      .join(' ');
    expect(allStyles).toMatch(/max-height:\s*180px/);
  });
});
