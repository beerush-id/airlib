import { createForm, TextInput, PasswordInput, Checkbox, FormSubmit } from '@airlib/react-form';
import { Meta, page, Title, mutable } from '@anchorlib/react';
import { z } from 'zod';
import { signUp } from './function.js';
import { signUpRoute } from './route.js';

const schema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Confirm password must be at least 8 characters'),
    remember: z.boolean().optional().default(false),
    accepted: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const SignUpForm = createForm(schema);

export const SignUpPage = page(signUpRoute).render(() => {
  const auth = mutable({ submitted: false, error: '' });

  return (
    <>
      <Title>Sign Up — AIR Stack</Title>
      <Meta name="description" content="Create your account." />

      <SignUpForm
        className="air-card-group w-md gap-2"
        onSubmit={async (data) => {
          auth.error = '';
          try {
            await signUp({ email: data.email, password: data.password });
            auth.submitted = true;
          } catch (err: any) {
            auth.error = err.message || 'An error occurred';
          }
        }}
      >
        <div className="air-card air-card-body p-10 gap-3">
          {auth.error ? <p className="air-body-sm text-error text-center">{auth.error}</p> : null}

          <SignUpForm.Field name="email" label="Email">
            <TextInput placeholder="jane@example.com" />
          </SignUpForm.Field>

          <SignUpForm.Field name="password" label="Password">
            <PasswordInput placeholder="••••••••" />
          </SignUpForm.Field>

          <SignUpForm.Field name="confirmPassword" label="Confirm Password" match="password">
            <PasswordInput placeholder="••••••••" />
          </SignUpForm.Field>

          <div className="flex flex-col gap-2 mt-3">
            <SignUpForm.Field name="remember">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="flex h-5 items-center">
                  <Checkbox />
                </div>
                <span className="air-body-md text-on-surface">Remember me</span>
              </label>
            </SignUpForm.Field>

            <SignUpForm.Field name="accepted">
              <label className="flex items-start gap-3 cursor-pointer">
                <div className="flex h-5 items-center mt-0.5">
                  <Checkbox />
                </div>
                <span className="air-body-md text-on-surface">I accept the terms and conditions</span>
              </label>
            </SignUpForm.Field>
          </div>
        </div>

        <div className="air-card-filled air-card-body p-10">
          <FormSubmit className="air-button w-full">{(form) => (form?.pending ? 'Signing Up...' : 'Sign Up')}</FormSubmit>

          {auth.submitted ? <p className="air-body-sm text-primary text-center mt-2">Welcome aboard!</p> : null}
        </div>
      </SignUpForm>
    </>
  );
});

export default SignUpPage;
