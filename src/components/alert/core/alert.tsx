import { Flex, Text, Clickable } from '../../core';
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

const TONE_COLORS: Record<Tone, { bg: string; border: string; text: string; icon: string }> = {
  info: { bg: 'transparent', border: 'status.info', text: 'text.primary', icon: 'status.info' },
  success: { bg: 'feedback.success.subtle', border: 'feedback.success.base', text: 'feedback.success.strong', icon: 'feedback.success.base' },
  warning: { bg: 'feedback.warning.subtle', border: 'feedback.warning.base', text: 'feedback.warning.strong', icon: 'feedback.warning.base' },
  critical: { bg: 'feedback.critical.subtle', border: 'feedback.critical.base', text: 'feedback.critical.strong', icon: 'feedback.critical.base' },
};

function AlertRoot({ children, tone = 'info', style, ...props }: AlertRootProps) {
  const colors = TONE_COLORS[tone];
  const role = tone === 'critical' || tone === 'warning' ? 'alert' : 'status';

  return (
    <AlertContext.Provider value={{ tone }}>
      <Flex
        role={role}
        {...props}
        alignItems="flex-start"
        gap="small"
        padding="small"
        paddingX="medium"
        borderRadius="small"
        borderLeftWidth={4}
        borderLeftStyle="solid"
        borderLeftColor={colors.border as never}
        backgroundColor={colors.bg as never}
        color={colors.text as never}
        style={style}
      >
        {children}
      </Flex>
    </AlertContext.Provider>
  );
}

function AlertIcon({ children, style, ...props }: AlertIconProps) {
  const { tone } = useAlertContext();
  const colors = TONE_COLORS[tone];

  return (
    <Flex
      as="span"
      aria-hidden="true"
      {...props}
      display="inline-flex"
      alignItems="center"
      flexShrink={0}
      color={colors.icon as never}
      style={style}
    >
      {children ?? <Icon name={TONE_ICON[tone]} size={18} />}
    </Flex>
  );
}

function AlertTitle({ children, style, ...props }: AlertTitleProps) {
  return (
    <Text
      as="p"
      {...props}
      fontWeight="medium"
      fontSize="small"
      style={{ margin: 0, lineHeight: '20px', ...style }}
    >
      {children}
    </Text>
  );
}

function AlertDescription({ children, style, ...props }: AlertDescriptionProps) {
  return (
    <Text
      as="p"
      {...props}
      fontSize="sm"
      color="inherit"
      style={{ margin: 0, lineHeight: '20px', ...style }}
    >
      {children}
    </Text>
  );
}

function AlertClose({ label = 'Fechar', style, ...props }: AlertCloseProps) {
  return (
    <Clickable
      as="button"
      type="button"
      aria-label={label}
      {...props}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      width={20}
      height={20}
      flexShrink={0}
      cursor="pointer"
      color="inherit"
      style={{
        marginLeft: 'auto',
        padding: 0,
        border: 'none',
        background: 'none',
        ...style,
      }}
    >
      <Icon name="X" size={14} aria-hidden="true" />
    </Clickable>
  );
}

export const Alert = Object.assign(AlertRoot, {
  Root: AlertRoot,
  Icon: AlertIcon,
  Title: AlertTitle,
  Description: AlertDescription,
  Close: AlertClose,
});
