import { useEffect, useRef, useSyncExternalStore } from 'react';
import { Animated, Easing, type ViewStyle } from 'react-native';
import { Box, Flex, Text, Clickable, Icon } from '../../core';
import type { IconName } from '../../core';
import { Portal } from '../../../ecosystem/primitives';
import { useSlotRecipe } from '../../../ecosystem/styled-system/recipes';
import { usePrefersReducedMotion } from '../../../ecosystem/styled-system/system/hooks';
import { ToastContext, useToastContext } from '../context/toast-context';
import { toastStore } from '../store/toast-store';
import type { FeedbackTone } from '../../../foundations';
import type {
  ToastRootProps,
  ToastIconProps,
  ToastTitleProps,
  ToastDescriptionProps,
  ToastCloseProps,
  ToasterProps,
  ToastPlacement,
  ToastItem,
} from '../interfaces';

type ToastSlots = 'root' | 'icon' | 'title' | 'description' | 'close';

const TONE_ICON: Record<FeedbackTone, IconName> = {
  neutral: 'Bell',
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
 * Toast nativo:
 * - `Toaster` monta um `<Portal mode="overlay">` para que toques em áreas vazias
 *   passem para a UI subjacente (toasts não são modais).
 * - Posicionamento via `position: 'absolute'` no container interno do Portal.
 *   `*-center` usa `alignItems: 'center'` (RN não suporta `translateX('-50%')`).
 * - Entrada animada via `Animated.parallel` em opacity + translateY. Quando o
 *   usuário tem `prefersReducedMotion` ativo, a animação é substituída por
 *   final state imediato (mesmo pattern de Spinner/Skeleton/ProgressCircle).
 * - `accessibilityLiveRegion` (Android) + `accessibilityRole='alert'` para
 *   tons assertivos (warning + critical).
 */

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

function ToastRoot({ children, tone = 'neutral', className, style, testID }: ToastRootProps) {
  const slots = useSlotRecipe<ToastSlots>('toast', { tone });
  const isAssertive = ASSERTIVE_TONES.has(tone);

  return (
    <ToastContext.Provider value={{ tone }}>
      <Flex
        accessible
        accessibilityRole={isAssertive ? 'alert' : undefined}
        accessibilityLiveRegion={isAssertive ? 'assertive' : 'polite'}
        testID={testID}
        className={className}
        style={style as ViewStyle}
        {...slots.root}
      >
        {children}
      </Flex>
    </ToastContext.Provider>
  );
}

function ToastIcon({ children, className, style, testID }: ToastIconProps) {
  const { tone } = useToastContext();
  const slots = useSlotRecipe<ToastSlots>('toast', { tone });

  return (
    <Box
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      testID={testID}
      className={className}
      style={style as ViewStyle}
      {...slots.icon}
    >
      {children ?? <Icon name={TONE_ICON[tone]} size="medium" />}
    </Box>
  );
}

function ToastTitle({ children, className, style, testID }: ToastTitleProps) {
  const { tone } = useToastContext();
  const slots = useSlotRecipe<ToastSlots>('toast', { tone });

  return (
    <Text testID={testID} className={className} style={style as ViewStyle} {...slots.title}>
      {children}
    </Text>
  );
}

function ToastDescription({ children, className, style, testID }: ToastDescriptionProps) {
  const { tone } = useToastContext();
  const slots = useSlotRecipe<ToastSlots>('toast', { tone });

  return (
    <Text testID={testID} className={className} style={style as ViewStyle} {...slots.description}>
      {children}
    </Text>
  );
}

function ToastClose({ accessibilityLabel = 'Fechar', onClose, className, style, testID }: ToastCloseProps) {
  const { tone } = useToastContext();
  const slots = useSlotRecipe<ToastSlots>('toast', { tone });

  return (
    <Clickable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onClick={onClose}
      testID={testID}
      className={className}
      style={style as ViewStyle}
      {...slots.close}
    >
      <Icon name="X" size="small" />
    </Clickable>
  );
}

function ToastItemRenderer({ item }: { item: ToastItem }) {
  const reducedMotion = usePrefersReducedMotion();
  const opacity = useRef(new Animated.Value(reducedMotion ? 1 : 0)).current;
  const translateY = useRef(new Animated.Value(reducedMotion ? 0 : 8)).current;

  useEffect(() => {
    if (reducedMotion || process.env.NODE_ENV === 'test') {
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
  }, [opacity, translateY, reducedMotion]);

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
        <ToastIcon>{item.icon}</ToastIcon>
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
        style={getPlacementContainerStyle(placement) as ViewStyle}
      >
        {items.map((item) => (
          <ToastItemRenderer key={item.id} item={item} />
        ))}
      </Box>
    </Portal>
  );
}

ToastRoot.displayName = 'Toast.Root';
ToastIcon.displayName = 'Toast.Icon';
ToastTitle.displayName = 'Toast.Title';
ToastDescription.displayName = 'Toast.Description';
ToastClose.displayName = 'Toast.Close';
Toaster.displayName = 'Toaster';

/**
 * @platform native
 *
 * Compound de toast em React Native — equivalente nativo do `Toast` web.
 * Mesmo padrão de uso: dispare via `useToast().toast(input)` e monte um único
 * `<Toaster />` na raiz da aplicação. Animação de entrada via
 * `Animated.Value` (Portal mode `'overlay'`). Respeita
 * `prefersReducedMotion` (pula animação quando ativo).
 *
 * @see {@link ToastRootProps}
 * @see {@link ToasterProps}
 */
export const Toast = Object.assign(ToastRoot, {
  Root: ToastRoot,
  Icon: ToastIcon,
  Title: ToastTitle,
  Description: ToastDescription,
  Close: ToastClose,
});

/**
 * @platform native
 *
 * `Toaster` em React Native: escuta o `toastStore` e renderiza os toasts
 * ativos via `Portal` mode `'overlay'`. Monte uma única vez na raiz do app.
 */
export { Toaster };
