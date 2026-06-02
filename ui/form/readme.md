# AIR Form

AIR Form is a reactive, framework-agnostic form engine powered by Zod schemas.

## AIR Stack Integration
To use AIR Form inside a reactive component, create a strictly typed form factory outside the component, and initialize the form state within the component's `setup` phase.

```tsx
import { setup, render } from '@anchorlib/react';
import { formFactory } from '@airlib/form';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(3, 'Name is too short'),
  age: z.number().min(18, 'Must be an adult'),
});

// Create a strictly typed factory outside the component
const userForm = formFactory(userSchema);

export const UserForm = setup((props) => {
  // Initialize the reactive form state inside the component
  const form = userForm({ 
    value: { name: '', age: 0 } 
  });

  return render(() => (
    <form>
      {/* UI logic goes here */}
    </form>
  ));
});
```

The factory guarantees that the initialized `formState` is strictly typed to the schema and properly integrated with the reactive rendering cycle.

## Field Selection
To access a specific field within the form, use the `.field()` method on the initialized form.

```tsx
export const UserForm = setup((props) => {
  const form = userForm({ value: { name: '', age: 0 } });

  // Isolate a strictly typed field boundary
  const name = form.field('name');

  return render(() => (
    <div>
      <input 
        value={name.value} 
        onInput={(e) => { name.value = e.currentTarget.value; }} 
      />
      {!name.valid && <span>{name.error}</span>}
    </div>
  ));
});
```

The `.field()` method provides a strictly typed reactive boundary for the specified field, allowing isolated state updates and error checking.

## Input Controllers
To bind a field to a UI input, use the `.input()` method to generate an input controller.

```tsx
export type UserFormProps = {
  value?: { name: string, age: number }
};

export const UserForm = setup<UserFormProps>((props) => {
  const form = userForm(props);
  
  // Generate input controllers
  const name = form.field('name').input({ type: 'text' });
  const age = form.field('age').input({ type: 'number' });

  return render(() => (
    <form>
      <input 
        type={name.type} 
        name={name.name}
        value={name.value}
        disabled={name.disabled}
        onInput={(e) => { name.value = e.currentTarget.value; }}
        onBlur={() => { name.settled(); }}
      />
      
      <input 
        type={age.type} 
        name={age.name}
        value={age.value}
        disabled={age.disabled}
        onInput={(e) => { age.value = e.currentTarget.value; }}
        onBlur={() => { age.settled(); }}
      />
    </form>
  ));
});
```

The input controller handles two-way data binding, string parsing, event synchronization, and automatically inherits the form's `pending` state via the `disabled` property to lock inputs during network submission.

## Form Context
To build composable input components without passing props, use the `formField` API to automatically inherit the form context.

```tsx
import { formField, FormInputType } from '@airlib/form';
import { setup, render } from '@anchorlib/react';

export const TextInput = setup<{ name: string, label: string, type?: FormInputType }>((props) => {
  // Automatically reads the Form context from the tree
  const input = formField<string>(props.name).input(props);

  return render(() => (
    <div className="field-group">
      <label>{props.label}</label>
      <input 
        type={input.type}
        name={input.name}
        value={input.value}
        disabled={input.disabled}
        onInput={(e) => { input.value = e.currentTarget.value; }}
        onBlur={() => { input.settled(); }}
      />
      {!input.valid && <span className="error">{input.error}</span>}
    </div>
  ));
});
```

The `formField` function automatically discovers the closest form provider in the component tree.

## Form Submission
The `.submit()` method handles the complete submission lifecycle. It executes the provided handler, tracks the network status (`IDLE`, `PENDING`, `SUCCESS`, `ERROR`), prevents concurrent race conditions by locking the form, and automatically maps its `pending` status down to the `disabled` state of all connected input fields. 

Additionally, on a successful submission, the form natively cleans up its dirty state (dropping `form.changed` to `false`) making the submitted data the new baseline.

```tsx
export const ProfileForm = setup(() => {
  const form = userForm({ value: { name: '', age: 0 } });

  const saveProfile = async (data: { name: string, age: number }) => {
    // Perform async network requests
    await fetch('/api/user', { method: 'POST', body: JSON.stringify(data) });
  };

  return render(() => (
    <form>
      {/* ... Form inputs ... */}

      {/* 
        `canSubmit` automatically ensures the form is valid, has active changes, 
        and is not currently pending.
      */}
      <button 
        disabled={!form.canSubmit}
        onClick={(e) => {
          e.preventDefault();
          form.submit(saveProfile);
        }}
      >
        {form.pending ? 'Saving...' : 'Save Profile'}
      </button>

      {/* Surface runtime errors strictly typed to the form API */}
      {form.status === 'error' && (
        <div className="error-banner">{form.error?.message}</div>
      )}
    </form>
  ));
});
```

By relying on `.submit(handler)`, developers completely avoid boilerplate loading-states, manual network try/catch blocks, and dirty-state reset procedures across the application.
