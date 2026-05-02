import { useEffect, useRef, useSyncExternalStore } from 'react';
import { Animated, Easing, type ViewStyle } from 'react-native';
import { Box, Flex, Text, Clickable, Icon } from '../../core';
import { Portal } from '../../../ecosystem/primitives';
import { toastStore } from '../store/toast-store';
import type {
  ToastRootProps,
  ToastTitleProps,
  ToastDescriptionProps,
  ToastCloseProps,
  ToasterProps,
  ToastTone,
  ToastPlacement,
  ToastItem,
} from '../interfaces';

/**
 * @platform native-ready
 *
 * Toast nativo:
 * - `Toaster` monta um `<Portal mode="overlay">` para que toques em áreas vazias
 *   passem para a UI subjacente (toasts não são modais).
 * - Posicionamento via `position: 'absolute'` no container interno do Portal.
 *   `*-center` usa `alignItems: 'center'` (RN não suporta `translateX('-50%')`).
 * - Entrada animada via `Animated.parallel` em opacity + translateY; em test env
 *   a animação é resolvida instantaneamente (mesmo padrão de Spinner/Skeleton/ProgressCircle).
 * - `accessibilityLiveRegion` (Android) + `accessibilityRole='alert'` para tom crítico.
 */

const TONE_BORDER: Record<ToastTone, string> = {
  neutral: 'border.default',
  info: 'status.info',
  success: 'feedback.success.base',
  warning: 'feedback.warning.base',
  critical: 'feedback.critical.base',
};

function getPlacementContainerStyle(placement: ToastPlacement): ViewStyle {
  const vertical: ViewStyle = placement.startsWith('top') ? { top: 16 } : { bottom: 16 };
  const reverse = placement.startsWith('bottom');
  const flexDirection: ViewStyle['flexDirection'] = reverse ? 'column-reverse' : 'column';

  if (placement.endsWith('center')) {
    return {
      position: 'absolute',
      left: 0,
      right: 0,
      alignItems: 'center',
      flexDirection,
      paddingHorizontal: 16,
      ...vertical,
    };
  }
  if (placement.endsWith('left')) {
    return {
      position: 'absolute',
      left: 16,
      right: 16,
      alignItems: 'flex-start',
      flexDirection,
      ...vertical,
    };
  }
  return {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'flex-end',
    flexDirection,
    ...vertical,
  };
}

function ToastRoot({ children, tone = 'neutral', style, testID }: ToastRootProps) {
  const borderColor = TONE_BORDER[tone];
  const isCritical = tone === 'critical';

  return (
    <Flex
      accessible
      accessibilityRole={isCritical ? 'alert' : 'text'}
      accessibilityLiveRegion={isCritical ? 'assertive' : 'polite'}
      testID={testID}
      alignItems="flex-start"
      gap="small"
      padding="small"
      paddingX="medium"
      borderRadius="small"
      backgroundColor="surface.raised"
      borderLeftWidth={4}
      borderLeftColor={borderColor as never}
      style={style as ViewStyle}
    >
      {children}
    </Flex>
  );
}

function ToastTitle({ children, style, testID }: ToastTitleProps) {
  return (
    <Text
      testID={testID}
      fontWeight="medium"
      fontSize="small"
      color="text.primary"
      style={style as never}
    >
      {children}
    </Text>
  );
}

function ToastDescription({ children, style, testID }: ToastDescriptionProps) {
  return (
    <Text
      testID={testID}
      fontSize="sm"
      color="text.secondary"
      style={style as never}
    >
      {children}
    </Text>
  );
}

function ToastClose({ label = 'Fechar', onClose, style, testID }: ToastCloseProps) {
  return (
    <Clickable
      accessibilityRole="button"
      accessibilityLabel={label}
      onClick={onClose}
      testID={testID}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      width={20}
      height={20}
      flexShrink={0}
      color="text.secondary"
      borderRadius="nano"
      style={{ marginLeft: 'auto', ...(style as object) } as never}
    >
      <Icon name="X" size="small" />
    </Clickable>
  );
}

function ToastItemRenderer({ item }: { item: ToastItem }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') {
      opacity.setValue(1);
      translateY.setValue(0);
      return;
    }
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  useEffect(() => {
    if (!item.duration) return;
    const t = setTimeout(() => toastStore.remove(item.id), item.duration);
    return () => clearTimeout(t);
  }, [item.id, item.duration]);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }],
        width: '100%',
        maxWidth: 420,
        marginVertical: 4,
      }}
    >
      <ToastRoot tone={item.tone}>
        <Flex flex={1} flexDirection="column" gap="micro">
          {item.title && <ToastTitle>{item.title}</ToastTitle>}
          {item.description && <ToastDescription>{item.description}</ToastDescription>}
        </Flex>
        <ToastClose onClose={() => toastStore.remove(item.id)} />
      </ToastRoot>
    </Animated.View>
  );
}

function Toaster({ placement = 'bottom-right' }: ToasterProps) {
  const items = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    toastStore.getSnapshot,
  );

  if (items.length === 0) return null;

  return (
    <Portal mode="overlay">
      <Box
        accessibilityLabel="Notificações"
        style={getPlacementContainerStyle(placement) as never}
      >
        {items.map((item) => (
          <ToastItemRenderer key={item.id} item={item} />
        ))}
      </Box>
    </Portal>
  );
}

ToastRoot.displayName = 'Toast.Root';
ToastTitle.displayName = 'Toast.Title';
ToastDescription.displayName = 'Toast.Description';
ToastClose.displayName = 'Toast.Close';
Toaster.displayName = 'Toaster';

export const Toast = Object.assign(ToastRoot, {
  Root: ToastRoot,
  Title: ToastTitle,
  Description: ToastDescription,
  Close: ToastClose,
});

export { Toaster };
