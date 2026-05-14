import { Flex, Text, Box, Clickable, Icon } from '../../core';
import type { IconName } from '../../core';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { AlertContext, useAlertContext } from '../context/alert-context';
import type { FeedbackTone } from '../../../foundations';
import type {
  AlertProps,
  AlertRootProps,
  AlertIconProps,
  AlertTitleProps,
  AlertDescriptionProps,
  AlertCloseProps,
} from '../interfaces';

type AlertSlots = 'root' | 'icon' | 'title' | 'description' | 'close';

const TONE_ICON: Record<FeedbackTone, IconName> = {
  neutral: 'Info',
  brand: 'Megaphone',
  info: 'Info',
  success: 'CircleCheck',
  warning: 'TriangleAlert',
  critical: 'CircleAlert',
};

const ASSERTIVE_TONES = new Set<FeedbackTone>(['critical', 'warning']);

/**
 * @platform native
 *
 * Implementação React Native do `Alert`. Emite `accessibilityLiveRegion` +
 * `accessibilityRole='alert'` (para tons assertivos) — paridade com o `role`
 * web. Slots compartilham a slot recipe `alert` em runtime.
 */
function AlertRoot({ children, tone = 'info', className, style }: AlertRootProps) {
  const slots = useSlotRecipe<AlertSlots>('alert', { tone });
  const isAssertive = ASSERTIVE_TONES.has(tone);

  return (
    <AlertContext.Provider value={{ tone }}>
      <Flex
        accessible
        accessibilityRole={isAssertive ? 'alert' : undefined}
        accessibilityLiveRegion={isAssertive ? 'assertive' : 'polite'}
        className={className}
        style={style}
        {...slots.root}
      >
        {children}
      </Flex>
    </AlertContext.Provider>
  );
}

function AlertIcon({ children, className, style }: AlertIconProps) {
  const { tone } = useAlertContext();
  const slots = useSlotRecipe<AlertSlots>('alert', { tone });

  return (
    <Box
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className={className}
      style={style}
      {...slots.icon}
    >
      {children ?? <Icon name={TONE_ICON[tone]} size="medium" />}
    </Box>
  );
}

function AlertTitle({ children, className, style }: AlertTitleProps) {
  const { tone } = useAlertContext();
  const slots = useSlotRecipe<AlertSlots>('alert', { tone });

  return (
    <Text className={className} style={style} {...slots.title}>
      {children}
    </Text>
  );
}

function AlertDescription({ children, className, style }: AlertDescriptionProps) {
  const { tone } = useAlertContext();
  const slots = useSlotRecipe<AlertSlots>('alert', { tone });

  return (
    <Text className={className} style={style} {...slots.description}>
      {children}
    </Text>
  );
}

function AlertClose({ accessibilityLabel = 'Fechar', onClick, className, style }: AlertCloseProps) {
  const { tone } = useAlertContext();
  const slots = useSlotRecipe<AlertSlots>('alert', { tone });

  return (
    <Clickable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onClick={onClick}
      className={className}
      style={style}
      {...slots.close}
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

function AlertFlat({
  title,
  description,
  icon,
  onClose,
  closeAccessibilityLabel,
  children,
  ...rootProps
}: AlertProps) {
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
      {onClose !== undefined && (
        <AlertClose onClick={onClose} accessibilityLabel={closeAccessibilityLabel} />
      )}
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
