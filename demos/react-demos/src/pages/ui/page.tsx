import { dialogConfirm } from '@airlib/react-ui/components';
import { page } from '@anchorlib/react';
import { uiRoute } from './route.js';

const DialogConfirmDemo = () => {
  const handleClick = () => {
    dialogConfirm({
      type: 'help',
      title: 'Are you sure?',
      message: 'Are you sure you want to perform this action?',
      // warningMessage: "This action can't be undone and you may lost access to the state.",
    }).then(console.log);
  };

  return (
    <button type="button" className="button" onClick={handleClick}>
      Confirm Action
    </button>
  );
};

export const UIPage = page(uiRoute).render(() => (
  <>
    <h1>React UI</h1>
    <DialogConfirmDemo />
  </>
));
