import { colorScheme } from '@airlib/headless/utils';
import { derived, microtask, render, setup } from '@airlib/react';
import type { ComponentProps, InputEventHandler } from 'react';
import { THEME_CONFIGS } from './config.ts';
import { Tooltip } from '../tooltip/Tooltip.tsx';

export type ThemeColorProps = Omit<ComponentProps<'input'>, 'value'>;

function isDarkHex(hex?: string): boolean {
  if (!hex || !hex.startsWith('#')) return false;
  const h = hex.slice(1);
  const full =
    h.length === 3
      ? h
          .split('')
          .map((x) => x + x)
          .join('')
      : h;
  const rgb = parseInt(full, 16);
  if (isNaN(rgb)) return false;
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = rgb & 0xff;
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

export const ThemeColor = setup<ThemeColorProps>((props) => {
  const restProps = props.$omit(['type', 'className', 'onInput']);
  const theme = colorScheme();
  const [schedule, cancel] = microtask(100);

  const isDarkColor = derived(() => isDarkHex(theme.color));

  const handleColorChange: InputEventHandler<HTMLInputElement> = (e) => {
    cancel();
    theme.color = (e.target as HTMLInputElement).value;
    schedule(() => {
      document.documentElement.style.setProperty('--seed-color', theme.color);
    });
    props.onInput?.(e);
  };

  return render(
    () => (
      <button
        className={props.className ?? THEME_CONFIGS.color.class}
        style={{ backgroundColor: theme.color, color: isDarkColor.value ? 'white' : 'black' }}
      >
        <input {...restProps} type="color" value={theme.color ?? 'red'} onInput={handleColorChange} />
        <div className="air-icon">palette</div>
        <Tooltip>Theme Color</Tooltip>
      </button>
    ),
    'ThemeColor'
  );
}, 'ThemeColor');
