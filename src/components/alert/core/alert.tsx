import { Flex, Text, Clickable } from '../../core';
import { Icon } from '../../core';
import type { IconName } from '../../core';
import { AlertContext, useAlertContext } from '../context/alert-context';
import { transition, getFeedbackToneColor, type FeedbackTone } from '../../../foundations';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type {
  AlertRootProps,
  AlertIconProps,
  AlertTitleProps,
  AlertDescriptionProps,
  AlertCloseProps,
} from '../interfaces';

const TONE_ICON: Record<FeedbackTone, IconName> = {
  neutral: 'Info',
  brand: 'Megaphone',
  info: 'Info',
  success: 'CircleCheck',
  warning: 'TriangleAlert',
  critical: 'CircleAlert',
};

function AlertRoot({ children, tone = 'info', className, style }: AlertRootProps) {
  const theme = useTheme();
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
        borderLeftColor={getFeedbackToneColor(theme, tone, 'base')}
        backgroundColor={getFeedbackToneColor(theme, tone, 'subtle')}
        color={getFeedbackToneColor(theme, tone, 'strong')}
      >
        {children}
      </Flex>
    </AlertContext.Provider>
  );
}

function AlertIcon({ children, className, style }: AlertIconProps) {
  const { tone } = useAlertContext();
  const theme = useTheme();

  return (
    <Flex
      as="span"
      aria-hidden="true"
      className={className}
      style={style}
      display="inline-flex"
      alignItems="center"
      flexShrink={0}
      color={getFeedbackToneColor(theme, tone, 'base')}
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
