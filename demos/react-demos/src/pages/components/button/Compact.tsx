import { ToolButton } from '@airlib/react-ui/components';

export default () => (
  <div className="flex flex-wrap gap-4 items-center">
    <ToolButton>Action</ToolButton>
    <ToolButton active>Active Action</ToolButton>
  </div>
);
