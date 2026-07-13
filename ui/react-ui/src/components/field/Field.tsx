import { classx } from '@airlib/headless/utils';
import { render, setup, template } from '@anchorlib/react';
import type { ComponentProps, MouseEventHandler } from 'react';
import type { ElementProps } from '../renderer.js';
import { FIELD_CONFIGS } from './config.js';

export interface FieldProps extends ComponentProps<'label'> {
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
}

export const Field = setup<FieldProps>((props) => {
  const restProps = props.$omit(['className', 'onClick', 'error']);

  const handleClick: MouseEventHandler<HTMLLabelElement> = (e) => {
    const target = e.target as HTMLElement;
    // If the click is directly on the label text or wrapper (not on a button/input inside it)
    if (target.tagName !== 'BUTTON' && target.tagName !== 'INPUT' && !target.closest('button')) {
      // Find the first interactive control inside the label
      const control = e.currentTarget.querySelector('button, input');
      if (control instanceof HTMLElement) {
        // Prevent the browser's default label behavior since we are handling it manually,
        // and because a label click on a nested button isn't standard HTML behavior anyway.
        e.preventDefault();
        control.click();
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

export const FieldLabel = template<ElementProps<'span'>>(
  ({ children, className, ...rest }) => (
    <span {...rest} className={classx([FIELD_CONFIGS.labelClass, className])}>
      {children}
    </span>
  ),
  'FieldLabel'
);

export const FieldSupportingText = template<ElementProps<'span'>>(
  ({ children, className, ...rest }) => (
    <span {...rest} className={classx([FIELD_CONFIGS.supportingTextClass, className])}>
      {children}
    </span>
  ),
  'FieldSupportingText'
);
