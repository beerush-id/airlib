import { cookies, getContext, setContext } from '@airlib/solid';

export type AppTheme = 'light' | 'dark';
export type AppSettings = {
  theme: AppTheme;
  toggleTheme(): void;
};

export const APP_SETTINGS_KEY = Symbol('app-settings');

export function createSettings(): AppSettings {
  const settings = cookies<AppSettings>('app-settings', {
    theme: 'light',
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
    },
  });

  setContext(APP_SETTINGS_KEY, settings);
  return settings;
}

export function getSettings() {
  return getContext<AppSettings>(APP_SETTINGS_KEY);
}

import { configureForm } from '@airlib/solid-form';

const textFieldClass =
  'w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:text-white';

configureForm({
  field: {
    labelClass: 'mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300',
    errorClass: 'text-red-500 text-xs mt-1 block',
    requiredClass: 'text-xs text-red-500',
  },
  input: {
    class: 'transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
    errorClass: '!border-red-500 focus:!border-red-500 focus:!ring-red-500',
  },
  textInput: { class: textFieldClass },
  textarea: { class: textFieldClass },
  select: { class: textFieldClass },
  color: { class: 'h-10 w-16 cursor-pointer rounded border-0 bg-transparent p-0' },
  slider: { class: 'h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700' },
  checkbox: {
    class:
      'h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-900',
  },
  reset: {
    class:
      'rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700',
  },
  submit: {
    class:
      'rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-gray-900',
  },
});
