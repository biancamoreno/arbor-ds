const localStorage = globalThis.localStorage;

export const storage = {
  async getItem(key: string): Promise<string> {
    if (localStorage?.getItem) {
      return localStorage.getItem(key) || '';
    }

    return '';
  },
  async setItem(key: string, rawValue: unknown): Promise<void> {
    if (localStorage?.setItem) {
      let value = String(rawValue);

      if (rawValue === null || rawValue === undefined) {
        value = '';
      }

      if (typeof rawValue === 'object') {
        value = JSON.stringify(rawValue);
      }

      return localStorage.setItem(key, value);
    }
  },
};
