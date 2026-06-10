import { configureForm, type AnyType } from '@airlib/react-form';
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
    class: 'text-field',
    labelClass: 'text-field-label',
    errorClass: 'text-field-error',
    requiredClass: 'text-error',
  },
  input: {
    class: '',
    errorClass: 'text-field-input-error',
  },
  textInput: { class: 'text-field-input' },
  email: { class: 'text-field-input' },
  password: { class: 'text-field-input' },
  number: { class: 'text-field-input' },
  textarea: { class: 'textarea-input' },
  select: { class: 'select-input' },
  color: { class: 'color-picker' },
  slider: { class: 'slider-primary' },
  checkbox: { class: 'checkbox-input' },
  reset: { class: 'button-outlined' },
  submit: { class: 'button' },
});
