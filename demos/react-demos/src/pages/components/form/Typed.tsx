import { Card, CardBody, CardGroup } from '@airlib/react-ui/components';
import {
  createForm,
  Select,
  SelectButton,
  SelectItem,
  SelectMenu,
  Switch,
  Textarea,
  TextField,
} from '@airlib/react-ui/form';
import { z } from 'zod';

const postSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  category: z.enum(['technology', 'lifestyle', 'education']).default('technology'),
  publish: z.boolean().default(false),
});
const PostForm = createForm(postSchema);

export default function Typed() {
  return (
    <PostForm
      className="flex flex-col gap-6"
      onSubmit={(data) => {
        alert(`Post submitted: ${JSON.stringify(data, null, 2)}`);
      }}
    >
      <CardGroup>
        <Card>
          <CardBody className="flex flex-col gap-2">
            <div className="flex items-start gap-2">
              <PostForm.Field name="title" label="Title">
                <TextField placeholder="Enter post title" />
              </PostForm.Field>
              <PostForm.Field name="category" label="Category" className="flex-1 shrink-0">
                <Select placeholder="Select a category">
                  <SelectButton inline />
                  <SelectMenu>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectMenu>
                </Select>
              </PostForm.Field>
            </div>
            <PostForm.Field name="content" label="Content">
              <Textarea placeholder="Write your post content..." />
            </PostForm.Field>
          </CardBody>
        </Card>
        <Card variant="filled">
          <CardBody>
            <div className="flex-row justify-end">
              <PostForm.Field name="publish" inline="after" label="Publish immediately" className="w-auto">
                <Switch />
              </PostForm.Field>
              <span className="flex-1"></span>
              <div className="shrink-0 flex items-center gap-2">
                <PostForm.Reset variant="text">Reset</PostForm.Reset>
                <PostForm.Submit>Submit Post</PostForm.Submit>
              </div>
            </div>
          </CardBody>
        </Card>
      </CardGroup>
    </PostForm>
  );
}
