import { Card, CardBody, CardGroup, CardHeader, CardTitle, Field, FieldLabel } from '@airlib/react-ui/components';
import {
  Checkbox,
  EmailField,
  Form,
  FormField,
  FormReset,
  FormSubmit,
  PasswordField,
  Radio,
  RadioGroup,
  Select,
  SelectButton,
  SelectItem,
  SelectMenu,
  SelectOption,
  Switch,
  Textarea,
  TextField,
} from '@airlib/react-ui/form';
import { mutable, setup } from '@anchorlib/react';
import { z } from 'zod';

const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z
    .string()
    .min(8, 'Minimum password length is 8 characters')
    .max(20, 'Password cannot exceed 20 characters'),
  confirmPassword: z
    .string()
    .min(8, 'Minimum password length is 8 characters')
    .max(20, 'Password cannot exceed 20 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(100, 'Bio is too long').optional(),
  role: z.enum(['admin', 'user', 'guest']).default('user'),
  notifications: z.boolean().default(false).optional(),
  interests: z.array(z.string()).default([]),
  theme: z.enum(['light', 'dark']).default('light'),
  terms: z.boolean().refine((val) => val === true, 'You must accept the terms and conditions'),
});

const General = setup(() => {
  const data = mutable({}) as z.infer<typeof formSchema>;

  return (
    <Form
      className="flex flex-col gap-6"
      schema={formSchema}
      value={data}
      onSubmit={(data) => {
        alert(`Form submitted: ${JSON.stringify(data, null, 2)}`);
      }}
    >
      <CardGroup>
        <Card>
          <CardHeader>
            <CardTitle>Register Form</CardTitle>
            <p className="air-card-subtitle">A complete form showing all available input types and validations.</p>
          </CardHeader>
          <CardBody className="flex flex-col gap-2">
            <div className="flex items-start gap-4">
              <FormField name="username" label="Username">
                <TextField placeholder="Enter your username" />
              </FormField>
              <FormField name="email" label="Email Address">
                <EmailField placeholder="Enter your email" />
              </FormField>
            </div>
            <div className="flex items-start gap-4">
              <FormField name="password" label="Password">
                <PasswordField placeholder="Enter your password" />
              </FormField>
              <FormField
                name="confirmPassword"
                label="Confirm Password"
                match="password"
                mismatchLabel="Password doesn't match"
              >
                <PasswordField placeholder="Confirm your password" />
              </FormField>
            </div>
            <div className="flex items-start gap-4">
              <FormField name="role" label="Role">
                <Select placeholder="Select a role...">
                  <SelectButton inline />
                  <SelectMenu>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="user">Regular User</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectMenu>
                </Select>
              </FormField>
              <FormField name="interests" label="Interests">
                <Select placeholder="Select interests..." multiple>
                  <SelectButton inline />
                  <SelectMenu>
                    <SelectOption value="coding">Coding</SelectOption>
                    <SelectOption value="music">Music</SelectOption>
                    <SelectOption value="sports">Sports</SelectOption>
                    <SelectOption value="reading">Reading</SelectOption>
                  </SelectMenu>
                </Select>
              </FormField>
            </div>
            <FormField name="bio" label="Biography" supportText="Optional short bio.">
              <Textarea placeholder="Tell us about yourself..." />
            </FormField>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="w-full flex gap-4 items-end justify-between">
              <FormField name="theme" label="Theme Setting" className="w-auto" block>
                <RadioGroup className="mb-1">
                  <Field>
                    <Radio value="light" />
                    <FieldLabel>Light</FieldLabel>
                  </Field>
                  <Field>
                    <Radio value="dark" />
                    <FieldLabel>Dark</FieldLabel>
                  </Field>
                </RadioGroup>
              </FormField>
              <FormField name="notifications" inline="before" label="Enable notifications" className={'w-auto'}>
                <Switch />
              </FormField>
            </div>
          </CardBody>
        </Card>
        <Card variant="filled">
          <CardBody className="flex gap-2">
            <FormField name="terms" inline="after" label="I agree to the Terms and Conditions">
              <Checkbox />
            </FormField>
            <div className="flex items-center shrink-0 gap-2">
              <FormReset variant="text">Reset</FormReset>
              <FormSubmit>Submit Form</FormSubmit>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </Form>
  );
}, 'General');

export default General;
