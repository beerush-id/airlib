import { dialogConfirm } from '@airlib/react-ui/components';
import { page, setup } from '@anchorlib/react';
import { uiRoute } from './route.js';
import { TabDemo } from './Tabs.js';

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
    </div>
  );
}, 'DialogConfirmDemo');

export const UIPage = page(uiRoute).render(() => (
  <>
    <h1>React UI</h1>
    <DialogConfirmDemo />
    <TabDemo />
  </>
));
