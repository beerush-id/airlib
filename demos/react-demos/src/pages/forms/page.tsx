import {
  Checkbox,
  ColorPicker,
  createForm,
  EmailInput,
  FormReset,
  FormSubmit,
  PasswordInput,
  Select,
  Slider,
  Textarea,
  TextInput,
} from '@airlib/react-form';
import { For, page, Title } from '@anchorlib/react';
import { z } from 'zod';
import { formsRoute } from './route.js';

const accountSchema = z.object({
  profile: z.object({
    fullName: z.string().min(2, 'Name is too short'),
    email: z.string().email('Invalid email address'),
    bio: z.string().max(160, 'Bio must be under 160 characters').optional(),
  }),
  password: z.string().min(8),
  passwordConfirm: z.string().min(8),
  addresses: z
    .array(
      z.object({
        id: z.string(),
        street: z.string().min(5, 'Street address is required'),
        city: z.string().min(2, 'City is required'),
        state: z.string().min(2, 'State is required'),
        zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
        country: z.string().default('United States'),
      })
    )
    .default([]),
  preferences: z.object({
    theme: z.enum(['light', 'dark', 'system']).default('system'),
    marketing: z.boolean().optional(),
    volume: z.number().min(0).max(100),
    accentColor: z.string().default('#ffffff'),
  }),
});

const AccountForm = createForm(accountSchema);

export const FormsPage = page(formsRoute).render(() => (
  <div className="mx-auto max-w-3xl p-6 lg:p-12 text-left w-full">
    <Title>Account Settings | Form Demo</Title>

    <div className="mb-8">
      <h1 className="air-headline-md font-bold tracking-tight text-on-surface">Account Settings</h1>
      <p className="mt-2 air-body-lg text-on-surface-variant">
        Showcasing deep paths, complex validation, and various input types.
      </p>
    </div>

    <AccountForm
      onSubmit={async (data, changes) => {
        console.log('Submitted Data:', data);
        console.log('Changed Fields:', changes);

        // Simulate network request
        await new Promise((resolve) => setTimeout(resolve, 1000));
        alert('Settings saved successfully!');
      }}
      className="air-card-group gap-2 [--card-padding:1.5rem] sm:[--card-padding:2rem]"
    >
      {/* Profile Section */}
      <div className="air-card">
        <div className="air-card-header">
          <h2 className="air-card-title">Profile Information</h2>
        </div>
        <div className="air-card-body grid gap-6 sm:grid-cols-2">
          <AccountForm.Field name="profile.fullName" label="Full Name">
            <TextInput placeholder="Jane Doe" />
          </AccountForm.Field>

          <AccountForm.Field name="profile.email" label="Email Address">
            <EmailInput placeholder="jane@example.com" />
          </AccountForm.Field>

          <AccountForm.Field name="profile.bio" label="Biography" className="air-text-field sm:col-span-2">
            <Textarea placeholder="Tell us a bit about yourself..." rows={3} />
          </AccountForm.Field>
        </div>
      </div>

      {/* Security Section */}
      <div className="air-card">
        <div className="air-card-header">
          <h2 className="air-card-title">Security Settings</h2>
        </div>
        <div className="air-card-body grid gap-6 sm:grid-cols-2">
          <AccountForm.Field name="password" label="New Password">
            <PasswordInput placeholder="••••••••" />
          </AccountForm.Field>

          <AccountForm.Field
            name="passwordConfirm"
            label="Confirm Password"
            match="password"
            mismatchLabel="Confirm password doesn't match"
          >
            <PasswordInput placeholder="••••••••" />
          </AccountForm.Field>
        </div>
      </div>

      {/* Addresses Section */}
      <div className="air-card">
        <div className="air-card-header">
          <h2 className="air-card-title">Address Information</h2>
        </div>

        <AccountForm.FieldList name="addresses">
          {(items) => (
            <div className="air-card-body space-y-2">
              <For each={() => items}>
                {(_, index) => (
                  <div className="air-card-filled air-card-body grid gap-6 sm:grid-cols-2">
                    <AccountForm.Field
                      name={`addresses.${index}.street`}
                      label="Street Address"
                      className="air-text-field sm:col-span-2"
                    >
                      <TextInput placeholder="123 Main St, Apt 4B" />
                    </AccountForm.Field>

                    <AccountForm.Field name={`addresses.${index}.city`} label="City">
                      <TextInput placeholder="San Francisco" />
                    </AccountForm.Field>

                    <div className="grid grid-cols-2 gap-6">
                      <AccountForm.Field name={`addresses.${index}.state`} label="State">
                        <TextInput placeholder="CA" maxLength={2} />
                      </AccountForm.Field>
                      <AccountForm.Field name={`addresses.${index}.zipCode`} label="ZIP Code">
                        <TextInput placeholder="94105" />
                      </AccountForm.Field>
                    </div>

                    {/* Remove Address Button */}
                    <div className="sm:col-span-2 flex justify-end pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          items.splice(index, 1);
                        }}
                        className="air-button-text text-error"
                      >
                        Remove Address
                      </button>
                    </div>
                  </div>
                )}
              </For>

              {/* Add Address Button */}
              <button
                type="button"
                onClick={() => {
                  items.push({
                    id: crypto.randomUUID(),
                    street: '',
                    city: '',
                    state: '',
                    zipCode: '',
                    country: 'United States',
                  });
                }}
                className="rounded-lg border border-dashed border-outline-variant px-4 py-3 air-body-md font-medium text-on-surface-variant transition-colors hover:border-outline hover:bg-surface-variant w-full"
              >
                + Add New Address
              </button>
            </div>
          )}
        </AccountForm.FieldList>
      </div>

      {/* Preferences Section */}
      <div className="air-card">
        <div className="air-card-header">
          <h2 className="air-card-title">App Preferences</h2>
        </div>
        <div className="air-card-body grid gap-8 sm:grid-cols-2">
          <AccountForm.Field name="preferences.theme" label="Interface Theme">
            <Select>
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
              <option value="system">System Default</option>
            </Select>
          </AccountForm.Field>

          <AccountForm.Field name="preferences.accentColor" label="Accent Color" className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <ColorPicker />
              <span className="air-body-sm text-on-surface-variant">Pick a brand color</span>
            </div>
          </AccountForm.Field>

          <AccountForm.Field
            name="preferences.volume"
            label="Notification Volume"
            className="flex flex-col gap-1 sm:col-span-2"
          >
            <Slider min="0" max="100" />
          </AccountForm.Field>

          <AccountForm.Field name="preferences.marketing" className="flex flex-col gap-1 sm:col-span-2">
            <label htmlFor={'marketing-check'} className="flex cursor-pointer items-start gap-3">
              <div className="flex h-6 items-center">
                <Checkbox id={'marketing-check'} />
              </div>
              <div className="flex flex-col">
                <span className="air-body-md font-medium text-on-surface">Marketing Emails</span>
                <span className="air-body-sm text-on-surface-variant">Receive weekly product updates and offers.</span>
              </div>
            </label>
          </AccountForm.Field>
        </div>
      </div>

      {/* Actions */}
      <div className="air-card">
        <div className="air-card-body flex items-center justify-end gap-3 bg-surface-variant">
          <FormReset>Discard Changes</FormReset>
          <FormSubmit>{(form) => (form?.pending ? 'Saving...' : 'Save Settings')}</FormSubmit>
        </div>
      </div>
    </AccountForm>
  </div>
));

export default FormsPage;
