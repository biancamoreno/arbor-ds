import React from 'react';
import { useTheme } from '../../../ecosystem';
import { IconButton } from '../../../components/button';
import { Tooltip } from '../../../components/tooltip';
import type { FavoriteButtonProps } from '../interfaces';

function FavoriteButtonInner({
  checked,
  defaultChecked = false,
  label = 'Favoritar produto',
  onCheckedChange,
  ...props
}: FavoriteButtonProps) {
  const theme = useTheme();
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isChecked = checked ?? internalChecked;

  return (
    <IconButton
      {...props}
      aria-label={label}
      aria-pressed={isChecked}
      variant={isChecked ? 'secondary' : 'ghost'}
      onClick={(event) => {
        props.onClick?.(event);
        if (props.disabled) {
          return;
        }

        const nextValue = !isChecked;
        if (checked === undefined) {
          setInternalChecked(nextValue);
        }
        onCheckedChange?.(nextValue);
      }}
      style={{
        color: isChecked ? theme.colors.feedback.critical.base : theme.colors.text.secondary,
        ...props.style,
      }}
    >
      {isChecked ? '♥' : '♡'}
    </IconButton>
  );
}

export function FavoriteButton({ tooltip, ...props }: FavoriteButtonProps) {
  if (tooltip) {
    return (
      <Tooltip content={tooltip}>
        <span style={{ display: 'inline-flex' }}>
          <FavoriteButtonInner {...props} />
        </span>
      </Tooltip>
    );
  }

  return <FavoriteButtonInner {...props} />;
}

export default FavoriteButton;
