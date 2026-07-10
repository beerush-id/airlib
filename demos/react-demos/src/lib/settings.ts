import { configureForm } from '@airlib/react-form';

export const configureApp = () => {
  configureForm({
    field: {
      class: 'air-field',
      errorClass: 'air-field-error',
      labelClass: 'air-field-label',
      supportClass: 'air-field-supporting-text',
      requiredClass: 'air-field-required',
    },
    input: {
      class: 'air-text-field',
      errorClass: 'air-text-field-error',
    },
    color: { class: 'air-color-picker' },
    reset: { class: 'air-button-outlined' },
    submit: { class: 'air-button' },
    slider: { class: 'air-slider-primary' },
    select: { class: 'air-select-field' },
    textarea: { class: 'air-textarea' },
    checkbox: { class: 'air-checkbox-input' },
  });
};
