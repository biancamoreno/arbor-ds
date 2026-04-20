import { toastStore } from '../store/toast-store';
import type { ToastInput } from '../interfaces';

/** Hook para disparar toasts programaticamente */
export function useToast() {
  return {
    toast: (input: ToastInput) => toastStore.add(input),
    dismiss: (id: string) => toastStore.remove(id),
    clear: () => toastStore.clear(),
  };
}
