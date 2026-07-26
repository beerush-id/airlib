import { Button, dialogConfirm } from '@airlib/react-ui/components';
import { setup } from '@anchorlib/react';

const Imperative = setup(() => {
  const showConfirm = () => {
    dialogConfirm({
      type: 'help',
      title: 'Delete Item?',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      warning: true,
      warningMessage: 'Deleting this will also delete all associated records.',
      acceptLabel: 'Yes, Delete',
      rejectLabel: 'Cancel',
    }).then((result) => {
      if (result) {
        console.log('Data deleted.');
      } else {
        console.log('Cancelled.');
      }
    });
  };

  const showInfo = () => {
    dialogConfirm({
      type: 'info',
      title: 'System Update',
      message: 'A new system update is available. Do you want to apply it now?',
      acceptLabel: 'Apply Update',
      rejectLabel: 'Not Now',
    }).then((result) => {
      if (result) {
        console.log('Applying system updated.');
      } else {
        console.log('Update postpone.');
      }
    });
  };

  return (
    <div className="flex gap-4">
      <Button onClick={showConfirm} color="error">
        Delete Item
      </Button>
      <Button onClick={showInfo}>System Update</Button>
    </div>
  );
}, 'ImperativeDialog');

export default Imperative;
