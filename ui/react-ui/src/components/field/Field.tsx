import { classx, render, setup, template } from '@airlib/react';
import type { ComponentProps, MouseEventHandler } from 'react';
import { type ElementProps, renderDynamic } from '../renderer.js';
import { FIELD_CONFIGS } from './config.js';

export interface FieldProps extends ComponentProps<'label'> {
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
}

export const Field = setup<FieldProps>((props) => {
  const restProps = props.$omit(['className', 'onClick', 'error']);

  const handleClick: MouseEventHandler<HTMLLabelElement> = (e) => {
    const target = e.target as HTMLElement;

    if (target.tagName !== 'BUTTON' && target.tagName !== 'INPUT' && !target.closest('button')) {
      const control = e.currentTarget.querySelector('button, input');

      if (control instanceof HTMLElement) {
        e.preventDefault();
        control.click();
        control.focus();
      }
    }
    props.onClick?.(e);
  };

  return render(
    () => (
      <label
        {...restProps}
        className={classx([
          FIELD_CONFIGS.class,
          props.error ? FIELD_CONFIGS.errorClass : undefined,
          props.size ? FIELD_CONFIGS.size[props.size] : undefined,
          props.className,
        ])}
        onClick={handleClick}
      >
        {props.children}
      </label>
    ),
    'Field'
  );
}, 'Field');

export type FieldLabelProps = ElementProps<'span'> & {
  required?: boolean;
};

export const FieldLabel = template<FieldLabelProps>(
  ({ children, className, required, ...rest }) => (
    <span {...rest} className={classx([FIELD_CONFIGS.labelClass, className])}>
      {renderDynamic(children)}
      {required && <span className={FIELD_CONFIGS.requiredClass}>{FIELD_CONFIGS.requiredLabel}</span>}
    </span>
  ),
  'FieldLabel'
);

export const FieldSupportingText = template<ElementProps<'span'>>(
  ({ children, className, ...rest }) => (
    <span {...rest} className={classx([FIELD_CONFIGS.supportingTextClass, className])}>
      {renderDynamic(children)}
    </span>
  ),
  'FieldSupportingText'
);
