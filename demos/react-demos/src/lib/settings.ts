import { configureForm } from '@airlib/react-form';

export const configureApp = () => {
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
    textInput: { class: 'air-text-field-input-filled' },
    email: { class: 'air-text-field-input-filled' },
    password: { class: 'air-text-field-input-filled' },
    number: { class: 'air-text-field-input-filled' },
    textarea: { class: 'air-textarea-input-filled' },
    select: { class: 'air-select-input-filled' },
    color: { class: 'air-color-picker' },
    slider: { class: 'air-slider-primary' },
    checkbox: { class: 'air-checkbox-input' },
    reset: { class: 'air-button-outlined' },
    submit: { class: 'air-button' },
  });
};
