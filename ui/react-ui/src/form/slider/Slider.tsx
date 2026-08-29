import { formInput } from '@airlib/form';
import type { AnyType } from '@airlib/headless';
import { classx } from '@airlib/headless/utils';
import { type Bindable, render, setup } from '@airlib/react';
import type { ComponentProps } from 'react';
import { SLIDER_CONFIGS } from './config.js';

export interface SliderProps extends Omit<ComponentProps<'div'>, 'value'> {
  min?: number;
  max?: number;
  value?: Bindable<number>;
}

export const Slider = setup<SliderProps>((props) => {
  const $props = props;
  const restProps = props.$omit(['className', 'value', 'onInput', 'min', 'max']);

  (props as AnyType).type = 'range';

  const input = formInput<number>(props);
  const fieldId = $props.id || input.name.replace(/\./g, '-');
  const errorId = `${fieldId}-error`;

  return render(
    () => (
      <div
        {...restProps}
        id={fieldId}
        className={classx([SLIDER_CONFIGS.class, props.className])}
        tabIndex={0}
        role="slider"
        aria-valuemin={props.min}
        aria-valuemax={props.max}
        aria-valuenow={input.value}
        aria-invalid={input.error ? true : undefined}
        aria-describedby={input.error ? errorId : undefined}
      >
        <div className={SLIDER_CONFIGS.trackClass} />
        <div className={SLIDER_CONFIGS.activeTrackClass} />
        <div className={SLIDER_CONFIGS.handleClass} />
      </div>
    ),
    'Slider'
  );
}, 'Slider');
