import { getPointer } from '@airlib/headless/utils';
import { render, setup } from '@airlib/react';
import { MouseIcon } from '../icons/index.js';

export const PointerDebug = setup(() => {
  const pointer = getPointer();

  return render(
    () => (
      <div className="fixed air-chip air-chip-sm bottom-0 right-0 m-2 flex gap-1 pointer-events-none">
        <span>
          X: {pointer.x}, Y: {pointer.y}
        </span>
        <MouseIcon size={16} />
      </div>
    ),
    'PointerDebug'
  );
}, 'PointerDebug');
