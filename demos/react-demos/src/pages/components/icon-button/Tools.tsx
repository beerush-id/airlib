import { Icon, ToolIconButton } from '@airlib/react-ui/components';

export default () => (
  <div className="flex flex-wrap gap-4 items-center justify-center">
    <ToolIconButton>
      <Icon name="format_bold" />
    </ToolIconButton>
    <ToolIconButton active>
      <Icon name="format_italic" />
    </ToolIconButton>
    <ToolIconButton>
      <Icon name="format_underlined" />
    </ToolIconButton>
  </div>
);
