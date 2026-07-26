import { createDialogState } from '@airlib/headless/components';
import { Button, Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@airlib/react-ui/components';
import { setup } from '@anchorlib/react';

const Fullscreen = setup(() => {
  const dialog = createDialogState();

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={() => dialog.show()} variant="outlined">
        Open Fullscreen Modal
      </Button>

      <Dialog 
        dialog={dialog} 
        // Using the predefined CSS utility class for fullscreen dialogs
        bodyClass="air-dialog-body air-dialog-fullscreen bg-surface"
      >
        <DialogHeader>
          <DialogTitle>Fullscreen View</DialogTitle>
          <DialogClose onClick={() => dialog.hide()} />
        </DialogHeader>
        <DialogContent>
          <div className="flex flex-col items-center justify-center h-full gap-4 text-on-surface-variant">
            <span className="material-symbols-outlined text-6xl opacity-50">open_in_full</span>
            <p className="text-center max-w-sm">
              By passing the <code className="bg-surface-variant px-1 rounded text-on-surface">air-dialog-fullscreen</code> class to the <code className="bg-surface-variant px-1 rounded text-on-surface">bodyClass</code> prop, the dialog automatically breaks out of the standard max-width container to fill the entire screen viewport.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}, 'FullscreenDialog');

export default Fullscreen;
