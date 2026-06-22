import { createForm, TextInput, PasswordInput, Checkbox, FormSubmit } from '@airlib/react-form';
import { Meta, page, Title, mutable } from '@anchorlib/react';
import { z } from 'zod';
import { signIn } from './function.js';
import { signInRoute } from './route.js';

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  remember: z.boolean().optional().default(false),
});

const SignInForm = createForm(schema);

export const SignInPage = page(signInRoute).render(() => {
  const auth = mutable({ submitted: false, error: '' });

  return (
    <>
      <Title>Sign In — AIR Stack</Title>
      <Meta name="description" content="Sign in to your account." />

      <SignInForm
        className="air-card-group w-md gap-2"
        onSubmit={async (data) => {
          auth.error = '';
          try {
            await signIn({ email: data.email, password: data.password });
            auth.submitted = true;
          } catch (err: any) {
            auth.error = err.message || 'An error occurred';
          }
        }}
      >
        <div className="air-card air-card-body p-10 gap-3">
          {auth.error ? <p className="air-body-sm text-error text-center">{auth.error}</p> : null}

          <SignInForm.Field name="email" label="Email">
            <TextInput placeholder="jane@example.com" />
          </SignInForm.Field>

          <SignInForm.Field name="password" label="Password">
            <PasswordInput placeholder="••••••••" />
          </SignInForm.Field>

          <div className="flex flex-col gap-2 mt-3">
            <SignInForm.Field name="remember">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="flex h-5 items-center">
                  <Checkbox />
                </div>
                <span className="air-body-md text-on-surface">Remember me</span>
              </label>
            </SignInForm.Field>
          </div>
        </div>

        <div className="air-card-filled air-card-body p-10">
          <FormSubmit className="air-button w-full">{(form) => (form?.pending ? 'Signing In...' : 'Sign In')}</FormSubmit>

          {auth.submitted ? <p className="air-body-sm text-primary text-center mt-2">Welcome back!</p> : null}
        </div>
      </SignInForm>
    </>
  );
});

export default SignInPage;
