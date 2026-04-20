import type { ToastItem, ToastInput } from '../interfaces';

type Listener = (items: ToastItem[]) => void;

function createToastStore() {
  let items: ToastItem[] = [];
  const listeners = new Set<Listener>();

  function notify() {
    const snapshot = [...items];
    listeners.forEach((fn) => fn(snapshot));
  }

  function add(input: ToastInput): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    items = [{ duration: 5000, tone: 'neutral', ...input, id }, ...items];
    notify();
    return id;
  }

  function remove(id: string) {
    items = items.filter((t) => t.id !== id);
    notify();
  }

  function clear() {
    items = [];
    notify();
  }

  function subscribe(listener: Listener): () => void {
    listeners.add(listener);
    listener(items);
    return () => listeners.delete(listener);
  }

  function getSnapshot(): ToastItem[] {
    return items;
  }

  return { add, remove, clear, subscribe, getSnapshot };
}

export const toastStore = createToastStore();
