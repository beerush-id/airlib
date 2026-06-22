import { configureForm } from '@airlib/react-form';
import { getContext, setContext } from '@anchorlib/core';
import { cookies } from '@anchorlib/react';

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

configureForm({
  field: {
    class: 'air-text-field',
    labelClass: 'air-text-field-label',
    errorClass: 'air-text-field-error',
    requiredClass: 'text-error',
  },
  input: {
    class: '',
    errorClass: 'air-text-field-input-error',
  },
  textInput: { class: 'air-text-field-input' },
  email: { class: 'air-text-field-input' },
  password: { class: 'air-text-field-input' },
  number: { class: 'air-text-field-input' },
  textarea: { class: 'air-textarea-input' },
  select: { class: 'air-select-input' },
  color: { class: 'air-color-picker' },
  slider: { class: 'air-slider-primary' },
  checkbox: { class: 'air-checkbox-input' },
  reset: { class: 'air-button-outlined' },
  submit: { class: 'air-button' },
});
