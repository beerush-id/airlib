import { classx } from '@airlib/headless/utils';
import { type Bindable, derived, nodeRef, setup } from '@anchorlib/react';
import type { MouseEvent, MouseEventHandler } from 'react';
import { CheckIcon, CheckIndeterminateIcon } from '../../icons/index.js';
import type { ElementProps } from '../renderer.js';
import { CHECKBOX_CONFIGS } from './config.js';

export interface CheckboxProps extends Omit<ElementProps<'button'>, 'aria-checked' | 'onChange'> {
  checked?: Bindable<boolean | 'mixed'>;
  onChange?: (checked: boolean | 'mixed', e: MouseEvent<HTMLButtonElement>) => void;
}

export const Checkbox = setup<CheckboxProps>((props) => {
  const restProps = props.$omit(['checked', 'className', 'onClick', 'onChange', 'disabled']);

  const handleClick: MouseEventHandler<HTMLButtonElement> = (e) => {
    if (typeof props.onClick === 'function') {
      props.onClick(e);
      return;
    }

    if (props.checked === 'mixed') {
      props.checked = true;
    } else {
      props.checked = !props.checked;
    }
    props.onChange?.(props.checked, e);
  };

  const isMixed = derived(() => props.checked === 'mixed');
  const isChecked = derived(() => props.checked === true);

  const ref = nodeRef<HTMLButtonElement>(() => ({
    'aria-checked': props.checked,
    disabled: props.disabled,
    className: classx([CHECKBOX_CONFIGS.containerClass, props.className]),
  }));
  const boxRef = nodeRef<HTMLSpanElement>(() => ({
    className: classx([
      CHECKBOX_CONFIGS.boxClass,
      isChecked.value && CHECKBOX_CONFIGS.boxCheckedClass,
      isMixed.value && CHECKBOX_CONFIGS.boxIndeterminateClass,
    ]),
  }));

  return (
    // biome-ignore lint/a11y/useSemanticElements: Expect custom.
    <button {...restProps} {...ref.attributes} ref={ref} role="checkbox" onClick={handleClick}>
      <span ref={boxRef} {...boxRef.attributes}>
        <CheckIcon data-icon="checked" />
        <CheckIndeterminateIcon data-icon="mixed" />
      </span>
    </button>
  );
}, 'Checkbox');
