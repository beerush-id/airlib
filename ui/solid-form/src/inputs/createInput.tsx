import { type AnyType, formInput, type FormInputOptions } from '@airlib/form';
import { setup } from '@anchorlib/solid';

export function createInput<P extends Record<string, AnyType>, T = AnyType>(
  type: string,
  options?: FormInputOptions<T>
) {
  return setup<P>((props) => {
    (props as AnyType).type = type;
    const input = formInput(props as AnyType, options);
    const rest = props.$omit(['value', 'type', 'name', 'id', 'disabled', 'onInput', 'onBlur'] as AnyType);
    const $props = props as AnyType;
    const fieldId = () => $props.id || input.name.replace(/\./g, '-');
    const errorId = () => `${fieldId()}-error`;

    const handleInput = (e: Event) => {
      input.value = (e.currentTarget as HTMLInputElement).value;
      if (typeof $props.onInput === 'function') {
        $props.onInput(e as any);
      }
    };

    const handleBlur = (e: Event) => {
      input.settled();
      if (typeof $props.onBlur === 'function') {
        $props.onBlur(e as any);
      }
    };

    return (
      <input
        {...rest}
        id={fieldId()}
        type={input.type}
        name={input.name}
        value={input.value}
        disabled={input.disabled}
        aria-invalid={input.error ? true : undefined}
        aria-describedby={input.error ? errorId() : undefined}
        onInput={handleInput}
        onBlur={handleBlur}
      />
    );
  });
}
