import type { AnyType } from '../../types.js';
import type { WebWindow } from './window.js';

export type ArrangeMode = 'cascade' | 'tile' | 'stack';

export class WindowLauncher extends Set<WebWindow<AnyType, AnyType>> {
  public launch(app: WebWindow<AnyType, AnyType>) {
    if (app.online) {
      app.restore();
    } else {
      app.open();
    }

    return this;
  }

  public closeAll(app: WebWindow<AnyType, AnyType>) {
    for (const child of app.children) {
      child.close();
    }

    return this;
  }

  public arrange(app: WebWindow<AnyType, AnyType>, mode: ArrangeMode = 'cascade') {
    const instances = [...app.children].filter((i) => !i.minimized);
    const count = instances.length;
    if (!count) return this;

    const { innerWidth, innerHeight } = window;

    switch (mode) {
      case 'cascade': {
        const offset = 30;
        const first = instances[0]!;
        const maxX = innerWidth - first.rect.width;
        const maxY = innerHeight - first.rect.height;

        instances.forEach((instance, i) => {
          instance.moveTo(Math.min(i * offset, maxX), Math.min(i * offset, maxY));
          instance.focus();
        });
        break;
      }

      case 'tile': {
        const cols = Math.ceil(Math.sqrt(count));
        const rows = Math.ceil(count / cols);
        const tileW = Math.floor(innerWidth / cols);
        const tileH = Math.floor(innerHeight / rows);

        instances.forEach((instance, i) => {
          instance.moveTo((i % cols) * tileW, Math.floor(i / cols) * tileH, tileW, tileH);
        });
        break;
      }

      case 'stack': {
        const offset = 4;
        const centerX = (innerWidth - instances[0]!.rect.width) / 2;
        const centerY = (innerHeight - instances[0]!.rect.height) / 2;

        instances.forEach((instance, i) => {
          instance.moveTo(centerX + i * offset, centerY + i * offset);
          instance.focus();
        });
        break;
      }
    }

    return this;
  }
}
