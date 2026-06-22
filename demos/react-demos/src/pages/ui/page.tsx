import { dialogConfirm } from '@airlib/react-ui/components';
import { webWindow } from '@airlib/react-ui/lib';
import { page, setup } from '@anchorlib/react';
import DemoWindow from './DemoWindow.js';
import { uiRoute } from './route.js';

const DialogConfirmDemo = setup(() => {
  const handleClick = () => {
    dialogConfirm({
      type: 'help',
      title: 'Are you sure?',
      message: 'Are you sure you want to perform this action?',
      // warningMessage: "This action can't be undone and you may lost access to the state.",
    }).then(console.log);
  };

  return (
    <div className="flex items-center gap-4">
      <button type="button" className="air-button" onClick={handleClick}>
        Confirm Action
      </button>
      <button type="button" className="air-button" onClick={() => demoWin.open()}>
        Open Window
      </button>
    </div>
  );
});

const demoWin = webWindow({
  name: 'asset-browser',
  title: 'Asset Browser',
  description: 'Multi window asset browser is awesome.',
  multiple: true,
  remember: 'default',
  rect: { minWidth: 960, minHeight: 680 },
}).render(DemoWindow);

export const UIPage = page(uiRoute).render(() => (
  <>
    <h1>React UI</h1>
    <DialogConfirmDemo />
  </>
));
