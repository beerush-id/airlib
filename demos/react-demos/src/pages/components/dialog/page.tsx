import { dialogConfirm, Card, CardBody, CardGroup, CardHeader, CardTitle } from '@airlib/react-ui/components';
import { page, setup } from '@anchorlib/react';
import { dialogRoute } from '../route.js';

const DialogDocsDemo = setup(() => {
  const showDialog = () => {
    dialogConfirm({
      type: 'help',
      title: 'Delete Item?',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
    }).then((result) => {
      console.log('Dialog result:', result);
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="air-display-sm mb-4">Dialog</h1>
        <p className="air-body-lg text-on-surface-variant max-w-3xl">
          Dialogs provide important prompts in a user flow.
        </p>
      </div>

      <CardGroup>
        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Imperative Dialog</CardTitle>
            <p className="air-body-sm">
              You can call dialogConfirm() to show a dialog imperatively and wait for the promise to resolve.
            </p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4 max-w-lg">
              <button className="air-button" onClick={showDialog}>
                Open Confirm Dialog
              </button>
            </div>
          </CardBody>
        </Card>

        <Card variant="outlined">
          <CardHeader>
            <CardTitle>Static CSS Preview</CardTitle>
            <p className="air-body-sm">This is a static preview of the dialog surface without any JS wrapper.</p>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col gap-4 max-w-lg">
              <div role="dialog" className="air-dialog-body relative max-w-sm mx-0" aria-hidden="false">
                <div className="air-dialog-header">
                  <h2 className="air-dialog-title mb-0">Static Dialog</h2>
                </div>
                <div className="air-dialog-content">
                  This is a static preview of the dialog surface without any JS wrapper.
                </div>
                <div className="air-dialog-footer">
                  <button className="air-button-text">Cancel</button>
                  <button className="air-button">Confirm</button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </div>
  );
}, 'DialogDocsDemo');

export const DialogPage = page(dialogRoute).render(() => <DialogDocsDemo />);

export default DialogPage;
