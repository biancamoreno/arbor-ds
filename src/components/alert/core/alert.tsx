import { Flex, Text, Clickable } from '../../core';
import { Icon } from '../../core';
import type { IconName } from '../../core';
import { AlertContext, useAlertContext } from '../context/alert-context';
import { transition } from '../../../foundations';
import type {
  AlertRootProps,
  AlertIconProps,
  AlertTitleProps,
  AlertDescriptionProps,
  AlertCloseProps,
} from '../interfaces';

type Tone = NonNullable<AlertRootProps['tone']>;

type ToneColors = {
  bg: string;
  border: string;
  text: string;
  icon: string;
};

const TONE_ICON: Record<Tone, IconName> = {
  info: 'Info',
  success: 'CircleCheck',
  warning: 'TriangleAlert',
  critical: 'CircleAlert',
};

const TONE_COLORS: Record<Tone, ToneColors> = {
  info: { bg: 'feedback.info.subtle', border: 'feedback.info.base', text: 'feedback.info.strong', icon: 'feedback.info.base' },
  success: { bg: 'feedback.success.subtle', border: 'feedback.success.base', text: 'feedback.success.strong', icon: 'feedback.success.base' },
  warning: { bg: 'feedback.warning.subtle', border: 'feedback.warning.base', text: 'feedback.warning.strong', icon: 'feedback.warning.base' },
  critical: { bg: 'feedback.critical.subtle', border: 'feedback.critical.base', text: 'feedback.critical.strong', icon: 'feedback.critical.base' },
};

function AlertRoot({ children, tone = 'info', className, style }: AlertRootProps) {
  const colors = TONE_COLORS[tone];
  const role = tone === 'critical' || tone === 'warning' ? 'alert' : 'status';

  return (
    <AlertContext.Provider value={{ tone }}>
      <Flex
        role={role}
        className={className}
        style={style}
        alignItems="flex-start"
        gap="small"
        padding="small"
        paddingX="medium"
        borderRadius="small"
        borderLeftWidth="thick"
        borderLeftStyle="solid"
        borderLeftColor={colors.border}
        backgroundColor={colors.bg}
        color={colors.text}
      >
        {children}
      </Flex>
    </AlertContext.Provider>
  );
}

function AlertIcon({ children, className, style }: AlertIconProps) {
  const { tone } = useAlertContext();
  const colors = TONE_COLORS[tone];

  return (
    <Flex
      as="span"
      aria-hidden="true"
      className={className}
      style={style}
      display="inline-flex"
      alignItems="center"
      flexShrink={0}
      color={colors.icon}
    >
      {children ?? <Icon name={TONE_ICON[tone]} size="medium" />}
    </Flex>
  );
}

function AlertTitle({ children, className, style }: AlertTitleProps) {
  return (
    <Text
      as="p"
      className={className}
      style={style}
      fontWeight="medium"
      fontSize="small"
      margin={0}
    >
      {children}
    </Text>
  );
}

function AlertDescription({ children, className, style }: AlertDescriptionProps) {
  return (
    <Text
      as="p"
      className={className}
      style={style}
      fontSize="small"
      color="inherit"
      margin={0}
    >
      {children}
    </Text>
  );
}

function AlertClose({ label = 'Fechar', onClick, className, style }: AlertCloseProps) {
  return (
    <Clickable
      as="button"
      type="button"
      aria-label={label}
      onClick={onClick}
      className={className}
      style={style}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      minWidth={44}
      minHeight={44}
      width={20}
      height={20}
      flexShrink={0}
      cursor="pointer"
      color="inherit"
      marginLeft="auto"
      padding={0}
      borderRadius="small"
      backgroundColor="transparent"
      borderWidth={0}
      transition={transition(['background-color', 'color'], 'fast')}
      _hover={{ backgroundColor: 'background.interactive' }}
      _focusVisible={{ outlineColor: 'focus.ring', outlineWidth: '2px', outlineStyle: 'solid', outlineOffset: '2px' }}
    >
      <Icon name="X" size="small" />
    </Clickable>
  );
}

AlertRoot.displayName = 'Alert.Root';
AlertIcon.displayName = 'Alert.Icon';
AlertTitle.displayName = 'Alert.Title';
AlertDescription.displayName = 'Alert.Description';
AlertClose.displayName = 'Alert.Close';

/**
 * @platform shared
 *
 * Compound de alerta — banner persistente para mensagens de status
 * (informação, sucesso, aviso, crítico). `Alert.Root` controla `tone` (afeta
 * borda colorida + ícone default + cor do título). Slots: `Icon` (substitui
 * o ícone tone-default), `Title`, `Description`, `Close` (botão `X`
 * dismissable). Para notificações efêmeras automáticas, prefira `Toast`.
 *
 * @example
 * <Alert tone="warning">
 *   <Alert.Icon />
 *   <Alert.Title>Atenção</Alert.Title>
 *   <Alert.Description>Sua sessão expira em 5 minutos.</Alert.Description>
 *   <Alert.Close onClick={dismiss} />
 * </Alert>
 *
 * @see {@link AlertRootProps}
 */
export const Alert = Object.assign(AlertRoot, {
  Root: AlertRoot,
  Icon: AlertIcon,
  Title: AlertTitle,
  Description: AlertDescription,
  Close: AlertClose,
});
