import { colorScheme } from '@airlib/uikit/utils';
import { render, setup } from '@anchorlib/react';
import type { InputEventHandler } from 'react';

export const ThemeColor = setup(() => {
  const theme = colorScheme();

  const handleColorChange: InputEventHandler<HTMLInputElement> = (e) => {
    theme.color = (e.target as HTMLInputElement).value;
    document.documentElement.style.setProperty('--seed-color', theme.color);
  };

  return render(() => <input type="color" value={theme.color ?? 'red'} onInput={handleColorChange} />, 'ThemeColor');
}, 'ThemeColor');
