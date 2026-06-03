# AIR React Form

Handling form states, validations, and complex data structures like arrays and nested objects in standard React can be verbose and hard to optimize for performance. `@airlib/react-form` provides reactive form components built on top of `@anchorlib/react` to solve this, ensuring high performance without unnecessary re-renders while giving a deeply type-safe structure.

## Creating Typed Forms

Building robust forms requires strict schema validation and type safety. Here how we define a schema and create a typed form.

```tsx
import { z } from 'zod';
import { createForm } from '@airlib/react-form';

const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
});

export const UserForm = createForm(userSchema);
```

The `createForm` function returns form components (`Form`, `Field`, `FieldList`) that are deeply typed against the provided Zod schema, ensuring autocompletion and compile-time checks for all field names.

## Building Form Interfaces

Building the UI requires binding inputs to the form state. The typed form provides everything needed to structure the form securely.

```tsx
import { UserForm } from './form';
import { TextInput, EmailInput, FormSubmit, FormReset } from '@airlib/react-form';

export function ProfileEditor() {
  return (
    <UserForm onSubmit={(data) => console.log(data)}>
      <UserForm.Field name="name" label="Name" errorClass="text-red-500">
        <TextInput placeholder="Enter name" />
      </UserForm.Field>

      <UserForm.Field name="email" label="Email" errorClass="text-red-500">
        <EmailInput placeholder="Enter email" />
      </UserForm.Field>

      <div>
        <FormReset>Reset</FormReset>
        <FormSubmit>Save Profile</FormSubmit>
      </div>
    </UserForm>
  );
}
```

The `UserForm.Field` wrapper automatically tracks errors and provides them to the UI, while components like `TextInput` and `EmailInput` seamlessly connect to the form state under the hood. The `FormSubmit` and `FormReset` buttons intelligently track form changes and validation status, automatically enabling or disabling based on the form's readiness.

## Handling Form Arrays

Dealing with dynamic lists, such as arrays of objects, in a form is often complicated. The `FieldList` component abstracts this complexity.

```tsx
import { z } from 'zod';
import { createForm, TextInput } from '@airlib/react-form';

const teamSchema = z.object({
  members: z.array(z.object({ name: z.string(), role: z.string() }))
});

const TeamForm = createForm(teamSchema);

export function TeamEditor() {
  return (
    <TeamForm>
      <TeamForm.FieldList name="members">
        {(items) => (
          <div>
            {items.map((member, i) => (
              <div key={i}>
                <TeamForm.Field name={`members.${i}.name`}>
                  <TextInput placeholder="Name" />
                </TeamForm.Field>
                <TeamForm.Field name={`members.${i}.role`}>
                  <TextInput placeholder="Role" />
                </TeamForm.Field>
              </div>
            ))}
            <button type="button" onClick={() => items.push({ name: '', role: '' })}>
              Add Member
            </button>
          </div>
        )}
      </TeamForm.FieldList>
    </TeamForm>
  );
}
```

The `FieldList` exposes the array items directly to the render function, allowing direct reactive mutations like `.push()` on the array. Because this uses `@anchorlib/react` under the hood, these mutations are automatically tracked without the need for verbose state management hooks.

## Working With Custom Inputs

Sometimes standard inputs are not enough. Building custom inputs that integrate seamlessly with the form state is trivial using the built-in `formInput` hook or the `createInput` factory.

```tsx
import { setup, render } from '@anchorlib/react';
import { formInput } from '@airlib/form';

export const CustomInput = setup<{ name: string }>((props) => {
  // Automatically connects to the form field state via the `name` prop
  const input = formInput(props);

  return render(() => (
    <div>
      <input 
        name={input.name}
        value={input.value || ''} 
        onInput={(e) => input.value = e.currentTarget.value} 
        onBlur={() => input.settled()}
      />
      {input.error?.map(err => <span key={err} className="error">{err}</span>)}
    </div>
  ));
});
```

Using `formInput()` instantly wires up the input state, validation rules, and error tracking based on the provided `name` prop. This eliminates boilerplate and wrapper components, keeping your custom fields extremely clean and performant. For even simpler standard inputs, you can simply use the `createInput('text')` factory.