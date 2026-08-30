import { FormField, TextField } from '@airlib/react-ui';
import {
  Button,
  createDialog,
  DialogCancel,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogSubmit,
  DialogTitle,
  Icon,
} from '@airlib/react-ui/components';
import { $bind, setup } from '@airlib/react';

type UserData = { name: string; email: string };

const Data = setup(() => {
  const handleEdit = async () => {
    try {
      const result = await editDialog.show({
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
      });
      console.log('Saving changes:', result);
    } catch (_) {
      console.log('Edit cancelled.');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button onClick={handleEdit}>
        <Icon>edit</Icon>
        <span>Edit Profile</span>
      </Button>
    </div>
  );
}, 'DataDialog');

export default Data;

const editDialog = createDialog<UserData, UserData>((data, dialog) => (
  <>
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
    </DialogHeader>
    <DialogContent className="gap-4">
      <p className="text-sm text-on-surface-variant">
        This dialog demonstrates injecting initial data (`dialog.show(data)`) and resolving with modified data
        (`dialog.hide(result)`).
      </p>
      <FormField label="Name">
        <TextField value={$bind(data, 'name')} placeholder="e.g. John Doe" />
      </FormField>
      <FormField label="Email">
        <TextField value={$bind(data, 'email')} placeholder="e.g. john.doe@domain.com" />
      </FormField>
    </DialogContent>
    <DialogFooter>
      <DialogCancel onClick={() => dialog.hide()}>Cancel</DialogCancel>
      <DialogSubmit onClick={() => dialog.hide()}>Save Changes</DialogSubmit>
    </DialogFooter>
  </>
));
