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
} from '@airlib/solid-form';
import { For, page, Title } from '@airlib/solid';
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
  <div class="mx-auto max-w-3xl p-6 lg:p-12 text-left">
    <Title>Account Settings | Form Demo</Title>

    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Account Settings</h1>
      <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Showcasing deep paths, complex validation, and various input types.
      </p>
    </div>

    <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <AccountForm
        onSubmit={async (data, changes) => {
          console.log('Submitted Data:', data);
          console.log('Changed Fields:', changes);

          // Simulate network request
          await new Promise((resolve) => setTimeout(resolve, 1000));
          alert('Settings saved successfully!');
        }}
        class="divide-y divide-gray-200 dark:divide-gray-800"
      >
        {/* Profile Section */}
        <div class="p-6 sm:p-8">
          <h2 class="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h2>
          <div class="grid gap-6 sm:grid-cols-2">
            <AccountForm.Field name="profile.fullName" label="Full Name">
              <TextInput placeholder="Jane Doe" />
            </AccountForm.Field>

            <AccountForm.Field name="profile.email" label="Email Address">
              <EmailInput placeholder="jane@example.com" />
            </AccountForm.Field>

            <AccountForm.Field name="profile.bio" label="Biography" class="sm:col-span-2">
              <Textarea placeholder="Tell us a bit about yourself..." rows={3} />
            </AccountForm.Field>
          </div>
        </div>

        {/* Security Section */}
        <div class="p-6 sm:p-8">
          <h2 class="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Security Settings</h2>
          <div class="grid gap-6 sm:grid-cols-2">
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
        <div class="p-6 sm:p-8">
          <h2 class="mb-6 text-lg font-semibold text-gray-900 dark:text-white">Address Information</h2>

          <AccountForm.FieldList name="addresses">
            {(items) => (
              <div class="space-y-8">
                <For each={items}>
                  {(_, index) => (
                    <div class="grid gap-6 sm:grid-cols-2 rounded-xl border border-gray-100 p-6 dark:border-gray-800">
                      <AccountForm.Field
                        name={`addresses.${index()}.street`}
                        label="Street Address"
                        class="sm:col-span-2"
                      >
                        <TextInput placeholder="123 Main St, Apt 4B" />
                      </AccountForm.Field>

                      <AccountForm.Field name={`addresses.${index()}.city`} label="City">
                        <TextInput placeholder="San Francisco" />
                      </AccountForm.Field>

                      <div class="grid grid-cols-2 gap-6">
                        <AccountForm.Field name={`addresses.${index()}.state`} label="State">
                          <TextInput placeholder="CA" maxLength={2} />
                        </AccountForm.Field>
                        <AccountForm.Field name={`addresses.${index()}.zipCode`} label="ZIP Code">
                          <TextInput placeholder="94105" />
                        </AccountForm.Field>
                      </div>

                      {/* Remove Address Button */}
                      <button
                        type="button"
                        onClick={() => {
                          items.splice(index(), 1);
                        }}
                        class="text-sm text-red-500 hover:text-red-600 sm:col-span-2 text-right"
                      >
                        Remove Address
                      </button>
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
                  class="rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800/50 w-full"
                >
                  + Add New Address
                </button>
              </div>
            )}
          </AccountForm.FieldList>
        </div>

        {/* Preferences Section */}
        <div class="p-6 sm:p-8">
          <h2 class="mb-6 text-lg font-semibold text-gray-900 dark:text-white">App Preferences</h2>
          <div class="grid gap-8 sm:grid-cols-2">
            <AccountForm.Field name="preferences.theme" label="Interface Theme">
              <Select>
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
                <option value="system">System Default</option>
              </Select>
            </AccountForm.Field>

            <AccountForm.Field name="preferences.accentColor" label="Accent Color">
              <div class="flex items-center gap-3">
                <ColorPicker />
                <span class="text-sm text-gray-500 dark:text-gray-400">Pick a brand color</span>
              </div>
            </AccountForm.Field>

            <AccountForm.Field name="preferences.volume" label="Notification Volume" class="sm:col-span-2">
              <Slider min="0" max="100" />
            </AccountForm.Field>

            <AccountForm.Field name="preferences.marketing" class="sm:col-span-2">
              <label for={'marketing-check'} class="flex cursor-pointer items-start gap-3">
                <div class="flex h-6 items-center">
                  <Checkbox id={'marketing-check'} />
                </div>
                <div class="flex flex-col">
                  <span class="text-sm font-medium text-gray-900 dark:text-white">Marketing Emails</span>
                  <span class="text-sm text-gray-500 dark:text-gray-400">
                    Receive weekly product updates and offers.
                  </span>
                </div>
              </label>
            </AccountForm.Field>
          </div>
        </div>

        {/* Actions */}
        <div class="flex items-center justify-end gap-3 bg-gray-50 p-6 dark:bg-gray-800/50 sm:px-8">
          <FormReset>Discard Changes</FormReset>
          <FormSubmit>{(form) => (form?.pending ? 'Saving...' : 'Save Settings')}</FormSubmit>
        </div>
      </AccountForm>
    </div>
  </div>
));

export default FormsPage;
