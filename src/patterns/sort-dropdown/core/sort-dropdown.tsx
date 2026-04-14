import { Select } from '../../../components';
import type { SortDropdownProps } from '../interfaces';

export function SortDropdown({ label = 'Ordenar por', helperText, ...props }: SortDropdownProps) {
  return (
    <Select
      label={label}
      helperText={typeof helperText === 'string' ? helperText : undefined}
      placeholder="Selecione"
      size="sm"
      {...props}
    />
  );
}

export default SortDropdown;
