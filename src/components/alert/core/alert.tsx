import { Flex, Text, Clickable } from '../../core';
import { Icon } from '../../core';
import type { IconName } from '../../core';
import { AlertContext, useAlertContext } from '../context/alert-context';
import { transition, getFeedbackToneColor, type FeedbackTone } from '../../../foundations';
import { useTheme } from '../../../ecosystem/styled-system/adapters';
import type {
  AlertProps,
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
 * Alerta — banner persistente para mensagens de status (informação, sucesso,
 * aviso, crítico). API plana (recomendada para 90% dos casos):
 *
 * @example
 * <Alert
 *   tone="warning"
 *   title="Atenção"
 *   description="Sua sessão expira em 5 minutos."
 *   onClose={dismiss}
 * />
 *
 * Para layouts não-triviais (ícone custom, ação inline, multi-coluna), use o
 * compound:
 *
 * @example
 * <Alert.Root tone="warning">
 *   <Alert.Icon><Icon name="Megaphone" /></Alert.Icon>
 *   <Alert.Title>Atenção</Alert.Title>
 *   <Alert.Description>
 *     Sua sessão expira em 5 minutos. <Link href="...">Renovar</Link>
 *   </Alert.Description>
 *   <Alert.Close onClick={dismiss} />
 * </Alert.Root>
 *
 * Para notificações efêmeras automáticas, prefira `Toast`.
 *
 * @see {@link AlertProps} para API plana
 * @see {@link AlertRootProps} para API compound
 */
function AlertFlat({ title, description, icon, onClose, closeLabel, children, ...rootProps }: AlertProps) {
  const usesFlatApi =
    title !== undefined ||
    description !== undefined ||
    icon !== undefined ||
    onClose !== undefined;
  if (!usesFlatApi) {
    return <AlertRoot {...rootProps}>{children}</AlertRoot>;
  }
  return (
    <AlertRoot {...rootProps}>
      <AlertIcon>{icon}</AlertIcon>
      {(title !== undefined || description !== undefined) && (
        <Flex flex={1} flexDirection="column" gap="micro">
          {title !== undefined && <AlertTitle>{title}</AlertTitle>}
          {description !== undefined && <AlertDescription>{description}</AlertDescription>}
        </Flex>
      )}
      {onClose !== undefined && <AlertClose onClick={onClose} label={closeLabel} />}
    </AlertRoot>
  );
}

AlertFlat.displayName = 'Alert';

export const Alert = Object.assign(AlertFlat, {
  Root: AlertRoot,
  Icon: AlertIcon,
  Title: AlertTitle,
  Description: AlertDescription,
  Close: AlertClose,
});
