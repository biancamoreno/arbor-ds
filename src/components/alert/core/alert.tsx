import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { Icon } from '../../core';
import type { IconName } from '../../core';
import { AlertContext, useAlertContext } from '../context/alert-context';
import type {
  AlertRootProps,
  AlertIconProps,
  AlertTitleProps,
  AlertDescriptionProps,
  AlertCloseProps,
} from '../interfaces';

type Tone = NonNullable<AlertRootProps['tone']>;

const TONE_ICON: Record<Tone, IconName> = {
  info: 'Info',
  success: 'CircleCheck',
  warning: 'TriangleAlert',
  critical: 'CircleAlert',
};

function getToneColors(tone: Tone, theme: ReturnType<typeof useTheme>) {
  const c = theme.colors;
  const map: Record<Tone, { bg: string; border: string; text: string; icon: string }> = {
    info: {
      bg: 'transparent',
      border: c.status.info,
      text: c.text.primary,
      icon: c.status.info,
    },
    success: {
      bg: c.feedback.success.subtle,
      border: c.feedback.success.base,
      text: c.feedback.success.strong,
      icon: c.feedback.success.base,
    },
    warning: {
      bg: c.feedback.warning.subtle,
      border: c.feedback.warning.base,
      text: c.feedback.warning.strong,
      icon: c.feedback.warning.base,
    },
    critical: {
      bg: c.feedback.critical.subtle,
      border: c.feedback.critical.base,
      text: c.feedback.critical.strong,
      icon: c.feedback.critical.base,
    },
  };
  return map[tone];
}

function AlertRoot({ children, tone = 'info', style, ...props }: AlertRootProps) {
  const theme = useTheme();
  const colors = getToneColors(tone, theme);
  const role = tone === 'critical' || tone === 'warning' ? 'alert' : 'status';

  return (
    <AlertContext.Provider value={{ tone }}>
      <div
        role={role}
        {...props}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: theme.space.small,
          padding: `${theme.space.small} ${theme.space.medium}`,
          borderRadius: theme.radii.small,
          borderLeftWidth: '4px',
          borderLeftStyle: 'solid',
          borderLeftColor: colors.border,
          backgroundColor: colors.bg,
          color: colors.text,
          ...style,
        }}
      >
        {children}
      </div>
    </AlertContext.Provider>
  );
}

function AlertIcon({ children, style, ...props }: AlertIconProps) {
  const theme = useTheme();
  const { tone } = useAlertContext();
  const colors = getToneColors(tone, theme);

  return (
    <span
      aria-hidden="true"
      {...props}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        flexShrink: 0,
        color: colors.icon,
        ...style,
      }}
    >
      {children ?? <Icon name={TONE_ICON[tone]} size={18} />}
    </span>
  );
}

function AlertTitle({ children, style, ...props }: AlertTitleProps) {
  const theme = useTheme();
  return (
    <p
      {...props}
      style={{
        margin: 0,
        fontWeight: theme.fontWeights.medium,
        fontSize: theme.fontSizes.small,
        lineHeight: '20px',
        ...style,
      }}
    >
      {children}
    </p>
  );
}

function AlertDescription({ children, style, ...props }: AlertDescriptionProps) {
  const theme = useTheme();
  return (
    <p
      {...props}
      style={{
        margin: 0,
        fontSize: theme.fontSizes.sm,
        color: 'inherit',
        lineHeight: '20px',
        ...style,
      }}
    >
      {children}
    </p>
  );
}

function AlertClose({ label = 'Fechar', style, ...props }: AlertCloseProps) {
  const theme = useTheme();
  return (
    <button
      type="button"
      aria-label={label}
      {...props}
      style={{
        marginLeft: 'auto',
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '20px',
        height: '20px',
        padding: 0,
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        color: 'inherit',
        borderRadius: theme.radii.nano,
        ...style,
      }}
    >
      <Icon name="X" size={14} aria-hidden="true" />
    </button>
  );
}

export const Alert = Object.assign(AlertRoot, {
  Root: AlertRoot,
  Icon: AlertIcon,
  Title: AlertTitle,
  Description: AlertDescription,
  Close: AlertClose,
});
