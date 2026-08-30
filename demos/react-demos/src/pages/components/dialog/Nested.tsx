import { createDialogState } from '@airlib/headless/components';
import {
  Button,
  Dialog,
  DialogCancel,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@airlib/react-ui/components';
import { setup } from '@airlib/react';

const Nested = setup(() => {
  const primaryDialog = createDialogState();
  const secondaryDialog = createDialogState();

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => primaryDialog.show()} variant="outlined">
        Open Primary Dialog
      </Button>

      {/* Primary Dialog */}
      <Dialog dialog={primaryDialog}>
        <DialogHeader>
          <DialogTitle>Primary Settings</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <div className="flex flex-col gap-4 py-2">
            <p className="text-sm text-on-surface-variant">
              This dialog traps focus to itself. If you open a secondary dialog from here, the focus trap will properly transfer to the new top-most dialog and return here when closed.
            </p>
            <Button onClick={() => secondaryDialog.show()} variant="filled" color="primary">
              Open Advanced Settings (Nested)
            </Button>
          </div>
        </DialogContent>
        <DialogFooter>
          <DialogCancel onClick={() => primaryDialog.hide()}>Close</DialogCancel>
        </DialogFooter>
      </Dialog>

      {/* Secondary (Nested) Dialog */}
      <Dialog dialog={secondaryDialog}>
        <DialogHeader>
          <DialogTitle>Advanced Settings</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <p className="text-sm text-on-surface-variant py-2">
            This is the secondary nested dialog. Notice how the overlay properly stacks and focus is trapped within this surface until it is closed.
          </p>
        </DialogContent>
        <DialogFooter>
          <DialogCancel onClick={() => secondaryDialog.hide()}>Back</DialogCancel>
        </DialogFooter>
      </Dialog>
    </div>
  );
}, 'NestedDialog');

export default Nested;
