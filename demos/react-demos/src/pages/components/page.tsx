import { dialogConfirm } from '@airlib/react-ui/components';
import { page, setup } from '@anchorlib/react';
import { uiIndexRoute } from './route.js';
import { TabDemo } from './Tabs.js';

const DialogConfirmDemo = setup(() => {
  const handleClick = () => {
    dialogConfirm({
      type: 'help',
      title: 'Are you sure?',
      message: 'Are you sure you want to perform this action?',
    }).then(console.log);
  };

  return (
    <div className="w-full gap-4 flex flex-col">
      <h2 className="air-headline-sm">Dialogs</h2>
      <button type="button" className="air-button" onClick={handleClick}>
        Confirm Action
      </button>
    </div>
  );
}, 'DialogConfirmDemo');

export const UIPage = page(uiIndexRoute).render(() => (
  <div className="flex flex-col gap-6 max-w-4xl">
    <h1 className="air-display-sm mb-4">UI Components</h1>
    <p className="air-body-lg text-on-surface-variant">
      Welcome to the AIR Components preview. Select a component from the sidebar to view its documentation and examples.
    </p>
    <DialogConfirmDemo />
    <TabDemo />
  </div>
));

export default UIPage;
