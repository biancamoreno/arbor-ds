import { useTheme } from '../../../ecosystem/styled-system/adapters';
import { AlertContext, useAlertContext } from '../context/alert-context';
import type {
  AlertRootProps,
  AlertIconProps,
  AlertTitleProps,
  AlertDescriptionProps,
  AlertCloseProps,
} from '../interfaces';

type Tone = NonNullable<AlertRootProps['tone']>;

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
  // info → status, critical → alert (assertiva)
  const role = tone === 'critical' ? 'alert' : 'status';

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
      {children}
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
      ×
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
